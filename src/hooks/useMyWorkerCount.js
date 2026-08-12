import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/User";
import { getWorkerByUserId } from "../service/WorkerService";
import { isRouteErrorResponse } from "react-router-dom";

const useMyWorkerCount = () => {
    const { user } = useContext(UserContext);
    const [count, setCount] = useState(0);

    useEffect(() => {
        async function fetchData() {
            if (!user?.USERS_ID) return;
            try {

                const USERS_ID = user.USERS_ID;
                const result = await getWorkerByUserId(USERS_ID);
                if (Array.isArray(result)) {
                    setCount(result.length);
                } else if (result) {
                    setCount(0); // 단일 객체 형태로 올 수도 있음
                }
            } catch (e) {
                console.error("❌ useMyWorkerCount 실패:", e);
            }
        }

        fetchData();
    }, [user?.USERS_ID]);

    return count;
};

export default useMyWorkerCount;
