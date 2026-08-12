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


export const CreateHomeWork = async({USERS_ID, NAME, STARTDATE, PHONE, ALARM, MEMO}) =>{

  let success = true;
  const HOMEWORKREF = doc(collection(db, "HOMEWORK"));
  const id = HOMEWORKREF.id;


  try{
     const newdata = {
         HOMEWORK_ID : id,
         NAME : NAME,
         USERS_ID : USERS_ID,
         STARTDATE : STARTDATE,
         PHONE : PHONE,
         ALARM: ALARM,
         MEMO: MEMO,
         complete :false,
         CREATEDT : Date.now(),
  
     }
    await setDoc(HOMEWORKREF, newdata);
  

  }catch(e){
    console.log("TCL: CREATEHOMEWORK -> error ",e.message )
     
      alert( e.message);
      success =false;
      return -1;
  }finally{
    return id;
  }
}


export const ReadHomeWork = async({USERS_ID})=>{
  const homeworkRef = collection(db, "HOMEWORK");

  let homeworkitems = [];
  let success = false;
  const q = query(homeworkRef, where("USERS_ID", "==", USERS_ID), orderBy("STARTDATE", "asc"));

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      homeworkitems.push(doc.data());
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(homeworkitems);
      } else {
        resolve(-1);
      }
    });
  }
}

export const UpdateHOMEWORKid = async ({ HOMEWORK_ID, complete }) => {

  const homeworkRef = collection(db, "HOMEWORK");
  const rows = query(homeworkRef, where("HOMEWORK_ID", "==", HOMEWORK_ID));

  try {
    const querySnapshot = await getDocs(rows);
    for (const doc of querySnapshot.docs) {
      await updateDoc(doc.ref, {
        complete: complete,
      });
    }
  } catch (e) {
    console.log("error", e.message);
    return -1;
  }

  return 0;
}
 
 export const DeleteHomeWorkHOMEWORK_ID = async({HOMEWORK_ID}) =>{

   const homeworkRef = collection(db, "HOMEWORK");
   const rows = query(homeworkRef, where("HOMEWORK_ID", "==", HOMEWORK_ID));

   try {
     const querySnapshot = await getDocs(rows);
     for (const doc of querySnapshot.docs) {
       await deleteDoc(doc.ref);
     }
   } catch (e) {
     console.log("error", e.message);
     return -1;
   }

   return 0;


 }

