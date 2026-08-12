import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../api/config';


const useGmarketDiscount = () => {
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmart = async () => {
            try {
                const snap = await getDoc(doc(db, 'discountItems', 'gmarket'));
                if (snap.exists()) {
                    const data = snap.data();
                    // ✅ 이미지 없는 상품 제거
                    const filtered = (data.items || []).filter(item => {
                        const url = item.image;

                        const isValidImage =
                            typeof url === "string" &&
                            url.trim() !== "" &&
                            url !== "undefined" &&
                            (url.startsWith("http") || url.startsWith("//"));

                        return isValidImage;
                    });
                    setItems(filtered);
                    setCount(filtered.length);
                }
            } catch (e) {
                console.error('🔥 emart fetch error', e);
            } finally {
                setLoading(false);
            }
        };

        fetchEmart();
    }, []);

    return { items, count, loading };
};

export default useGmarketDiscount;
