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

export const CreateTOURCOURSE = async({ITEM}) =>{

  let success = true;
  const TOURCOURSEREF = doc(collection(db, "TOURCOURSE"));
  const id = TOURCOURSEREF.id;

  try{
     const newdata = {
         TOURCOURSE_ID : id,
         TOURCOURSEITEM : ITEM,
  
     }
     await setDoc(TOURCOURSEREF, newdata);
  

  }catch(e){
    console.log("TCL: TOURCOURSE -> error ",e.message )
     
      alert( e.message);
      success =false;
      return -1;
  }finally{
    return id;
  }
}
export const CreateTOURCOURSECODE = async({ITEM}) =>{

  let success = true;
  const TOURCOURSECODEREF = doc(collection(db, "TOURCOURSECODE"));
  const id = TOURCOURSECODEREF.id;

  try{
     const newdata = {
         TOURCOURSECODE_ID : id,
         TOURCOURSECODEITEM : ITEM,
  
     }
     await setDoc(TOURCOURSECODEREF, newdata);
  

  }catch(e){
    console.log("TCL: TOURCOURSE -> error ",e.message )
     
      alert( e.message);
      success =false;
      return -1;
  }finally{
    return id;
  }
}


export const ReadTOURCOURSE = async({})=>{
  const TOURCOURSEREF = collection(db, "TOURCOURSE");

  let tourcourseitems = [];
  let success = false;
  const q = query(TOURCOURSEREF);

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      tourcourseitems.push(doc.data());
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(tourcourseitems);
      } else {
        resolve(-1);
      }
    });
  }
}


export const ReadTOURCOURSECODE = async({})=>{
  const TOURCOURSECODEREF = collection(db, "TOURCOURSECODE");

  let tourcoursecodeitems = [];
  let success = false;
  const q = query(TOURCOURSECODEREF);

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      tourcoursecodeitems.push(doc.data());
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(tourcoursecodeitems);
      } else {
        resolve(-1);
      }
    });
  }
}
