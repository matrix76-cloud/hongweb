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


export const CreateEventConfig = async({USERS_ID, eventworkitems, eventpriceitems, eventhongitems}) =>{

    let success = true;
    const EVENTCONFIGREF = doc(collection(db, "EVENTCONFIG"));
    const id = EVENTCONFIGREF.id;

    try{
       const newdata = {
           EVENTCONFIG_ID : id,
           EVENTWORKITEMS : eventworkitems,
           EVENTPRICEITEMS : eventpriceitems,
           EVENTHONGITEMS : eventhongitems,
           USERS_ID : USERS_ID,
           CREATEDT : Date.now(),
       }
       await setDoc(EVENTCONFIGREF, newdata);
    
    }catch(e){
      console.log("TCL: CreateRegistaddr -> error ",e.message )
       
        alert( e.message);
        success =false;
        return -1;
    }finally{
      return id;
    }
}

export const ReadEventConfig = async({USERS_ID})=>{


  return new Promise(async (resolve, resject) => {
    const EVENTCONFIGREF = collection(db, "EVENTCONFIG");
    let success = false;
    let eventitem = {}
    const q = query(EVENTCONFIGREF, where("USERS_ID", "==", USERS_ID));

    try {
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc) => {
      console.log("TCL: EVENTCONFIGREF -> doc", doc.data())
        eventitem  = doc.data();
        success = true;
      });

      if (success) {
        resolve(eventitem);
      } else {
        resolve(-1);
      }


    } catch (e) {
      console.log("error", e.message);
    } finally {

    }
  });
}
export const UpdateEventConfig = async({USERS_ID, eventworkitems,eventhongitems, eventpriceitems})=>{
  
    return new Promise(async (resolve, resject) => {
      const EVENTCONFIGREF = collection(db, "EVENTCONFIG");

      const rows = query(EVENTCONFIGREF, where("USERS_ID",'==', USERS_ID ));
    
      let docid = "";
      try{
          const querySnapshot =  await getDocs(rows);
    
          querySnapshot.forEach(function (doc) {
    
              docid = doc.id;
              updateDoc(doc.ref, {
                EVENTWORKITEMS  : eventworkitems,
                EVENTPRICEITEMS  : eventpriceitems,
                EVENTHONGITEMS  : eventhongitems,

              });
          });
    
      }catch(e){
           console.log("error", e.message);
      }finally{
          resolve(docid);
      }
    });
}
  

