import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy, addDoc, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS, WORKSTATUS } from '../utility/status';
import randomLocation from 'random-location'
import { sleep, useSleep } from '../utility/common';
import Axios from 'axios';
import { CreateRegistAddr, ReadRegistAddr } from './RegistAddrService';
import { FILTERITMETYPE } from '../utility/screen';
import { CountryAddress, KeywordAddress } from '../utility/region';
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

export const CreateWorker = async (data) => {
  try {
    const q = query(
      collection(db, "WORKERS"),
      where("users_id", "==", data.users_id) // ✅ 여기도 users_id 통일
    );
    const snap = await getDocs(q);

    if (!snap.empty) {
      return { success: false, reason: "already_exists" };
    }

    const WORKREF = doc(collection(db, "WORKERS"));
    const id = WORKREF.id;

    const newData = {
      WORKER_ID: id,
      ...data,
      createdAt: Date.now(),
    };

    await setDoc(WORKREF, newData);
    return { success: true, id };

  } catch (e) {
    console.log("❌ CreateWorker Error:", e.message);
    return { success: false, reason: "error", message: e.message };
  }
};


export const getAllWorkers = async () => {
  const snapshot = await getDocs(collection(db, "WORKERS"));
  return snapshot.docs.map(doc => doc.data());
};

export const getAiWorkers = async (latitude, longitude, checkdistance = 4) => {
  try {
    const q = query(
      collection(db, "WORKERS"),
      where("AI_NEWIMAGE_COMPRESSED", "!=", null)
    );
    const snapshot = await getDocs(q);
    const result = [];

    snapshot.forEach(doc => {
      const data = doc.data();
      const lat = data.LAT || data.latitude;
      const lng = data.LNG || data.longitude;

      if (lat && lng) {
        const distance = distanceFunc(lat, lng, latitude, longitude);
        if (distance <= 30) {
          result.push({
            WORKER_ID: doc.id,
            distance: Number(distance.toFixed(1)),
            ...data
          });
        }
      }
    });

    // 가까운 거리순 정렬 후 최대 50명까지 제한
    return result.sort((a, b) => a.distance - b.distance).slice(0, 60);
  } catch (error) {
    console.error("🔥 getAiWorkers 오류:", error);
    return [];
  }
};




export const getNearbyWorkers = async ({ latitude, longitude, checkdistance = 4 }) => {
  const snapshot = await getDocs(collection(db, "WORKERS"));
  const nearbyWorkers = [];

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    const lat = data.LAT || data.latitude;
    const lng = data.LNG || data.longitude;

    if (lat && lng) {
      const distance = distanceFunc(lat, lng, latitude, longitude);
      if (distance <= checkdistance) {
        nearbyWorkers.push({
          id: doc.id,
          distance: Number(distance.toFixed(1)),
          ...data,
        });
      }
    }
  });

  // 가까운 순 정렬 후 최대 50명 제한
  const finalList = nearbyWorkers.sort((a, b) => a.distance - b.distance).slice(0, 60);

  return finalList;
};


// ✅ 등록된 지원서 
export const getWorkerByUserId = async (USERS_ID) => {
  try {
    const q = query(
      collection(db, "WORKERS"),
      where("users_id", "==", USERS_ID)
    );
    const snap = await getDocs(q);
    return snap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (e) {
    console.error("❌ getWorkersByUserId 실패:", e);
    return [];
  }
};

export const updateWorkerByUserId = async (USERS_ID, updatedData) => {

  console.log("updateWorkerByUserId", USERS_ID, updatedData);
  try {
    // 🔍 users_id 필드 기준으로 문서 조회
    const q = query(collection(db, "WORKERS"), where("users_id", "==", USERS_ID));
    const snap = await getDocs(q);

    if (!snap.empty) {
      const docRef = snap.docs[0].ref; // 기존 문서의 참조
      await setDoc(docRef, { ...updatedData, updatedAt: Date.now() }, { merge: true });
      return true;
    } else {
      console.warn("해당 사용자의 지원서가 존재하지 않습니다.");
      return false;
    }
  } catch (e) {
    console.error("❌ updateWorkerByUserId 실패:", e);
    return false;
  }
};

// ✅ 지원서 삭제
export const deleteWorkerByUserId = async (USERS_ID) => {
  try {
    await deleteDoc(doc(db, "WORKERS", USERS_ID));
    return true;
  } catch (e) {
    console.error("❌ deleteWorkerByUserId 실패:", e);
    return false;
  }
};
