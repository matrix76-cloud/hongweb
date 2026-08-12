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

export const CreateFESTIVAL = async({ITEM}) =>{

  let success = true;
  const FESTIVALREF = doc(collection(db, "FESTIVAL"));
  const id = FESTIVALREF.id;

  try{
     const newdata = {
         FESTIVAL_ID : id,
         FESTIVALITEM : ITEM,
  
     }
     await setDoc(FESTIVALREF, newdata);
  

  }catch(e){
    console.log("TCL: FESTIVALREF -> error ",e.message )
     
      alert( e.message);
      success =false;
      return -1;
  }finally{
    return id;
  }
}


export const ReadFESTITVAL = async({})=>{
  const FESTIVALREF = collection(db, "FESTIVAL");

  let festivalitems = [];
  let success = false;
  const q = query(FESTIVALREF, orderBy("fstvlBgngDe", "asc"));

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      festivalitems.push(doc.data());
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(festivalitems);
      } else {
        resolve(-1);
      }
    });
  }
}
export const ReadFESTITVALBYFESTIVAL_ID = async ({ FESITVAL_ID }) => {
  const FESTIVALREF = collection(db, "FESTIVAL");


  console.log("FESITVAL_ID", FESITVAL_ID);


  let festivalitem = {};
  let success = false;
  const q = query(FESTIVALREF, where("FESTIVAL_ID", "==", FESITVAL_ID));
  


  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      festivalitem = doc.data();
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(festivalitem);
      } else {
        resolve(-1);
      }
    });
  }
}
export const UpdateFESTIVAL = async ({ FESTIVAL_ID, fstvlBgngDe }) => {

  return new Promise(async (resolve, resject) => {
    const FESTIVALREF = collection(db, "FESTIVAL");

    const rows = query(FESTIVALREF, where("FESTIVAL_ID", '==', FESTIVAL_ID));

    let docid = "";
    try {
      const querySnapshot = await getDocs(rows);

      querySnapshot.forEach(function (doc) {

        docid = doc.id;
        updateDoc(doc.ref, {
          fstvlBgngDe: fstvlBgngDe,


        });
      });

    } catch (e) {
      console.log("error", e.message);
    } finally {
      resolve(docid);
    }
  });
}


