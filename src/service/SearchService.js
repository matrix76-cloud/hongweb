import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy, limit } from 'firebase/firestore';
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

export const CreateSearch = async({USER_ID,SEARCH,CONTENT}) =>{

  let success = true;
  const SEARCHREF = doc(collection(db, "SEARCH"));
  const id = SEARCHREF.id;

  try{

 
     const newdata = {
         SEARCH_ID : id,
         USER_ID : USER_ID,
         SEARCH : SEARCH,
         CONTENT : CONTENT,
         CREATEDT : Date.now(),
  
     }
     await setDoc(SEARCHREF, newdata);
  

  }catch(e){
    console.log("TCL: CreateSearch -> error ",e.message )
     
      alert( e.message);
      success =false;
      return -1;
  }finally{
    return id;
  }
}


/**
 * 
 * 검색 결과를 30개까지만 제한 합니다
 */
export const ReadSearchByid = async({USER_ID})=>{
  const searchRef = collection(db, "SEARCH");

  let searchitems = [];
  let success = false;
  const q = query(searchRef,where("USER_ID", "==", USER_ID)
  ,limit(30)
  ,orderBy("CREATEDT", "desc")
  );

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

export const UpdateSearchByid = async({SEARCH_ID, USERCOMMENT})=>{

 const searchRef = collection(db, "SEARCH");

 const rows = query(searchRef, where("SEARCH_ID", "==", SEARCH_ID));
 try {
   const querySnapshot = await getDocs(rows);

   querySnapshot.forEach(function (doc) {

     updateDoc(doc.ref, {
       USERCOMMENT:USERCOMMENT,
     });
   });
 } catch (e) {
   return new Promise((resolve, resject) => {
     console.log("error", e.message);
     resolve(-1);
   });
 
   
 } finally {
   return new Promise((resolve, resject) => {
   console.log("TCL: UpdateCommunityByid -> resolve success", resolve)
     resolve(0);

   
   });
 }
}


export const DeleteSearchByid = async({SEARCH_ID})=>{

  let success = true;
  const searchRef = doc(db, "SEARCH", SEARCH_ID);
  try{
      await deleteDoc(searchRef);
  }catch(e){
      console.log("error", e.message);
      success = false;
  }finally{
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(0);
      } else {
        resolve(-1);
      }
    });
  }

}