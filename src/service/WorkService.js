import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS, WORKSTATUS } from '../utility/status';

const authService = getAuth(firebaseApp);



/**
 * Work 관련 서비스
 *! Create 
 * ① CreateWork : 
 * 요청 일감 생성 
 * USER_ID(요청자 정보 인덱스),
 * WORK_INFO(일감 정보 object)
 * WORK_STATUS(일감상태: 기본값 WORKSTATUS.OPEN), 
 * CREATEDT(일감요청일시: 현재시간), 
 *! Read
 * ① ReadWork : 모든 일감 가져오기
 *! Update
 
 *! Delete

 */


export const CreateWork = async({USER_ID,WORKTYPE, WORK_INFO}) =>{

    let success = true;
    const WORKREF = doc(collection(db, "WORK"));
    const id = WORKREF.id;

    try{
       const newdata = {
           WORK_ID : id,
           USER_ID : USER_ID,
           WORKTYPE : WORKTYPE,
           WORK_INFO : WORK_INFO,
           WORK_STATUS : WORKSTATUS.OPEN,
           CREATEDT : Date.now(),
       }
       await setDoc(WORKREF, newdata);
    
    }catch(e){
      console.log("TCL: CreateWork -> error ",e.message )
       
        alert( e.message);
        success =false;
        return -1;
    }finally{
      return id;
    }
}

export const ReadWork = async()=>{
  const workRef = collection(db, "WORK");

  let workitems = [];
  let success = false;
  const q = query(workRef,orderBy("CREATEDT", "desc"));

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      workitems.push(doc.data());
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(workitems);
      } else {
        resolve(-1);
      }
    });
  }
}
