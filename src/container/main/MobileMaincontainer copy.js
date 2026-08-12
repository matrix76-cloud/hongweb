// src/pages/mobile/MobileMaincontainer.js
import React, { Component, Fragment, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled, { keyframes } from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { CouponimageDB, imageDB, Seekimage } from "../../utility/imageData";

import { DataContext } from "../../context/Data";

import { checkExistingRoom, createVirtualWork, DeleteWorkByUSER_ID, getNewWorksSinceLastLogin, getWorkersWithIntroVideo, getWorknetTotalCount, ReadAllWorkTmp, ReadWork, ReadWorkByIndividually } from "../../service/WorkService";
import { BetweenRow, FlexstartRow, Row } from "../../common/Row";
import Loading from "../../components/Loading";
import { CHATCONTENTTYPE, CONFIGMOVE, CONTACTTYPE, FILTERITMETYPE, LoadingType, PCMAINMENU } from "../../utility/screen";
import Position from "../../components/Position";
import { REFRESHTYPE, WORKNAME, WORKPOLICY } from "../../utility/work";
import { useDispatch, useSelector } from "react-redux";
import { Column, FlexstartColumn } from "../../common/Column";
import MobileWorkItem from "../../components/MobileWorkItem";
import Label from "../../common/Label";
import { GoNoEntry } from "react-icons/go";

import "./MobileMaincontainer.css";
import MobileStoreInfo from "../../components/MobileStoreInfo";
import Swipe from "../../common/Swipe";
import SlickSliderComponent from "../../common/Swipe";
import { postLog, useSleep } from "../../utility/common";
import { FILTERNAME } from "../../utility/fitler";
import LazyImage from "../../common/LasyImage";
import LazyImageex from "../../common/LasyImageex";
import MainImageex from "../../common/MainImageex";
import { getFontSize } from "../../utility/fontsize";
import localforage from 'localforage';
import PermissionPopup from "../../modal/PermissionPopup";
import { cleanWorkersWithoutPhone, getLastLoginAt, getuserInfobyusers_id, readuser, readuserbydeviceid, Readuserbyusersid, Sync_userProfileImg_fromWorker, syncFirst3UserImgs, updateAllUserImagesIfMatched, updateUserImages } from "../../service/UserService";
import useInitUserContext from "../../hooks/useInitUserContext";

import { Toaster, toast } from 'sonner';
import useWorkStatus from "../../hooks/useWorkStatus";
import { getReadCoupon, getUnreadEventCoupons, markEventAsRead } from "../../service/CouponService";
import CouponPopup from "../../modal/CouponPopup";
import NewWorkPopup from "../../modal/NewWorkPopup";
import useWorkerStatus from "../../hooks/useWorkerStatus";
import { db } from "../../api/config";
import { collection, getDocs, query, updateDoc, where, doc, setDoc, deleteDoc, orderBy, arrayUnion, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signInWithPhoneNumber, signOut, updateProfile } from 'firebase/auth';
import { uploadDong } from "../../service/PostService";
import useCustomBackHandler from "../../hooks/useCustomBackHandler";
import WorkerStatsCard from "../../components/WorkerStatsCard";
import { safeGetCouponHiddenUntil, safeSetCouponHiddenUntil } from "../../utility/storage";
import ExpertWorkerSlider from "../../components/ExpertWorkerSlider";

import SelfGuideIntroworker from "../../components/SelfGuideIntroworker";
import IntroVideoCard from "../../components/IntroVideoCard";
import { distanceFunc, extractCityName } from "../../utility/region";
import { CreateChat, NewCreateMessage } from "../../service/ChatService";
import { CreateContact } from "../../service/ContactService";
import BannerSlide from "../../components/BannerSlide";
import FeatureGrid from "../../components/FeatureGrid";
import IntroCarousel from "../../components/IntroCarousel";
import WorkStatsCard from "../../components/WorkStatsCard";
import { getWorkerByUserId } from "../../service/WorkerService";
import AbilityHorizontalSlider from "../../components/AbilityHorizontalSlider";
import dayjs from "dayjs";
import { deterministicShuffle } from "../../utility/shuffle";
import AIQuickAskBar from "../../components/AIQuickAskBar";
import usePolicyNews from "../../hooks/usePolicyNews";
import { getGeneralJobs, getJobList } from "../../service/jobService";
import SeniorJobCard from "../../components/SeniorJobCard";
import SeniorJobSwiperSection from "../../components/SeniorJobSwiperSection";
import GeneralJobSwiperSection from "../../components/GeneralJobSwiperSection";
import FunctionSwipeSection from "../../components/FunctionSwipeSection";
import { COLORS } from "../../utility/colors";
import { PrimaryRoundedButton } from "../../components/PrimaryRoundButton";
import JobCategoryGrid from "../../components/JobCategoryGrid";

import { DEFAULT_ITEMS, DEFAULT_VISIBLE_KEYS } from "../../utility/categories";
import CategoryEditSheet from "../../components/CategoryEditSheet";
import { useCategoryPrefs } from "../../hooks/useCategoryPrefs";

import { useWorknetCountsNear } from "../../hooks/useWorknetCountsNear";
import { useWorknet } from "../../context/WorknetContext";
import AbilityCategoryEditSheet from "../../components/AbilityCategoryEditSheet";
import { useAbilityVisibleKeys } from "../../hooks/useAbilityVisibleKeys";    // ✅ NEW
import EditToggle from "../../components/EditToggle";

const HEADER_HEIGHT = 50;
const FOOT_HEIGHT = 65;

const Container = styled.div`
  margin-top: ${HEADER_HEIGHT}px; // ✅ 상단 safe 영역 확보
  height: calc(100dvh - ${HEADER_HEIGHT + FOOT_HEIGHT}px);             // ✅ 전체 화면 높이에서 상·하단 제외
  overflow-y: scroll;
  overscroll-behavior: none;
  -webkit-overflow-scrolling: touch;
  background-color: #fcfbf7;
  scrollbar-gutter: stable;
`;

const style = { display: "flex" };

const FilterBox = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: row;
  background: ${({ clickstatus }) => clickstatus == true ? ('#FF7125') : ('#fff')};
  border:  ${({ clickstatus }) => clickstatus == true ? (null) : ('1px solid #C3C3C3')};
  margin-right: 3px;
  border-radius: 4px;
  padding: 20px 15px;
  height:30px;
  flex: 0 0 auto;
`
const FilterBoxText = styled.div`
  color: ${({ clickstatus }) => clickstatus == true ? ('#FFF') : ('#131313')};
  font-size: ${() => () => getFontSize(14)}px;
  margin-left:5px;
  font-weight:600;
`

const StickyPos = styled.div` position: sticky; top:0px; `
const Bannerstyle = { width: '100%', borderRadius: '10px', margin: '20px 0px' }
const Inputstyle = { background: '#FFF', width: '75%', borderRadius: '5px', fontSize: '16px', padding: '0px 20px 0px 20px', height: '40px', border: "1px solid #FF7125", position: "absolute" }
const Searchstyle = { position: "absolute", left: '15px' }

const InputLine = styled.div`
  width: 95%;
  background: rgb(249, 249, 249);
  margin: 0px auto;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`

const SearchElementStyle = { height: '80px', background: "white", width: '100%', marginBottom: '10px' }

const RegistButton = styled.div`
  height: 45px;
  width: 45%;
  border-radius: 100px;
  background: #FF7e19;
  color: #fff;
  margin: 20px auto 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${() => () => getFontSize(18)}px;
  font-family : Pretendard-SemiBold;
  cursor: pointer;
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.2);
  &:active { transform: scale(0.95); box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2); }
`

/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const CLEANINGWorkItems = [
  { name: WORKNAME.HOMECLEAN, img: imageDB.house, bgcolor: "#f9f9f9" },
  { name: WORKNAME.BUSINESSCLEAN, img: imageDB.business, bgcolor: "#f9f9f9" },
  { name: WORKNAME.MOVECLEAN, img: imageDB.move, bgcolor: "#f9f9f9" },
  { name: WORKNAME.SHOPCLEAN, img: imageDB.shopclean, bgcolor: "#f9f9f9" },
]

const HOMECAREWorkItems1 = [
  { name: "간단한 집안수리", img: imageDB.carry, bgcolor: "#c6e2ff", desc: "집안일 도움" },
  { name: "손쉬운 가구조립", img: imageDB.assemble, bgcolor: "#f9f9f9", desc: "가구조립 도움" },
]

const HOMECAREWorkItems2 = [
  { name: WORKNAME.AIRCON, img: imageDB.aircon, bgcolor: "#f9f9f9", desc: "에어컨 청소 전문가에게 맡기세요" },
  { name: WORKNAME.CURTAIN, img: imageDB.curtain, bgcolor: "#f9f9f9" },
  { name: WORKNAME.STORECLEAN, img: imageDB.storeclean, bgcolor: "#f9f9f9" },
  { name: WORKNAME.COMPUTER, img: imageDB.computer, bgcolor: "#f9f9f9" },
]

const MEALSWorkItems = [
  { name: WORKNAME.SHOPPING, img: imageDB.shopping, bgcolor: "#c6e2ff" },
  { name: WORKNAME.RECIPETRANSMIT, img: imageDB.recipe, bgcolor: "#c6e2ff" },
  { name: WORKNAME.FOODPREPARE, img: imageDB.cook, bgcolor: "#c6e2ff" },
  { name: WORKNAME.FAMILYEVENT, img: imageDB.gimchi, bgcolor: "#c6e2ff" },
]

const MEALSWorkItems2 = [
  { name: WORKNAME.RECIPETRANSMIT, img: imageDB.recipe, bgcolor: "#c6e2ff" },
  { name: WORKNAME.FOODPREPARE, img: imageDB.cook, bgcolor: "#c6e2ff" },
  { name: WORKNAME.SHOPPING, img: imageDB.shopping, bgcolor: "#c6e2ff" },
  { name: WORKNAME.FAMILYEVENT, img: imageDB.gimchi, bgcolor: "#c6e2ff" },
]

const CHILDCAREItems = [
  { name: WORKNAME.GOOUTSCHOOL, img: imageDB.gooutschool, bgcolor: "#f4f4f4" },
  { name: WORKNAME.BABYCARE, img: imageDB.babycare, bgcolor: "#f4f4f4" },
  { name: WORKNAME.GOSCHOOLEVENT, img: imageDB.schoolevent, bgcolor: "#f4f4f4" },
  { name: WORKNAME.LESSON, img: imageDB.lesson, bgcolor: "#f4f4f4" },
]

const HELPItems = [
  { name: WORKNAME.ERRAND, img: imageDB.help, bgcolor: "#c6e2ff" },
  { name: WORKNAME.PATIENTCARE, img: imageDB.patientcare, bgcolor: "#fff1c6" },
  { name: WORKNAME.GOHOSPITAL, img: imageDB.hospital, bgcolor: "#fff1c6" },
  { name: WORKNAME.OFFICE, img: imageDB.office, bgcolor: "#fff1c6" },
]

const DogItems = [
  { name: WORKNAME.GODOGHOSPITAL, img: imageDB.doghospital, bgcolor: "#f9f9f9" },
  { name: WORKNAME.GODOGWALK, img: imageDB.dog, bgcolor: "#f9f9f9" },
  { name: WORKNAME.GODOGHOTEL, img: imageDB.doghotel, bgcolor: "#f9f9f9" },
]

const WorkItems = [
  { name: WORKNAME.HOMECLEAN, img: imageDB.house, bgcolor: "#f9f9f9" },
  { name: WORKNAME.BUSINESSCLEAN, img: imageDB.business, bgcolor: "#f9f9f9" },
  { name: WORKNAME.MOVECLEAN, img: imageDB.move, bgcolor: "#f9f9f9" },

  { name: WORKNAME.STORECLEAN, img: imageDB.storeclean, bgcolor: "#f9f9f9" },
  { name: WORKNAME.ERRAND, img: imageDB.help, bgcolor: "#c6e2ff" },
  { name: WORKNAME.RECIPETRANSMIT, img: imageDB.recipe, bgcolor: "#c6e2ff" },
  { name: WORKNAME.FOODPREPARE, img: imageDB.cook, bgcolor: "#c6e2ff" },
  { name: WORKNAME.SHOPPING, img: imageDB.shopping, bgcolor: "#c6e2ff" },

  { name: WORKNAME.GOOUTSCHOOL, img: imageDB.gooutschool, bgcolor: "#f4f4f4" },
  { name: WORKNAME.BABYCARE, img: imageDB.babycare, bgcolor: "#f4f4f4" },
  { name: WORKNAME.GOSCHOOLEVENT, img: imageDB.schoolevent, bgcolor: "#f4f4f4" },
  { name: WORKNAME.LESSON, img: imageDB.lesson, bgcolor: "#f4f4f4" },

  { name: WORKNAME.PATIENTCARE, img: imageDB.patientcare, bgcolor: "#fff1c6" },
  { name: WORKNAME.GOHOSPITAL, img: imageDB.hospital, bgcolor: "#fff1c6" },

  { name: WORKNAME.GODOGHOSPITAL, img: imageDB.doghospital, bgcolor: "#f9f9f9" },
  { name: WORKNAME.GODOGWALK, img: imageDB.dog, bgcolor: "#f9f9f9" },
  { name: WORKNAME.CARRYLOAD, img: imageDB.carry, bgcolor: "#c6e2ff" },
  { name: WORKNAME.AIRCON, img: imageDB.aircon, bgcolor: "#f9f9f9" },
  { name: WORKNAME.CURTAIN, img: imageDB.curtain, bgcolor: "#f9f9f9" },
  { name: WORKNAME.ASSEMBLE, img: imageDB.assemble, bgcolor: "#f9f9f9" },
]

const FilterItems = [
  { name: FILTERNAME.INIT, img: imageDB.house, img2: imageDB.house },
  { name: FILTERNAME.SERVICE, img: imageDB.house, img2: imageDB.house },
  { name: FILTERNAME.PRICE, img: imageDB.house, img2: imageDB.house },
  { name: FILTERNAME.DISTNACE, img: imageDB.house, img2: imageDB.house },
  { name: FILTERNAME.PROCESS, img: imageDB.house, img2: imageDB.house },
]

const BannerItems = [
  {
    headline: "영상채팅",
    bgcolor: "#FFF", color: "#FFFFFF",
    maintext: "집안일, 아무한테나 못 맡겨요", subtext1: "직접 얼굴 보고 결정해보세요 ",
    buttontype: 2, buttonText: "채팅하기", buttonImage: imageDB.videochat,
    Image: imageDB.banner2,
    footer: "아르바이트, 아무한테나 못 맡기잖아요"
  },
  {
    headline: "영상채팅",
    bgcolor: "#FFF", color: "#FFFFFF",
    maintext: "집안일, 아무한테나 못 맡겨요", subtext1: "직접 얼굴 보고 결정해보세요 ",
    buttontype: 3, buttonText: "채팅하기", buttonImage: imageDB.introducevideo,
    Image: imageDB.banner3,
    footer: "아르바이트, 아무한테나 못 맡기잖아요"
  },
  {
    headline: "빠른 집안일 요청",
    bgcolor: "#FFF", color: "#FFFFFF",
    maintext: "일감 요청, 단 10초!", subtext1: "이웃이 금방 도와줘요",
    buttontype: 1, buttonText: "지금 요청하기", buttonImage: imageDB.house,
    Image: imageDB.banner1,
    footer: "급한 집안일, 고민 말고 요청하세요"
  },
];

const Lineup = styled.div` background: #fcfbf7; `

const SupporterLayer = styled.div`
  position: relative;
  background: #FFF;
  margin: 20px auto;
  padding: 15px 16px 15px 9px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border-radius: 12px;
  box-sizing: border-box;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  overflow: hidden;
  @keyframes scrollBorder {
    0% { background-position: 0% 0%; }
    100% { background-position: 0% 100%; }
  }
`;

const SupporterLayer2 = styled(SupporterLayer)``;

const WorkLayer = styled.div`
  background: #E6F2FF;
  width: 90%;
  margin: 20px auto;
  padding :15px;
  border: 1px solid #ececec;
  border-radius: 12px;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
`

const ImageLayer = styled.div` width : 22%; `

const Guide = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  font-family: Pretendard-SemiBold;
  width: 100%;
  align-items: center;
  padding-top: 20px;
  padding-bottom: 10px;
  font-size: ${() => () => getFontSize(18)}px;
`

const GuideView = styled.div`
  display: flex;
  width:90%;
  margin : 20px auto;
  flex-direction:column;
`
const GuideSub = styled.div`
  line-height: 1.5;
  font-size: ${() => () => getFontSize(16)}px;
  letter-spacing: -0.32px;
`
const BoxStyle = `
.BoxHover:hover img {
  transform: scale(1.2);
  filter: brightness(1.2);
}
}
`

const WORKNOTIFY = styled.div`
    justify-content: space-between;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
`

const TitleSection = styled.div`
  width: 90%;
  margin: 5px auto;
  font-family: Pretendard-SemiBold;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  border-left: 4px solid #ff6f00;
  padding-left: 12px;
  font-size: ${() => () => getFontSize(16)}px;
  color: #222;
`

const MainBox = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  border-radius: 15px;
  margin-bottom: 2px;
  padding :10px 10px 0px;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  @media (max-width: 300px) {
    width: 90%;
    flex-direction: column;
    .MainMenuDesc { display: none; }
    .MainMenuname { font-size: ${() => () => getFontSize(16)}px; }
  }
`;

const CategoryWrapper = styled.div`
  background-color: #fff;
  border: 1px solid #ececec;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  border-radius: 12px;
  position: relative;
  width: 100%;
  margin-top:38px;
`;

const CategoryLabel = styled.div`
  position: absolute;
  top: -18px;
  left: 20px;
  background-color: #FFF;
  color: #131313;
  font-weight: 600;
  font-size: ${() => getFontSize(14)}px;
  padding: 6px 20px;
  border-radius: 9999px;
  font-family:Pretendard-SemiBold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const ItemLayer = styled.div`
  flex-wrap: wrap;
  width: 100%;
  gap: 6px 3px;
  display: flex;
  justify-content:center;
  flex-direction: row;
  align-items: center;
`
const Menuname = styled.div`
  font-size: ${() => getFontSize(14)}px;
  color: rgb(26, 30, 40);
  margin-top: 20px;
  letter-spacing: -1px;
`
const MainMenuname = styled.div`
  font-size: ${() => getFontSize(20)}px;
  color: #1e1e1e;
  margin-top: 2px;
  letter-spacing: -1px;
  font-family: Pretendard-Bold;
`
const MainMenuDesc = styled.div`
  font-size: ${() => getFontSize(14)}px;
  color: rgb(26, 30, 40);
  margin-top: 7px;
  letter-spacing: -1px;
  font-family: Pretendard-Regular;
`

const Box = styled.div`
  align-items: center;
  display: flex;
  justify-content: center;
  flex-direction:column;
  width: 32%;
  border-radius: 15px;
  margin-bottom:15px;
  pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')};
  @media (max-width: 320px) { width: 30%; }
`

const BoxImg = styled.div` padding: 10px; height:35px; `
const MainBoxImg = styled.div` padding: 10px; width:40%; `

const HomeCareWrapper = styled.div`
  border: 1px solid #ededed;
  border-radius: 12px;
  position: relative;
  width: 100%;
  margin: 30px auto 0;
  background: #fff;
`;

const HomeCareLabel = styled.div`
  position: absolute;
  top: -18px;
  left: 20px;
  background-color: #FFF;
  color: #131313;
  font-weight: 600;
  font-size: ${() => getFontSize(14)}px;
  padding: 6px 20px;
  border-radius: 9999px;
  font-family: Pretendard-SemiBold;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const RepresentativeRow = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  padding: 0 20px;
  gap: 10px;
  @media (max-width: 300px) {
    flex-direction: column;
    align-items: center;
  }
`;

const RepresentativeImg = styled.img` width: 60px; height: 60px; margin-right: 14px; `

const RepresentativeBox = styled.div`
  flex: 1;
  background: #FFE3C1;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  padding: 10px 16px;
  align-items: center;
`;

const RepresentativeText = styled.div`
  text-align: center;
  margin-top: 8px;
  > .title { font-size: ${() => getFontSize(16)}px; color: #333333; font-family: Pretendard-SemiBold; }
  > .desc { font-size: ${() => getFontSize(14)}px; color: #FFF; margin-top: 6px; }
`;

const SubItemRow = styled.div`
  display: flex; justify-content: space-around; flex-wrap: wrap;
  padding: 20px 10px 16px; gap: 10px;
`;
const SubItemBox = styled.div`
  display: flex; flex-direction: column; align-items: center; width: 20%; min-width: 60px;
`;
const SubIcon = styled.img` width: 50px; height: 50px; `;
const SubLabel = styled.div` font-size: ${() => () => getFontSize(13)}px; margin-top: 8px; color: #222; `;

const RowGrid = styled.div`
  display: flex; justify-content: space-around; align-items: center; flex-wrap: wrap;
  padding: 36px 10px; gap: 10px;
  @media (max-width: 360px) { justify-content: space-between; }
`;
const ItemButton = styled.div` width: 22%; min-width: 60px; display: flex; flex-direction: column; align-items: center; pointer-events: ${({ disabled }) => (disabled ? 'none' : 'auto')}; `;
const Icon = styled.img` width: 48px; height: 48px; `;
const LabelItem = styled.div` font-size: ${() => () => getFontSize(13)}px; margin-top: 8px; color: #222; `;

const PetWrapper = styled.div`
  border: 1px solid #ededed; border-radius: 12px; position: relative; width: 100%; margin: 30px auto 0; background: #fff;
`;
const PetLabel = styled.div`
  position: absolute; top: -18px; left: 20px; background-color: #FFF; color: #131313; font-weight: 600;
  font-size: ${() => getFontSize(14)}px; padding: 6px 20px; border-radius: 9999px; font-family: Pretendard-SemiBold; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;
const PetItemRow = styled.div`
  display: flex; justify-content: space-around; align-items: center; flex-direction: row; padding: 20px 10px; gap: 12px;
  @media (max-width: 360px) { flex-wrap: wrap; justify-content: center; }
`;
const PetItem = styled.div` width: 28%; display: flex; flex-direction: column; align-items: center; min-width: 70px; `;
const PetIcon = styled.img` width: 48px; height: 48px; `;
const PetLabelText = styled.div` font-size: ${() => () => getFontSize(13)}px; margin-top: 8px; text-align: center; color: #222; `;

const blinkScale = keyframes` 0%, 100% { transform: scale(1); } 50% { transform: scale(1.08); } `;
const WorkStatusLabel = styled.div`
  position: absolute; top: -12px; right: 0; background: #ff7125; color: #fff; padding: 4px 10px;
  font-size: ${() => getFontSize(12)}px; border-radius: 9999px; font-family: Pretendard-Bold; box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${blinkScale}  1.8s ease-in-out infinite;
`;

const NoticeText = styled.div`
  position: relative; color: #333; font-weight: 500; font-size: ${() => getFontSize(16)}px !important;
  line-height: 1.6; word-break: keep-all; white-space: normal; font-family: Pretendard-SemiBold;
`;

const WorkBox = styled.div`
  position: relative; background: #D6ECFF; border-radius: 8px; padding: 12px 14px; margin: 12px 0px;
  font-size: ${() => getFontSize(13)}px; color: #333; font-weight: 500; line-height: 1.4; overflow: hidden;
`;
const WorkGradient = styled.div`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px; border: 2px solid transparent;
  background: linear-gradient(120deg, #4FC3F7, #81D4FA, #B3E5FC, #4FC3F7); background-size: 400% 400%;
  animation: borderSmooth 4s ease-in-out infinite; z-index: 0; pointer-events: none;
  @keyframes borderSmooth { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
`;

// ✅ 탭 헤더 스타일
const TabHeader = styled.div` display: flex; justify-content:flex-start; gap: 16px; margin-top: 12px; `;
const TabButton = styled.div`
  width: 35%; text-align: center; padding: 12px 0; font-family: "Pretendard-Bold";
  font-size: ${() => getFontSize(17)}px !important; font-weight: 700; color: #222; display: inline-block;
  padding-bottom: 4px; color: ${({ active }) => (active ? COLORS.primary : "#131313")};
  border-bottom: ${({ active }) => (active ? `3px solid ${COLORS.primary}` : "1px solid #ededed")};
  cursor: pointer; transition: color 0.3s ease, border-bottom-color 0.3s ease;
`;

const CardTitle = styled.div``;

const Spinner = styled.div`
  width: 36px; height: 36px; border: 4px solid #eee; border-top: 4px solid ${COLORS.primary};
  border-radius: 50%; animation: spin 0.8s linear infinite; margin: 20px auto;
  @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
`;

const AlertBox = styled.div`
  position: relative; background: #FFF0C9; border-radius: 8px; padding: 12px 12px; margin: 5px 5px;
  font-size: ${() => getFontSize(13)}px !important; color: #333; font-weight: 500; line-height: 1.4; overflow: hidden;
  max-width: 400px; min-height: 50px; display: flex; align-items: center; width :90%;
`;
const AlertBox2 = styled(AlertBox)` background:#FFF0C9; `;

const AlertGradient = styled.div`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px; border: 2px solid transparent;
  background: linear-gradient(120deg, #FFB74D, #FFE082, #FFF3C0, #FFB74D); background-size: 400% 400%;
  animation: borderSmoothReverse 4s ease-in-out infinite; z-index: 0; pointer-events: none;
  @keyframes borderSmoothReverse { 0% { background-position: 100% 50%; } 50% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
`;
const AlertGradient2 = styled.div`
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px; border: 2px solid transparent;
  background: linear-gradient(120deg, #d3d3d3, #eeeeee, #fafafa, #d3d3d3); background-size: 400% 400%;
  animation: borderSmoothReverse 4s ease-in-out infinite; z-index: 0; pointer-events: none;
  @keyframes borderSmoothReverse { 0% { background-position: 100% 50%; } 50% { background-position: 0% 50%; } 100% { background-position: 100% 50%; } }
`;

const AlertLink = styled.div`
  position: relative; z-index: 1; text-align: right; padding-top: 6px;
  font-size: ${() => getFontSize(13)}px !important; color: #2962FF; font-weight: 500; cursor: pointer;
`;

const SpaceRow = styled.div`
  justify-content: space-between; line-height: 1.6 !important; display: flex; flex-direction: row; align-items: center;
`;

const TaskPreviewBox = styled.div` display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; padding: 8px 0; `;
const IconImage = styled.img` width: 32px; height: 32px; object-fit: contain; justify-self: center; `;

const SectionBanner = styled.div`
  width: 100vw; margin-left: -16px; margin-right: -16px; padding: 0 16px;
  background: ${({ bgcolor }) => bgcolor || "#F8F8F8"}; padding-top: 24px; padding-bottom: 40px;
`;

const Wrapper = styled.div`
  width: 90%; padding: 15px; background: #ffffff; border-radius: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);
  margin: 20px auto; cursor: pointer;
`;

const BannerInner = styled.div` display: flex; flex-direction: column; align-items: center; gap: 16px; flex-wrap: nowrap; `;
const BoxImage = styled.img` width: 72px; height: 72px; object-fit: contain; flex-shrink: 0; `;

const BenefitBox = styled.div` background: #f5f5f5; padding: 12px; border-radius: 8px; margin: 0 0 12px 0; width:100%; `;
const BenefitItem = styled.div` font-size: ${() => getFontSize(14)}px !important; color: #444; margin-bottom: 4px; line-height: 1.4; `;

const CTAButton = styled.div`
  background: #00aa55; color: #fff; font-size: ${() => getFontSize(15)}px !important;
  padding: 10px 18px; border-radius: 9999px; text-align: center; font-weight: 600; width: fit-content; align-self: flex-start; margin-top: 8px;
`;

const Section = styled.div` margin-top: 30px; `;
const SectionTitle = styled.div` font-size: ${() => getFontSize(18)}px !important; font-family: Pretendard-Bold; color: #111; margin-bottom: 12px; `;

const recommendedList = [{
  isGuide: true,
  chatName: "구해줘 홍여사",
  age: "30대",
  gender: "남성",
  tags: ["가이드영상", "영상등록안내"],
  videoUrl: "https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/introduce%2F%5B%E1%84%87%E1%85%A9%E1%86%A8%E1%84%89%E1%85%A1%E1%84%87%E1%85%A9%E1%86%AB%5D%20%E1%84%89%E1%85%B5%E1%86%AB%E1%84%82%E1%85%B2%E1%84%89%E1%85%B3%20(1).mp4?alt=media&token=d10a6dbc-9e50-40d3-ab3c-492aee501898",
  videoThumbnail: "",
  description: "홍여사 영상 등록 가이드입니다. 어떻게 촬영하면 좋은지 확인해보세요!",
}];
const guide = recommendedList[0];
const dummyList = [guide]; // 3개 복제

const ViewMoreButton = styled.div`
  font-size: ${() => getFontSize(14)}px !important; color: #2563eb;
  text-align: center; font-weight: 500; cursor: pointer;
`;

const ActionButton = styled.div`
  padding: 10px 18px; font-size: ${() => getFontSize(16)}px !important; font-weight: 500;
  background-color: #fff6e0; color: #333; border: 1px solid #e0d3b8; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  cursor: pointer; transition: all 0.2s ease; box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  &:hover { background-color: #ffeec0; }
  &:active { background-color: #ffdf96; }
`;
const OrangeButton = styled(ActionButton)`
  background-color: #ff7e19; color: white; border: none;
  &:hover { background-color: #e55d00; }
`;

const BannerCard = styled.div`
  background: #ecebea; border-radius: 12px; padding: 16px; min-height: 80px; display: flex; align-items: center; gap: 12px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06); width: 100%; margin: 24px auto 0; box-sizing: border-box; contain: layout paint;
`;

const TextGroup = styled.div` display: flex; flex-direction: column; gap: 4px; `;
const Title = styled.div` font-weight: 700; font-size: ${() => getFontSize(12)}px !important; color: #333; `;
const Subtitle = styled.div`
  font-size: ${() => getFontSize(16)}px !important; color: #333; font-family: Pretendard-SemiBold; line-height: 1.4; font-weight: 600; white-space: pre-line;
`;
const HintText = styled.div`
  color: #131313; font-family: Pretendard-Regular; font-size: ${() => getFontSize(16)}px !important;
  margin-top: 5px; line-height: 1.6; white-space: pre-line;
`;

const SeeAllText = styled.div`
  font-size: ${() => getFontSize(13)}px !important; color: #999; cursor: pointer;
  &:hover { color: #555; text-decoration: underline; }
`;

// ★ NEW: 히어로 카드
const WorkBannerBox = styled.div`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0,1fr) 10px;
  grid-template-areas: "text char";
  gap: 6px;
  padding: 22px 16px 24px;
  border-radius: 28px;
  overflow: hidden;
  width: 90%;
  margin: 30px auto;
  background: ${({ variant }) =>
    variant === "seek"
      ? "linear-gradient(135deg, #3C8CFF 0%, #5B5BFF 100%)"
      : "linear-gradient(135deg, #7B5CFF 0%, #9A4DFF 100%)"};
  box-shadow: ${({ variant }) =>
    variant === "seek"
      ? "0 16px 40px rgba(60,140,255,.33)"
      : "0 16px 40px rgba(122,64,255,.35)"};
  &::before{
    content:""; position:absolute; top:-20%; left:5%; width:60%; height:60%;
    background: radial-gradient(circle, rgba(255,255,255,.18) 0%, rgba(255,255,255,0) 60%); pointer-events:none;
  }
`;
const HeroTexts = styled.div` grid-area: text; color: #fff; position: relative; z-index: 1; padding : 0px 10px; `;
const HeroFigure = styled.div`
  grid-area: char; justify-self: end; align-self: start; position: relative; width: 140px; margin-right: -36px; margin-top: 6px;
  &::after{
    content: ""; position: absolute; left: 50%; bottom: 4px; transform: translateX(-50%);
    width: 118px; height: 20px;
    background: radial-gradient(ellipse at center, rgba(0,0,0,.24) 0%, rgba(0,0,0,.12) 45%, rgba(0,0,0,0) 70%);
    filter: blur(6px); opacity: .35; pointer-events: none;
  }
`;
const HeroTitle = styled.div` font-family: Pretendard-Bold, sans-serif; font-size: ${() => getFontSize(22)}px !important; line-height: 1.05; letter-spacing: -0.5px; `;
const HeroLine = styled.div` margin: 10px 0 16px; font-size: ${() => getFontSize(20)}px !important; line-height: 1.32; color: rgba(255,255,255,.92); word-break: keep-all; `;
const Line = styled.span` display:block; `;
const NoWrap = styled.span` white-space: nowrap; `;
const EmNumber = styled.span`
  display: inline-block; background: linear-gradient(180deg, #FFC83A 0%, #FF7A00 100%);
  -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; color: transparent;
  font-family : Pretendard-SemiBold; font-size: ${() => getFontSize(22)}px !important; letter-spacing: -0.2px; line-height: 1; transform: translateY(1px); font-variant-numeric: tabular-nums;
`;
const GlassButton = styled.button`
  height: 50px; padding: 0 18px; border-radius: 999px; background: rgba(255,255,255,.22);
  border: 1.5px solid rgba(255,255,255,.55); color: #fff; font-size: ${() => getFontSize(16)}px !important;
  font-family:Pretendard-SemiBold; cursor: pointer; backdrop-filter: blur(6px);
  transition: transform .12s ease, background .12s ease, opacity .12s ease; &:active{ transform: scale(.985); }
`;
const HeroCharacter = styled.img` display:block; width:100%; height:auto; filter: drop-shadow(0 12px 18px rgba(0,0,0,.15)); transform: translateY(2px); `;

const WorkIllustration = styled.img` width: 100px; margin-bottom: 20px; `;
const WorkIllustration2 = styled.img` width: 110px; margin-bottom: 20px; `;

const WorkDescription = styled.div`
  font-size: ${() => getFontSize(15)}px; color: #888; font-weight: 500; margin-bottom: 18px;
`;
const HighlightNumber = styled.span` color: #FF7E19; font-weight: 700; font-family:Pretendard-Bold; `;
const RegisterButton = styled.button`
  background: ${COLORS.primary}; color: white; font-size: ${() => getFontSize(16)}px;
  padding: 14px 24px; border-radius: 12px; font-weight: 600; border: none; cursor: pointer; width: 100%; max-width: 260px;
`;

const MobileMaincontainer = ({ containerStyle, checkingPermission, showUpdateBanner }) => {
  const reduxdispatch = useDispatch();
  const { value } = useSelector((state) => state.menu);
  const { dispatch, user } = useContext(UserContext);

  const { datadispatch, data } = useContext(DataContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [workitems, setWorkitems] = useState([]);
  const [displayitems, setDisplayitems] = useState([]);
  const [currentloading, setCurrentloading] = useState(false);
  const [menu, setMenu] = useState('');
  const [showNewDiv, setShowNewDiv] = useState(true);
  const [search, setSearch] = useState('');
  const recordRef = useRef(null);
  const elementRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [totalset, setTotalset] = useState(0);

  const [servicepopup, setServicepopup] = useState(false);
  const [pricepopup, setPricepoupup] = useState(false);
  const [periodpopup, setPeriodpopup] = useState(false);
  const [distancepopup, setDistancepopup] = useState(false);
  const [processpopup, setProcesspopup] = useState(false);

  const [servicefilter, setServicefilter] = useState([]);
  const [pricefilter, setPricefilter] = useState([]);
  const [periodfilter, setPeriodfilter] = useState([]);
  const [distancefilter, setDistancefilter] = useState([]);
  const [processfilter, setProcessfilter] = useState([]);

  const [refresh, setRefresh] = useState(1);
  const [init, setInit] = useState(false);
  const inputRef = useRef(null);
  const [isPermissionRetried, setIsPermissionRetried] = useState(false);
  const [isCardTouchable, setIsCardTouchable] = useState(false);
  const [couponPopupEvent, setCouponPopupEvent] = useState(null);

  const phone = location.state?.phone;

  const [newWorks, setNewWorks] = useState([]);
  const [showNewWorkPopup, setShowNewWorkPopup] = useState(false);

  const { status, items } = useWorkStatus(user.USERINFO?.latitude, user.USERINFO?.longitude);
  const { workerstatus, workeritems } = useWorkerStatus(user.USERINFO?.latitude, user.USERINFO?.longitude);

  console.log("workers", workeritems, workerstatus);

  const getTodayKey = () => new Date().toISOString().slice(0, 10);
  const hideToday = localStorage.getItem("hideWorkPopup") === getTodayKey();

  const [categoryData, setCategoryData] = useState({});
  const [genderData, setGenderData] = useState({});
  const [ageData, setAgeData] = useState({});
  const [workStats, setWorkStats] = useState({});
  const [introducelist, setIntroducelist] = useState([]);
  const [selectedTab, setSelectedTab] = useState("seek"); // seek | hire
  const [seniorJobs, setSeniorJobs] = useState([]);
  const [generalJobs, setGeneralJobs] = useState([]);
  const [workCount, setWorkCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);

  const [isWorkerEditing, setIsWorkerEditing] = useState(false);
  const [workeropen, setWorkerOpen] = useState(false);

  // ✅ 일자리 카테고리(워크넷)용 프리퍼런스
  const { visibleKeys: jobVisibleKeys, replace } = useCategoryPrefs({ autoSave: false });

  // ✅ 능력자 카테고리(지원자 능력)용 프리퍼런스
  const {
    visibleKeys: abilityKeys,
    setVisibleKeys: setAbilityKeys,
    showAll: showAllAbility,
    reset: resetAbility,
  } = useAbilityVisibleKeys();

  // WorknetProvider에서 계산/캐시된 값 재사용
  const {
    counts: nearCounts = {},
    loading: nearCountsLoading,
    refresh: refreshWorknet,
    center,            // { lat, lng }
    radiusKm           // Provider에 준 반경
  } = useWorknet();



  // 선택된 카테고리(일자리) 총합
  const selectedTotalCount = useMemo(
    () => jobVisibleKeys.reduce((sum, key) => sum + (nearCounts?.[key] || 0), 0),
    [nearCounts, jobVisibleKeys]
  );

  // ✅ 능력자 카테고리별 인원수 집계
  const abilityCounts = useMemo(() => {
    const acc = {};
    (workeritems || []).forEach(w => {
      const list = Array.isArray(w?.abilities) ? w.abilities
        : Array.isArray(w?.tags) ? w.tags : [];
      list.forEach(tag => { acc[tag] = (acc[tag] || 0) + 1; });
    });
    return acc;
  }, [workeritems]);

  // useCustomBackHandler(); // ✅ 뒤로가기 작전 투입

  const handleJobCategorySaved = (nextKeys) => {
    // 상태 반영 + 로컬스토리지 저장
    replace(nextKeys, { save: true });
  };

  const params = new URLSearchParams(location.search);
  const uid = params.get("uid");

  // ✅ 여기서 훅 호출 (원래 코드 구조 유지)
  if (!uid) {
    console.log("uid 존재", uid);
    useInitUserContext(phone);
  }

  // ✅ uid로 진입한 경우 사용자 정보 세팅
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const uid = params.get("uid");
    const initFromUid = async () => {
      if (!uid) return;
      const userData = await getuserInfobyusers_id({ USERS_ID: uid });
      if (!userData || userData === -1) return;

      dispatch({
        USERS_ID: userData.USERS_ID,
        USERINFO: userData.USERINFO,
        simulate: true, // ✅ 시뮬레이터 모드임을 명시
        locationGranted: true,
        pushGranted: true,
        popupStep: "confirmed",
        startTrigger: true,
      });
    };
    initFromUid();
  }, []);

  useLayoutEffect(() => {
    setWidth(elementRef.current.offsetWidth);
  }, []);

  // ✅ workeritems 기반 통계 생성
  useEffect(() => {
    if (!workeritems || workeritems.length === 0) return;
    const category = {};
    workeritems.forEach(worker => {
      const gender = worker.gender || '기타';
      const ageText = worker.age || '';
      const getAgeGroup = (ageStr) => {
        if (ageStr.includes('20')) return 'age20';
        if (ageStr.includes('30')) return 'age30';
        if (ageStr.includes('40')) return 'age40';
        if (ageStr.includes('50')) return 'age50';
        if (ageStr.includes('60')) return 'age60';
        return null;
      };
      const ageGroup = getAgeGroup(ageText);
      (worker.tags || []).forEach(tag => {
        if (!category[tag]) category[tag] = { total: 0, female: 0, male: 0, age20: 0, age30: 0, age40: 0, age50: 0, age60: 0 };
        category[tag].total += 1;
        if (gender === 'female') category[tag].female += 1;
        else if (gender === 'male') category[tag].male += 1;
        if (ageGroup) category[tag][ageGroup] += 1;
      });
    });
    setWorkStats(category);
  }, [user.workeritems]);

  // ✅ 새 일감 확인 (시뮬 제외)
  useEffect(() => {
    if (
      user.simulate ||
      !user?.USERS_ID ||
      !user.USERINFO?.latitude ||
      !user.USERINFO?.longitude ||
      showNewWorkPopup
    ) return;

    const fetchNewWorks = async () => {
      const lastLogin = await getLastLoginAt({ uid: user.USERS_ID });
      const result = await getNewWorksSinceLastLogin({
        uid: user.USERS_ID,
        lastLoginAt: lastLogin,
        location: { latitude: user.USERINFO.latitude, longitude: user.USERINFO.longitude }
      });
      if (result.length > 0) {
        setNewWorks(result);
        const todayKey = new Date().toISOString().slice(0, 10);
        const hideToday = localStorage.getItem("hideWorkPopup") === todayKey;
        if (!hideToday) setShowNewWorkPopup(true);
      }
    };
    setTimeout(fetchNewWorks, 500);
  }, [showUpdateBanner, user?.USERS_ID]);

  // ✅ localforage → deviceId 기반 사용자 복원
  useEffect(() => {
    const restoreUserContext = async () => {
      if (user?.USERS_ID) return;
      await localforage.ready();
      const config = await localforage.getItem('userconfig');
      const DEVICEID = config?.deviceid;
      if (!DEVICEID) return;
      const userData = await readuserbydeviceid({ DEVICEID });
      if (!userData || userData === -1) return;
      dispatch({ USERS_ID: userData.USERS_ID, USERINFO: userData.USERINFO, locationGranted: true, pushGranted: true, popupStep: 'confirmed', startTrigger: true });
    };
    restoreUserContext();
  }, []);

  // ✅ 0.5초 후 카드 활성화
  useEffect(() => {
    const timeout = setTimeout(() => { setIsCardTouchable(true); }, 500);
    return () => clearTimeout(timeout);
  }, []);

  // ✅ RN 권한 요청 트리거 (시뮬 제외)
  useEffect(() => {
    if (user.simulate || !user?.USERS_ID) return;
    const timer = setTimeout(() => {
      if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: "REQUEST_PERMISSION" }));
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [user?.USERS_ID]);

  // ✅ 권한 상태 감시 루프 (시뮬 제외)
  useEffect(() => {
    if (user.simulate) return;
    const delay = 60000;
    let interval;
    const timeout = setTimeout(() => {
      interval = setInterval(() => {
        if (window.ReactNativeWebView && (!user.locationGranted || !user.pushGranted)) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: "CHECK_INITIAL_PERMISSION" }));
        }
      }, 30000);
    }, delay);
    return () => {
      clearTimeout(timeout);
      if (interval) clearInterval(interval);
    };
  }, [user.locationGranted, user.pushGranted]);

  // ✅ 디바이스 ID 일치 확인
  useEffect(() => {
    const checkDeviceIdConsistency = async () => {
      const config = await localforage.getItem('userconfig');
      const localDeviceId = config?.deviceid;
      if (!localDeviceId) return;
      const serverUser = await readuserbydeviceid({ DEVICEID: localDeviceId });
      if (serverUser === -1 || !serverUser?.USERINFO) return;
    };
    checkDeviceIdConsistency();
  }, []);

  // ✅ denied → denied_retry 전환
  useEffect(() => {
    if (user.popupStep === "denied" && isPermissionRetried && (!user.locationGranted || !user.pushGranted)) {
      dispatch({ popupStep: "denied_retry" });
    }
  }, [user.popupStep, user.locationGranted, user.pushGranted, isPermissionRetried]);

  function shuffleArray(array) {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  useEffect(() => {
    const fetch = async () => {
      const allResults = await getWorkersWithIntroVideo(); // ✅ 전체 유저 호출
      console.log("introduce", allResults);

      const hourlySeed = dayjs().format('YYYY-MM-DD-HH'); // 시간 기반 시드

      const nearby = allResults.filter(item => {
        if (!item.latitude || !item.longitude || !user?.USERINFO?.latitude || !user?.USERINFO?.longitude) return false;
        const dist = distanceFunc(user.USERINFO.latitude, user.USERINFO.longitude, item.latitude, item.longitude);
        return dist <= 5;
      });

      const finalList = deterministicShuffle(nearby, hourlySeed);
      setIntroducelist(finalList);
    };
    fetch();
  }, [user]);

  const _handleWorkermap = () => { navigate("/Mobileworkermap"); }

  const handleOneDay = async () => {
    const today = new Date().toISOString().split("T")[0];
    await safeSetCouponHiddenUntil(today);
    setCouponPopupEvent(null);
  };
  const handleSevenDays = async () => {
    const future = new Date(); future.setDate(future.getDate() + 7);
    const expiry = future.toISOString().split("T")[0];
    await safeSetCouponHiddenUntil(expiry);
    setCouponPopupEvent(null);
  };

  // 👇 현재 시간 기준으로 오늘의 배너 세트 결정
  const now = new Date();
  const hour = now.getHours();
  const groupSize = 3;
  const groupIndex = Math.floor(hour % Math.ceil(BannerItems.length / groupSize));
  const startIndex = groupIndex * groupSize;
  const bannersToday = BannerItems; // slice 대신 전체 사용

  const handleSelfMoreClick = () => { navigate("/MobileIntroduceList"); }

  // ✅ 채팅 핸들러 내부 구현
  const handleChat = async (SUPPORTER) => {
    const OWNER = user;
    if (!SUPPORTER || !OWNER) return;

    if (OWNER.USERS_ID === SUPPORTER.users_id) {
      alert("본인에게는 채팅을 시작할 수 없습니다.");
      return;
    }

    const CHAT_ID = await checkExistingRoom({ OWNER_ID: OWNER.USERS_ID, SUPPORTER_ID: SUPPORTER.users_id });
    if (CHAT_ID) { window.location.href = `/chat/${CHAT_ID}`; return; }

    const { id: WORK_ID, WORK_INFO } = await createVirtualWork({ OWNER });
    if (WORK_ID === -1) { alert("일감 생성 실패. 잠시 후 다시 시도해주세요."); return; }

    await ChatRequestComplete(WORK_ID, SUPPORTER, WORK_INFO);
  };

  const ChatRequestComplete = async (WORK_ID, SUPPORTER, WORK_INFO) => {
    const WORK_DATA = await ReadWorkByIndividually({ WORK_ID });
    console.log("reqcomplete", WORK_DATA);
    const OWNER = await Readuserbyusersid({ USERS_ID: WORK_DATA.USERS_ID });
    console.log("OWNER", OWNER); console.log("SUPPORTER", SUPPORTER);

    const OWNER_ID = OWNER.USERS_ID;
    const SUPPORTER_ID = SUPPORTER.users_id;
    const SUPPORTER_INFO = await Readuserbyusersid({ USERS_ID: SUPPORTER_ID });

    if (!SUPPORTER_INFO || !SUPPORTER_INFO.USERS_ID || !SUPPORTER_INFO.USERINFO) {
      alert("해당 지원자의 정보가 없습니다."); return;
    }

    const TYPE = PCMAINMENU.HOMEMENU;
    const INFO = { ...WORK_DATA, isVirtualWork: true };

    const CHAT_ID = await CreateChat({ OWNER, OWNER_ID, SUPPORTER: SUPPORTER_INFO, SUPPORTER_ID, INFO, TYPE });

    const CONTACT_INFO = WORK_INFO;
    await CreateContact({ OWNER_ID, SUPPORTER_ID, CONTACT_STATUS: CONTACTTYPE.INIT, CONTACT_INFO, ID: CHAT_ID, RIGHT_SIGN: "", WORKTYPE: TYPE });

    const CHAT_CONTENT_TYPE = CHATCONTENTTYPE.ENTER;
    const read = [user.USERS_ID, SUPPORTER_ID];
    const msg = `${OWNER.USERINFO.nickname}님이 대화를 시작하였습니다.`;

    await NewCreateMessage({ CHAT_ID, msg, users_id: user.USERS_ID, read, CHAT_CONTENT_TYPE, AlarmTarget_ID: SUPPORTER_ID });
    _handleChat();
  };

  const _handleChat = () => { navigate("/Mobilechat"); };
  const _handleWorkerRegister = async () => {
    const workers = await getWorkerByUserId(user.USERS_ID);
    if (workers.length > 0) { navigate("/Mobileworkeredit", { state: { worker: workers[0] } }); }
    else { navigate('/Mobileworkerregist'); }
  }
  const _handleWorkerView = () => { navigate('/Mobileworkermap'); }
  const _handleWorkRegister = () => { navigate("/Mobilecategory"); }
  const _handleWorkView = () => { navigate('/Mobilemap'); }
  const onSeeAll = () => { navigate("/MobileResult", { state: { NAME: "구직자 전체보기", TYPE: "worker" } }); }
  const _handleRegiserConfess = () => { navigate("/Mobileconfigcontent", { state: { NAME: CONFIGMOVE.CONFESSCONFIG, TYPE: "" } }); }

  const abilityExcludedIds = useMemo(() => {
    const keys = abilityKeys || [];
    const hasTag = (w, tag) => {
      const list = Array.isArray(w?.abilities) ? w.abilities
        : Array.isArray(w?.tags) ? w.tags : [];
      return list.includes(tag);
    };
    const ids = new Set();
    (workeritems || []).forEach(w => {
      if (keys.some(tag => hasTag(w, tag))) {
        ids.add(w.users_id || w.USERS_ID);
      }
    });
    return ids;
  }, [workeritems, abilityKeys]);
  

  return (
    <>
      {/* <IntroCarousel /> */}
      <div ref={elementRef}>
        <Container style={containerStyle} width={width}>
          <Column>
            <Column style={{ width: "100%", margin: "0px auto" }}>
              <SlickSliderComponent width={width} items={bannersToday} />
            </Column>

            <Lineup style={{ padding: "0px 16px", width: "90%" }}>
              <>
                <TabHeader>

                  <TabButton active={selectedTab === "seek"} onClick={() => setSelectedTab("seek")}>구직하기</TabButton>
                  
                  <TabButton active={selectedTab === "hire"} onClick={() => setSelectedTab("hire")}>구인하기</TabButton>
            
                </TabHeader>

                {selectedTab == "seek" ? (
                  <>
                    <WorkBannerBox variant="seek">
                      <HeroTexts>
                        <HeroTitle>일할사람이 모여 있어요</HeroTitle>
                        <HeroLine>
                          <Line>총 <EmNumber>{user?.workerstatus?.newcount ?? 0}</EmNumber>명이 알바가</Line>
                          <Line><NoWrap>대기 중이에요</NoWrap></Line>
                        </HeroLine>
                        <GlassButton onClick={_handleWorkerRegister}>알바 지원하기</GlassButton>
                      </HeroTexts>
                      <HeroFigure charLeft><HeroCharacter src={imageDB.hirecharacter} /></HeroFigure>
                    </WorkBannerBox>

                    <BannerCard onClick={() => { navigate("/MobileAIView") }}>
                      <TextGroup>
                        <Title>{'AI가 지원서 분석 동네 알바들'}</Title>
                        <Subtitle>{'한눈에 보는 AI 지원자 이미지 갤러리'}</Subtitle>
                      </TextGroup>
                      <img src={imageDB.AISupporter} style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
                    </BannerCard>

                    <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 12, marginTop: 40 }}>
                      <SectionTitle style={{ marginBottom: "unset" }}>능력자 모음</SectionTitle>

                      <EditToggle
                        variant="seek"
                        isEditing={isWorkerEditing}
                        onClick={() => {
                          setIsWorkerEditing(!isWorkerEditing);
                          setWorkerOpen(true);
                        }}
                      />

                      {workeropen && (
                        <AbilityCategoryEditSheet
                          open={workeropen}
                          onClose={() => setWorkerOpen(false)}            // ✅ FIX
                          visibleKeys={abilityKeys}                        // ✅ 능력자 키
                          countsMap={abilityCounts}                        // ✅ 능력자 인원수
                          onSaved={(next) => setAbilityKeys(next)}         // ✅ 즉시 반영
                        />
                      )}
                    </Row>

                    <AbilityHorizontalSlider
                      workeritems={workeritems}
                      visibleKeys={abilityKeys}                            // ✅ 필터링 적용
                    />

                    <Section>
                      <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 15 }}>
                        <SectionTitle style={{ marginBottom: "unset" }}>AI 추천 구직자</SectionTitle>
                        <SeeAllText onClick={onSeeAll}>전체보기</SeeAllText>
                      </Row>
                      <ExpertWorkerSlider workers={workeritems}
                        excludedIds={abilityExcludedIds}/>
                    </Section>
                  </>
                ) : (
                  <>
                    <WorkBannerBox variant="hire">
                      <HeroTexts>
                        <HeroTitle>일자리를 모아 놨어요</HeroTitle>
                        <HeroLine>
                          <Line>총 <EmNumber>{selectedTotalCount}</EmNumber>개의 일자리가</Line>
                          <Line><NoWrap>등록되어 있어요</NoWrap></Line>
                        </HeroLine>
                        <GlassButton onClick={_handleWorkRegister}>일감 등록하기</GlassButton>
                      </HeroTexts>
                      <HeroFigure><HeroCharacter src={imageDB.seekcharacter} /></HeroFigure>
                    </WorkBannerBox>

                    <BannerCard onClick={_handleRegiserConfess}>
                      <img src={imageDB.ic_myinfo_menu_mypraise} style={{ width: 60, height: 60 }} />
                      <TextGroup>
                        <Title>우리동네 가게 응원해요!</Title>
                        <Subtitle>{'칭찬 한마디가 힘이 돼요. \n 응원카드 만들어서 응원해주세요'}</Subtitle>
                      </TextGroup>
                    </BannerCard>

                    <Row style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 12, marginTop: 40 }}>
                      <SectionTitle style={{ marginBottom: "unset" }}>일자리 모음</SectionTitle>

                        <EditToggle
                        variant="hire"
                        isEditing={isEditing}
                        onClick={() => {
                          setIsEditing(!isEditing);
                          setOpen(true);
                        }}
                      />

                      {open && (
                        <CategoryEditSheet
                          open={open}
                          onClose={() => setOpen(false)}
                          visibleKeys={jobVisibleKeys}     
                          items={DEFAULT_ITEMS}
                          countsMap={nearCounts}
                          onSaved={handleJobCategorySaved}
                        />
                      )}
                    </Row>

                    <JobCategoryGrid
                      items={DEFAULT_ITEMS}
                      visibleKeys={jobVisibleKeys}        // ✅ 일자리용 키
                      countsMap={nearCounts}
                      isLoading={true}
                    />

                    <Section>
                      <BannerSlide width={width - 40} />
                    </Section>
                  </>
                )}
              </>
            </Lineup>

            <div style={{ height: 20 }} />
          </Column>

          <MobileStoreInfo containerStyle={{ marginBottom: 50 }} />
        </Container>
      </div>

      <Toaster position="bottom-right" richColors />
    </>
  );
}

export default MobileMaincontainer;
