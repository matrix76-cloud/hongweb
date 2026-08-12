import { useEffect, useState } from 'react';
import { CURRENT_WEB_VERSION } from '../utility/version';
import localforage from 'localforage';
import { useSleep } from '../utility/common';
import { ReadVersion } from '../service/VersionService';
import { readuserbydeviceid } from '../service/UserService';

export const useForceReloadIfVersionChanged = () => {

    const [showUpdateBanner, setShowUpdateBanner] = useState(false);

    useEffect(() => {


        const checkAndReload = async () => {
            try {
                const isFirstInstall = await localforage.getItem('is_first_install');

                console.log("isFirstInstall:version", isFirstInstall);
                const current = await ReadVersion(); // 🔄 서버에서 가져오기

                // ✅ 설치 초기면 리프레시(버전 체크) 아예 스킵
                if (!isFirstInstall) {
                    await localforage.setItem('web_version', current.version); // ✅ 최초 버전 저장
                    await localforage.setItem('is_first_install', 'done');
                    return;
                }


                // ✅ 정상 버전 체크 시작
                localforage.getItem('web_version')
                    .then(async function (value) {

                    

                        console.log("current:version", current.version, value);

                        if (value !== current.version) {

                            await localforage.setItem('web_version', current.version);
                            setShowUpdateBanner(true); // ✅ 업데이트 메시지 보여줘

                            const url = new URL(window.location.href);
                            url.searchParams.set('v', Date.now().toString()); // 캐시 우회용

                            setTimeout(() => {
                                window.location.replace(url.toString());
                            }, 1200);
                        }

                    });

            } catch (err) {
                console.error('🔁 버전 체크 오류:', err);
            }
        };

        checkAndReload();
    }, []);

    return { showUpdateBanner }; // ✅ 리턴해줘야 화면에서 사용할 수 있음
};
