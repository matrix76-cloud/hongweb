import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../api/config';

const useHomeplusDiscount = () => {
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomeplus = async () => {
            try {
                const snap = await getDoc(doc(db, 'discountItems', 'homeplus'));
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
                console.error('🔥 homeplus fetch error', e);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeplus();
    }, []);

    return { items, count, loading };
};

export default useHomeplusDiscount;
