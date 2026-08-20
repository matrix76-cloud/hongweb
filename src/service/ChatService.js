import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, getDoc, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy, onSnapshot, increment } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS, WORKSTATUS } from '../utility/status';
import randomLocation from 'random-location'
import { useSleep } from '../utility/common';
import Axios from 'axios';
import { CHATCONTENTTYPE } from "../utility/screen";
const authService = getAuth(firebaseApp);


/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;




/**
 * CHAT 관련 서비스
 *! Create 
 * ① CreateChat : 

 *! Read

 *! Update
 
 *! Delete

 */


export const CreateChat = async({OWNER, OWNER_ID, SUPPORTER, SUPPORTER_ID,WORK_INFO}) =>{

    let success = true;
    const CHATREF = doc(collection(db, "CHAT"));
    const id = CHATREF.id;

    try{
       const newdata = {
           CHAT_ID : id,
           OWNER : OWNER,
           OWNER_ID :OWNER_ID,
           SUPPORTER : SUPPORTER,
           SUPPORTER_ID :SUPPORTER_ID,
           // 실제 DB 에 쌓인 176개 방이 모두 INFO 를 쓴다. 새 방도 같은 이름으로 맞춘다. (형 리뷰 2026-08-12)
           INFO : WORK_INFO,
           CREATEDT : Date.now(),
           // 목록에서 마지막 대화를 바로 보여주기 위한 필드 (형 리뷰 2026-08-12)
           PARTICIPANTS : [OWNER_ID, SUPPORTER_ID],
           LASTMESSAGE : '',
           LASTMESSAGE_AT : Date.now(),
           UNREAD : { [OWNER_ID] : 0, [SUPPORTER_ID] : 0 },
       }
       await setDoc(CHATREF, newdata);
    
    }catch(e){
      console.log("TCL: Create chat -> error ",e.message )
       
        alert( e.message);
        success =false;
        return -1;
    }finally{
      return id;
    }
}

export const ReadChat = async({USERS_ID}) =>{
console.log("TCL: ReadChat -> USERS_ID", USERS_ID)

  return new Promise(async (resolve, reject) => {
    const userRef = collection(db, "CHAT");
    const q = query(userRef, orderBy('CREATEDT',"desc"));
  

    let chatitems = [];
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
  
        if((doc.data().OWNER_ID == USERS_ID) || (doc.data().SUPPORTER_ID == USERS_ID)){
          chatitems.push(doc.data());
        }
  
      });
  
      if (chatitems.length > 0) {
        resolve(chatitems);
      }else{
        resolve(-1);
      }
    } catch (e) {
      console.log("error", e.message);
      resolve(-1);
    } finally {

    }
  });
}
export const ReadChatByCHATID = async({CHAT_ID}) =>{
 
  
    return new Promise(async (resolve, reject) => {
      const userRef = collection(db, "CHAT");
      const q = query(userRef, where('CHAT_ID',"==", CHAT_ID));
    
  
      let chatitem = {};
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
    
            chatitem = doc.data();
  
        });
    
        if (chatitem.CHAT_ID != undefined) {
          resolve(chatitem);
        }else{
          resolve(-1);
        }
      } catch (e) {
        console.log("error", e.message);
        resolve(-1);
      } finally {
  
      }
    });
  }
export const ReadChannel = async({CHAT_ID}) =>{

  return new Promise(async (resolve, reject) => {
    const chatRef = collection(db, `CHAT/${CHAT_ID}/messages`);
    const q = query(chatRef, orderBy('CREATEDT',"asc"));
  
    let chatitems = [];
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         chatitems.push(doc.data());
      });
  
      if (chatitems.length > 0) {
        resolve(chatitems);
      }else{
        resolve(-1);
      }
    } catch (e) {
      console.log("error", e.message);
      resolve(-1);
    } finally {

    }

  });
  

}



export const CreateMessage = async ({ CHAT_ID, msg, users_id,read,CHAT_CONTENT_TYPE }) => {

  console.log("TCL: CreateMessage -> data", msg,users_id,read)


  const messageRef = doc(collection(db, `CHAT/${CHAT_ID}/messages`));
  const id = messageRef.id;
  const newMessage = {
    MESSAGE_ID: id,
    TEXT: msg,
    // 기존 메시지는 전부 CREATEDT 로 저장돼 있는데 여기서만 CREATEDAT 로 썼다.
    // 대화방이 orderBy("CREATEDT") 로 읽으므로 이 필드가 없으면 그 메시지는 화면에 아예 안 나온다.
    CREATEDT: Date.now(),
    USERS_ID: users_id,
    READ:read,
    CHAT_CONTENT_TYPE: CHAT_CONTENT_TYPE
  };

  try {
    await setDoc(messageRef, newMessage);
    // 목록 화면이 마지막 대화를 보여줄 수 있게 방 문서도 같이 갱신한다.
    // 상대의 안읽음 수를 1 올린다 — 대화방에 들어가면 MarkRead 로 0 이 된다.
    await UpdateChatSummary({ CHAT_ID, msg, users_id });
  } catch (e) {
    console.log("error", e.message);
  }
};

/**
 * 방 문서의 마지막 대화·시간·안읽음 수 갱신.
 * 방 문서에 상대가 누구인지 들어있으니 그걸 읽어서 상대 카운트만 올린다.
 */
export const UpdateChatSummary = async ({ CHAT_ID, msg, users_id }) => {
  try {
    const chatRef = doc(db, "CHAT", CHAT_ID);
    const snap = await getDoc(chatRef);
    if (!snap.exists()) return;

    const room = snap.data();
    const other = room.OWNER_ID === users_id ? room.SUPPORTER_ID : room.OWNER_ID;

    const patch = {
      LASTMESSAGE: msg || '',
      LASTMESSAGE_AT: Date.now(),
    };
    // 예전에 만들어진 방은 PARTICIPANTS 가 없다 — 이때 채워둔다
    if (!room.PARTICIPANTS) patch.PARTICIPANTS = [room.OWNER_ID, room.SUPPORTER_ID];
    if (other) patch[`UNREAD.${other}`] = increment(1);

    await updateDoc(chatRef, patch);
  } catch (e) {
    console.log("TCL: UpdateChatSummary -> error", e.message);
  }
};

/** 대화방에 들어왔을 때 내 안읽음 수를 0 으로 */
export const MarkRead = async ({ CHAT_ID, USERS_ID }) => {
  try {
    await updateDoc(doc(db, "CHAT", CHAT_ID), { [`UNREAD.${USERS_ID}`]: 0 });
  } catch (e) {
    console.log("TCL: MarkRead -> error", e.message);
  }
};

/**
 * 내 대화방 목록 실시간 구독. 새 메시지가 오면 목록이 알아서 갱신된다.
 * 반환값은 구독 해제 함수 — 화면 언마운트 때 호출할 것.
 */
export const SubscribeChatRooms = ({ USERS_ID }, callback) => {
  /* 예전에는 CHAT 컬렉션 전체를 받아 와서 내 방만 걸러냈다.
     남의 대화방까지 전부 내려받으니 채팅 화면이 열릴 때마다 한참 걸렸고,
     방이 늘어날수록 더 느려졌다. 이제 내가 낀 방만 물어본다. (형 지적 2026-08-18)

     정렬은 서버에 맡기지 않고 여기서 한다 — 정렬까지 서버에 맡기면
     복합 색인을 따로 만들어야 하고, 없으면 조회 자체가 실패한다. */
  if (!USERS_ID) { callback([]); return () => {}; }

  const mine = { owner: [], supporter: [] };

  const emit = () => {
    const seen = new Set();
    const rooms = [];
    [...mine.owner, ...mine.supporter].forEach((room) => {
      if (!room || seen.has(room.CHAT_ID)) return;      // 양쪽에 걸리는 방은 한 번만
      // 내가 나간 방은 내 목록에서만 뺀다 (상대에게는 그대로 남는다)
      if (Array.isArray(room.EXITED) && room.EXITED.includes(USERS_ID)) return;
      seen.add(room.CHAT_ID);
      rooms.push(room);
    });
    // 마지막 대화가 있는 방을 위로 (없으면 만든 시간 기준)
    rooms.sort((a, b) => (b.LASTMESSAGE_AT || b.CREATEDT || 0) - (a.LASTMESSAGE_AT || a.CREATEDT || 0));
    callback(rooms);
  };

  const watch = (field, bucket) => onSnapshot(
    query(collection(db, "CHAT"), where(field, "==", USERS_ID)),
    (snapshot) => {
      mine[bucket] = snapshot.docs.map((d) => d.data());
      emit();
    },
    (e) => {
      console.log("TCL: SubscribeChatRooms ->", field, e.message);
      mine[bucket] = [];
      emit();
    },
  );

  const stopOwner = watch("OWNER_ID", "owner");
  const stopSupporter = watch("SUPPORTER_ID", "supporter");

  return () => { stopOwner(); stopSupporter(); };
};

/** 방 목록에서 내 안읽음 총합 (하단 탭 뱃지용) */
export const UnreadTotalOf = (rooms, USERS_ID) =>
  (rooms || []).reduce((sum, r) => sum + ((r.UNREAD && r.UNREAD[USERS_ID]) || 0), 0);

/* ────────────────────────────────────────────────────────────
   대화방 관리 — 삭제 · 나가기 · 신고 · 차단 (형 지시 2026-08-12)
   ──────────────────────────────────────────────────────────── */

/**
 * 나만 삭제 — 문서는 그대로 두고 "나에게만 안 보이게" 표시한다.
 * 상대 화면에는 그대로 남는다. 내 글이든 상대 글이든 가능하다.
 */
export const DeleteMessageForMe = async ({ CHAT_ID, MESSAGE_ID, USERS_ID }) => {
  try {
    const ref = doc(db, `CHAT/${CHAT_ID}/messages`, MESSAGE_ID);
    const snap = await getDoc(ref);
    if (!snap.exists()) return false;

    const hidden = snap.data().DELETED_FOR || [];
    if (!hidden.includes(USERS_ID)) hidden.push(USERS_ID);

    await updateDoc(ref, { DELETED_FOR: hidden });
    return true;
  } catch (e) {
    console.log("TCL: DeleteMessageForMe -> error", e.message);
    return false;
  }
};

/**
 * 모두에게 삭제 — 내 글만 가능.
 * 문서는 남기고 내용만 비운다. 양쪽 화면에 "삭제된 메시지입니다" 로 보인다.
 */
export const DeleteMessageForAll = async ({ CHAT_ID, MESSAGE_ID, USERS_ID }) => {
  try {
    const ref = doc(db, `CHAT/${CHAT_ID}/messages`, MESSAGE_ID);
    const snap = await getDoc(ref);
    if (!snap.exists()) return false;
    if (snap.data().USERS_ID !== USERS_ID) return false;

    await updateDoc(ref, { DELETED_ALL: true, TEXT: "" });

    // 목록에 옛 내용이 남지 않게 마지막 대화도 같이 손본다
    const chatRef = doc(db, "CHAT", CHAT_ID);
    const room = await getDoc(chatRef);
    if (room.exists() && room.data().LASTMESSAGE === snap.data().TEXT) {
      await updateDoc(chatRef, { LASTMESSAGE: "삭제된 메시지입니다" });
    }
    return true;
  } catch (e) {
    console.log("TCL: DeleteMessageForAll -> error", e.message);
    return false;
  }
};

/** 내가 쓴 메시지를 문서째 지운다 (지금은 안 쓴다 — 위 두 가지로 대신한다) */
export const DeleteMessage = async ({ CHAT_ID, MESSAGE_ID, USERS_ID }) => {
  try {
    const ref = doc(db, `CHAT/${CHAT_ID}/messages`, MESSAGE_ID);
    const snap = await getDoc(ref);
    if (!snap.exists()) return false;
    if (snap.data().USERS_ID !== USERS_ID) return false;

    await deleteDoc(ref);
    return true;
  } catch (e) {
    console.log("TCL: DeleteMessage -> error", e.message);
    return false;
  }
};

/**
 * 대화방 나가기.
 * 방 문서는 지우지 않는다 — 상대에게는 대화가 남아야 한다.
 * 나간 사람 목록(EXITED)에 넣고, 목록에서 그 사람에게만 안 보이게 한다.
 */
export const ExitChat = async ({ CHAT_ID, USERS_ID, nickname }) => {
  try {
    const chatRef = doc(db, "CHAT", CHAT_ID);
    const snap = await getDoc(chatRef);
    if (!snap.exists()) return false;

    const exited = snap.data().EXITED || [];
    if (!exited.includes(USERS_ID)) exited.push(USERS_ID);

    await updateDoc(chatRef, { EXITED: exited, [`UNREAD.${USERS_ID}`]: 0 });

    // 상대 화면에 남길 안내
    await CreateMessage({
      CHAT_ID,
      msg: `${nickname || '상대방'}님이 대화방을 나갔습니다.`,
      users_id: USERS_ID,
      read: [USERS_ID],
      CHAT_CONTENT_TYPE: "퇴장",
    });
    return true;
  } catch (e) {
    console.log("TCL: ExitChat -> error", e.message);
    return false;
  }
};

/** 신고 — 내용은 REPORT 컬렉션에 쌓고, 운영에서 확인한다. */
export const ReportChat = async ({ CHAT_ID, USERS_ID, TARGET_ID, REASON, DETAIL }) => {
  try {
    const ref = doc(collection(db, "REPORT"));
    await setDoc(ref, {
      REPORT_ID: ref.id,
      CHAT_ID,
      USERS_ID,          // 신고한 사람
      TARGET_ID,         // 신고당한 사람
      REASON: REASON || "",
      DETAIL: DETAIL || "",
      STATUS: "접수",
      CREATEDT: Date.now(),
    });
    return true;
  } catch (e) {
    console.log("TCL: ReportChat -> error", e.message);
    return false;
  }
};

/** 차단 — 내 USERS 문서에 담아둔다. 차단한 사람의 방은 내 목록에서 빠진다. */
export const BlockUser = async ({ USERS_ID, TARGET_ID }) => {
  try {
    const q = query(collection(db, "USERS"), where("USERS_ID", "==", USERS_ID));
    const snap = await getDocs(q);
    if (snap.empty) return false;

    const target = snap.docs[0];
    const blocked = target.data().BLOCKED || [];
    if (!blocked.includes(TARGET_ID)) blocked.push(TARGET_ID);

    await updateDoc(target.ref, { BLOCKED: blocked });
    return true;
  } catch (e) {
    console.log("TCL: BlockUser -> error", e.message);
    return false;
  }
};

/** 내가 차단한 사람 목록 */
export const ReadBlocked = async ({ USERS_ID }) => {
  try {
    const snap = await getDocs(query(collection(db, "USERS"), where("USERS_ID", "==", USERS_ID)));
    if (snap.empty) return [];
    return snap.docs[0].data().BLOCKED || [];
  } catch (e) {
    console.log("TCL: ReadBlocked -> error", e.message);
    return [];
  }
};

/**
 * 대화명을 바꾸면 참여 중인 모든 대화방에 안내를 남긴다. (형 리뷰 2026-08-12)
 * 상대가 "누구지?" 하지 않도록 바뀐 사실을 그 자리에서 알려준다.
 */
export const NoticeNicknameChanged = async ({ USERS_ID, beforeName, afterName }) => {
  if (!USERS_ID || !afterName || beforeName === afterName) return 0;

  const rooms = await ReadChat({ USERS_ID });
  if (!Array.isArray(rooms) || rooms.length === 0) return 0;

  const msg = beforeName
    ? `${beforeName}님이 대화명을 ${afterName}(으)로 변경하였습니다`
    : `대화명을 ${afterName}(으)로 변경하였습니다`;

  await Promise.all(
    rooms.map((room) =>
      CreateMessage({
        CHAT_ID: room.CHAT_ID,
        msg,
        users_id: USERS_ID,
        read: [USERS_ID],
        CHAT_CONTENT_TYPE: CHATCONTENTTYPE.ENTER,   // 시스템 안내로 가운데 표시된다
      }).catch(() => null),
    ),
  );
  return rooms.length;
};

/**
 * 일감별 지원자 모음 (형 리뷰 2026-08-13
 * "진행중인 건수 -> 채팅중인 건수, 그 밑에 지원자 프로필을 겹쳐서").
 *
 * 목록 카드마다 채팅을 따로 읽으면 카드 수만큼 조회가 나간다.
 * 한 번만 읽어 WORK_ID 별로 묶어 돌려준다.
 *   { [WORK_ID] : [{ id, nickname, userimg }, ...] }
 */
export const ReadSupportersByWork = async () => {
  try {
    const snap = await getDocs(query(collection(db, "CHAT")));
    const map = {};
    snap.forEach((d) => {
      const room = d.data();
      const WORK_ID = (room.INFO || room.WORK_INFO || {}).WORK_ID;
      if (!WORK_ID || !room.SUPPORTER_ID) return;
      const bucket = (map[WORK_ID] ||= []);
      if (bucket.some((x) => x.id === room.SUPPORTER_ID)) return;   // 같은 사람이 여러 방을 열었을 수 있다
      const info = room.SUPPORTER?.USERINFO || room.SUPPORTER || {};
      bucket.push({
        id: room.SUPPORTER_ID,
        nickname: info.nickname || '',
        userimg: info.userimg || '',
      });
    });
    return map;
  } catch (e) {
    console.log("ReadSupportersByWork error", e.message);
    return {};
  }
};
