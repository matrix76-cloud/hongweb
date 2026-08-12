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

export const CreatePerformanceEvent = async({ITEM}) =>{

  let success = true;
  const PERFORMANCEEVENTREF = doc(collection(db, "PERFORMANCEEVENT"));
  const id = PERFORMANCEEVENTREF.id;

  try{
     const newdata = {
        PERFORMANCEEVENT_ID : id,
        PERFORMANCEEVENTITEM : ITEM,
  
     }
    await setDoc(PERFORMANCEEVENTREF, newdata);
  

  }catch(e){
    console.log("TCL: PERFORMANCEEVENTREF -> error ",e.message )
     
      alert( e.message);
      success =false;
      return -1;
  }finally{
    return id;
  }
}


export const ReadPerformanceEvent = async({})=>{
  const PERFORMANCEEVENTREF = collection(db, "PERFORMANCEEVENT");

  let festivalitems = [];
  let success = false;
  const q = query(PERFORMANCEEVENTREF, orderBy("performanceDate", "asc"));

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
export const ReadPerformanceEventBYPERFORMANCEEVENT_ID = async ({ PERFORMANCEEVENT_ID }) => {
  const PERFORMANCEEVENTREF = collection(db, "PERFORMANCEEVENT");

  let festivalitem= {};
  let success = false;
  const q = query(PERFORMANCEEVENTREF, where("PERFORMANCEEVENT_ID", "==", PERFORMANCEEVENT_ID));

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      festivalitem = (doc.data());
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
export const UpdatePerformanceEvent = async ({ PERFORMANCEEVENT_ID, performanceDate }) => {
  console.log("MATRIX LOG : UpdatePerformanceEvent : performanceDate:", performanceDate)

  return new Promise(async (resolve, resject) => {
    const PERFORMANCEEVENTREF = collection(db, "PERFORMANCEEVENT");

    const rows = query(PERFORMANCEEVENTREF, where("PERFORMANCEEVENT_ID", '==', PERFORMANCEEVENT_ID));

    let docid = "";
    try {
      const querySnapshot = await getDocs(rows);

      querySnapshot.forEach(function (doc) {

   


        docid = doc.id;
        updateDoc(doc.ref, {
          performanceDate: performanceDate,


        });
      });

    } catch (e) {
      console.log("error", e.message);
    } finally {
      resolve(docid);
    }
  });
}


