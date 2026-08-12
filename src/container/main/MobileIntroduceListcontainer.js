import React, { useContext, useLayoutEffect, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { UserContext } from "../../context/User";
import { DataContext } from "../../context/Data";
import { useSelector } from "react-redux";
import { getFontSize } from "../../utility/fontsize";
import { Column } from "../../common/Column";
import MobileWorkItem from "../../components/MobileWorkItem";
import Empty from "../../components/Empty";
import useWorkStatus from "../../hooks/useWorkStatus";
import { FILTERITMETYPE, LoadingType, PCMAINMENU } from "../../utility/screen";
import { imageDB } from "../../utility/imageData";
import IconButton from "../../common/IconButton";
import LottieAnimation from "../../common/LottieAnimation";
import MobileServiceFilter from "../../modal/MobileServiceFilterPopup/MobileServiceFilter";
import { MdOutlineFilterAlt } from "react-icons/md";
import { HiOutlinePlus } from "react-icons/hi2";
import { distanceFunc } from "../../utility/region";
import SelfIntroworker from "../../components/SelfIntroworker";
import { getWorkersWithIntroVideo } from "../../service/WorkService";
import { getWorkerByUserId } from "../../service/WorkerService";

const HEADER_HEIGHT = 47;
const FOOT_HEIGHT = 65;


const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px;
  height: calc(100dvh - ${HEADER_HEIGHT + FOOT_HEIGHT}px);
  overflow-y: auto;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: auto;
  background-color: #fff;
  padding: 0 16px;
`;

const EmptyImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  background: #fff;
  border-radius: 12px;
`;
const EmptyTitle = styled.div`
  margin-top: 20px;
  font-family: 'Pretendard-SemiBold';
 font-size: ${() => `${getFontSize(22)}px`} !important;
  color: #423f3f;
`;
const EmptySubTitle = styled.div`
  margin: 5px 0px;
`;

const FilterButtonLayer = styled.div`
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 135px);
  right: 15px;
  width: 100%;
  z-index: 2;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const FilterButton = styled.div`
  background-color: #000000b0;
  width: 80px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  justify-content: space-evenly;
  border-radius: 20px;
  border: 1px solid #ededed;
  color: #131313;
`;

const FilterEx2 = styled.div`
  position: fixed;
  z-index: 2;
  right: 10px;
  display: flex;
  flex-direction: row;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 70px);
`;

const FloatingAddButton = styled.div`
  position: fixed;
  bottom: 140px;
  right: 20px;
  width: 38px;
  height: 38px;
  background: #fff;
  border: 2px solid #4F8BFF;
  color: #4F8BFF;
  border-radius: 50%;
  font-size: 32px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0,0,0,0.12);
  z-index: 999;
`;

const Tooltip = styled.div`
   display: none;
  position: absolute;
  bottom: 70px;
  right: 0;
  background-color: #333;
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;

  ${FloatingAddButton}:hover & {
    display: block;
  }
`;





export default function SelfIntroListContainer() {
  const [list, setList] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetch = async () => {
      const allResults = await getWorkersWithIntroVideo(); // ✅ 분리된 서비스 호출

      const nearby = allResults.filter(item => {
        if (!item.latitude || !item.longitude || !user?.USERINFO?.latitude || !user?.USERINFO?.longitude) return false;
        const dist = distanceFunc(user.USERINFO.latitude, user.USERINFO.longitude, item.latitude, item.longitude);
        return dist <= 20;
      });

      setList(nearby);
    };
    fetch();
  }, [user]);

  const _handleWorkerRegister = async () => {

    const workers = await getWorkerByUserId(user.USERS_ID);

    if (workers.length > 0) {
      // 이미 등록된 사용자 → 상세 페이지로 이동
      navigate("/Mobileworkeredit", { state: { worker: workers[0] } });

    } else {
      // 미등록 → 등록 페이지로 이동
      navigate('/Mobileworkerregist');
    }



  };


  return (
    <Container>
      <SelfIntroworker list={list} />

      <FloatingAddButton onClick={_handleWorkerRegister}>
        <HiOutlinePlus size={28} color="#4F8BFF" />
        <Tooltip>아르바이트에 지원 해보세요</Tooltip>
      </FloatingAddButton>
    </Container>
  );
}