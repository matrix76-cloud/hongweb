import { useContext, useEffect, useState } from "react";

import { doc, getDoc, collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../api/config";
import { UserContext } from "../context/User";
import dayjs from "dayjs";

export function usePolicyNewsStatus(userId) {
    const [news, setNews] = useState([]);
    const [hasNewNews, setHasNewNews] = useState(false);
    const [loading, setLoading] = useState(true);

    const { user } = useContext(UserContext);

    const fetchNews = async () => {
        if (!user.USERS_ID) return;

        // ✅ 유저 테이블에서 실시간으로 읽음 시간 가져오기
        const userSnap = await getDoc(doc(db, "USERS",user.USERS_ID));
        const lastRead = userSnap.data()?.lastReadPolicyNewsAt || 0;

    
        const q = query(
            collection(db, "policynews"),
            where("createdAt", ">", lastRead),
            orderBy("approveDate", "desc")
        );
        const snap = await getDocs(q);

        const data = snap.docs
            .map(doc => ({ id: doc.id, ...doc.data() }))
            .filter(item => item.imageUrl && item.imageUrl.trim() !== "");

        console.log("News Data", data);

        setNews(data);
        setHasNewNews(data.length > 0);
        setLoading(false);
    };

    useEffect(() => {
        fetchNews(); // 처음 실행
        const interval = setInterval(fetchNews, 600000); // 10분마다
        return () => clearInterval(interval);
    }, [userId]);

    return { news, hasNewNews, loading };
}
