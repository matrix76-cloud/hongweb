import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS, WORKSTATUS } from '../utility/status';
import randomLocation from 'random-location'
import { useSleep } from '../utility/common';
const authService = getAuth(firebaseApp);


/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;


export const distanceFunc = (lat1, lon1, lat2, lon2) => {
	const R = 6371; // 지구 반지름 (단위: km)
	const dLat = deg2rad(lat2 - lat1);
	const dLon = deg2rad(lon2 - lon1);
	const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
			  Math.sin(dLon/2) * Math.sin(dLon/2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	const distance = R * c; // 두 지점 간의 거리 (단위: km)
	return distance;
}
  
export const  deg2rad = (deg)=> {
	return deg * (Math.PI/180);
}

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


export const CreateWork = async({USERS_ID,WORKTYPE, WORK_INFO}) =>{

    let success = true;
    const WORKREF = doc(collection(db, "WORK"));
    const id = WORKREF.id;

    try{
       const newdata = {
           WORK_ID : id,
           USERS_ID : USERS_ID,
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

export const ReadAllWork = async()=>{
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

export const ReadWork = async({latitude, longitude})=>{
  const workRef = collection(db, "WORK");

  let workitems = [];
  let success = false;
  const q = query(workRef,orderBy("CREATEDT", "desc"));

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {

      let WORK_INFONEW = doc.data().WORK_INFO;

      const FindIndex = WORK_INFONEW.findIndex(x=>x.requesttype == '지역');

      const distance = distanceFunc(WORK_INFONEW[FindIndex].latitude , WORK_INFONEW[FindIndex].longitude,latitude,longitude );
      

      if(distance < 5){
        workitems.push(doc.data());
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
        resolve(workitems);
      } else {
        resolve(-1);
      }
    });
  }
}

export const DefaultReadWork = async({latitude, longitude})=>{
  const workRef = collection(db, "WORK");

  let workitems = [];
  let success = false;
  const q = query(workRef,where("USER_ID", "==", "01062149755"));

  try {
    const querySnapshot = await getDocs(q);

    let icount = 0;
    querySnapshot.forEach((doc) => {

      let item ={
        CREATEDT :"",
        WORKTYPE : "",
        WORK_INFO : [],
        WORK_STATUS :""
      }
 
      item.WORKTYPE = doc.data().WORKTYPE;

      let WORK_INFONEW = doc.data().WORK_INFO;

      const FindIndex = WORK_INFONEW.findIndex(x=>x.requesttype == '지역');
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
      
          WORK_INFONEW[FindIndex].result = address;
          WORK_INFONEW[FindIndex].latitude = randomPoint.latitude;
          WORK_INFONEW[FindIndex].longitude = randomPoint.longitude;
          item.WORK_INFO = WORK_INFONEW;
          item.WORK_STATUS = doc.data().WORK_STATUS;
          icount++;
          workitems.push(item);
          if(querySnapshot.size == icount){
            success = true;
          }
  
        }
      });
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {

    await useSleep(3000);

    return new Promise(async (resolve, resject) => {

   
      if (success) {
        resolve(workitems);
      } else {
        resolve(-1);
      }
    });
  }
}
export const ReadWorkByIndividually = async({WORK_ID})=>{
  const workRef = collection(db, "WORK");

  let workitem = {};
  let success = false;
  const q = query(workRef,where("WORK_ID", "==", WORK_ID));
 
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      workitem = doc.data();
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(workitem);
      } else {
        resolve(-1);
      }
    });
  }
}

export const ReadRoomByIndividually = async({ROOM_ID})=>{
  const workRef = collection(db, "ROOM");

  let roomitem = {};
  let success = false;
  const q = query(workRef,where("ROOM_ID", "==", ROOM_ID));
 
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      roomitem = doc.data();
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(roomitem);
      } else {
        resolve(-1);
      }
    });
  }
}


export const DeleteWorkByUSER_ID = async({USER_ID}) =>{


  const workRef = collection(db, "WORK");

  let success = false;
  const q = query(workRef,where("USERS_ID", "==", USER_ID));
 
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async(doc) => {
      await deleteDoc(doc.ref);
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(0);
      } else {
        resolve(-1);
      }
    });
  }


  }