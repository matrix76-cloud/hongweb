import { useEffect, useState } from "react";
import { getNearbyWorkers } from "../service/WorkerService";

const useWorkerStatus = (latitude, longitude, checkdistance = 4) => {
    const [loading, setLoading] = useState(true);
    const [workeritems, setWorkeritems] = useState([]);
    const [workerstatus, setWorkerstatus] = useState({
        newcount: 0,
    });

    useEffect(() => {
        const fetchWorkers = async () => {
            if (!latitude || !longitude) {
                setLoading(false); // ✅ 좌표 없을 때도 로딩 끝내기
                return;
            }

            try {
                console.log("latitude", latitude, longitude);

                const filteredWorkers = await getNearbyWorkers({
                    latitude,
                    longitude,
                    checkdistance,
                });

                const validWorkers = filteredWorkers.filter(w => w.WORKER_ID);

                console.log("filteredWorkers", validWorkers);

                setWorkeritems(validWorkers);
                setWorkerstatus({
                    newcount: validWorkers.length,
                });
            } catch (error) {
                console.error("❌ useWorkerStatus 에러:", error.message);
                setWorkeritems([]);
                setWorkerstatus({ newcount: 0 });
            } finally {
                setLoading(false); // ✅ 무조건 끝에는 로딩 종료
            }
        };

        setLoading(true); // ✅ 로딩 시작 지점
        fetchWorkers();
    }, [latitude, longitude, checkdistance]);

    return { workerstatus, workeritems, loading };
};

export default useWorkerStatus;
