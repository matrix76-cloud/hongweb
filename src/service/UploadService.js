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

/**
 * 파일(Blob)을 Storage 에 바로 올리고 URL 을 돌려준다.
 * 기존 uploadImage 는 dataURL 을 XHR 로 다시 읽어 blob 을 만드는 구조라
 * 압축된 File 을 그대로 올릴 수 없었다. (2026-08-12)
 */
export const uploadImageFile = async ({ file, folder = 'images' }) => {
  if (!file) return null;
  const ext = (file.type && file.type.split('/')[1]) || 'jpg';
  const name = `${folder}/${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const spaceRef = ref(storage, name);
  const snapshot = await uploadBytes(spaceRef, file);
  return getDownloadURL(snapshot.ref);
};
