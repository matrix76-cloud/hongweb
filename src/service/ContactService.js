import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS, WORKSTATUS } from '../utility/status';
import randomLocation from 'random-location'
import { useSleep } from '../utility/common';
import Axios from 'axios';
const authService = getAuth(firebaseApp);


/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;




/**
 * Contact 관련 서비스
 *! Create 
 * ① CreateContact : 

 *! Read

 *! Update
 
 *! Delete

 */


export const CreateContact = async({OWNER_ID, CONTACT_STATUS, SUPPORTER_ID,CONTACT_INFO,WORK_ID,RIGHT_SIGN}) =>{

    let success = true;
    const CONTACTREF = doc(collection(db, "CONTACT"));
    const id = CONTACTREF.id;

    try{
       const newdata = {
           CONTACT_ID : id,
           WORK_ID :WORK_ID,
           SUPPORTER_ID :SUPPORTER_ID,
           OWNER_ID: OWNER_ID,
           CONTACT_INFO : CONTACT_INFO,
           CONTACTSTATUS : CONTACT_STATUS,
           RIGHT_SIGN : RIGHT_SIGN,
           CREATEDT : Date.now(),
       }
       await setDoc(CONTACTREF, newdata);
    
    }catch(e){
      console.log("TCL: Create contact -> error ",e.message )
       
        alert( e.message);
        success =false;
        return -1;
    }finally{
      return id;
    }
}

export const ReadContactByIndividually = async({WORK_ID, OWNER_ID, SUPPORTER_ID})=>{
  console.log("TCL: ReadContactByIndividually -> WORK_ID", WORK_ID)
  console.log("TCL: ReadContactByIndividually -> SUPPORTER_ID", SUPPORTER_ID)
  console.log("TCL: ReadContactByIndividually -> OWNER_ID", OWNER_ID)
  return new Promise(async (resolve, reject) => {
    const contactRef = collection(db, "CONTACT");

    let contactitem = {};
    let success = false;
    const q = query(contactRef,where("WORK_ID", "==", WORK_ID));
   
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {

        if(doc.data().OWNER_ID == OWNER_ID && doc.data().SUPPORTER_ID == SUPPORTER_ID){
          contactitem = doc.data();
        }

      });
  
      if (contactitem.CONTACT_ID != undefined) {
        resolve(contactitem);
      }else{
        resolve(-1);
      }

    } catch (e) {
      console.log("error", e.message);
      resolve(-1);
    } finally {

    }

  });

}

export const UpdateContactByContactID = async({CONTACT_ID,CONTACT_INFO}) =>{

  const contactRef = collection(db, "CONTACT");

  const rows = query(contactRef, where("CONTACT_ID",'==', CONTACT_ID ));

  let docid = "";
  try{
      const querySnapshot =  await getDocs(rows);

      querySnapshot.forEach(function (doc) {

          docid = doc.id;
          updateDoc(doc.ref, {
            CONTACT_INFO  : CONTACT_INFO,
          });
      });

  }catch(e){
       console.log("error", e.message);
  }finally{
      return docid;
  }
}
export const UpdateContactByLeftSign = async({CONTACT_ID,LEFT_SIGN}) =>{

  const contactRef = collection(db, "CONTACT");

  const rows = query(contactRef, where("CONTACT_ID",'==', CONTACT_ID ));

  let docid = "";
  try{
      const querySnapshot =  await getDocs(rows);

      querySnapshot.forEach(function (doc) {

          docid = doc.id;
          updateDoc(doc.ref, {
            LEFT_SIGN  : LEFT_SIGN,
          });
      });

  }catch(e){
       console.log("error", e.message);
  }finally{
      return docid;
  }
}

