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





export const ReadVersion = async () => {


  return new Promise(async (resolve, reject) => {
    const VERSIONREF = collection(db, "VERSION");

    let version = {};
    let success = false;
    const q = query(VERSIONREF);

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        version = doc.data();
      });

      
      resolve(version);

    } catch (e) {
      console.log("error", e.message);
      resolve(-1);
    } finally {

    }

  });

}
  

