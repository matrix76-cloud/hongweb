import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPhoneNumber, signOut, updateProfile } from 'firebase/auth';
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


export const Create_userdevice = async({DEVICEID, TOKEN, LATITUDE, LONGITUDE}) =>{

  let success = true;

  try{

     const userRef = doc(collection(db, "USERS"));
     const id = userRef.id;
     const newuser = {
         USERS_ID : id,
         DEVICEID : DEVICEID,
         TOKEN : TOKEN,
         LATITUDE : LATITUDE,
         LONGITUDE : LONGITUDE,
     
     }
     await setDoc(userRef, newuser);
   
    

  }catch(e){
      console.log("auth ", e.message);
      success =false;
      return null;
  }finally{
    return;
  }
}
export const Read_userdevice = async({DEVICEID}) =>{

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
        resolve(searchitems);
      } else {
        resolve(-1);
      }
    });
  }

}

export const Update_userdevice = async({DEVICEID, TOKEN, LATITUDE, LONGITUDE}) =>{


    const userRef = collection(db, "USERS");

    const rows = query(userRef, where("DEVICEID",'==', DEVICEID ));

    try{
        const querySnapshot =  await getDocs(rows);

        querySnapshot.forEach(function (doc) {
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
        return;
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
