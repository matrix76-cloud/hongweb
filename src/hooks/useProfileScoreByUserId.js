import { useEffect, useState } from "react";
import { db } from "../api/config";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function useProfileScoreByUserId(USERS_ID) {
    const [worker, setWorker] = useState(null);

    const [score, setScore] = useState(60);
    const [checklist, setChecklist] = useState({
        ability: false,
        video: false,
        reference: false,
        career: false,
        aiImage: false,
    });

    useEffect(() => {
        if (!USERS_ID) return;

        const fetchWorker = async () => {
            try {
                const q = query(
                    collection(db, "WORKERS"),
                    where("users_id", "==", USERS_ID)
                );
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const data = snapshot.docs[0].data();
                    setWorker(data);

              

                    const newChecklist = {
                        ability: Array.isArray(data.abilities) && data.abilities.length > 0,
                        video: !!data.videoUrl,
                        photos: Array.isArray(data.photos) && data.photos.length > 0,
                        career: !!data.career,
                        aiImage: !!data.AI_NEWIMAGE_COMPRESSED,
                    };

                    console.log("newChecklist", newChecklist);

                    let tempScore = 50;
                    if (newChecklist.ability) tempScore += 10;
                    if (newChecklist.video) tempScore += 10;
                    if (newChecklist.photos) tempScore += 10;
                    if (newChecklist.career) tempScore += 10;
                    if (newChecklist.aiImage) tempScore += 10;

                    setScore(Math.min(tempScore, 100));
                    setChecklist(newChecklist);
                }
            } catch (err) {
                console.error("🔥 WORKERS 조회 실패:", err);
            }
        };

        fetchWorker();
    }, [USERS_ID]);

    return { score, worker, checklist };
}
