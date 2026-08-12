// hooks/useNoticeStatus.js
import { useEffect, useState, useContext } from 'react'; // useContext 추가 주의!
import { UserContext } from '../context/User';
import { readNews } from '../service/NewsService';
import { Readuserbyusersid } from '../service/UserService';

export const useNoticeStatus = () => {
    const [hasUnread, setHasUnread] = useState(null); // 초기에 undefined 아님
    const { user } = useContext(UserContext);

    useEffect(() => {
        const checkUnread = async () => {
            try {
                const USERS_ID = user?.USERS_ID;
                if (!USERS_ID) return;

                const newsList = await readNews();
                const userConfig = await Readuserbyusersid({ USERS_ID });

                const lastReadRaw = userConfig?.lastReadNewsDate;

         

                const lastReadDate = lastReadRaw?.toDate
                    ? new Date(lastReadRaw.toDate())
                    : new Date('2000-01-01T00:00:00Z'); // fallback
                
                console.log('📌 lastReadRaw:', lastReadRaw);
                console.log('📌 lastReadDate:', lastReadDate.toISOString?.() || lastReadDate);
               
                if (isNaN(lastReadDate.getTime())) {
                    console.warn('❌ lastReadDate is Invalid Date:', lastReadDate);
                    return;
                }

                console.log('📌 비교 시작');
                console.log('🕐 lastReadDate:', lastReadDate.toISOString());

          
                
                const unreadExists = newsList.some((news) => {
                    const created = new Date(news.createdAt?.toDate?.() || news.createdAt);

                    const result = created > lastReadDate;

                    console.log(
                        `🔍 createdAt: ${created.toISOString()} | 비교 대상: ${lastReadDate.toISOString()} | 결과: ${result}`
                    );

                    return created > lastReadDate;
                });


                console.log("✅ [useNoticeStatus] 최종 unread:", unreadExists);
                setHasUnread(unreadExists);
            } catch (e) {
                console.error("❌ useNoticeStatus 에러:", e);
                setHasUnread(false);
            }
        };

        checkUnread();
    }, [user?.USERS_ID]);

    return hasUnread === true;
};
  
  
  