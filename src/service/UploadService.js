import { db, auth, storage } from "../api/config";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
  doc,
  setDoc,
  deleteDoc,
  orderBy,
} from "firebase/firestore";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";



/**
 * 업로드  관련 서비스

 */
export const uploadImage = async ({ uri, random }) => {
    
    console.log("TCL: uploadImage -> uri", uri, random)

    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
  
      xhr.onerror = function (e) {
        reject(new TypeError("Network request failed"));
      };
  
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  
    return new Promise((resolve, reject) => {
      const imagefile = "images/" + random + ".png";
      const spaceRef = ref(storage, imagefile);
  
      uploadBytes(spaceRef, blob).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          // blob.close(); 주석을 임시로 삭제
          resolve(url);
        });
      });
    });
  };