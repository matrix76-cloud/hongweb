import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS, WORKSTATUS } from '../utility/status';

const authService = getAuth(firebaseApp);



/**
 * Room 관련 서비스
 *! Create 
 * ① CreateRoom : 
 * 공간 생성 
 * USER_ID(공간 대여자 정보 인덱스),
 * ROOMTYPE
 * ROOMSIZE
 * ROOMENABLE
 * ROOMIMAGE
 * REGION
 * PRICE
 * LATITUDE
 * LONGITUDE
 * ROOM_STATUS(일감상태: 기본값 ROOMSTATUS.OPEN), 
 * CREATEDT(일감요청일시: 현재시간), 
 *! Read
 * ① ReadRoom : 모든 일감 가져오기
 *! Update
 
 *! Delete

 */


export const CreateRoom = async({USER_ID,ROOMTYPE,ROOM_INFO}) =>{

    let success = true;
    const ROOMREF = doc(collection(db, "ROOM"));
    const id = ROOMREF.id;

    try{
       const newdata = {
           ROOM_ID : id,
           USER_ID : USER_ID,
           ROOMTYPE : ROOMTYPE,
           ROOM_INFO : ROOM_INFO,
           ROOM_STATUS : WORKSTATUS.OPEN,
           CREATEDT : Date.now(),
       }
       await setDoc(ROOMREF, newdata);
    
    }catch(e){
      console.log("TCL: CreateRoom -> error ",e.message )
       
        alert( e.message);
        success =false;
        return -1;
    }finally{
      return id;
    }
}

export const ReadRoom = async()=>{
  const roomRef = collection(db, "ROOM");

  let roomitems = [];
  let success = false;
  const q = query(roomRef);

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      roomitems.push(doc.data());
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(roomitems);
      } else {
        resolve(-1);
      }
    });
  }
}
