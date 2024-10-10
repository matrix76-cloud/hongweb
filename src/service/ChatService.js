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
 * CHAT 관련 서비스
 *! Create 
 * ① CreateChat : 

 *! Read

 *! Update
 
 *! Delete

 */


export const CreateChat = async({OWNER, OWNER_ID, SUPPORTER, SUPPORTER_ID,WORK_INFO}) =>{

    let success = true;
    const CHATREF = doc(collection(db, "CHAT"));
    const id = CHATREF.id;

    try{
       const newdata = {
           CHAT_ID : id,
           OWNER : OWNER,
           OWNER_ID :OWNER_ID,
           SUPPORTER : SUPPORTER,
           SUPPORTER_ID :SUPPORTER_ID,
           WORK_INFO : WORK_INFO,
           CREATEDT : Date.now(),
       }
       await setDoc(CHATREF, newdata);
    
    }catch(e){
      console.log("TCL: Create chat -> error ",e.message )
       
        alert( e.message);
        success =false;
        return -1;
    }finally{
      return id;
    }
}

export const ReadChat = async({USERS_ID}) =>{
console.log("TCL: ReadChat -> USERS_ID", USERS_ID)

  return new Promise(async (resolve, reject) => {
    const userRef = collection(db, "CHAT");
    const q = query(userRef, orderBy('CREATEDT',"desc"));
  

    let chatitems = [];
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
  
        if((doc.data().OWNER_ID == USERS_ID) || (doc.data().SUPPORTER_ID == USERS_ID)){
          chatitems.push(doc.data());
        }
  
      });
  
      if (chatitems.length > 0) {
        resolve(chatitems);
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
export const ReadChatByCHATID = async({CHAT_ID}) =>{
 
  
    return new Promise(async (resolve, reject) => {
      const userRef = collection(db, "CHAT");
      const q = query(userRef, where('CHAT_ID',"==", CHAT_ID));
    
  
      let chatitem = {};
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
    
            chatitem = doc.data();
  
        });
    
        if (chatitem.CHAT_ID != undefined) {
          resolve(chatitem);
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
export const ReadChannel = async({CHAT_ID}) =>{

  return new Promise(async (resolve, reject) => {
    const chatRef = collection(db, `CHAT/${CHAT_ID}/messages`);
    const q = query(chatRef, orderBy('CREATEDT',"asc"));
  
    let chatitems = [];
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
         chatitems.push(doc.data());
      });
  
      if (chatitems.length > 0) {
        resolve(chatitems);
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



export const CreateMessage = async ({ CHAT_ID, msg, users_id,read,CHAT_CONTENT_TYPE }) => {

  console.log("TCL: CreateMessage -> data", msg,users_id,read)

  
  const messageRef = doc(collection(db, `CHAT/${CHAT_ID}/messages`));
  const id = messageRef.id;
  const newMessage = {
    MESSAGE_ID: id,
    TEXT: msg,
    CREATEDAT: Date.now(),
    USERS_ID: users_id,
    READ:read,
    CHAT_CONTENT_TYPE: CHAT_CONTENT_TYPE
  };

  try {
    await setDoc(messageRef, newMessage);
  } catch (e) {
    console.log("error", e.message);
  }
};
