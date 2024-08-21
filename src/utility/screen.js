import { imageDB } from "./imageData"

export const PCMAINMENU={
    HOMEMENU : "홍여사",
    ROOMMENU : "공간대여",
    REGIONMENU : "내주변",
    COMMUNITYMENU : "커뮤니티",
    RANKINGMENU : "홍여사순위",
    CHATMENU : '채팅하기',
    ROOMGUIDE :"공간알아보기",
    EVENTMENU : "이벤트",
    REGISTMENU :"등록"
}

export const MOBILEMAINMENU={
    HOMEMENU : "홍여사",
    ROOMMENU : "공간대여",
    REGIONMENU : "내주변",
    COMMUNITYMENU : "커뮤니티",
    RANKINGMENU : "홍여사순위",
    CHATMENU : '채팅하기',
    ROOMGUIDE :"공간알아보기",
    EVENTMENU : "이벤트"
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
    {img : imageDB.sample20,img2 : imageDB.sample25, eventtype:EVENTTYPE.ATTENDANCE, desc : "매일매일 출석체크", date: "2024.08.01 ~ 2024.8.31"},
    {img : imageDB.sample21,img2 : imageDB.sample26, eventtype:EVENTTYPE.RULLET, desc : "무조건 당첨! 얼리버드 타임쿠폰 룰렛", date: "2024.08.01 ~ 종료시까지"},
    {img : imageDB.sample22,img2 : imageDB.sample27, eventtype:EVENTTYPE.NEWCUSTOMER, desc : "신규고객님을 위한 특별혜택", date: "2024.08.01 ~ 종료시까지"},
    {img : imageDB.sample23,img2 : imageDB.sample28, eventtype:EVENTTYPE.HONGLADYREGIST, desc : "홍여사 가입혜택", date: "2024.08.01 ~ 2024.09.01"},
    {img : imageDB.sample24,img2 : imageDB.sample29, eventtype:EVENTTYPE.HOTSUMMER, desc : "2024 핫썸머 이벤트", date: "2024.08.01 ~ 2024.09.31"},
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

export const  CHATIMAGETYPE = {
    HONGIMG : "홍여사관리",
    USERIMG : "사용자이미지",

}
  