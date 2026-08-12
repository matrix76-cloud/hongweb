// service/LadderService.js
import { db } from '../api/config';
import {
    doc,
    getDoc,
    setDoc,
    addDoc,
    collection,
    query,
    where,
    getDocs,
    Timestamp,
    serverTimestamp,
} from 'firebase/firestore';

const defaultRewardPattern = [
    '쿠폰',
    '쿠폰',
    '쿠폰',
    '쿠폰',
    ...Array(20).fill('꽝')
];

const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);


export const getTotalLadderIndex = async (USERS_ID) => {
    const q = query(
        collection(db, 'LADDER_HISTORY'),
        where('USERS_ID', '==', USERS_ID)
    );
    const snap = await getDocs(q);
    return snap.size;
  };

export const getOrCreateRewardTable = async (USERS_ID) => {
    const ref = doc(db, 'LADDER_REWARD_TABLE', USERS_ID);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
        const rewards = shuffleArray(defaultRewardPattern);
        await setDoc(ref, {
            USERS_ID, // ✅ USERS_ID도 함께 저장
            rewards,
            createdAt: serverTimestamp(),
        });
        return rewards;
    } else {
        return snap.data().rewards;
    }
  };

export const getWeeklyLadderIndex = async (USERS_ID) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const q = query(
        collection(db, 'LADDER_HISTORY'),
        where('USERS_ID', '==', USERS_ID),
        where('createdAt', '>=', Timestamp.fromDate(weekStart))
    );
    const snap = await getDocs(q);
    return snap.size;
};

export const getCooldownTime = async (USERS_ID) => {
    const ref = doc(db, 'LADDER_USER_STATE', USERS_ID);
    const snap = await getDoc(ref);
    if (snap.exists()) {
        const data = snap.data();
        return data.nextAvailableAt?.toDate() || null;
    }
    return null;
};

export const setCooldownTime = async (USERS_ID, hours = 6) => {
    const next = new Date(Date.now() +  10* 1000); // ✅ 1분으로 임시 변경
    await setDoc(doc(db, 'LADDER_USER_STATE', USERS_ID), {
        USERS_ID, // ✅ USERS_ID도 함께 저장
        nextAvailableAt: Timestamp.fromDate(next),
        updatedAt: serverTimestamp(),
    });
    return next;
};

export const logLadderResult = async (USERS_ID, result) => {
    await addDoc(collection(db, 'LADDER_HISTORY'), {
        USERS_ID,
        result,
        createdAt: serverTimestamp(),
    });
};

export const recordCouponRequest = async (USERS_ID, phone) => {
    await addDoc(collection(db, 'LADDER_COUPON_REQUESTS'), {
        USERS_ID,
        phone,
        createdAt: serverTimestamp(),
        sent: false,
    });
};
export const reorderRewardTypesForDisplay = (resultText) => {
    const base = ['쿠폰', '5,000P', '1,000P', '꽝'];
    const shuffled = shuffleArray(base);
    const index = shuffled.findIndex((r) => r === resultText);

    if (index !== -1) return shuffled;

    const others = base.filter(r => r !== resultText);
    return [resultText, ...shuffleArray(others)].slice(0, 4);
};

export const reorderAndTrackIndex = (resultText) => {
    const displayRewards = reorderRewardTypesForDisplay(resultText);
    const visualIndex = displayRewards.findIndex(r => r === resultText);
    return { displayRewards, visualIndex };
  };