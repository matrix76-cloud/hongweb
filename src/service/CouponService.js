import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy, Timestamp } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS, WORKSTATUS } from '../utility/status';
import randomLocation from 'random-location'
import { useSleep } from '../utility/common';
import Axios from 'axios';
import { CONTACTTYPE } from '../utility/screen';
const authService = getAuth(firebaseApp);



export const getUnreadEventCoupons = async ({ uid }) => {
    console.log('🔍 getUnreadEventCoupons 호출됨 for UID:', uid);

    try {
        const eventRef = collection(db, 'USERS', uid, 'EVENTS');
        const q = query(
            eventRef,
            where('isRead', '==', false),
            where('imagePath', '!=', null) // ✅ 진짜 쿠폰 이벤트만 골라냄
        );

        const querySnapshot = await getDocs(q);
        console.log(`📦 조건 일치 이벤트 개수: ${querySnapshot.size}`);

        const result = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log('📄 이벤트 문서:', doc.id, data);

            result.push({
                id: doc.id,
                ...data,
            });
        });

        return result;
    } catch (e) {
        console.error('❌ 이벤트 조회 실패:', e);
        return [];
    }
};


export const getReadCoupon = async({uid})=>{

    console.log('🔍 getReadCoupon 호출됨 for UID:', uid);

    try {
        const eventRef = collection(db, 'USERS', uid, 'EVENTS');
        const q = query(eventRef);

        const querySnapshot = await getDocs(q);
        console.log(`📦 Firestore 이벤트 문서 개수: ${querySnapshot.size}`);

        const result = [];

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log('📄 이벤트 문서:', doc.id, data);

            result.push({
                id: doc.id,
                ...data,
            });
        });

        return result;
    } catch (e) {
        console.error('❌ 쿠폰 이벤트 조회 실패:', e);
        return [];
    }
}


export const getGiftCoupons = async ({ USERS_ID }) => {
    try {
        const snapshot = await getDocs(collection(db, "USERS", USERS_ID, "EVENTS"));
        const result = [];

        snapshot.forEach((doc) => {
            const data = doc.data();
            if (data.type?.startsWith("COUPON_") && data.imagePath) {
                result.push({ id: doc.id, ...data });
            }
        });

        return result;
    } catch (e) {
        console.error("❌ 쿠폰 필터링 실패:", e);
        return [];
    }
};


export const markEventAsRead = async (uid, eventId) => {

    await updateDoc(doc(db, `USERS/${uid}/EVENTS/${eventId}`), {
        isRead: true,
        readAt: Timestamp.now(),
    });
};