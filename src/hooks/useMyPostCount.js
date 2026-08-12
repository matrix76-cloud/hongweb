import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/User";
import { getMyPosts } from "../service/PostService";

const useMyPostCount = () => {
    const { user } = useContext(UserContext);
    const [count, setCount] = useState(0);

    useEffect(() => {
        async function fetchData() {
            if (!user?.USERS_ID) return;
            try {
                const result = await getMyPosts(user.USERS_ID);
                if (Array.isArray(result)) {
                    setCount(result.length);
                } else {
                    setCount(0);
                }
            } catch (e) {
                console.error("❌ useMyPostCount 실패:", e);
            }
        }

        fetchData();
    }, [user?.USERS_ID]);

    return count;
};

export default useMyPostCount;
