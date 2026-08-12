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

export const CreateRegionCode = async({ITEM}) =>{

  let success = true;
  const REGIONCODEREF = doc(collection(db, "REGIONCODETABLE"));
  const id = REGIONCODEREF.id;

  try{
     const newdata = {
         REGIONCODE_ID : id,
         REGIONCODE : ITEM,
  
     }
     await setDoc(REGIONCODEREF, newdata);
  

  }catch(e){
    console.log("TCL: CreateRegionCode -> error ",e.message )
     
      alert( e.message);
      success =false;
      return -1;
  }finally{
    return id;
  }
}


export const ReadREGIONCODE = async({})=>{
  const REGIONCODEREF = collection(db, "REGIONCODETABLE");

  let regioncodeitems = [];
  let success = false;
  const q = query(REGIONCODEREF);

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      regioncodeitems.push(doc.data());
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(regioncodeitems);
      } else {
        resolve(-1);
      }
    });
  }
}
