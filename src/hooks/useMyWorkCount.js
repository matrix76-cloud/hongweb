import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/User";
import { getWorkByUserId, ReadWorkByuserid } from "../service/WorkService"; // 형 서비스 구조에 맞게 조정

const useMyWorkCount = () => {
    const { user } = useContext(UserContext);
    const [count, setCount] = useState(0);

    useEffect(() => {
        async function fetchData() {
            if (!user?.USERS_ID) return;
            try {
                const USERS_ID = user.USERS_ID;
                const result = await ReadWorkByuserid({ USERS_ID });
                if (Array.isArray(result)) {
                    setCount(result.length);
                } else if (result) {
                    setCount(0);
                }
            } catch (e) {
                console.error("❌ useMyWorkCount 실패:", e);
            }
        }

        fetchData();
    }, [user?.USERS_ID]);

    return count;
};

export default useMyWorkCount;
