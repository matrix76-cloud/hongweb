import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy, Timestamp } from 'firebase/firestore';
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


export const CreateCOURAGE = async ({ BOTTLE, USERS_ID }) =>{

    let success = true;
    const COURAGEREF = doc(collection(db, "COURAGE"));
    const id = COURAGEREF.id;

    try{
       const newdata = {
        COURAGE_ID: id,
        BOTTLE: BOTTLE,
        NAME : "+" + BOTTLE +"ml",
        USERS_ID : USERS_ID,
        CREATEDT: Timestamp.now(),
       }
      await setDoc(COURAGEREF, newdata);
    
    }catch(e){
      console.log("TCL: CreateWater -> error ",e.message )
       
        alert( e.message);
        success =false;
        return -1;
    }finally{
      return id;
    }
}

export const CreateWATER = async ({ CONTENT, USERS_ID }) => {

  let success = true;
  const WATERREF = doc(collection(db, "WATER"));
  const id = WATERREF.id;
  

  try {
    const newdata = {
      WATER_ID: id,
      CONTENT: CONTENT,
      CONTENTDATE: Timestamp.now(),
      USERS_ID: USERS_ID,
      CREATEDT: Timestamp.now(),
    }
    await setDoc(WATERREF, newdata);

  } catch (e) {
    console.log("TCL: CreateWater -> error ", e.message)

    alert(e.message);
    success = false;
    return -1;
  } finally {
    return id;
  }
}


export const ReadCOURAGETByIndividually = async ({ USERS_ID }) => {


  return new Promise(async (resolve, reject) => {
    const COURAGEREF = collection(db, "COURAGE");

    let courageitems = [];
    let success = false;
    const q = query(COURAGEREF
      , where("USERS_ID", "==", USERS_ID)
      , orderBy("BOTTLE", "desc"));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        courageitems.push(doc.data());
      });

      console.log("courageitems", courageitems);

      if (courageitems.length > 0) {
        resolve(courageitems);
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


export const ReadWaterByIndividually = async ({ USERS_ID }) => {


  return new Promise(async (resolve, reject) => {
    const WATERREF = collection(db, "WATER");
    const now = new Date();
    let wateritems = [];
    let success = false;

    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const endOfDay = new Date(now.setHours(23, 59, 59, 999));

    // Firestore Timestamp 변환
    const startTimestamp = Timestamp.fromDate(startOfDay);
    const endTimestamp = Timestamp.fromDate(endOfDay);

    console.log("startTime", startTimestamp);

    const q = query(WATERREF, 
      where("CREATEDT", ">=", startTimestamp),
      where("CREATEDT", "<=", endTimestamp));


    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data().USERS_ID == USERS_ID) {
          wateritems.push(doc.data());
        }

      });

      console.log("wateritems", wateritems);

      if (wateritems.length > 0) {
        resolve(wateritems);
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

export const ReadWaterWeekByIndividually = async ({ USERS_ID, startday, endday}) => {


  return new Promise(async (resolve, reject) => {
    const WATERREF = collection(db, "WATER");

    let wateritems = [];
    let success = false;


    // Firestore Timestamp 변환
    const startTimestamp = Timestamp.fromDate(startday);
    const endTimestamp = Timestamp.fromDate(endday);

    console.log("startTime", startTimestamp, startday);

    const q = query(WATERREF,
      where("CREATEDT", ">=", startTimestamp),
      where("CREATEDT", "<=", endTimestamp)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {

        if (doc.data().USERS_ID == USERS_ID) {
          wateritems.push(doc.data());
        }
      });

      console.log("wateritems", wateritems);

      if (wateritems.length > 0) {
        resolve(wateritems);
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

export const ReadWaterMonthByIndividually = async ({ USERS_ID, startday, endday }) => {


  return new Promise(async (resolve, reject) => {
    const WATERREF = collection(db, "WATER");

    let wateritems = [];
    let success = false;


    // Firestore Timestamp 변환
    const startTimestamp = Timestamp.fromDate(startday);
    const endTimestamp = Timestamp.fromDate(endday);

    console.log("startTime", startTimestamp, startday);

    const q = query(WATERREF,
      where("CREATEDT", ">=", startTimestamp),
      where("CREATEDT", "<=", endTimestamp)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        if (doc.data().USERS_ID == USERS_ID) {
          wateritems.push(doc.data());
        }
      });

      console.log("wateritems", wateritems);

      if (wateritems.length > 0) {
        resolve(wateritems);
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

export const DeleteWaterByWATER_ID = async ({ WATER_ID }) => {

  return new Promise(async (resolve, reject) => {

    const waterRef = collection(db, "WATER");

    let success = false;
    const q = query(waterRef, where("WATER_ID", "==", WATER_ID));

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        await deleteDoc(doc.ref);
        resolve(0);
      });



    } catch (e) {
      console.log("error", e.message);
    } finally {

    }

  });



}



  

