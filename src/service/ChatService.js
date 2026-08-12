import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, getDoc, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy, onSnapshot, increment } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS, WORKSTATUS } from '../utility/status';
import randomLocation from 'random-location'
import { useSleep } from '../utility/common';
import Axios from 'axios';
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
  const q = query(collection(db, "CHAT"), orderBy("CREATEDT", "desc"));

  return onSnapshot(q, (snapshot) => {
    const rooms = [];
    snapshot.forEach((d) => {
      const room = d.data();
      if (room.OWNER_ID === USERS_ID || room.SUPPORTER_ID === USERS_ID) rooms.push(room);
    });
    // 마지막 대화가 있는 방을 위로 (없으면 만든 시간 기준)
    rooms.sort((a, b) => (b.LASTMESSAGE_AT || b.CREATEDT || 0) - (a.LASTMESSAGE_AT || a.CREATEDT || 0));
    callback(rooms);
  }, (e) => {
    console.log("TCL: SubscribeChatRooms -> error", e.message);
    callback([]);
  });
};

/** 방 목록에서 내 안읽음 총합 (하단 탭 뱃지용) */
export const UnreadTotalOf = (rooms, USERS_ID) =>
  (rooms || []).reduce((sum, r) => sum + ((r.UNREAD && r.UNREAD[USERS_ID]) || 0), 0);
