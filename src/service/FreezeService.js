import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy, limit, arrayUnion } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS } from '../utility/status';

const authService = getAuth(firebaseApp);



/**
 * Search 관련 서비스
 *! Create 
 * ① CreateSearch : 
 * Search 생성 
 * USER_ID(검색한사람 정보 인덱스),
 * SEARCH(검색어),
 * CONTENT(검색결과),
 * CREATEDT(생성날짜)

 *! Read
 * ① ReadSearchByid : 인덱스에 맞는 검색어 결과 가져오기

 *! update
 * ① UpdateSearchByid : 인덱스에 맞는 검색내용 업데이트
 * USERCOMMENT(추가 커메트)


 *! Delete
 * ① DeleteSearchByid : 인덱스에 맞는 검색내용삭제
 */

function randomNumberInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export const CreateFreeze = async({USERS_ID, NAME, STARTDATE, ENDDATE, ALARM}) =>{

  let success = true;
  const FREEZEREF = doc(collection(db, "FREEZE"));
  const id = FREEZEREF.id;


  try{
     const newdata = {
         FREEZE_ID : id,
         NAME : NAME,
         USERS_ID : USERS_ID,
         STARTDATE : STARTDATE,
         ENDDATE : ENDDATE,
         ALARM : ALARM,
         check : false,
         CREATEDT : Date.now(),
  
     }
     await setDoc(FREEZEREF, newdata);
  

  }catch(e){
    console.log("TCL: CreateFreeze -> error ",e.message )
     
      alert( e.message);
      success =false;
      return -1;
  }finally{
    return id;
  }
}


export const ReadFREEZE = async({USERS_ID})=>{
  const freezeRef = collection(db, "FREEZE");

  let freezeitems = [];
  let success = false;
  const q = query(freezeRef, where("USERS_ID", "==", USERS_ID));

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      freezeitems.push(doc.data());
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(freezeitems);
      } else {
        resolve(-1);
      }
    });
  }
}

export const UpdateFREEZECHECKid = async({FREEZE_ID, check})=>{

  const freezeRef = collection(db, "FREEZE");
 
  const rows = query(freezeRef, where("FREEZE_ID", "==", FREEZE_ID));
  try {
    const querySnapshot = await getDocs(rows);
 
    querySnapshot.forEach(function (doc) {
      updateDoc(doc.ref, {
        check:check,
      });
    });
  } catch (e) {
    return new Promise((resolve, resject) => {
      console.log("error", e.message);
      resolve(-1);
    });
  
    
  } finally {
    return new Promise((resolve, resject) => {
    console.log("TCL: FREEZE_ID -> resolve success", resolve)
      resolve(0);
 
    
    });
  }
 }

 export const UpdateFREEZEid = async({FREEZE_ID, ITEM})=>{

 

  const freezeRef = collection(db, "FREEZE");
 
  const STARTDATE = ITEM.STARTDATE;
  const ENDDATE = ITEM.ENDDATE;
  const NAME = ITEM.NAME;
  const ALARM = ITEM.ALARM;

  console.log("TCL: UpdateFREEZEid -> ITEM", STARTDATE, ENDDATE, NAME, ALARM)

  const rows = query(freezeRef, where("FREEZE_ID", "==", FREEZE_ID));
  try {
    const querySnapshot = await getDocs(rows);
 
    querySnapshot.forEach(function (doc) {
    console.log("TCL: UpdateFREEZEid -> doc", doc.data())
      
      updateDoc(doc.ref, {
        STARTDATE : STARTDATE,
        ENDDATE : ENDDATE,
        NAME : NAME,
        ALARM :ALARM
      });
    });
  } catch (e) {
    return new Promise((resolve, resject) => {
      console.log("error", e.message);
      resolve(-1);
    });
  
    
  } finally {
    return new Promise((resolve, resject) => {
    console.log("TCL: UpdateFREEZEDATEid -> resolve success");
      resolve(0);
 
    
    });
  }
 }
 
 export const DeleteFreezeFREEZE_ID = async({FREEZE_ID}) =>{

  return new Promise(async (resolve, reject) => {

    const freezeRef = collection(db, "FREEZE");

    let success = false;
    const q = query(freezeRef,where("FREEZE_ID", "==", FREEZE_ID));

   
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async(doc) => {
        await deleteDoc(doc.ref);
        resolve(0);
      });
  


    } catch (e) {
      console.log("error", e.message);
    } finally {

    }

  });



}