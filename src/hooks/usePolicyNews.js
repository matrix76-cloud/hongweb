import { useContext, useEffect, useState } from "react";

import { doc, getDoc, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../api/config";
import { UserContext } from "../context/User";
import dayjs from "dayjs";

export function usePolicyNews(userId) {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lastRead, setLastRead] = useState(0);

    useEffect(() => {
        const fetch = async () => {
            if (!userId) return;

            const userSnap = await getDoc(doc(db, "USERS", userId));
            const lastReadValue = userSnap.data()?.lastReadPolicyNewsAt || 0;
            setLastRead(lastReadValue);

            const threeDaysAgo = dayjs().subtract(3, 'day').valueOf();

            const q = query(
                collection(db, "policynews"),
                orderBy("approveDate", "desc")
            );
            const snap = await getDocs(q);
            const data = snap.docs
                .map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    isUnread: doc.data().createdAt > lastReadValue,
                }))
                .filter((item) =>
                    item.imageUrl &&
                    item.imageUrl.trim() !== "" &&
                    item.createdAt > threeDaysAgo // ✅ 여기서 3일 이내만 남김
                );

            setNews(data);
            setLoading(false);
        };

        fetch();
    }, [userId]);

    return { news, loading };
}
  