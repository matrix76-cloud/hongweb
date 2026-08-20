import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy, addDoc, getDoc, getCountFromServer } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS, WORKSTATUS } from '../utility/status';
import randomLocation from 'random-location'
import { sleep, useSleep } from '../utility/common';
import Axios from 'axios';
import { CreateRegistAddr, ReadRegistAddr } from './RegistAddrService';
import { FILTERITMETYPE } from '../utility/screen';
import { CountryAddress, KeywordAddress } from '../utility/region';
import { getSearchRange } from "../utility/searchRange";
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


/* 홈 홍보 문구에 쓰는 "활동 중인 홍여사" 수.
   문서를 다 읽지 않고 집계만 받아온다 — 홈은 자주 열리는 화면이라 읽기 비용을 아낀다.
   (형 리뷰 2026-08-16 "몇명의 홍여사가 활동중이고") */
export const getWorkerCount = async () => {
  try {
    const snapshot = await getCountFromServer(collection(db, "WORKERS"));
    return snapshot.data().count || 0;
  } catch (e) {
    console.log("getWorkerCount 오류:", e.message);
    return 0;
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




/* 내 주변 홍여사 수 (형 지시 2026-08-19)
 *
 * 예전에는 WORKERS 전체를 세어 1110명 같은 숫자를 보여줬다. 그런데 홈에서 말하는
 * "활동 중인 홍여사"는 내 동네에서 일을 받아줄 수 있는 사람이다. 멀리 사는 분까지
 * 세면 숫자만 커지고 뜻이 없다. 범위는 내 정보 > 나의 범위설정 값을 그대로 쓴다.
 *
 * 좌표로 거르는 일이라 서버 집계(getCountFromServer)를 못 쓴다. 대신 잠깐 보관한다.
 */
const NEARBY_CACHE_MS = 60 * 1000;
let nearbyCountCache = null;   // { key, at, count }

export const getNearbyWorkerCount = async ({ latitude, longitude, checkdistance }) => {
  if (!latitude || !longitude) return 0;

  const limitKm = Number(checkdistance) > 0 ? Number(checkdistance) : getSearchRange();
  const key = `${Number(latitude).toFixed(3)}|${Number(longitude).toFixed(3)}|${limitKm}`;
  if (nearbyCountCache && nearbyCountCache.key === key && Date.now() - nearbyCountCache.at < NEARBY_CACHE_MS) {
    return nearbyCountCache.count;
  }

  try {
    const snapshot = await getDocs(collection(db, "WORKERS"));
    let count = 0;
    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      const lat = data.LAT || data.latitude;
      const lng = data.LNG || data.longitude;
      if (!lat || !lng) return;
      if (distanceFunc(lat, lng, latitude, longitude) <= limitKm) count += 1;
    });
    nearbyCountCache = { key, at: Date.now(), count };
    return count;
  } catch (e) {
    console.log("getNearbyWorkerCount 오류:", e.message);
    return 0;
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
