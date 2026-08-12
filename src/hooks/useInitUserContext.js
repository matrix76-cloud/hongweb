
import { useEffect, useContext } from "react";
import { readuserbyphone, Update_userlastlogin } from "../service/UserService";
import { UserContext } from "../context/User";
import localforage from 'localforage';

export const useInitUserContext = (phone) => {
    const { user, dispatch } = useContext(UserContext);

    useEffect(() => {
        async function init() {
         
            await localforage.ready(); // ✅ 여기가 핵심: 내부에서 기다림

            if (!phone) {
                const config = await localforage.getItem("userconfig");
                phone = config?.USERINFO?.phone;
            }

            if (!phone) {
                phone = await localforage.getItem("user_phone");

            }

            try {
                const serverUser = await readuserbyphone({ PHONE: phone });

                if (serverUser && serverUser !== -1) {
                    console.log("✅ 서버 조회 성공: 사용자 정보 가져옴", serverUser);

                    // 🔐 로컬 저장소에서 deviceid 확인
                    const localConfig = await localforage.getItem("userconfig");
                    const localDeviceId = localConfig?.deviceid;
                    const serverDeviceId = serverUser?.DEVICEID;

                    console.log("📦 로컬 deviceid:", localDeviceId);
                    console.log("📡 서버 deviceid:", serverDeviceId);

                    if (localDeviceId !== serverDeviceId) {
                        console.warn("⚠️ 로컬과 서버의 DEVICEID 불일치");
                    } else {
                        console.log("🟢 로컬과 서버의 DEVICEID 일치");
                    }

                    // 🔄 마지막 로그인 시간 업데이트
                    try {
                        await Update_userlastlogin({
                            USERS_ID: serverUser.USERS_ID,
                        });
                    } catch (e) {
                        console.error("❌ 로그인 시간 갱신 실패:", e.message);
                    }

                    // 🧠 사용자 정보 Context에 저장
                    dispatch({
                        ...serverUser,
                        USERINFO: {
                            ...(user.USERINFO ?? {}),
                            ...(serverUser.USERINFO ?? {}),
                        },
                    });

                    console.log("✅ context 설정 완료");
                } else {
                    console.warn("❌ 서버에 사용자 없음 → 신규 가입 필요");
                }
            } catch (error) {
                console.error("🚨 useInitUserContext 에러:", error);
            }
        }

        init();
    }, [phone]);
};

export default useInitUserContext;
  


