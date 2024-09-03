import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS, WORKSTATUS } from '../utility/status';
import axios from 'axios';

const authService = getAuth(firebaseApp);



/**
 * Life 관련 서비스
 *! Read
 * ① ReadTourPicture : 
 * ② ReadTourRegion : 
 * ③ ReadTourFestival : 
 * ④ ReadTourCountry : 
 * ⑤ ReadPerformanceEvent : 
 * ⑥ ReadPerformanceCinema : 
 * ⑦ ReadHospital :
 * ⑧ ReadCamping : 

 */



export const ReadTourPicture = async()=>{

  let response = {};
  let success = false;

  try {

    const fileRef = ref(storage, 'images/tourpicture.json');
    const url = await getDownloadURL(fileRef);
  
    response = await axios.get(url);


    success = true;

  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(response.data);
      } else {
        resolve(-1);
      }
    });
  }
}
export const ReadTourRegion = async()=>{

    let response = {};
    let success = false;
  
    try {
  
      const fileRef = ref(storage, 'images/tourregion.json');
      const url = await getDownloadURL(fileRef);
    
      response = await axios.get(url);
  
      success = true;
  
    } catch (e) {
      console.log("error", e.message);
    } finally {
      return new Promise((resolve, resject) => {
        if (success) {
          resolve(response.data);
        } else {
          resolve(-1);
        }
      });
    }
}

export const ReadTourFestival = async()=>{

    const festivalRef = collection(db, "TOURFESTIVAL");

    let festivalitems = [];
    let success = false;
    const q = query(festivalRef);
  
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        festivalitems = doc.data().data;
      });
  
      if (querySnapshot.size > 0) {
        success = true;
      }
    } catch (e) {
      console.log("error", e.message);
    } finally {
      return new Promise((resolve, resject) => {
        if (success) {
          resolve(festivalitems);
        } else {
          resolve(-1);
        }
      });
    }
}
export const ReadTourCountry = async()=>{

    let response = {};
    let success = false;
  
    try {
  
      const fileRef = ref(storage, 'images/tourcountry.json');
      const url = await getDownloadURL(fileRef);
    
      response = await axios.get(url);
  
      success = true;
  
    } catch (e) {
      console.log("error", e.message);
    } finally {
      return new Promise((resolve, resject) => {
        if (success) {
          resolve(response.data);
        } else {
          resolve(-1);
        }
      });
    }
}
export const ReadPerformanceEvent = async()=>{

    let response = {};
    let success = false;
  
    try {
  
      const fileRef = ref(storage, 'images/performanceevent.json');
      const url = await getDownloadURL(fileRef);
    
      response = await axios.get(url);
  
      success = true;
  
    } catch (e) {
      console.log("error", e.message);
    } finally {
      return new Promise((resolve, resject) => {
        if (success) {
          resolve(response.data);
        } else {
          resolve(-1);
        }
      });
    }
}
export const ReadPerformanceCinema = async()=>{

    let response = {};
    let success = false;
  
    try {
  
      const fileRef = ref(storage, 'images/performancecinema.json');
      const url = await getDownloadURL(fileRef);
    
      response = await axios.get(url);
  
      success = true;
  
    } catch (e) {
      console.log("error", e.message);
    } finally {
      return new Promise((resolve, resject) => {
        if (success) {
          resolve(response.data);
        } else {
          resolve(-1);
        }
      });
    }
}

export const ReadHospitalRegion1 = async()=>{

    let response = {};
    let success = false;
  
    try {
  
      const fileRef = ref(storage, 'images/hospital1.json');
      const url = await getDownloadURL(fileRef);
    
      response = await axios.get(url);
  
      success = true;
  
    } catch (e) {
      console.log("error", e.message);
    } finally {
      return new Promise((resolve, resject) => {
        if (success) {
          resolve(response.data);
        } else {
          resolve(-1);
        }
      });
    }
}

export const ReadCampingRegion = async()=>{

    let response = {};
    let success = false;
  
    try {
  
      const fileRef = ref(storage, 'images/camping.json');
      const url = await getDownloadURL(fileRef);
    
      response = await axios.get(url);
  
      success = true;
  
    } catch (e) {
      console.log("error", e.message);
    } finally {
      return new Promise((resolve, resject) => {
        if (success) {
          resolve(response.data);
        } else {
          resolve(-1);
        }
      });
    }
}