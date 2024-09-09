import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS, WORKSTATUS } from '../utility/status';
import { useSleep } from '../utility/common';
import randomLocation from 'random-location'
import { distanceFunc } from '../utility/region';

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


export const CreateRoom = async({USERS_ID,ROOMTYPE,ROOM_INFO}) =>{

    let success = true;
    const ROOMREF = doc(collection(db, "ROOM"));
    const id = ROOMREF.id;

    try{
       const newdata = {
           ROOM_ID : id,
           USERS_ID : USERS_ID,
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

export const ReadRoom = async({latitude, longitude})=>{
  const roomRef = collection(db, "ROOM");

  let roomitems = [];
  let success = false;
  const q = query(roomRef);

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {

      let ROOM_INFONEW = doc.data().ROOM_INFO;

      const FindIndex = ROOM_INFONEW.findIndex(x=>x.requesttype == '지역');

      const distance = distanceFunc(ROOM_INFONEW[FindIndex].latitude , ROOM_INFONEW[FindIndex].longitude,latitude,longitude );
      

      if(distance < 5){
        roomitems.push(doc.data());
      }
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

export const ReadAllRoom = async()=>{
  const roomRef = collection(db, "ROOM");

  let roomitems = [];
  let success = false;
  const q = query(roomRef,orderBy("CREATEDT", "desc"));

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

export const DefaultReadRoom = async({latitude, longitude})=>{
  const roomRef = collection(db, "ROOM");

  let roomitems = [];
  let success = false;
  const q = query(roomRef,where("USERS_ID", "==", "01062149756"));

  try {
    const querySnapshot = await getDocs(q);

    let icount = 0;
    querySnapshot.forEach((doc) => {
    console.log("TCL: DefaultReadRoom -> ",doc.data() )

      let item ={
        CREATEDT :"",
        ROOMTYPE : "",
        ROOM_INFO : [],
        ROOM_STATUS :""
      }
 
      item.ROOMTYPE = doc.data().ROOMTYPE;

      let ROOM_INFONEW = doc.data().ROOM_INFO;

      const FindIndex = ROOM_INFONEW.findIndex(x=>x.requesttype == '지역');
      const P = {
        latitude: latitude,
        longitude: longitude
      }

      const R = 2000 // meters
      const randomPoint = randomLocation.randomCirclePoint(P, R);

      const geocoder = new kakao.maps.services.Geocoder();

      geocoder.coord2Address(randomPoint.longitude, randomPoint.latitude, async (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const address = result[0].address.address_name;
      
          ROOM_INFONEW[FindIndex].result = address;
          ROOM_INFONEW[FindIndex].latitude = randomPoint.latitude;
          ROOM_INFONEW[FindIndex].longitude = randomPoint.longitude;
          item.ROOM_INFO = ROOM_INFONEW;
          item.ROOM_STATUS = doc.data().ROOM_STATUS;
          icount++;
          roomitems.push(item);
          if(querySnapshot.size == icount){
            success = true;
          }
  
        }
      });
    });


  } catch (e) {
    console.log("error", e.message);
  } finally {

    await useSleep(3000);

    return new Promise(async (resolve, resject) => {

   
      if (success) {
        resolve(roomitems);
      } else {
        resolve(-1);
      }
    });
  }
}
