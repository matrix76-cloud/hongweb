import { imageDB } from "./imageData"



export const PCMAINMENU={
    HOMEMENU : "홍여사",
    ROOMMENU : "공간대여",
    REGIONMENU : "내주변",
    RANKINGMENU : "홍여사순위",
    CHATMENU : '채팅하기',
    ROOMGUIDE :"공간알아보기",
    EVENTMENU : "이벤트",
    REGISTMENU :"등록",
    LIVEINFORMATIONMENU: "커뮤니티",
}

export const MOBILEMAINMENU={
    HOMEMENU : "홍여사",
    ROOMMENU : "공간대여",
    REGIONMENU : "내주변",
    COMMUNITYMENU : "커뮤니티",
    RANKINGMENU : "홍여사순위",
    CHATMENU : '채팅하기',
    ROOMGUIDE :"공간알아보기",
    EVENTMENU : "이벤트",
    CONFIGMENU : "내정보"
}


export const PCCOMMNUNITYMENU={
    ALLITEM:"전체보기",
    DAILYITEM:"일상생각",
    PARENTMARRIAGEITEM:"육아결혼",
    PASSIONITEM:"패션미용",
    INTERIORITEM:"인테리어DIY",
    RECIPEITEM:"요리레시피",
    CULTUREITEM:"원예재배",
    HOBBYITEM :"취미",
    PERFORMANCEITEM:"공연정보"

}

export const PCDAYMENU ={
    ALLDAYS : "매일",
    ALLWEEKS : "매주"
}


export const OPTIONTYPE={
    COMMNUNITYOPTION: "커뮤니케이션",
    DAYOPTION :"기간설정"
}


export const COMMNUNITYOPTION = [
    { value:  PCCOMMNUNITYMENU.DAILYITEM, name: PCCOMMNUNITYMENU.DAILYITEM },
    { value:  PCCOMMNUNITYMENU.PARENTMARRIAGEITEM, name: PCCOMMNUNITYMENU.PARENTMARRIAGEITEM },
    { value:  PCCOMMNUNITYMENU.PASSIONITEM, name: PCCOMMNUNITYMENU.PASSIONITEM },
    { value:  PCCOMMNUNITYMENU.INTERIORITEM, name: PCCOMMNUNITYMENU.INTERIORITEM },
    { value:  PCCOMMNUNITYMENU.RECIPEITEM, name: PCCOMMNUNITYMENU.RECIPEITEM },
    { value:  PCCOMMNUNITYMENU.CULTUREITEM, name: PCCOMMNUNITYMENU.CULTUREITEM },
    { value:  PCCOMMNUNITYMENU.HOBBYITEM, name: PCCOMMNUNITYMENU.HOBBYITEM },
    { value:  PCCOMMNUNITYMENU.PERFORMANCEITEM, name: PCCOMMNUNITYMENU.PERFORMANCEITEM },
]

export const  DAYOPTION = [
    { value:  PCDAYMENU.ALLDAYS, name: PCDAYMENU.ALLDAYS },
    { value:  PCDAYMENU.ALLWEEKS, name: PCDAYMENU.ALLWEEKS },

]



export const EVENTTYPE={
    ATTENDANCE : "출석체크이벤트",
    RULLET : "타임룰렛이벤트",
    NEWCUSTOMER :"신규고객이벤트",
    HONGLADYREGIST : "홍여사가입이벤트",
    HOTSUMMER : "핫썸머이벤트"
}



export const EventItems = [
    {img : imageDB.sample20,img2 : imageDB.sample25, eventtype:EVENTTYPE.ATTENDANCE, desc : "매일매일 출석체크", date: "2024.08.01 ~ 종료시까지"},
    {img : imageDB.sample21,img2 : imageDB.sample26, eventtype:EVENTTYPE.RULLET, desc : "무조건 당첨! 얼리버드 타임쿠폰 룰렛", date: "2024.08.01 ~ 종료시까지"},
    {img : imageDB.sample22,img2 : imageDB.sample27, eventtype:EVENTTYPE.NEWCUSTOMER, desc : "신규고객님을 위한 특별혜택", date: "2024.08.01 ~ 종료시까지"},

]

export const LoadingType = [
    {CURRENTPOS : "위치 재검색", REDIRECTPATH : "/PCmain"},
    {AI : "AI 검색", REDIRECTPATH : ""},

]

export const LAWTYPE={
    USELAW : "이용약관",
    GPSLAW : "위치 서비스 이용약관",
    PRIVACYLAW : "개인정보 처리방침",
}

export const CENTERTYPE={
    NOTICE : "공지사항",
    FREQ :"자주묻는질문",
    KAKAO : "1:1 카카오문의",
    CONSULTANT :"상담원연결"

}

export const FILTERITMETYPE={
    HONG : "홍여사",
    ROOM : "공간대여",
    MAP : "내주변"
}

export const FILTERITEMMONEY ={
    ONE : "3만원 이하",
    TWO : "3만원 이상 ~ 4만원 이하",
    THREE : "4만원 이상 ~ 5만원 이하",
    FOUR : "5만원 이상 ~ 6만원 이하",
    FIVE : "6만원 이상 ~ 8만원 이하",
    SIX : "8만원 이상",
}
export const FILTERITEMPERIOD ={
    ONE : "전체기간",
    TWO : "D+1일 까지",
    THREE : "D+2일 까지",
    FOUR : "D+3일 까지",
    FIVE : "D+5일 까지",
    SIX : "D+6일 까지",

}

export const FILTERITEMDISTANCE ={
    ONE : "1km 내외",
    TWO : "2km 내외",
    THREE : "3km 내외",
    FOUR : "4km 내외",
    FIVE : "5km 내외",
    SIX : "6km 내외",

}
export const FILTERITEMPROCESS ={
    OPEN : "진행",
    CLOSE : "마감",
}


export const  CHATIMAGETYPE = {
    HONGIMG : "홍여사관리",
    USERIMG : "사용자이미지",

}

export const INCLUDEDISTANCE = "5";
export const CHECKDISTANCE = "5";

export const PROFILEIMAGE ="https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/images%2Fperson.png?alt=media&token=0413209a-88c0-4893-b0f4-1f0bb94fb992";
  

export const CHATCONTENTTYPE ={
    ENTER :"입장",
    EXIT : "퇴장",
    TEXT : "대화",
    IMAGE :"이미지",
    FILE : "파일"
}


export const CONTACTTYPE ={
    OWNER :"의뢰자서명완료",
    SUPPROTER : "홍여사서명완료",
    PAY : "결재완료",
    COMPLETE :"작업완료",
    ESCROCOMPLETE: "정산완료"
}

export const CHATSELECTFILTER ={
	ALL : "전체",
    OWNER : "내가 의뢰한",
    SUPPORT : "나한테 지원한",
    UNREAD : "안 읽은 채팅방"
}

export const CONFIGMOVE = {
    PROFILECONFIG: "프로필",
    PROFILENAME: "프로필이름변경",
    PROFILEBADGE: "활동뱃지",
    WORKERINFO: "홍여사등록",
    WORKERAUTH: "신분증인증",
    EVENTVIEW: "이벤트보기",
    LAWPOLICY:"이용약관",
    LAWPRIVACY :"개인정보 처리지침",
    LAWGPS :"위치정보기반 수집동의 규정"
}