import { useEffect, useState } from 'react';
import { db } from '../api/config';
import { collection, query, where, getDocs } from 'firebase/firestore';

export const useFreezeMenu = (userId) => {
    const [freezemenu, setFreezemenu] = useState([]);

    useEffect(() => {
        const fetchFreezes = async () => {
            if (!userId) return;

            const q = query(
                collection(db, 'FREEZE'),
                where('USERS_ID', '==', userId)
            );

            const snap = await getDocs(q);
            const list = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            }));

            setFreezemenu(list);
        };

        fetchFreezes();
    }, [userId]);

    return [freezemenu, setFreezemenu]; // ✅ 형이 원하는 구조!
};
