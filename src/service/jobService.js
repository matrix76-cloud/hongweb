import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy, limit, arrayUnion } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS } from '../utility/status';
import { distanceFunc } from './WorkService';


export const getAllJobList = async () => {
    try {
        const snapshot = await getDocs(collection(db, "jobs"));
        const results = [];

        snapshot.forEach((doc) => {
            const data = doc.data();


            results.push({
                id: doc.id,
                ...data, // ✅ DB에 저장된 필드는 가공 없이 그대로 전달
            });


        });

        console.log("전체 job 개수:", snapshot.size, results);

        return results
            .sort((a, b) => a.distance - b.distance)
    } catch (e) {
        console.error("🔥 getJobList error", e);
        return [];
    }
};


export const getJobList = async ({ latitude, longitude }) => {
    try {
        const snapshot = await getDocs(collection(db, "jobs"));
        const results = [];


        

        snapshot.forEach((doc) => {
            const data = doc.data();


            const lat = data.LATITUDE || data.latitude;
            const lng = data.LONGITUDE || data.longitude;

            if (!lat || !lng) return;

            const distance = distanceFunc(lat, lng, latitude, longitude);

            results.push({
                id: doc.id,
                distance: Number(distance.toFixed(1)),
                ...data, // ✅ DB에 저장된 필드는 가공 없이 그대로 전달
            });
     

        });

        console.log("전체 job 개수:", snapshot.size, results);

        return results
            .filter((item) => item.distance <= 15)
            .sort((a, b) => a.distance - b.distance)
    } catch (e) {
        console.error("🔥 getJobList error", e);
        return [];
    }
};

export const getGeneralJobs = async ({ addressName }) => {
    try {
        const ref = collection(db, "gg_jobs");
        const q = query(ref, orderBy("createdAt", "desc")); // 최신순
        const snapshot = await getDocs(q);

        const jobs = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            const region = data.region || "";  // 저장된 지역

            // ✅ 자기 지역 포함 필터 (ex: '남양주시' 포함 여부)
            if (!addressName || !region.includes(addressName)) return;

            jobs.push({
                id: doc.id,
                ...data,
            });
        });

        console.log(`📦 '${addressName}' 포함 일반 일자리 수:`, jobs.length);

        return jobs;

    } catch (e) {
        console.error("❌ 일반 일자리 불러오기 실패:", e.message);
        return [];
    }
};
  

export const saveJobIntro = async ({ USERS_ID, jobId, jobType, aiIntroText }) => {
    const docId = `${USERS_ID}_${jobId}`;
    try {
        const ref = doc(db, "job_intros", docId);
        await setDoc(ref, {
            id: docId,     // ✅ 여기!
            USERS_ID,
            jobId,
            jobType,
            aiIntro: aiIntroText,
            createdAt: new Date(),
        });
        console.log("✅ job_intros 저장 완료");
        return true;
    } catch (err) {
        console.error("❌ job_intros 저장 실패:", err);
        throw err;
    }
};
  