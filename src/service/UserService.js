import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";




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
   

    // const USERID = user.uid;
    // const DEVICEID = uniqueId;
    // const update = await update_userdevice(USERID, DEVICEID);
 
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

export const get_userInfoForUID = async({USER_ID}) =>{
 
    const userRef = collection(db, "USERS");
    
    const q = query(userRef, where("USER_SESSION",'==', USER_ID));
 
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



export const update_userdevice = async({USERID, DEVICEID}) =>{


    const userRef = collection(db, "USERS");

    let deviceid = "";
    if(DEVICEID == ''){
        deviceid ="";
    }else{
        deviceid = DEVICEID;
    }
    const rows = query(userRef, where("USER_SESSION",'==', USERID ));

    try{
        const querySnapshot =  await getDocs(rows);

        querySnapshot.forEach(function (doc) {
            updateDoc(doc.ref, {
                DEVICEID  : deviceid,
            });
        });

    }catch(e){
         console.log("error", e.message);
    }finally{
        return;
    }

}
export const update_userkakaoid = async ({ USERID, kakaoID }) => {
  const userRef = collection(db, "USERS");

  const rows = query(userRef, where("USER_SESSION", "==", USERID));

  try {
    const querySnapshot = await getDocs(rows);

    querySnapshot.forEach(function (doc) {
      updateDoc(doc.ref, {
        kakaoID: kakaoID,
      });
    });
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return;
  }
};


export const get_userInfoForDevice = async({DEVICEID}) =>{


    const userRef = collection(db, "USERS");
    
    const q = query(userRef, where("DEVICEID",'==', DEVICEID));
 
    let useritem = null;
    try{
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            useritem =  doc.data();
        });
    
        if(querySnapshot.size < 0){
            return null;
        }

    }catch(e){

    }finally{

        return new Promise((resolve, resject)=>{
            resolve(useritem);
        }) 

    }
   

}
export const get_userInfoForPhone = async ({ USER_TEL }) => {
  const userRef = collection(db, "USERS");

  const q = query(userRef, where("USER_TEL", "==", USER_TEL));

  let useritem = null;
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      useritem = doc.data();
    });

    if (querySnapshot.size < 0) {
      return null;
    }
  } catch (e) {
  } finally {
    return new Promise((resolve, resject) => {
      resolve(useritem);
    });
  }
};


export const reset_userdevice = async({USERID, DEVICEID}) =>{

    console.log("update_userdevice", USERID, DEVICEID);

    const userRef = collection(db, "USERS");

    let deviceid = "";
    if(DEVICEID == ''){
        deviceid ="";
    }else{
        deviceid = "";
    }
    const rows = query(userRef, where("USER_SESSION",'==', USERID ));

    try{
        const querySnapshot =  await getDocs(rows);

        querySnapshot.forEach(function (doc) {
            updateDoc(doc.ref, {
                DEVICEID  : "",
            });
        });

    }catch(e){
         console.log("error", e.message);
    }finally{
        return;
    }

}

export const logout = async () =>{

    // return await authService.signOut();

    return new Promise((resolve, resject)=>{

        const auth = getAuth();
        signOut(auth).then(() => {
             resolve(0);
        }).catch((error) => {
            // An error happened.
             console.log(error);
             resolve(-1);
        });

    }) 




}

export const update_userdistance = async({USERID, DISTANCE}) =>{

   
    const userRef = collection(db, "USERS");


    const rows = query(userRef, where("USER_SESSION",'==', USERID ));

    try{
        const querySnapshot =  await getDocs(rows);

        querySnapshot.forEach(function (doc) {
            updateDoc(doc.ref, {
                DISTANCE  : DISTANCE,
            });
        });

    }catch(e){
         console.log("error", e.message);
    }finally{
        return;
    }

}


export const Update_userimg = async({USERID, img}) =>{


  const userRef = collection(db, "USERS");


  const rows = query(userRef, where("USER_SESSION",'==', USERID ));

  try{
      const querySnapshot =  await getDocs(rows);

      querySnapshot.forEach(function (doc) {
          updateDoc(doc.ref, {
              USER_IMAGE  : img,
          });
      });

  }catch(e){
       console.log("error", e.message);
  }finally{
      return;
  }

}

export const DuplicatePhone = async ({ USER_TEL }) => {
  const reviewRef = collection(db, "USERS");
  const q = query(reviewRef, where("USER_TEL", "==", USER_TEL));

  let user = null;

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
      user = doc.data();
    });
  } catch (e) {
    console.log("review read error", e);
  } finally {
    return new Promise((resolve, resject) => {
      resolve(user);
    });
  }
};
