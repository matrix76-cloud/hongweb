import React, { useContext, useEffect, useState } from 'react';
import localforage from 'localforage';

import { MobileFortuneInfoInitModal } from './MobileFortuneInfoInitModal';
import { MobileFortuneInfoSettingModal } from './MobileFortuneInfoSettingModal';
import { MobileFortuneDailyDetail } from './MobileFortuneDailyDetail';

import { callVertexAI } from '../service/callVertexAI';

import { Column } from '../common/Column';
import { BetweenRow } from '../common/Row';
import { imageDB } from '../utility/imageData';
import { useNavigate } from 'react-router-dom';
import KakaoShare from './KakaoShare';
import { UserContext } from '../context/User';
import { getDailyPrompt } from '../service/fortunePromptService';
import { parseDailyFortune } from '../utility/parseWeeklyFortune';
import { isIOS } from '../utility/fontsize';
import styled from 'styled-components';
import ShoppingSpinner from './ShoppingSpinner';
import { Update_userfortune } from '../service/UserService';




const HeaderWrapper = styled.div`
  position: fixed;
  top: env(safe-area-inset-top, 0px); // ✅ 아이폰, 안드로이드 모두 대응
  left: 0;
  right: 0;
  z-index: 999;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;

`;

export const MobileFortuneDailyScreen = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [showInitModal, setShowInitModal] = useState(false);
    const [showSettingModal, setShowSettingModal] = useState(false);
    const [fortuneText, setFortuneText] = useState('');
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    useEffect(() => {
        const load = async () => {
            const info = await localforage.getItem('fortune_user_info3');
            if (!info) {
                setShowInitModal(true);
                return;
            }
            setUserInfo(info);

            const USERS_ID = user.USERS_ID;
            const today = new Date().toISOString().split('T')[0];
            const FORTUNE = today;

            await Update_userfortune({ USERS_ID, FORTUNE });

          
            const uidKey = `${info.year}${info.month}${info.day}_${info.time}_${info.isLunar ? 'lunar' : 'solar'}`;
            const docId = `${uidKey}_${today}`;

            const cached = await localforage.getItem(docId);

            if (cached && cached.date === today) {
                setFortuneText(cached.content);
            } else {
                const prompt = getDailyPrompt(info);
                const result = await callVertexAI(prompt);
                const parsed = parseDailyFortune(result);

                setFortuneText(parsed);

                await localforage.setItem(docId, {
                    date: today,
                    content: parsed
                });
            }
        };
        load();
    }, []);

    const handleSaveInfo = async (info) => {
        await localforage.setItem('fortune_user_info3', info);
        setUserInfo(info);
        setShowInitModal(false);
        window.location.reload();
    };

    const _handleprev = () => navigate(-1);

    return (
        <>
            <HeaderWrapper>
                <Column style={{ width: '100%' }}>
                    <BetweenRow style={{ width: '90%', paddingTop: 20, margin: '0 auto' }}>
                        <div style={{ display: 'flex', fontSize: '18px', color: '#131313', alignItems: 'center' }}>
                            <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }} onClick={_handleprev} />
                        </div>
                        {/* <KakaoShare
                            height={20}
                            width={20}
                            text={'[구해줘 홍여사] 오늘의 운세를 공유합니다'}
                            url={`https://honglady.co.kr/Mobilefortunecontent?id=${user.USERS_ID}`}
                        /> */}
                    </BetweenRow>
                </Column>
            </HeaderWrapper>


            {fortuneText == '' && <ShoppingSpinner/>}
            {showInitModal && <MobileFortuneInfoInitModal onSave={handleSaveInfo} />}
            {showSettingModal && (
                <MobileFortuneInfoSettingModal
                    defaultInfo={userInfo}
                    onSave={handleSaveInfo}
                    onClose={() => setShowSettingModal(false)}
                />
            )}

            {!showInitModal && (
                <MobileFortuneDailyDetail
                    date={new Date().toLocaleDateString()}
                    content={fortuneText}
                    onEdit={() => setShowSettingModal(true)}
                    onShare={() => navigator.share?.({ text: fortuneText }) || alert('공유 기능이 지원되지 않는 환경입니다.')}
                    onViewArchive={() => navigate('/Mobilefortunearchive')}
                />
            )}
        </>
    );
};
