import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/User";
import { ReadContactByRELATE } from "../service/ContactService";

const useMyContractCount = () => {
    const { user } = useContext(UserContext);
    const [count, setCount] = useState(0);

    useEffect(() => {
        async function fetchContracts() {
            if (!user?.USERS_ID) return;
            try {
                const USERS_ID = user.USERS_ID;
                const result = await ReadContactByRELATE(USERS_ID);
                if (Array.isArray(result)) {
                    setCount(result.length);
                } else if (result) {
                    setCount(0);
                }
            } catch (e) {
                console.error("❌ useMyContractCount 실패:", e);
            }
        }

        fetchContracts();
    }, [user?.USERS_ID]);

    return count;
};

export default useMyContractCount;
