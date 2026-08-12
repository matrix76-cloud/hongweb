import React, { Component, createRef, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { HashRouter, Route, Switch, Redirect, BrowserRouter, Routes, useLocation, useNavigate } from "react-router-dom";
import styled, { css, keyframes } from 'styled-components';
import { UserContext } from "../../context/User";
import moment from "moment";
import { imageDB, Seekgrayimage, Seekimage } from "../../utility/imageData";
import { BetweenRow, FlexEndRow, FlexstartRow, Row } from "../../common/Row";
import { checkExistingRoom, createVirtualWork, ReadWork, ReadWorkByIndividually } from "../../service/WorkService";
import { CommaFormatted } from "../../utility/money";
import { WORKSTATUS } from "../../utility/status";
import IconButton from "../../common/IconButton";
import { Column } from "../../common/Column";
import { DataContext } from "../../context/Data";
import { FaArrowLeft } from "react-icons/fa";

import "./Mobilemap.css"
import { Any } from "@react-spring/web";
import Button from "../../common/Button";
import PcFilterPopup from "../../modal/PcFilterPopup/PcFilterPopup";

import { IoSearchCircle } from "react-icons/io5";
import { ref } from "firebase/storage";
import { useSleep } from "../../utility/common";
import { REFRESHTYPE, REQUESTINFO, WORKNAME } from "../../utility/work";
import { CHATCONTENTTYPE, CONTACTTYPE, FILTERITMETYPE, PCMAINMENU } from "../../utility/screen";

import { useDispatch, useSelector } from "react-redux";
import { RESET } from "../../store/menu/MenuSlice";
import MobileServiceFilter from "../../modal/MobileServiceFilterPopup/MobileServiceFilter";
import { LoadingCommunityStyle } from "../../screen/css/common";
import { RiListView } from "react-icons/ri";

import { MdOutlineFilterAlt } from "react-icons/md";
import { getFontSize } from "../../utility/fontsize";

import { HiOutlinePlus } from "react-icons/hi2";
import { getNearbyWorkers, getWorkerByUserId } from "../../service/WorkerService";

import MobileWorkerPopup from "../../modal/MobileWorkerPopup";
import ReactDOMServer from 'react-dom/server';
import MobileWorkerMiniPopup from "../../modal/MobileWorkerMiniPopup";
import { Readuserbyusersid } from "../../service/UserService";
import { CreateChat, NewCreateMessage } from "../../service/ChatService";
import { CreateContact } from "../../service/ContactService";
import { Toaster, toast } from 'sonner';
import FilterOverlay from "../../modal/FilterOverlay";


const BRAND = "#7C3AED";      // violet-600
const BRAND_RGB = "124,58,237";

const Container = styled.div`

    padding: 50px 0px;
    height: 100%;
  
`
const mapstyle = {
  position: "absolute",
  overflow: "hidden",
  width:'100%',
};

const GuideLeftStyle={
  position:"absolute",
  right:'10px',
  top:'60px',
  zIndex:5,
  display:"flex",
  flexDrirection :"row",

}
const GuideRightStyle={
    position:"absolute",
    bottom:'20px',
    zIndex:5,
    display:"flex",
    flexDrirection :"row",
  
  }
const GuideTextStyle={
  background: '#a1a2a4a3',
  color: '#fff',
  padding: '5px 10px',
  fontSize: () => getFontSize(12),
}
const GuideButtonStyle={
  background: '#21A2FF',
  color: '#fff',
  padding: '5px 10px',
  marginRight:10,
  borderRadius: 10,
  width: '100px',
  fontSize: '12px',
  height: '20px',
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}

export const WorkItems = [
  { name: WORKNAME.HOMECLEAN, img: imageDB.house },
  { name: WORKNAME.BUSINESSCLEAN, img: imageDB.business },
  { name: WORKNAME.MOVECLEAN, img: imageDB.move },
  { name: WORKNAME.FOODPREPARE, img: imageDB.cook },
  { name: WORKNAME.ERRAND, img: imageDB.help },
  { name: WORKNAME.GOOUTSCHOOL, img: imageDB.gooutschool },
  { name: WORKNAME.BABYCARE, img: imageDB.babycare },
  { name: WORKNAME.LESSON, img: imageDB.lesson },
  { name: WORKNAME.PATIENTCARE, img: imageDB.patientcare },
  { name: WORKNAME.CARRYLOAD, img: imageDB.carry },
  { name: WORKNAME.GOHOSPITAL, img: imageDB.hospital },
  { name: WORKNAME.RECIPETRANSMIT, img: imageDB.recipe },
  { name: WORKNAME.GOSCHOOLEVENT, img: imageDB.schoolevent },
  { name: WORKNAME.SHOPPING, img: imageDB.shopping },
  { name: WORKNAME.GODOGHOSPITAL, img: imageDB.doghospital },
  { name: WORKNAME.GODOGWALK, img: imageDB.dog },
]

const FilterButtonLayer = styled.div`
  position: absolute;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 135px); // ✅ 최소 여백 + safe-area
  width: 100%;
  z-index: 2;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content:flex-end;
`
const ListButtonLayer = styled.div`
  position: absolute;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 90px); // ✅ 최소 여백 + safe-area
  width: 100%;
  z-index: 2;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content:flex-end;
`

const MapBox = styled.div`
border: 1px solid #cbcbcb;
background: ${({enable})=> enable == true ? ("#21A2FF") : ("#fff")};
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
padding : 0px 5px;
`

const MapBoxControl = styled.div`
  border: 1px solid #cbcbcb;
  background: ${({enable})=> enable == true ? ("#21A2FF") : ("#fff")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width:30px;
  height:30px;
  font-size: ${() => getFontSize(28)}px;
`

const MapBoxSpan = styled.div`
  font-size: ${() => getFontSize(9)}px;
  color: ${({enable})=> enable == true ? ("#fff") : ("#131313")};
`
const FloatingActionButton = styled.button`
  position: fixed;
  right: 3px;
  bottom: calc(env(safe-area-inset-bottom, 0px) + 135px);
  z-index: 2;

  display: inline-flex;
  align-items: center;


  padding: 5px 10px;
  border-radius: 9999px;
  font-weight: 700;
 font-size: ${() => getFontSize(15)}px !important;
  border: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: opacity .18s ease, transform .18s ease, box-shadow .18s ease, background .18s ease;
  &:active { transform: scale(.97); }
  opacity: ${({ $hidden }) => ($hidden ? 0 : 1)};
  transform: translate3d(0, ${({ $hidden }) => ($hidden ? '12px' : '0')}, 0);
  pointer-events: ${({ $hidden }) => ($hidden ? 'none' : 'auto')};
  will-change: transform, opacity;


  ${({ $variant }) => {
    switch ($variant) {
      case 'solid':
        return css`
          background: ${BRAND};
          color: #fff;
          box-shadow: 0 6px 16px rgba(${BRAND_RGB}, .28);
        `;
      case 'outline':
        return css`
          background: #fff;
          color: ${BRAND};
          border: 1.5px solid rgba(${BRAND_RGB}, .45);
          box-shadow: 0 6px 16px rgba(0,0,0,.08);
        `;
      case 'glass':
        return css`
          background: rgba(255,255,255,.78);
          color: ${BRAND};
          border: 1px solid rgba(255,255,255,.9);
          backdrop-filter: blur(10px) saturate(140%);
          box-shadow: 0 10px 24px rgba(0,0,0,.10);
        `;
      // 기본: 톤다운(tonal)
      default:
        return css`
          background: rgba(${BRAND_RGB}, .12);
          color: ${BRAND};
          border: 1px solid rgba(${BRAND_RGB}, .28);
          box-shadow: 0 6px 16px rgba(0,0,0,.08);
        `;
    }
  }}
`;

const FabIcon = styled.img`
  width: 32x;
  height: 32px;
  display: block;
  object-fit: contain;
  pointer-events: none; /* 클릭 이벤트는 버튼이 받도록 */
`;







const LoadingAnimationStyle={
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%"
}

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
  color : #131313;
`



  const ListButton = styled.div`
    background-color: #000000b0;
    width: 120px;
    height: 40px;
    display: flex;
    margin-left:5px;
    justify-content: center;
    align-items: center;
    justify-content: space-evenly;
    border-radius: 20px;
    point : cursor;

 
  `

const MarkerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: zoomIn 0.3s ease-out;

  @keyframes zoomIn {
    0% { transform: scale(0.8); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }
`;

const MarkerImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1px solid #666666; // ✅ 진회색 → 약간 부드러운 중간톤
  background-color: #fff;
  padding: 2px;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.25); // glow 효과 약간 약화
`;

const MarkerLabel = styled.div`
  margin-top: 4px;
  background-color: ${({ gender }) => gender === 'female' ? '#FF6B6B' : '#2D6FF7'};  // 🔥 여성 빨간색 / 남성 파랑
  color: #ffffff;  // ✅ 글자 항상 흰색
  font-size: ${() => getFontSize(11)}px !important;
  font-family: Pretendard-SemiBold;
  padding: 3px 8px;
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.15);
  white-space: nowrap;
  text-align: center;
`;



const ButtonWrapper = styled.button`
  position: fixed;
  bottom: 200px; /* 기존보다 70px 위 */
  right: 15px;
  z-index: 5;
  background-color: white;
  border: 2px solid #333;
  border-radius: 50%;
  width: 54px;
  height: 54px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color: #f7f7f7;
  }
`;

const StyledMarkerIcon = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ffffff;

  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledPlusBadge = styled.div`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 18px;
  height: 18px;
  background: #2D6FF7;
  color: #fff;
  font-size: 10px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.25);
`;

const WorkerCountBadge = styled.div`
  position: fixed;
  bottom: 90px;
  left: 16px;
  background: rgba(255, 255, 255, 0.85);
  color: #222;
  font-size: ${() => getFontSize(12)}px !important;
  font-weight: 500;
  padding: 6px 12px;
  border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,0.1);
  z-index: 3;
`;

const DismissLayer = styled.div`
  position: fixed;
  top: 52px;
  left: 0;
  width: 100%;
  height: calc(100% - 52px); // 헤더 높이 제외
  z-index: 5; // 마커보다 아래, 미니뷰보다 위
`;



// 🔽 애니메이션 정의
const slideUp = keyframes`
  from {
    transform: translateY(100%); // 화면 아래에서 시작
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// 🔽 적용할 박스 스타일
const SlideUpContainer = styled.div`
  animation: ${slideUp} 0.4s ease-out forwards;
`;

/**
/**
 * 카카오맵을 연동 하기 위해서 kakao 변수를 선언 해둔다
 */
const { kakao } = window;

const DetailLevel = 1;
const DetailMeter = 300;

const DEFAULT_LATITUDE = "37.5665";
const DEFAULT_LONGITUDE = "126.9780";

function getKoreanGender(gender) {
  if (!gender) return '미지정';
  const lower = gender.toLowerCase();
  if (lower === 'male') return '남성';
  if (lower === 'female') return '여성';
  return '기타';
}


const MobileWorkerMapcontainer = ({ containerStyle, showFilter, setShowFilter }) =>  {


  const mapRef = useRef(null);
  const mapDrawn = useRef(false);
  
  const { dispatch, user } = useContext(UserContext);

  const location = useLocation();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [displayitems, setDisplayitems] = useState([]);


  const [show, setShow] = useState(true);

  const [curmap, setCurMap] = useState({});

  const [currentloading, setCurrentloading] = useState(true);
  const [selectedMiniWorker, setSelectedMiniWorker] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);

  const [saving, setSaving] = useState(false);

  const itemRefs = useRef([]);

  // const [showFilter, setShowFilter] = useState(false);

  const [selectedCategories, setSelectedCategories] = useState(() => {

    console.log("selectedCategories  반영");

    const stored = localStorage.getItem('filter_categories');
    return stored ? JSON.parse(stored) : [];
  });
  
  const [selectedGenders, setSelectedGenders] = useState([]);
  const [selectedAges, setSelectedAges] = useState([]);




  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371; // km 기준
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getAgeGroup = (age) => {
    if (!age) return '30대';
    const clean = typeof age === 'string' && age.includes('대') ? age : String(age);
    const n = parseInt(clean);
    if (n < 20) return '10대';
    if (n < 30) return '20대';
    if (n < 40) return '30대';
    if (n < 50) return '40대';
    return '50대 이상';
  };
  

  
  const _handleWorkerRegister = async() => {
    const mapDiv = document.getElementById("map");
    if (mapDiv) {
      mapDiv.remove(); // ✅ 수동 제거
    }

    const workers = await getWorkerByUserId(user.USERS_ID);

    if (workers.length > 0) {
      // 이미 등록된 사용자 → 상세 페이지로 이동

      navigate("/Mobileworkeredit", { state: { worker: workers[0] } });

    } else {
      // 미등록 → 등록 페이지로 이동
      navigate('/Mobileworkerregist');
    }


  };
  


  // 📦 scroll 제어 유지
  useEffect(() => {
    document.documentElement.style.scrollbarGutter = 'stable';
    if (show) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);




  useEffect(() => {
    if (document.getElementById("map")) return; // 중복 방지

    const div = document.createElement("div");
    div.id = "map";
    Object.assign(div.style, {
      position: "fixed",
      top: "52px",          // ✅ 헤더만큼 내려줌
      left: "0px",
      width: "100%",
      height: "calc(100% - 64px - 65px)", // 64px(헤더) + 65px(푸터)
      zIndex: 1,
    });
    document.body.appendChild(div);


  }, []);


  useEffect(() => {

    const filters = {
      selectedCategories,
      selectedGenders,
      selectedAges,
 
    };

    console.log("📦 useEffect triggered with filters:", filters);

    MainListmapDraw(filters);
  }, [selectedCategories, selectedGenders, selectedAges]);



  const getMarkerType = (worker, filters) => {
    const { selectedCategories, selectedGenders, selectedAges } = filters;

    const workerTags = worker.tags || [];
    const inCategory = selectedCategories.length === 0
      ? true
      : selectedCategories.some(cat => workerTags.includes(cat));
    const inGender = selectedGenders.length === 0 || selectedGenders.includes(worker.gender);
    const inAge = selectedAges.length === 0 || selectedAges.includes(worker.ageGroup);


    // 🔥 이 부분이 핵심
    const filterCount =
      (selectedCategories.length > 0 ? 1 : 0) +
      (selectedGenders.length > 0 ? 1 : 0) +
      (selectedAges.length > 0 ? 1 : 0);

    if (filterCount <= 1) {
      if (inCategory) return 'category';
      if (inGender || inAge) return 'demo';
      return null;
    }

    if (inCategory && (inGender || inAge)) return 'both';
    if (inCategory) return 'category';
    if (inGender || inAge) return 'demo';

    return null;
  };
  

  // 📍 마커 렌더링 함수
  const renderMarker = (worker, map, filters, onClick) => {

    console.log('worker:', worker.latitude, worker.longitude, 'distance:', worker.distance);


    const markerType = getMarkerType(worker, filters);
    if (!markerType) {

      console.log("Marker Type 이 없습니다", worker);
      return;
    } 

    const container = document.createElement('div');
    let content;

    if (markerType === 'demo') {
      content = (
        <MarkerWrapper>
          <MarkerImage src={imageDB.hongladywebtoon} />
          {/* <MarkerLabel gender={worker.gender}>
            {getKoreanGender(worker.gender)} / {worker.ageGroup || '30대'}
          </MarkerLabel> */}
        </MarkerWrapper>
      );
    } else {
      const firstMatchedType = (worker.tags || [])[0];
  
      const matchedTag = (worker.tags || []).find(tag => filters.selectedCategories.includes(tag))
        || (worker.tags || [])[0];

      const matchedIcon = WorkItems.find(item => item.name === matchedTag);


      const iconUrl = matchedIcon ? matchedIcon.img : imageDB.hongladywebtoon;
      const showPlus = markerType === 'both';
  

      content = (
        <MarkerWrapper>
          <StyledMarkerIcon>
            <img src={iconUrl} width={28} height={28} />
            {showPlus && <StyledPlusBadge>+</StyledPlusBadge>}
          </StyledMarkerIcon>

          {/* <MarkerLabel gender={worker.gender}>
            {getKoreanGender(worker.gender)} / {worker.age || '30대'}
          </MarkerLabel> */}

        </MarkerWrapper>
      );
    }

    container.innerHTML = ReactDOMServer.renderToString(content);

    const customOverlay = new kakao.maps.CustomOverlay({
      position: new kakao.maps.LatLng(worker.latitude, worker.longitude),
      content: container,
      clickable: true,
    });

    customOverlay.setMap(map);

    container.addEventListener('click', () => onClick(worker));
  };

  // 📌 마커 전체 그리기 함수
  const drawAllMarkers = (workers, map, filters, setSelectedMiniWorker) => {
    workers.forEach((worker) => {
      if (worker.latitude && worker.longitude) {
        renderMarker(worker, map, filters, setSelectedMiniWorker);
      }
    });
  };

  // ✅ MainListmapDraw 내부 수정: 데이터 정제 포함
  const MainListmapDraw = async (passedFilters) => {
    const latitude = user.USERINFO.latitude;
    const longitude = user.USERINFO.longitude;

    // const rawWorkers = await getNearbyWorkers({ latitude, longitude });

    const rawWorkers = user.workeritems || []; // ✅ context에서 받기


    const filters = passedFilters;
    const filtered = rawWorkers.filter(worker => {
      const tags = worker.tags || [];
      const gender = worker.gender;
      const ageGroup = getAgeGroup(worker.age);
 
      const categoryMatch = filters.selectedCategories.length === 0 || filters.selectedCategories.some(c => tags.includes(c));
      const genderMatch =
        filters.selectedGenders.length === 0 ||
        filters.selectedGenders.includes(getKoreanGender(gender)); // 👈 이 부분 수정
      const ageMatch = filters.selectedAges.length === 0 || filters.selectedAges.includes(ageGroup);
      // const distanceMatch = distance <= filters.selectedDistance;

      return categoryMatch && genderMatch && ageMatch;
    });
   
    const workers = filtered.map(worker => {

      const ageGroup = getAgeGroup(worker.age);
      return {
        ...worker,
 
        ageGroup,
      };
    });

    setItems(workers);
    setDisplayitems(workers);

    const mapContainer = document.getElementById("map");
    const mapOption = {
      center: new kakao.maps.LatLng(latitude, longitude),
      level: 7,
    };
    const map = new kakao.maps.Map(mapContainer, mapOption);
    mapRef.current = map;

    const zoomControl = new kakao.maps.ZoomControl();
    map.addControl(zoomControl, kakao.maps.ControlPosition.TOPRIGHT);

    const coords = new kakao.maps.LatLng(latitude, longitude);
    const circle = new kakao.maps.Circle({
      center: coords,
      radius: 10000,
      strokeWeight: 2,
      strokeColor: "#ff4e19",
      strokeOpacity: 1,
      strokeStyle: "dashed",
    });
    circle.setMap(map);

    drawAllMarkers(filtered, map, filters, setSelectedMiniWorker);

    setCurMap(map);
  };
  

  const _handleList = () => {
    const mapDiv = document.getElementById("map");
    if (mapDiv) {
      mapDiv.remove(); // ✅ 수동 제거
    }

    navigate("/Mobileworkerlist" ,{state :{WORK_ID :"", TYPE : ""}});
  }

  const DetailCallback = (data) => {

    console.log("DetailCallback", data);

    setSelectedMiniWorker(null);

    setSelectedWorker(data);
  }

  const onChat = async () => {
    
    const SUPPORTER = selectedMiniWorker || selectedWorker;

    const OWNER = user;

    if (!SUPPORTER || !OWNER) return;

    console.log("TCL: onChat -> OWNER", OWNER);
    console.log("TCL: onChat -> SUPPORTER", SUPPORTER);

    // 1. 자기 자신 방지
    if (OWNER.USERS_ID === SUPPORTER.users_id) {
      toast.info("본인에게는 채팅을 시작할 수 없습니다.");
      return;
    }

    // 2. 기존 채팅방 있는지 확인
    const CHAT_ID = await checkExistingRoom({
      OWNER_ID: OWNER.USERS_ID,
      SUPPORTER_ID: SUPPORTER.users_id,
    });

    console.log("TCL: onChat -> CHAT_ID", CHAT_ID);

    if (CHAT_ID) {
      _handleChat();
      return;
    }

    // 3. 가상 일감 생성
    const { id: WORK_ID, WORK_INFO } = await createVirtualWork({ OWNER });

    if (WORK_ID === -1) {
      toast.error("일감 생성 실패. 잠시 후 다시 시도해주세요.");
      return;
    }

    console.log("TCL: onChat -> WORK_ID", WORK_ID);
    // 4. 기존 채팅 흐름 호출
    await ChatRequestComplete(WORK_ID, SUPPORTER, WORK_INFO); // SUPPORTER 인자 추가해야 될 수도 있음
  }

  const ChatRequestComplete = async (WORK_ID, SUPPORTER, WORK_INFO) => {


    const WORK_DATA = await ReadWorkByIndividually({ WORK_ID });

    console.log("reqcomplete", WORK_DATA);


    const OWNER = await Readuserbyusersid({ USERS_ID: WORK_DATA.USERS_ID });

    console.log("OWNER", OWNER);
    console.log("SUPPORTER", SUPPORTER);
    const OWNER_ID = OWNER.USERS_ID;
    const SUPPORTER_ID = SUPPORTER.users_id;

  
    // ✅ 지원자 전체 정보 조회
    const SUPPORTER_INFO = await Readuserbyusersid({ USERS_ID: SUPPORTER_ID });


    if (!SUPPORTER_INFO || !SUPPORTER_INFO.USERS_ID || !SUPPORTER_INFO.USERINFO) {
      alert("해당 지원자의 정보가 없습니다.");
      return;
    }

    const TYPE = PCMAINMENU.HOMEMENU;

    const INFO = {
      ...WORK_DATA,
      isVirtualWork: true
    };

    const CHAT_ID = await CreateChat({
      OWNER, OWNER_ID, SUPPORTER: SUPPORTER_INFO, SUPPORTER_ID, INFO, TYPE,
    });

    const CONTACT_INFO = WORK_INFO;
    const createcontact = await CreateContact({
      OWNER_ID, SUPPORTER_ID, CONTACT_STATUS: CONTACTTYPE.INIT,
      CONTACT_INFO, ID: CHAT_ID, RIGHT_SIGN: "", WORKTYPE: TYPE,
    });

    const CHAT_CONTENT_TYPE = CHATCONTENTTYPE.ENTER;
    const read = [user.USERS_ID, SUPPORTER_ID];
    const msg = `${OWNER.USERINFO.nickname}님이 대화를 시작하였습니다.`;

    await NewCreateMessage({
      CHAT_ID,
      msg,
      users_id: user.USERS_ID,
      read,
      CHAT_CONTENT_TYPE,
      AlarmTarget_ID: SUPPORTER_ID
    });

    _handleChat();

  };

  
  const _handleChat = () => {
    const mapDiv = document.getElementById("map");
    if (mapDiv) {
      mapDiv.remove(); // ✅ 수동 제거
    }
    navigate("/Mobilechat");
  }

  const getMatchedCount = (filters) => {
    const {
      selectedCategories,
      selectedGenders,
      selectedAges,
      selectedDistance,
    } = filters;

    return items.filter((user) => {
      const matchCategory =
        selectedCategories.length === 0 ||
        (user.tags || []).some(tag => selectedCategories.includes(tag));

      const matchGender =
        selectedGenders.length === 0 ||
        selectedGenders.includes(getKoreanGender(user.gender));

      const matchAge =
        selectedAges.length === 0 ||
        selectedAges.includes(user.ageGroup); // ✅ 이미 ageGroup이 붙어있음


      return matchCategory && matchGender && matchAge;
    }).length;
  };
  


  return (
    <>

        <Container style={containerStyle}>
          <Row>
            <div style={{display:"flex", width:'100%'}}>

            {selectedMiniWorker && (
              <>
                <DismissLayer onClick={() => setSelectedMiniWorker(null)} />
                <MobileWorkerMiniPopup
                  data={selectedMiniWorker}
                  onClose={() => setSelectedMiniWorker(null)}
                  onChat={() => {
                    onChat();
                  }}
                  onDetail={DetailCallback}
                />
              </>
  
            )}

            {selectedWorker && (
              <>
       
                <MobileWorkerPopup
                  data={selectedWorker} // ✅ 실제 data
                  onChat={() => {
                    onChat();
                  }}
                  onClose={() => setSelectedWorker(null)}
                />
              
              </>

            )}

            </div>  
          </Row>
    
  


        <ListButtonLayer>
            <ListButton onClick={_handleList}>
            <RiListView size={18} color={'#fff'} />
            <div style={{ fontSize: () => getFontSize(16), color:"#fff"}}>리스트보기</div>
            </ListButton>
        </ListButtonLayer>
        {/* <FloatingAddButton onClick={_handleWorkerRegister}>
          <HiOutlinePlus size={28} color="#4F8BFF" />
          <Tooltip>아르바이트에 지원 해보세요</Tooltip>
        </FloatingAddButton> */}



        <FloatingActionButton
          $variant="outline"  
          aria-label="알바지원"
          onClick={_handleWorkerRegister}
        >
        <FabIcon src={imageDB.seekcharacter} alt="" />
        알바지원
        </FloatingActionButton>


        <WorkerCountBadge>총 {displayitems.length}명의 일할 사람이 근처에 있어요</WorkerCountBadge>

    
      </Container>
      <FilterOverlay
        show={showFilter}
        getMatchedCount={getMatchedCount}
        onClose={() => setShowFilter(false)}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        selectedGenders={selectedGenders}
        setSelectedGenders={setSelectedGenders}
        selectedAges={selectedAges}
        setSelectedAges={setSelectedAges}/>
      <Toaster position="bottom-right" richColors />
    </>
  


  );

}

export default MobileWorkerMapcontainer;

