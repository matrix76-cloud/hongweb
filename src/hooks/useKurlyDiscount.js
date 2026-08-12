import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../api/config';


const useKurlyDiscount = () => {
    const [items, setItems] = useState([]);
    const [count, setCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchKurly = async () => {
            try {
                const snap = await getDoc(doc(db, 'discountItems', 'kurly'));
                if (snap.exists()) {
                    const data = snap.data();

                    const merged = [
                        ...(data.best || []),
                        ...(data.new || []),
                        ...(data.sales || [])
                    ];

                    const filtered = merged.filter(item => {
                        const imageValid =
                            typeof item.image === "string" &&
                            item.image.startsWith("http") &&
                            item.image.trim() !== "" &&
                            item.image !== "undefined";

                        const rate = Number(item.할인율 || item.meta?.할인율 || 0);
                        const rateValid = !isNaN(rate) && rate >= 50;

                        return imageValid && rateValid;
                    });

                    setItems(filtered);
                    setCount(filtered.length);
                }
            } catch (e) {
                console.error('🔥 kurly fetch error', e);
            } finally {
                setLoading(false);
            }
        };

        fetchKurly();
    }, []);


    return { items, count, loading };
};

export default useKurlyDiscount;
