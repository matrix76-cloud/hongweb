import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS, WORKSTATUS } from '../utility/status';
import randomLocation from 'random-location'
import { useSleep } from '../utility/common';
import Axios from 'axios';
import { CONTACTTYPE } from '../utility/screen';
const authService = getAuth(firebaseApp);



export const readNews = async()=>{

    try {
        const newsRef = collection(db, 'NEWS'); // 🔔 'NEWS' 컬렉션에서
        const q = query(newsRef, orderBy('createdAt', 'desc')); // 최신순 정렬
        const snapshot = await getDocs(q);

        const newsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return newsList;
    } catch (error) {
        console.error("알림 불러오기 실패:", error);
        return [];
      }


}