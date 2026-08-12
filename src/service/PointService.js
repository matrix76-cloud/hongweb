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
 * Room 관련 서비스
 *! Create 
 * ① CreateRoom : 
 *! Read
 * ① ReadRoom : 모든 일감 가져오기
 *! Update
 
 *! Delete

 */


export const CreatePoint = async ({ POINTVARCODE, POINT, TYPE, POINTDATE, POINTEXPIREDATE, ENABLE, USERS_ID }) =>{

    let success = true;
    const POINTREF = doc(collection(db, "POINT"));
    const id = POINTREF.id;

    try{
       const newdata = {
        POINT_ID: id,
        POINTVARCODE : POINTVARCODE,
        POINT: POINT,
        POINTTYPE: TYPE,
        POINTDATE: POINTDATE,
        POINTEXPIREDATE: POINTEXPIREDATE,
        ENABLE: ENABLE,
        USERS_ID : USERS_ID,
        CREATEDT : Date.now(),
       }
      await setDoc(POINTREF, newdata);
    
    }catch(e){
      console.log("TCL: CreateRegistaddr -> error ",e.message )
       
        alert( e.message);
        success =false;
        return -1;
    }finally{
      return id;
    }
}



export const ReadPOINTByIndividually = async ({ USERS_ID }) => {


  return new Promise(async (resolve, reject) => {
    const POINTREF = collection(db, "POINT");

    let pointitems = [];
    let success = false;
    const q = query(POINTREF, where("USERS_ID", "==", USERS_ID), orderBy("CREATEDT", "desc"));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        pointitems.push(doc.data());
      });

      console.log("pointitems", pointitems);

      if (pointitems.length > 0) {
        resolve(pointitems);
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
  

