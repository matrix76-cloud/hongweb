import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS, WORKSTATUS } from '../utility/status';
import { useSleep } from '../utility/common';
import randomLocation from 'random-location'
import { distanceFunc } from '../utility/region';
import Axios from 'axios';

const authService = getAuth(firebaseApp);




/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;


/**
 * Room 관련 서비스
 *! Create 
 * ① CreateRoom : 
 *! Read
 * ① ReadRoom : 모든 일감 가져오기
 *! Update
 
 *! Delete

 */


export const CreateRegistAddr = async({ADDR, TYPE}) =>{

    let success = true;
    const REGISTADDRREF = doc(collection(db, "REGISTADDR"));
    const id = REGISTADDRREF.id;

    try{
       const newdata = {
           REGISTADDR_ID : id,
           ADDR : ADDR,
           TYPE : TYPE,
           CREATEDT : Date.now(),
       }
       await setDoc(REGISTADDRREF, newdata);
    
    }catch(e){
      console.log("TCL: CreateRegistaddr -> error ",e.message )
       
        alert( e.message);
        success =false;
        return -1;
    }finally{
      return id;
    }
}



export const ReadRegistAddr = async({ADDR, TYPE})=>{
console.log("TCL: ReadRegistAddr -> TYPE", TYPE)
console.log("TCL: ReadRegistAddr -> ADDR", ADDR)

  return new Promise(async (resolve, resject) => {
    const REGISTADDRREF = collection(db, "REGISTADDR");
    let success = false;
    const q = query(REGISTADDRREF, where("ADDR", "==", ADDR));

    try {
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
      console.log("TCL: ReadRegistAddr -> doc", doc.data())

        
        if(doc.data().TYPE == TYPE){
          success = true;
        }
      });

      if (success) {
        resolve(1);
      } else {
        resolve(-1);
      }


    } catch (e) {
      console.log("error", e.message);
    } finally {

    }
  });
}

