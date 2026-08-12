// ✅ 주간 운세 날짜 감지 리팩터 완료 버전
// ✨ 주요 변경사항:
// - localforage 저장 시 weekRange 함께 저장
// - 현재 주간 날짜와 비교하여 변경 시 자동 재호출

import React, { useContext, useEffect, useState } from 'react';
import localforage from 'localforage';

import { MobileFortuneInfoInitModal } from './MobileFortuneInfoInitModal';
import { MobileFortuneInfoSettingModal } from './MobileFortuneInfoSettingModal';
import { getWeeklyPrompt } from '../service/fortunePromptService';
import { callVertexAI } from '../service/callVertexAI';
import { parseWeeklyFortune } from '../utility/parseWeeklyFortune';
import { Column } from '../common/Column';
import { BetweenRow } from '../common/Row';
import { imageDB } from '../utility/imageData';
import { useNavigate } from 'react-router-dom';
import KakaoShare from './KakaoShare';
import { UserContext } from '../context/User';
import { isIOS } from '../utility/fontsize';
import styled from 'styled-components';
import ShoppingSpinner from './ShoppingSpinner';
import { MobileFortuneWeeklyDetail } from './MobileFortuneWeeklyDetail';

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

export const MobileFortuneWeeklyScreen = () => {
    const [weeklyData, setWeeklyData] = useState(null);
    const [showInitModal, setShowInitModal] = useState(false);
    const [showSettingModal, setShowSettingModal] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const navigate = useNavigate();
    const { dispatch, user } = useContext(UserContext);

    useEffect(() => {
        const getCurrentWeekRange = () => {
            const today = new Date();
            const start = new Date(today);
            start.setDate(today.getDate() - today.getDay() + 1);
            const end = new Date(start);
            end.setDate(start.getDate() + 6);
            const format = (d) => d.toISOString().split('T')[0];
            return `${format(start)} ~ ${format(end)}`;
        };

        const load = async () => {
            const info = await localforage.getItem('fortune_user_info3');
            if (!info) {
                setShowInitModal(true);
                return;
            }
            setUserInfo(info);

            const uidKey = `${info.year}${info.month}${info.day}_${info.time}`;
            const docId = `weekly_${uidKey}`;
            const thisWeek = getCurrentWeekRange();

            const cached = await localforage.getItem(docId);

            if (cached && cached.weekRange === thisWeek) {
                setWeeklyData(cached.content);
            } else {
                const prompt = getWeeklyPrompt(info);
                const result = await callVertexAI(prompt);
                const parsed = parseWeeklyFortune(result);

                setWeeklyData(parsed);

                await localforage.setItem(docId, {
                    weekRange: thisWeek,
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

    const _handleprev = () => {
        navigate(-1);
    };

    return (
        <div>
            <HeaderWrapper>
                <Column style={{ width: "100%" }}>
                    <BetweenRow style={{ width: "90%", paddingTop: 20, margin: "0 auto" }}>
                        <div style={{ display: "flex", fontSize: '18px', color: "#131313", alignItems: "center" }}>
                            <img src={imageDB.ic_common_top_back_nor} style={{ height: 24 }} onClick={_handleprev} />
                        </div>
                        {/* <KakaoShare
                            height={20}
                            width={20}
                            text={'[구해줘 홍여사] 가사분담내용을 공유합니다'}
                            url={`https://honglady.co.kr/MobileWorkView?id=${user.USERS_ID}`}
                        /> */}
                    </BetweenRow>
                </Column>
            </HeaderWrapper>

            {showInitModal && <MobileFortuneInfoInitModal onSave={handleSaveInfo} />}
            {showSettingModal && (
                <MobileFortuneInfoSettingModal
                    defaultInfo={userInfo}
                    onSave={handleSaveInfo}
                    onClose={() => setShowSettingModal(false)}
                />
            )}

            {weeklyData ? (
                <MobileFortuneWeeklyDetail data={weeklyData} />
            ) : (
                <ShoppingSpinner />
            )}

            {!showInitModal && (
                <div style={{ textAlign: 'right', marginTop: 12 }}>
                    <button
                        onClick={() => setShowSettingModal(true)}
                        style={{ background: 'none', border: 'none', color: '#999', fontSize: 14, textDecoration: 'underline', cursor: 'pointer' }}
                    >
                        정보 수정
                    </button>
                </div>
            )}
        </div>
    );
};
