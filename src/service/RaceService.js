import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS, WORKSTATUS } from '../utility/status';
import randomLocation from 'random-location'
import { useSleep } from '../utility/common';
import Axios from 'axios';
import { CONTACTTYPE } from '../utility/screen';
const authService = getAuth(firebaseApp);


/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;




/**
 * Contact 관련 서비스
 *! Create 
 * ① CreateContact : 

 *! Read

 *! Update
 
 *! Delete

 */


export const CreateRACE = async({USERS_ID, MINUTE, COUNT}) =>{

    let success = true;
    const RACEREF = doc(collection(db, "RACE"));
    const id = RACEREF.id;

    try{
       const newdata = {
           RACE_ID : id,
           USERS_ID: USERS_ID,
           MINUTE : MINUTE,
           COUNT : COUNT,
           CREATEDT : Date.now(),
       }
       await setDoc(RACEREF, newdata);
    
    }catch(e){
      console.log("TCL: Create race -> error ",e.message )
      alert( e.message);
      success =false;
      return -1;
    }finally{
      return id;
    }
}

export const ReadRACEByIndividually = async({USERS_ID})=>{


  return new Promise(async (resolve, reject) => {
    const RACEREF = collection(db, "RACE");

    let raceitems = [];
    let success = false;
    const q = query(RACEREF,where("USERS_ID", "==", USERS_ID));
   
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        raceitems.push(doc.data());
      });
  
      if (raceitems.length > 0) {
        resolve(raceitems);
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
export const ReadRACE = async({})=>{

  
    return new Promise(async (resolve, reject) => {
      const RACEREF = collection(db, "RACE");
  
      let raceitems = [];
      let success = false;
      const q = query(RACEREF);
     
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          raceitems.push(doc.data());
    
  
        });
    
        if (raceitems.length > 0) {
          resolve(raceitems);
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
  
export const ReadRACEREPORT = async ({ }) => {


  return new Promise(async (resolve, reject) => {
    const RACEREPORTREF = collection(db, "RACEREPORT");

    let raceitems = [];
    let success = false;
    const q = query(RACEREPORTREF);

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        raceitems.push(doc.data());


      });

      if (raceitems.length > 0) {
        resolve(raceitems);
      } else {
        resolve(-1);
      }

    } catch (e) {
      console.log("error", e.message);
      resolve(-1);
    } finally {

    }

  });

}

export const UpdateRACEByUSERSID = async ({ USERS_ID, MINUTE, NAME, PHOTO, LOCATION }) => {
  const RACEREF = collection(db, "RACE");
  const rows = query(RACEREF, where("USERS_ID", "==", USERS_ID));
  let docid = "";

  try {
    const querySnapshot = await getDocs(rows);

    if (!querySnapshot.empty) {
      // ✅ 첫 문서만 업데이트 (중복방지)
      const docRef = querySnapshot.docs[0].ref;
      docid = querySnapshot.docs[0].id;

      await updateDoc(docRef, {
        MINUTE,
        NAME,
        PHOTO,
        LOCATION,
        CREATEDT: Date.now(),
      });

      console.log("✅ 기존 기록 업데이트:", docid);
    } else {
      const docRef = await addDoc(RACEREF, {
        USERS_ID,
        MINUTE,
        NAME,
        PHOTO,
        LOCATION,
        CREATEDT: Date.now(),
      });
      docid = docRef.id;

      console.log("✅ 신규 기록 추가:", docid);
    }
  } catch (e) {
    console.log("❌ 기록 저장 오류:", e.message);
  }

  return docid;
};



  