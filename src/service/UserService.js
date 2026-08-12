import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy, arrayUnion } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPhoneNumber, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { imageDB } from "../utility/imageData";

/* 사진을 안 올린 사람의 기본 프로필 — 홍여사 캐릭터 (형 리뷰 2026-08-12) */
export const DEFAULT_PROFILE_IMG = imageDB.hongprofile;




const authService = getAuth(firebaseApp)    ;

/** 사용자 관리 */
export const signup = async({USER_ID,password, nickname, tel, membertype, imgs}) =>{

    let success = true;


    try{
       const {user} = await createUserWithEmailAndPassword(authService, USER_ID, password);


       const userRef = doc(collection(db, "USERS"));
       const id = userRef.id;
       const newuser = {
           USERS_INDEX : id,
           USER_SESSION : user.uid,
           USER_ID : USER_ID,
           USER_PW : password,
           USER_NICKNAME : nickname,
           USER_IMAGE : imgs,
           USER_TYPE : membertype,
           USER_TEL : tel,
           REGISTDATE : Date.now(),
           SMSRECEIVE :0,
           EMAILRECEIVE : 0,
           GRADE :0,
           DISTANCE: 10,
           KakaoID :"",
   
       }
       await setDoc(userRef, newuser);
     
       await updateProfile(user,{
           USER_DISPLAY: nickname, 
           USER_TYPE : membertype,
         }).then(() => {
     
         }).catch((error) => {
   
         });
   

   
       return user;

    }catch(e){
        console.log("auth ", e.message);

        alert( e.message);
        success =false;
        return null;
    }finally{

    }
}


export const login = async({email, password}) =>{
    let success = false;

    let user = {};
    
    try{
        user = await signInWithEmailAndPassword(authService,email, password);
        success = true;

    }catch(e){

        console.log("error", e);
    }finally{

        return new Promise((resolve, reject)=>{

            if(success){
                resolve(user);
            }else{
                resolve(-1);
            }
        })
    }
   
 
}

export const get_userInfoForusername = async ({ USER_NICKNAME }) => {
  const userRef = collection(db, "USERS");

  const q = query(userRef, where("USER_NICKNAME", "==", USER_NICKNAME));

  let useritem = null;

  let success = false;
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      useritem = doc.data();
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(useritem);
      } else {
        resolve(null);
      }
    });
  }
};

export const getuserInfobyusers_id = async({USERS_ID}) =>{
 
    const userRef = collection(db, "USERS");
    
    const q = query(userRef, where("USERS_ID",'==', USERS_ID));
 
    let useritem = null;

    let success = false;
    try{
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            useritem =  doc.data();
        });
    
        if(querySnapshot.size > 0){
            success = true;
        }

    }catch(e){

    }finally{

        return new Promise((resolve, resject)=>{
            if(success){
                resolve(useritem);
            }else{
                resolve(null);
            }
            
        }) 

    }
   

}
export const get_userInfoForKakaoID = async ({ kakaoID }) => {
  const userRef = collection(db, "USERS");

  const q = query(userRef, where("kakaoID", "==", kakaoID));

  let useritem = null;

  let success = false;
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      useritem = doc.data();
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(useritem);
      } else {
        resolve(null);
      }
    });
  }
};


export const Create_userdevice = async({DEVICEID, TOKEN, LATITUDE, LONGITUDE, PHONE, NICKNAME}) =>{

  let success = true;

  let users_id = "";
  try{

     const userRef = doc(collection(db, "USERS"));
     const id = userRef.id;
     users_id =id;
     const newuser = {
         USERS_ID : id,
         DEVICEID : DEVICEID,
         TOKEN : TOKEN,
         LATITUDE : LATITUDE,
         LONGITUDE : LONGITUDE,
         PHONE : PHONE,
         NICKNAME : NICKNAME,
     
     }
     await setDoc(userRef, newuser);
   
    

  }catch(e){
      console.log("auth ", e.message);
      success =false;
      return null;
  }finally{
    return users_id;
  }
}

export const createuser = async({USERINFO, DEVICEID, TOKEN}) =>{

  let success = true;

  let users_id = "";
  try{

     const userRef = doc(collection(db, "USERS"));
     const id = userRef.id;
     users_id =id;
     // 사진을 안 고른 사람은 홍여사 기본 프로필로 저장한다 (형 리뷰 2026-08-12)
     const INFO = { ...(USERINFO || {}) };
     if(!INFO.userimg || String(INFO.userimg).trim() === ''){
       INFO.userimg = DEFAULT_PROFILE_IMG;
     }
     const newuser = {
         USERS_ID : id,
         USERINFO : INFO,
         DEVICEID : DEVICEID,
         TOKEN : TOKEN,
     }
     await setDoc(userRef, newuser);
   
    

  }catch(e){
      console.log("auth ", e.message);
      success =false;
      return null;
  }finally{
    return users_id;
  }
}

export const Readuserbyusersid = async({USERS_ID}) =>{
  return new Promise(async (resolve, reject) => {
    const userRef = collection(db, "USERS");
    const q = query(userRef, where("USERS_ID",'==', USERS_ID ));

    let success = false;
    let searchitems = [];
  
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        searchitems.push(doc.data());
      });
  
      if (querySnapshot.size > 0) {
        success = true;
        resolve(searchitems[0]);
      }else{
        resolve(-1);
      }
    } catch (e) {
      resolve(-1);
    } finally {
  
    }

  });


}
export const readuserbydeviceid = async({DEVICEID}) =>{

  const userRef = collection(db, "USERS");
  const q = query(userRef, where("DEVICEID",'==', DEVICEID ));

  let success = false;
  let searchitems = [];

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      searchitems.push(doc.data());
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(searchitems[0]);
      } else {
        resolve(-1);
      }
    });
  }

}
export const readuserbyphone = async({PHONE}) =>{
  return new Promise(async (resolve, reject) => {
    const userRef = collection(db, "USERS");
    const q = query(userRef);
  
    let searchitems = {};
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
  
        if((doc.data().USERINFO.phone == PHONE)){
          searchitems = doc.data();
        }
  
      });
  
      if (searchitems.USERINFO != undefined) {
        resolve(searchitems);
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
export const readuser = async() =>{
  return new Promise(async (resolve, reject) => {
    const userRef = collection(db, "USERS");
    const q = query(userRef);
  
    let searchitems = [];
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        searchitems.push(doc.data());
      });
  
      if (searchitems.length > 0) {
        resolve(searchitems);
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
export const Update_userdevice = async({DEVICEID, TOKEN, LATITUDE, LONGITUDE, PHONE}) =>{
console.log("TCL: Update_userdevice -> Update_userdevice", DEVICEID, TOKEN, LATITUDE, LONGITUDE)


    const userRef = collection(db, "USERS");

    const rows = query(userRef, where("DEVICEID",'==', DEVICEID ));

    let docid = "";
    try{
        const querySnapshot =  await getDocs(rows);

        querySnapshot.forEach(function (doc) {

            docid = doc.id;
            updateDoc(doc.ref, {
                DEVICEID  : DEVICEID,
                TOKEN  : TOKEN,
                LATITUDE  : LATITUDE,
                LONGITUDE  : LONGITUDE,
            });
        });

    }catch(e){
         console.log("error", e.message);
    }finally{
        return docid;
    }

}

export const Update_usertoken = async({DEVICEID, TOKEN}) =>{
  console.log("TCL: Update_usertoken -> Update_usertoken", DEVICEID, TOKEN)
  
  
      const userRef = collection(db, "USERS");
  
      const rows = query(userRef, where("DEVICEID",'==', DEVICEID ));
  
      let docid = "";
      try{
          const querySnapshot =  await getDocs(rows);
  
          querySnapshot.forEach(function (doc) {
  
              docid = doc.id;
              updateDoc(doc.ref, {
                  TOKEN  : TOKEN,
              });
          });
  
      }catch(e){
           console.log("error", e.message);
      }finally{
          return docid;
      }
  
  }

export const Update_tokendevice = async({DEVICEID, TOKEN}) =>{
  console.log("TCL: Update_userdevice -> Update_userdevice", DEVICEID, TOKEN)
  
  
      const userRef = collection(db, "USERS");
  
      const rows = query(userRef, where("DEVICEID",'==', DEVICEID ));
  
      let docid = "";
      try{
          const querySnapshot =  await getDocs(rows);
  
          querySnapshot.forEach(function (doc) {
  
              docid = doc.id;
              updateDoc(doc.ref, {
                  TOKEN  : TOKEN,
            
              });
          });
  
      }catch(e){
           console.log("error", e.message);
      }finally{
          return docid;
      }
  
}

export const updatealluserbydeviceid = async({USERINFO, DEVICEID}) =>{
 
  const userRef = collection(db, "USERS");

  const rows = query(userRef, where("DEVICEID",'==', DEVICEID ));

  let docid = "";
  try{
      const querySnapshot =  await getDocs(rows);

      querySnapshot.forEach(function (doc) {

          docid = doc.id;
          updateDoc(doc.ref, {
            USERINFO  : USERINFO,
        
          });
      });

  }catch(e){
        console.log("error", e.message);
  }finally{
      return docid;
  }

}
  
export const Update_addrbyusersid = async({ADDR, USERS_ID}) =>{
  console.log("TCL:  -> Update_addrsbyusersid", USERS_ID)
  
  
      const userRef = collection(db, "USERS");
  
      const rows = query(userRef, where("USERS_ID",'==', USERS_ID ));
  
      let docid = "";
      try{
          const querySnapshot =  await getDocs(rows);
  
          querySnapshot.forEach(function (doc) {
  
              docid = doc.id;
              updateDoc(doc.ref, {
      
                ADDRESSITEMS: arrayUnion(ADDR) // 배열 필드에 값 추가
            
              });
          });
  
      }catch(e){
           console.log("error", e.message);
      }finally{
          return docid;
      }
  
}
export const Update_addrItemsbyusersid = async({ADDRITEMS, USERS_ID}) =>{
  console.log("TCL:  -> Update_addrsbyusersid", USERS_ID)
  
  
      const userRef = collection(db, "USERS");
  
      const rows = query(userRef, where("USERS_ID",'==', USERS_ID ));
  
      let docid = "";
      try{
          const querySnapshot =  await getDocs(rows);
  
          querySnapshot.forEach(function (doc) {
  
              docid = doc.id;
              updateDoc(doc.ref, {
      
                ADDRESSITEMS: ADDRITEMS // 배열 필드에 값 추가
            
              });
          });
  
      }catch(e){
           console.log("error", e.message);
      }finally{
          return docid;
      }
  
}
export const get_phonenumber = async ()=>{
  try {
  
     const recaptchaVerifier = auth.RecaptchaVerifier;
     const appVerifier = recaptchaVerifier;

      const phoneNumber = "+82 01062149756";


      // const confirmation = await signInWithPhoneNumber(authService, "+82 01062149756",appVerifier);
  
      const confirmation = await signInWithPhoneNumber({auth, phoneNumber,appVerifier});

      console.log("phone auth")
    } catch (error) {
      alert(error);

      console.log("err", error);
    }

}

export const Update_userinfobyusersid = async({USERINFO, USERS_ID}) =>{
  console.log("TCL:  -> Update_namebyusersid", USERS_ID)
  
  
      const userRef = collection(db, "USERS");
  
      const rows = query(userRef, where("USERS_ID",'==', USERS_ID ));
  
      let docid = "";
      try{
          const querySnapshot =  await getDocs(rows);
  
          querySnapshot.forEach(function (doc) {
  
              docid = doc.id;
              updateDoc(doc.ref, {
      
                USERINFO: USERINFO 
            
              });
          });
  
      }catch(e){
           console.log("error", e.message);
      }finally{
          return docid;
      }
  
}

/**
 * 프로필 이미지 갱신 — 홍여사 등록 화면에서 쓴다.
 * 원래 import 만 있고 구현이 없어 등록이 저장 직전에 터졌다. (2026-08-12)
 */
export const Update_userimg_by_usersid = async({USERS_ID, profileImg}) =>{
  const userRef = collection(db, "USERS");
  const rows = query(userRef, where("USERS_ID", "==", USERS_ID));
  try{
    const querySnapshot = await getDocs(rows);
    const jobs = [];
    querySnapshot.forEach(function (doc) {
      jobs.push(updateDoc(doc.ref, { USERIMG : profileImg }));
    });
    await Promise.all(jobs);
    return true;
  }catch(e){
    console.log("Update_userimg_by_usersid error", e.message);
    return false;
  }
}

/**
 * 회원 탈퇴. (형 지시 2026-08-12)
 *
 * 문서를 지우지 않고 탈퇴 표시를 남긴다.
 * 이 사람이 올린 일감·주고받은 대화가 상대 쪽에 남아 있어서, 문서를 지우면 그쪽 화면이 깨진다.
 * 대신 개인정보는 비운다.
 */
export const WithdrawUser = async ({ USERS_ID }) => {
  try {
    const snap = await getDocs(query(collection(db, "USERS"), where("USERS_ID", "==", USERS_ID)));
    if (snap.empty) return false;

    const target = snap.docs[0];
    const info = target.data().USERINFO || {};

    await updateDoc(target.ref, {
      WITHDRAWN: true,
      WITHDRAWN_AT: Date.now(),
      DEVICEID: "",
      USERINFO: {
        ...info,
        nickname: "탈퇴한 사용자",
        userimg: "",
        phone: "",
        token: "",
      },
    });
    return true;
  } catch (e) {
    console.log("TCL: WithdrawUser -> error", e.message);
    return false;
  }
};

/**
 * 대화명 변경 — 하루 한 번만 (형 지시 2026-08-12).
 * 마지막 변경 시각을 USERS 문서에 남긴다. 기기를 바꿔도 우회되지 않게 서버에 둔다.
 *   { ok: true }                     저장 완료
 *   { ok: false, nextAt: number }    아직 못 바꿈 (다음 가능 시각)
 */
export const Update_nickname_by_usersid = async({USERS_ID, nickname}) =>{
  const userRef = collection(db, "USERS");
  const rows = query(userRef, where("USERS_ID", "==", USERS_ID));
  const DAY = 24 * 60 * 60 * 1000;

  try{
    const querySnapshot = await getDocs(rows);
    if(querySnapshot.empty) return { ok:false, reason:'no-user' };

    const target = querySnapshot.docs[0];
    const last = Number(target.data().NICKNAME_CHANGED_AT || 0);
    const now = Date.now();

    if(last && now - last < DAY){
      return { ok:false, nextAt: last + DAY };
    }

    await updateDoc(target.ref, { NICKNAME : nickname, NICKNAME_CHANGED_AT : now });
    return { ok:true };
  }catch(e){
    console.log("Update_nickname_by_usersid error", e.message);
    return { ok:false, reason:e.message };
  }
}

/** 다음 변경 가능 시각 조회 (없으면 0 = 지금 바로 가능) */
export const Read_nickname_next_at = async({USERS_ID}) =>{
  try{
    const userRef = collection(db, "USERS");
    const querySnapshot = await getDocs(query(userRef, where("USERS_ID", "==", USERS_ID)));
    if(querySnapshot.empty) return 0;
    const last = Number(querySnapshot.docs[0].data().NICKNAME_CHANGED_AT || 0);
    return last ? last + 24 * 60 * 60 * 1000 : 0;
  }catch{
    return 0;
  }
}
