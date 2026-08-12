
export const WORKNAME={
    ALLWORK : '전체보기',
    // 청소
    HOMECLEAN : '집 청소',
    BUSINESSCLEAN : '사무실 청소',
    MOVECLEAN : '이사 청소',
    // 집안일
    FOODPREPARE : '식사 준비',
    SHOPPING : '장봐주기',
    CARRYLOAD : '짐 나르기',
    ERRAND : '심부름',
    // 아이
    BABYCARE : '아이돌봄',
    GOOUTSCHOOL : '등원하원',
    LESSON : '아이레슨',
    GOSCHOOLEVENT : '학교행사',
    // 돌봄
    PATIENTCARE : '간병하기',
    GOHOSPITAL : '병원가기',
    // 반려
    GODOGWALK : '애견산책',
    GODOGHOSPITAL : '애견 병원',
}

// 구 표기 -> 현재 표기. 이름을 정비하기 전에 저장된 일감(WORKTYPE)을 흡수한다.
// null = 폐지된 항목(요리비법 — 사람을 구하는 일이 아니라 콘텐츠였다. CORE.md)
export const LEGACY_WORKNAME = {
    '사무실청소': '사무실 청소',
    '이사청소': '이사 청소',
    '식사준비': '식사 준비',
    '집안수리': '짐 나르기',
    '도와주기': '심부름',
    '애견돌봄': '애견 병원',
    '요리비법': null,
}

export const normalizeWorkName = (name) => {
    if (!name) return name;
    if (Object.prototype.hasOwnProperty.call(LEGACY_WORKNAME, name)) {
        return LEGACY_WORKNAME[name] || name;
    }
    return name;
}

export const REFRESHTYPE= "REFRESH";
export const RESETTYPE= "RESET";

export const WORKPOLICY ={
    HOMECLEAN :9,
    BUSINESSCLEAN :12,
    MOVECLEAN :12,
    FOODPREPARE :13,
    ERRAND :9,
    GOOUTSCHOOL :11,
    BABYCARE :12,
    LESSON :12,
    PATIENTCARE :12,
    CARRYLOAD :10,
    GOHOSPITAL :12,
    GOSCHOOLEVENT :9,
    SHOPPING :10,
    GODOGHOSPITAL :10,
    GODOGWALK :10,
}




export const WORK_INFO= {
    WORKTYPE :"",
    REQUESTCONTENT :"",
    WORKKEYWORD:[],
    REGION:"",
    DATE:"",
    PRICE:"",
    LATITUDE:"",
    LONGITUE:""

}

export const REQUESTINFO={
    // 2026-08-12 추가 — 홍여사가 지원 여부를 판단하는 데 필요한 정보
    PET : "반려동물",
    TOOL : "청소도구",
    FLOOR : "층수",
    MOVETIMING : "이사 시점",
    MEALCOUNT : "식사 인원",
    INGREDIENT : "재료 준비",
    BUDGET : "예상 금액",
    PAYMENT : "결제 방법",
    TRANSPORT : "이동 수단",
    LOADSIZE : "짐 규모",
    CHILDAGE : "아이 나이",
    CHILDCOUNT : "아이 인원",
    SCHOOLTRIP : "등하원 구분",
    SUBJECT : "과목",
    GRADE : "학년",
    EVENTTYPE : "행사 종류",
    MOBILITY : "거동 상태",
    CAREPLACE : "돌봄 장소",
    ACCOMPANY : "동행 범위",
    DOGSIZE : "반려견 크기",
    DOGCOUNT : "반려견 수",
    PERIOD : "주기",
    DATE : "일자",
    MONEY : "금액",
    TARGET : "대상",
    TIMEMONEY : "시간과 금액",
    TARGETAREA : "대상평수",
    TIME : "시간",
    CLEANINGTIME: "요청시간대",
    CUSTOMERGENDER : "고객님성별",
    HELP: "홍여사성별과연령대",
    HELPGENDER : "홍여사성별",
    HELPAGE : "요청연령대",
    CUSTOMERREGION :"지역",
    COMMENT :"요구사항",
    ROOM :"짐보관할 장소",
    ROOMCHECK :"짐확인"
}



/**
 * ! ① type : initialize(초기값), request(일반요청),
 * ! requestdate(날짜요청), requestregion(지역요청), requestcomplete(완료)
 * ! ② show : 보여줄지 말지 결정 보여줄거면  true
 * ! ③ index : 순번
 * ! ④ info : 내용
 * ! ⑤ selected :  선택했으면  true
 * ! ⑥ multiselect_enable : 선택지가 다중으로 가능하면 true
 * ! ⑦ selectitems : 선택 할 대상들 배열
 * 
 * ! ① type : response(응답)
 * ! ② show : 보여줄지 말지 결정 보여줄거면  true
 * ! ③ index : 순번
 * ! ④ info : 내용
 * ! ⑤ requesttype : 어떤 대상인지 설정
 * ! responseshow : true 일때만 확인 화면이 나오도록 하자
 * ! ⑥ result : 고객이 선택한 값을 설정한다
 * 
 */
export const Requestcleanmessages =[

    {
     type:"initialize", 
     show:true, 
     index:1, 
     info:"몇가지 정보만 알려주시면 실시간으로 견적을 받을수 있어요",
     selected: false,
     multiselect_enable: false,
     selectitems :[
       {selected : false, key:"",request:"", response:""}
     ]
    },
    {
      type:"request", 
      show:false, 
      index:2, 
      info:"언제마다 청소하시기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"정기적", request:"정기적", response:"정기적"},
        {selected : false, key:"1회만", request:"1회만", response:"1회만"}
      ]
    },
    {type:"response", responseshow : true, show:false, index:3, requesttype:REQUESTINFO.PERIOD,  result:""},
  
    {
      type:"requestdate", 
      show:false, 
      index:4,
      info:"청소하는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:5, requesttype:REQUESTINFO.DATE,  result:""},

    {
      type:"requesttarget", 
      show:false, 
      index:6, 
      info:"청소가 필요한 곳의 대상과 범위을 선택해주세요",
      selected : false,
      multiselect_enable:true, 
      targetpositionselectitems:[
        {selected : false, key:"아파트", request:"아파트", response:"아파트"},
        {selected : false, key:"빌라", request:"빌라", response:"빌라"},
        {selected : false, key:"단독주택", request:"단독주택", response:"단독주택"},
        {selected : false, key:"오피스텔", request:"오피스텔", response:"오피스텔"},],
      targetareaselectitems:[
        {selected : false, key:"10평미만", request:"10평미만", response:"10평미만"},
        {selected : false, key:"10평대", request:"10평대", response:"10평대"},
        {selected : false, key:"20평대", request:"20평대", response:"20평대"},
        {selected : false, key:"30평대", request:"30평대", response:"30평대"},
        {selected : false, key:"40평대", request:"40평대", response:"40평대"},
        {selected : false, key:"50평대", request:"50평대", response:"50평대"},]
    },
  
  
    {type:"response", responseshow : true, show:false, index:7, requesttype:REQUESTINFO.TARGET,  result:""},
  
    {
      type:"requesttimemoney", 
      show:false, 
      index:8, 
      info:"청소시간을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      timeselectitems:[
      {selected : false, key:"3시간", request:"3시간", response:"3시간"},
      {selected : false, key:"4시간", request:"4시간", response:"4시간"},
      {selected : false, key:"5시간", request:"5시간", response:"5시간"},
      {selected : false, key:"청소끝날때까지", request:"하루종일", response:"하루종일"},],

      moneyselectitems:[
        {selected : false, key:"최저임금", request:"최저임금", response:"최저임금"},
        {selected : false, key:"3만원대", request:"3만원대", response:"3만원대"},
        {selected : false, key:"4만원대", request:"4만원대", response:"4만원대"},
        {selected : false, key:"5만원대", request:"5만원대", response:"5만원대"},
        {selected : false, key:"6만원대", request:"6만원대", response:"6만원대"},
        {selected : false, key:"협의필요", request:"협의필요", response:"협의필요"},],
    },
  
    {type:"response", responseshow : true, show:false, index:9,requesttype:REQUESTINFO.TIMEMONEY, result:""},

    {
      type:"requesthelp", 
      show:false, 
      index:10, 
      info:"도움주실분의 원하는 성별 과 연령대를 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      helpgenderselectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"여성", request:"여성", response:"여성"},],
      helpageselectitems:[
        {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
        {selected : false, key:"20대", request:"20대", response:"20대"},
        {selected : false, key:"30대", request:"30대", response:"30대"},
        {selected : false, key:"40대", request:"40대", response:"40대"},
        {selected : false, key:"50대", request:"50대", response:"50대"},
        {selected : false, key:"60대", request:"60대", response:"60대"},]
  
    },
  
    {type:"response", responseshow : true, show:false, index:11,requesttype:REQUESTINFO.HELP, result:""},
  
  
    {
      type:"requestregion", 
      show:false, 
      index:12,
      info:"도움이 필요한곳의 지역을 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:13, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},

        {
      type:"request",
      show:false,
      index:14,
      info:"반려동물을 키우시나요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"없음", request:"없음", response:"없음"},
        {selected : false, key:"강아지", request:"강아지", response:"강아지"},
        {selected : false, key:"고양이", request:"고양이", response:"고양이"},
        {selected : false, key:"그 외", request:"그 외", response:"그 외"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:15, requesttype:REQUESTINFO.PET,  result:""},

    {
      type:"request",
      show:false,
      index:16,
      info:"청소도구와 세제는 준비되어 있나요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"집에 있어요", request:"집에 있어요", response:"집에 있어요"},
        {selected : false, key:"홍여사가 준비해주세요", request:"홍여사가 준비해주세요", response:"홍여사가 준비해주세요"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:17, requesttype:REQUESTINFO.TOOL,  result:""},

{
      type:"requestcomment", 
      show:false, 
      index:18,
      info:"도움이 필요한내용을 적어주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:19, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},
  
    {type:"requestcomplete", show: false, index:20, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestbusinesscleanmessages =[

    {
     type:"initialize", 
     show:true, 
     index:1, 
     info:"몇가지 정보만 알려주시면 실시간으로 견적을 받을수 있어요",
     selected: false,
     multiselect_enable: false,
     selectitems :[
       {selected : false, key:"",request:"", response:""}
     ]
    },
    {
      type:"request", 
      show:false, 
      index:2, 
      info:"언제마다 청소하시기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"정기적", request:"정기적", response:"정기적"},
        {selected : false, key:"1회만", request:"1회만", response:"1회만"}
      ]
    },
    {type:"response", responseshow : true, show:false, index:3, requesttype:REQUESTINFO.PERIOD,  result:""},
  
    {
      type:"requestdate", 
      show:false, 
      index:4,
      info:"청소하는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:5, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:6, 
      info:"청소금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"최저임금", request:"최저임금", response:"최저임금"},
        {selected : false, key:"2만원대", request:"2만원대", response:"2만원대"},
        {selected : false, key:"3만원대", request:"3만원대", response:"3만원대"},
        {selected : false, key:"4만원대", request:"4만원대", response:"4만원대"},
        {selected : false, key:"5만원대", request:"5만원대", response:"5만원대"},
        {selected : false, key:"6만원대", request:"6만원대", response:"6만원대"},
        {selected : false, key:"7만원대", request:"7만원대", response:"7만원대"},
        {selected : false, key:"8만원대", request:"8만원대", response:"8만원대"},
        {selected : false, key:"9만원대", request:"9만원대", response:"9만원대"},
        {selected : false, key:"10만원대", request:"10만원대", response:"10만원대"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:7, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:8, 
      info:"청소가 필요한 곳을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"사무실", request:"사무실", response:"사무실"},
        {selected : false, key:"상가", request:"상가", response:"상가"},]
    },
  
  
    {type:"response", responseshow : true, show:false, index:9, requesttype:REQUESTINFO.TARGET,  result:""},
  
    {
      type:"request", 
      show:false, 
      index:10, 
      info:"청소할곳이 몇평인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"10평미만", request:"10평미만", response:"10평미만"},
      {selected : false, key:"10평대", request:"10평대", response:"10평대"},
      {selected : false, key:"20평대", request:"20평대", response:"20평대"},
      {selected : false, key:"30평대", request:"30평대", response:"30평대"},
      {selected : false, key:"40평대", request:"40평대", response:"40평대"},
      {selected : false, key:"50평대", request:"50평대", response:"50평대"},]},
  
      {type:"response", responseshow : true, show:false, index:11, requesttype:REQUESTINFO.TARGETAREA,  result:""},
  
    {
      type:"request", 
      show:false, 
      index:12, 
      info:"청소시간을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"3시간", request:"3시간", response:"3시간"},
      {selected : false, key:"4시간", request:"4시간", response:"4시간"},
      {selected : false, key:"5시간", request:"5시간", response:"5시간"},
      {selected : false, key:"청소끝날때까지", request:"하루종일", response:"하루종일"},]},
  
    {type:"response", responseshow : true, show:false, index:13,requesttype:REQUESTINFO.TIME, result:""},
  
    {
      type:"request", 
      show:false, 
      index:14, 
      info:"청소하는 시간대는 언제가 좋을까요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"협의가능", request:"협의가능", response:"협의가능"},
        {selected : false, key:"오전시간", request:"오전시간", response:"오전시간"},
        {selected : false, key:"오후시간", request:"오후시간", response:"오후시간"},
        {selected : false, key:"저녁시간", request:"저녁시간", response:"저녁시간"},]},
  
    {type:"response", responseshow : true, show:false, index:15,requesttype:REQUESTINFO.CLEANINGTIME, result:""},
  
  
  
    {
      type:"request", 
      show:false, 
      index:16, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:17,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:18, 
      info:"도움주실분의 연령대을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"20대", request:"20대", response:"20대"},
      {selected : false, key:"30대", request:"30대", response:"30대"},
      {selected : false, key:"40대", request:"40대", response:"40대"},
      {selected : false, key:"50대", request:"50대", response:"50대"},
      {selected : false, key:"60대", request:"60대", response:"60대"},
    ]},
  
    {type:"response", responseshow : true, show:false, index:19,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:20,
      info:"도움이 필요한곳의 지역을 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:21, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
        {
      type:"request",
      show:false,
      index:22,
      info:"건물 층수와 엘리베이터를 알려주세요",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"1층", request:"1층", response:"1층"},
        {selected : false, key:"엘리베이터 있음", request:"엘리베이터 있음", response:"엘리베이터 있음"},
        {selected : false, key:"2~3층 계단", request:"2~3층 계단", response:"2~3층 계단"},
        {selected : false, key:"4층 이상 계단", request:"4층 이상 계단", response:"4층 이상 계단"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:23, requesttype:REQUESTINFO.FLOOR,  result:""},

{
      type:"requestcomment", 
      show:false, 
      index:24,
      info:"도움이 필요한내용을 적어주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:25, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:26, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestmovecleanmessages =[

    {
     type:"initialize", 
     show:true, 
     index:1, 
     info:"몇가지 정보만 알려주시면 실시간으로 견적을 받을수 있어요",
     selected: false,
     multiselect_enable: false,
     selectitems :[
       {selected : false, key:"",request:"", response:""}
     ]
    },
    {
        type:"request", 
        show:false, 
        index:2, 
        info:"언제마다 청소하시기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:3, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:4,
      info:"청소하는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:5, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:6, 
      info:"청소금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"최저임금", request:"최저임금", response:"최저임금"},
        {selected : false, key:"2만원대", request:"2만원대", response:"2만원대"},
        {selected : false, key:"3만원대", request:"3만원대", response:"3만원대"},
        {selected : false, key:"4만원대", request:"4만원대", response:"4만원대"},
        {selected : false, key:"5만원대", request:"5만원대", response:"5만원대"},
        {selected : false, key:"6만원대", request:"6만원대", response:"6만원대"},
        {selected : false, key:"7만원대", request:"7만원대", response:"7만원대"},
        {selected : false, key:"8만원대", request:"8만원대", response:"8만원대"},
        {selected : false, key:"9만원대", request:"9만원대", response:"9만원대"},
        {selected : false, key:"10만원대", request:"10만원대", response:"10만원대"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:7, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:8, 
      info:"청소가 필요한 곳을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"사무실", request:"사무실", response:"사무실"},
        {selected : false, key:"상가", request:"상가", response:"상가"},]
    },
  
  
    {type:"response", responseshow : true, show:false, index:9, requesttype:REQUESTINFO.TARGET,  result:""},
  
    {
      type:"request", 
      show:false, 
      index:10, 
      info:"청소할곳이 몇평인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"10평미만", request:"10평미만", response:"10평미만"},
      {selected : false, key:"10평대", request:"10평대", response:"10평대"},
      {selected : false, key:"20평대", request:"20평대", response:"20평대"},
      {selected : false, key:"30평대", request:"30평대", response:"30평대"},
      {selected : false, key:"40평대", request:"40평대", response:"40평대"},
      {selected : false, key:"50평대", request:"50평대", response:"50평대"},]},
  
      {type:"response", responseshow : true, show:false, index:11, requesttype:REQUESTINFO.TARGETAREA,  result:""},
  
    {
      type:"request", 
      show:false, 
      index:12, 
      info:"청소시간을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"3시간", request:"3시간", response:"3시간"},
      {selected : false, key:"4시간", request:"4시간", response:"4시간"},
      {selected : false, key:"5시간", request:"5시간", response:"5시간"},
      {selected : false, key:"청소끝날때까지", request:"하루종일", response:"하루종일"},]},
  
    {type:"response", responseshow : true, show:false, index:13,requesttype:REQUESTINFO.TIME, result:""},
  
    {
      type:"request", 
      show:false, 
      index:14, 
      info:"청소하는 시간대는 언제가 좋을까요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"협의가능", request:"협의가능", response:"협의가능"},
        {selected : false, key:"오전시간", request:"오전시간", response:"오전시간"},
        {selected : false, key:"오후시간", request:"오후시간", response:"오후시간"},
        {selected : false, key:"저녁시간", request:"저녁시간", response:"저녁시간"},]},
  
    {type:"response", responseshow : true, show:false, index:15,requesttype:REQUESTINFO.CLEANINGTIME, result:""},
  
  
  
    {
      type:"request", 
      show:false, 
      index:16, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:17,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:18, 
      info:"도움주실분의 연령대을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"20대", request:"20대", response:"20대"},
      {selected : false, key:"30대", request:"30대", response:"30대"},
      {selected : false, key:"40대", request:"40대", response:"40대"},
      {selected : false, key:"50대", request:"50대", response:"50대"},
      {selected : false, key:"60대", request:"60대", response:"60대"},
    ]},
  
    {type:"response", responseshow : true, show:false, index:19,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:20,
      info:"도움이 필요한곳의 지역을 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:21, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
        {
      type:"request",
      show:false,
      index:22,
      info:"언제 청소하나요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"이사 전 (빈집)", request:"이사 전 (빈집)", response:"이사 전 (빈집)"},
        {selected : false, key:"이사 후 (짐 있음)", request:"이사 후 (짐 있음)", response:"이사 후 (짐 있음)"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:23, requesttype:REQUESTINFO.MOVETIMING,  result:""},

{
      type:"requestcomment", 
      show:false, 
      index:24,
      info:"도움이 필요한내용을 적어주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:25, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:26, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestfoodpreparemessages =[

    {
     type:"initialize", 
     show:true, 
     index:1, 
     info:"몇가지 정보만 알려주시면 실시간으로 견적을 받을수 있어요",
     selected: false,
     multiselect_enable: false,
     selectitems :[
       {selected : false, key:"",request:"", response:""}
     ]
    },
    {
        type:"request", 
        show:false, 
        index:2, 
        info:"언제마다 식사준비하시기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:3, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:4,
      info:"식사준비하는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:5, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:6, 
      info:"식사준비금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"시급9860원", request:"시급9860원", response:"시급9860원"},
        {selected : false, key:"2만원", request:"2만원", response:"2만원"},
        {selected : false, key:"2만원~4만원", request:"2만원~4만원", response:"2만원~4만원"},
        {selected : false, key:"4만원~6만원", request:"4만원~6만원", response:"4만원~6만원"},
        {selected : false, key:"6만원~8만원", request:"6만원~8만원", response:"6만원~8만원"},
        {selected : false, key:"8만원~10만원", request:"8만원~10만원", response:"8만원~10만원"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:7, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:8, 
      info:"식사준비가 필요한 곳을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"아파트", request:"아파트", response:"아파트"},
        {selected : false, key:"빌라", request:"빌라", response:"빌라"},
        {selected : false, key:"단독주택", request:"단독주택", response:"단독주택"},
        {selected : false, key:"오피스텔", request:"오피스텔", response:"오피스텔"},]
    },
  
  
    {type:"response", responseshow : true, show:false, index:9, requesttype:REQUESTINFO.TARGET,  result:""},

    {
        type:"request", 
        show:false, 
        index:10, 
        info:"식사준비에 장보기를 포함할까여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
        {selected : false, key:"장보기 포함", request:"장보기 포함", response:"장보기 포함"},
        {selected : false, key:"장보기 미포함", request:"장보기 미포함", response:"장보기 미포함"},]},
    
      {type:"response", responseshow : true, show:false, index:11,requesttype:REQUESTINFO.TIME, result:""},

    
    {
      type:"request", 
      show:false, 
      index:12, 
      info:"식사준비를 어떤걸로 하는지 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"찌개+반찬1개", request:"찌개+반찬1개", response:"찌개+반찬1개"},
      {selected : false, key:"찌개+반찬2개", request:"찌개+반찬2개", response:"찌개+반찬2개"},
      {selected : false, key:"찌개+반찬3개", request:"찌개+반찬3개", response:"찌개+반찬3개"},
      {selected : false, key:"찌개+반찬4개", request:"찌개+반찬4개", response:"찌개+반찬4개"},]},
  
    {type:"response", responseshow : true, show:false, index:13,requesttype:REQUESTINFO.TIME, result:""},
  
    {
      type:"request", 
      show:false, 
      index:14, 
      info:"식사준비하는 시간대는 언제가 좋을까요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"협의가능", request:"협의가능", response:"협의가능"},
        {selected : false, key:"아침식사", request:"아침식사", response:"아침식사"},
        {selected : false, key:"점심식사", request:"점심식사", response:"점심식사"},
        {selected : false, key:"저녁식사", request:"저녁식사", response:"저녁식사"},]},
  
    {type:"response", responseshow : true, show:false, index:15,requesttype:REQUESTINFO.CLEANINGTIME, result:""},
  
  
  
    {
      type:"request", 
      show:false, 
      index:16, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:17,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:18, 
      info:"도움주실분의 연령대을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"20대", request:"20대", response:"20대"},
      {selected : false, key:"30대", request:"30대", response:"30대"},
      {selected : false, key:"40대", request:"40대", response:"40대"},
      {selected : false, key:"50대", request:"50대", response:"50대"},
      {selected : false, key:"60대", request:"60대", response:"60대"},
    ]},
  
    {type:"response", responseshow : true, show:false, index:19,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:20,
      info:"도움이 필요한곳의 지역을 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:21, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
        {
      type:"request",
      show:false,
      index:22,
      info:"몇 분 드실 식사인가요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"1~2인", request:"1~2인", response:"1~2인"},
        {selected : false, key:"3~4인", request:"3~4인", response:"3~4인"},
        {selected : false, key:"5인 이상", request:"5인 이상", response:"5인 이상"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:23, requesttype:REQUESTINFO.MEALCOUNT,  result:""},

    {
      type:"request",
      show:false,
      index:24,
      info:"재료는 준비되어 있나요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"재료 있어요", request:"재료 있어요", response:"재료 있어요"},
        {selected : false, key:"장보기부터 해주세요", request:"장보기부터 해주세요", response:"장보기부터 해주세요"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:25, requesttype:REQUESTINFO.INGREDIENT,  result:""},

{
      type:"requestcomment", 
      show:false, 
      index:26,
      info:"도움이 필요한내용을 적어주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:27, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:28, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requesterrandmessages =[

    {
     type:"initialize", 
     show:true, 
     index:1, 
     info:"몇가지 정보만 알려주시면 실시간으로 견적을 받을수 있어요",
     selected: false,
     multiselect_enable: false,
     selectitems :[
       {selected : false, key:"",request:"", response:""}
     ]
    },
    {
        type:"request", 
        show:false, 
        index:2, 
        info:"언제마다 도움받기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:3, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:4,
      info:"도움받는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:5, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:6, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"최저임금", request:"최저임금", response:"최저임금"},
        {selected : false, key:"2만원대", request:"2만원대", response:"2만원대"},
        {selected : false, key:"3만원대", request:"3만원대", response:"3만원대"},
        {selected : false, key:"4만원대", request:"4만원대", response:"4만원대"},
        {selected : false, key:"5만원대", request:"5만원대", response:"5만원대"},
        {selected : false, key:"6만원대", request:"6만원대", response:"6만원대"},
        {selected : false, key:"7만원대", request:"7만원대", response:"7만원대"},
        {selected : false, key:"8만원대", request:"8만원대", response:"8만원대"},
        {selected : false, key:"9만원대", request:"9만원대", response:"9만원대"},
        {selected : false, key:"10만원대", request:"10만원대", response:"10만원대"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:7, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:8, 
      info:"어떤 도움을 받기를 원하시나요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"줄서기", request:"줄서기", response:"줄서기"},
        {selected : false, key:"택배부치기", request:"택배부치기", response:"택배부치기"},
        {selected : false, key:"중고거래대행", request:"중고거래대행", response:"중고거래대행"},
        {selected : false, key:"티켓업무", request:"티켓업무", response:"티켓업무"},
        {selected : false, key:"관공서업무", request:"관공서업무", response:"관공서업무"},
        {selected : false, key:"하객대행", request:"하객대행", response:"하객대행"},
        {selected : false, key:"은행업무대행", request:"은행업무대행", response:"은행업무대행"},
    ]
    },
  
  
    {type:"response", responseshow : true, show:false, index:9, requesttype:REQUESTINFO.TARGET,  result:""},

  
  
    {
      type:"request", 
      show:false, 
      index:10, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:11,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:12, 
      info:"도움주실분의 연령대을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"20대", request:"20대", response:"20대"},
      {selected : false, key:"30대", request:"30대", response:"30대"},
      {selected : false, key:"40대", request:"40대", response:"40대"},
      {selected : false, key:"50대", request:"50대", response:"50대"},
      {selected : false, key:"60대", request:"60대", response:"60대"},
    ]},
  
    {type:"response", responseshow : true, show:false, index:13,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:14,
      info:"도움이 필요한곳의 지역을 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:15, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
        {
      type:"request",
      show:false,
      index:16,
      info:"이동 수단이 필요한가요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"도보 가능", request:"도보 가능", response:"도보 가능"},
        {selected : false, key:"대중교통", request:"대중교통", response:"대중교통"},
        {selected : false, key:"차량 필요", request:"차량 필요", response:"차량 필요"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:17, requesttype:REQUESTINFO.TRANSPORT,  result:""},

{
      type:"requestcomment", 
      show:false, 
      index:18,
      info:"도움이 필요한내용을 적어주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:19, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:20, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestgooutschoolmessages =[

    {
     type:"initialize", 
     show:true, 
     index:1, 
     info:"몇가지 정보만 알려주시면 실시간으로 견적을 받을수 있어요",
     selected: false,
     multiselect_enable: false,
     selectitems :[
       {selected : false, key:"",request:"", response:""}
     ]
    },
    {
        type:"request", 
        show:false, 
        index:2, 
        info:"언제마다 도움받기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:3, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:4,
      info:"등원하원 도와주는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:5, requesttype:REQUESTINFO.DATE,  result:""},


    {
        type:"request", 
        show:false, 
        index:6, 
        info:"등원하원 도와주는 시간대는 언제가 좋을까요?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"아침", request:"아침", response:"아침"},
          {selected : false, key:"오후", request:"오후", response:"오후"},
          {selected : false, key:"저녁", request:"저녁", response:"저녁"},
          {selected : false, key:"하루종일", request:"하루종일", response:"하루종일"},]},
    
    {type:"response", responseshow : true, show:false, index:7,requesttype:REQUESTINFO.CLEANINGTIME, result:""},


    {
        type:"request", 
        show:false, 
        index:8, 
        info:"등원하원 대상은 무엇인가요?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"학교", request:"학교", response:"학교"},
          {selected : false, key:"학원", request:"학원", response:"학원"},
          {selected : false, key:"학교/학원", request:"학교/학원", response:"학교/학원"},
        ]},
    
    {type:"response", responseshow : true, show:false, index:9,requesttype:REQUESTINFO.CLEANINGTIME, result:""},

    {
      type:"request", 
      show:false, 
      index:10, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"최저임금", request:"최저임금", response:"최저임금"},
        {selected : false, key:"2만원대", request:"2만원대", response:"2만원대"},
        {selected : false, key:"3만원대", request:"3만원대", response:"3만원대"},
        {selected : false, key:"4만원대", request:"4만원대", response:"4만원대"},
        {selected : false, key:"5만원대", request:"5만원대", response:"5만원대"},
        {selected : false, key:"6만원대", request:"6만원대", response:"6만원대"},
        {selected : false, key:"7만원대", request:"7만원대", response:"7만원대"},
        {selected : false, key:"8만원대", request:"8만원대", response:"8만원대"},
        {selected : false, key:"9만원대", request:"9만원대", response:"9만원대"},
        {selected : false, key:"10만원대", request:"10만원대", response:"10만원대"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:11, requesttype:REQUESTINFO.MONEY,  result:""},

  
    {
      type:"request", 
      show:false, 
      index:12, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:13,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:14, 
      info:"도움주실분의 연령대을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"20대", request:"20대", response:"20대"},
      {selected : false, key:"30대", request:"30대", response:"30대"},
      {selected : false, key:"40대", request:"40대", response:"40대"},
      {selected : false, key:"50대", request:"50대", response:"50대"},
      {selected : false, key:"60대", request:"60대", response:"60대"},
    ]},
  
    {type:"response", responseshow : true, show:false, index:15,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:16,
      info:"도움이 필요한곳의 지역을 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:17, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
        {
      type:"request",
      show:false,
      index:18,
      info:"아이 나이대를 알려주세요",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"미취학", request:"미취학", response:"미취학"},
        {selected : false, key:"초등 저학년", request:"초등 저학년", response:"초등 저학년"},
        {selected : false, key:"초등 고학년", request:"초등 고학년", response:"초등 고학년"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:19, requesttype:REQUESTINFO.CHILDAGE,  result:""},

    {
      type:"request",
      show:false,
      index:20,
      info:"등원과 하원 중 어느 쪽인가요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"등원만", request:"등원만", response:"등원만"},
        {selected : false, key:"하원만", request:"하원만", response:"하원만"},
        {selected : false, key:"등하원 모두", request:"등하원 모두", response:"등하원 모두"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:21, requesttype:REQUESTINFO.SCHOOLTRIP,  result:""},

{
      type:"requestcomment", 
      show:false, 
      index:22,
      info:"도움이 필요한내용을 적어주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:23, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:24, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestbabycaremessages =[

    {
     type:"initialize", 
     show:true, 
     index:1, 
     info:"몇가지 정보만 알려주시면 실시간으로 견적을 받을수 있어요",
     selected: false,
     multiselect_enable: false,
     selectitems :[
       {selected : false, key:"",request:"", response:""}
     ]
    },
    {
        type:"request", 
        show:false, 
        index:2, 
        info:"언제마다 아이돌보는것을 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:3, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:4,
      info:"아이 돌봐주는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:5, requesttype:REQUESTINFO.DATE,  result:""},


    {
        type:"request", 
        show:false, 
        index:6, 
        info:"아이돌봐주는 시간대는 언제가 좋을까요?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"아침", request:"아침", response:"아침"},
          {selected : false, key:"오후", request:"오후", response:"오후"},
          {selected : false, key:"저녁", request:"저녁", response:"저녁"},
          {selected : false, key:"하루종일", request:"하루종일", response:"하루종일"},]},
    
    {type:"response", responseshow : true, show:false, index:7,requesttype:REQUESTINFO.CLEANINGTIME, result:""},


    {
        type:"request", 
        show:false, 
        index:8, 
        info:"아이돌보는  대상은 무엇인가요?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"1명", request:"1명", response:"1명"},
          {selected : false, key:"2명", request:"2명", response:"2명"},
        ]},
    
    {type:"response", responseshow : true, show:false, index:9,requesttype:REQUESTINFO.CLEANINGTIME, result:""},

    {
        type:"request", 
        show:false, 
        index:10, 
        info:"아이 돌봐줄곳을 선택해주세요",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"아파트", request:"아파트", response:"아파트"},
          {selected : false, key:"빌라", request:"빌라", response:"빌라"},
          {selected : false, key:"단독주택", request:"단독주택", response:"단독주택"},
          {selected : false, key:"오피스텔", request:"오피스텔", response:"오피스텔"},]
      },
    
    
      {type:"response", responseshow : true, show:false, index:11, requesttype:REQUESTINFO.TARGET,  result:""},

    {
      type:"request", 
      show:false, 
      index:12, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"최저임금", request:"최저임금", response:"최저임금"},
        {selected : false, key:"2만원대", request:"2만원대", response:"2만원대"},
        {selected : false, key:"3만원대", request:"3만원대", response:"3만원대"},
        {selected : false, key:"4만원대", request:"4만원대", response:"4만원대"},
        {selected : false, key:"5만원대", request:"5만원대", response:"5만원대"},
        {selected : false, key:"6만원대", request:"6만원대", response:"6만원대"},
        {selected : false, key:"7만원대", request:"7만원대", response:"7만원대"},
        {selected : false, key:"8만원대", request:"8만원대", response:"8만원대"},
        {selected : false, key:"9만원대", request:"9만원대", response:"9만원대"},
        {selected : false, key:"10만원대", request:"10만원대", response:"10만원대"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:13, requesttype:REQUESTINFO.MONEY,  result:""},

  
    {
      type:"request", 
      show:false, 
      index:14, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:15,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:16, 
      info:"도움주실분의 연령대을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"20대", request:"20대", response:"20대"},
      {selected : false, key:"30대", request:"30대", response:"30대"},
      {selected : false, key:"40대", request:"40대", response:"40대"},
      {selected : false, key:"50대", request:"50대", response:"50대"},
      {selected : false, key:"60대", request:"60대", response:"60대"},
    ]},
  
    {type:"response", responseshow : true, show:false, index:17,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:18,
      info:"도움이 필요한곳의 지역을 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:19, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
        {
      type:"request",
      show:false,
      index:20,
      info:"아이 나이대를 알려주세요",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"12개월 미만", request:"12개월 미만", response:"12개월 미만"},
        {selected : false, key:"1~3세", request:"1~3세", response:"1~3세"},
        {selected : false, key:"4~6세", request:"4~6세", response:"4~6세"},
        {selected : false, key:"초등학생", request:"초등학생", response:"초등학생"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:21, requesttype:REQUESTINFO.CHILDAGE,  result:""},

    {
      type:"request",
      show:false,
      index:22,
      info:"아이는 몇 명인가요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"1명", request:"1명", response:"1명"},
        {selected : false, key:"2명", request:"2명", response:"2명"},
        {selected : false, key:"3명 이상", request:"3명 이상", response:"3명 이상"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:23, requesttype:REQUESTINFO.CHILDCOUNT,  result:""},

{
      type:"requestcomment", 
      show:false, 
      index:24,
      info:"도움이 필요한내용을 적어주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:25, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:26, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestlessonmessages =[

    {
     type:"initialize", 
     show:true, 
     index:1, 
     info:"몇가지 정보만 알려주시면 실시간으로 견적을 받을수 있어요",
     selected: false,
     multiselect_enable: false,
     selectitems :[
       {selected : false, key:"",request:"", response:""}
     ]
    },
    {
        type:"request", 
        show:false, 
        index:2, 
        info:"언제마다 레슨 하는것을 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:3, requesttype:REQUESTINFO.PERIOD,  result:""},


    {
      type:"requestdate", 
      show:false, 
      index:4,
      info:"아이 레슨하는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:5, requesttype:REQUESTINFO.DATE,  result:""},


    {
        type:"request", 
        show:false, 
        index:6, 
        info:"아이레슨 시간대는 언제가 좋을까요?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"오후", request:"오후", response:"오후"},
          {selected : false, key:"저녁", request:"저녁", response:"저녁"},
         ]
    },
    
    {type:"response", responseshow : true, show:false, index:7,requesttype:REQUESTINFO.CLEANINGTIME, result:""},


    {
        type:"request", 
        show:false, 
        index:8,
        info:"아이 레슨이 필요한 과목은 무엇인가요 ?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"피아노", request:"피아노", response:"피아노"},
          {selected : false, key:"수학", request:"수학", response:"수학"},
          {selected : false, key:"영어", request:"영어", response:"영어"},
          {selected : false, key:"논술", request:"논술", response:"논술"},
          {selected : false, key:"책읽기", request:"책읽기", response:"책읽기"},
          {selected : false, key:"학습지봐주기", request:"학습지봐주기", response:"학습지봐주기"},
         ]
    },
    
      
    {type:"response", responseshow : true, show:false, index:9, requesttype:REQUESTINFO.DATE,  result:""},

    {
        type:"request", 
        show:false, 
        index:10, 
        info:"아이 레슨하는곳을 선택해주세요",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"아파트", request:"아파트", response:"아파트"},
          {selected : false, key:"빌라", request:"빌라", response:"빌라"},
          {selected : false, key:"단독주택", request:"단독주택", response:"단독주택"},
          {selected : false, key:"오피스텔", request:"오피스텔", response:"오피스텔"},]
      },
    
    
      {type:"response", responseshow : true, show:false, index:11, requesttype:REQUESTINFO.TARGET,  result:""},

    {
      type:"request", 
      show:false, 
      index:12, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"최저임금", request:"최저임금", response:"최저임금"},
        {selected : false, key:"2만원대", request:"2만원대", response:"2만원대"},
        {selected : false, key:"3만원대", request:"3만원대", response:"3만원대"},
        {selected : false, key:"4만원대", request:"4만원대", response:"4만원대"},
        {selected : false, key:"5만원대", request:"5만원대", response:"5만원대"},
        {selected : false, key:"6만원대", request:"6만원대", response:"6만원대"},
        {selected : false, key:"7만원대", request:"7만원대", response:"7만원대"},
        {selected : false, key:"8만원대", request:"8만원대", response:"8만원대"},
        {selected : false, key:"9만원대", request:"9만원대", response:"9만원대"},
        {selected : false, key:"10만원대", request:"10만원대", response:"10만원대"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:13, requesttype:REQUESTINFO.MONEY,  result:""},

  
    {
      type:"request", 
      show:false, 
      index:14, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:15,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:16, 
      info:"도움주실분의 연령대을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"20대", request:"20대", response:"20대"},
      {selected : false, key:"30대", request:"30대", response:"30대"},
      {selected : false, key:"40대", request:"40대", response:"40대"},
      {selected : false, key:"50대", request:"50대", response:"50대"},
      {selected : false, key:"60대", request:"60대", response:"60대"},
    ]},
  
    {type:"response", responseshow : true, show:false, index:17,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:18,
      info:"도움이 필요한곳의 지역을 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:19, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
        {
      type:"request",
      show:false,
      index:20,
      info:"어떤 과목인가요?",
      selected : false,
      multiselect_enable:true,
      selectitems:[
        {selected : false, key:"국어", request:"국어", response:"국어"},
        {selected : false, key:"영어", request:"영어", response:"영어"},
        {selected : false, key:"수학", request:"수학", response:"수학"},
        {selected : false, key:"예체능", request:"예체능", response:"예체능"},
        {selected : false, key:"그 외", request:"그 외", response:"그 외"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:21, requesttype:REQUESTINFO.SUBJECT,  result:""},

    {
      type:"request",
      show:false,
      index:22,
      info:"학년을 알려주세요",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"미취학", request:"미취학", response:"미취학"},
        {selected : false, key:"초등", request:"초등", response:"초등"},
        {selected : false, key:"중등", request:"중등", response:"중등"},
        {selected : false, key:"고등", request:"고등", response:"고등"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:23, requesttype:REQUESTINFO.GRADE,  result:""},

{
      type:"requestcomment", 
      show:false, 
      index:24,
      info:"도움이 필요한내용을 적어주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:25, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:26, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestpatientcaremessages =[

    {
     type:"initialize", 
     show:true, 
     index:1, 
     info:"몇가지 정보만 알려주시면 실시간으로 견적을 받을수 있어요",
     selected: false,
     multiselect_enable: false,
     selectitems :[
       {selected : false, key:"",request:"", response:""}
     ]
    },
    {
        type:"request", 
        show:false, 
        index:2, 
        info:"언제마다 간병 하는것을 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:3, requesttype:REQUESTINFO.PERIOD,  result:""},


    {
      type:"requestdate", 
      show:false, 
      index:4,
      info:"간병하는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:5, requesttype:REQUESTINFO.DATE,  result:""},


    {
        type:"request", 
        show:false, 
        index:6, 
        info:"간병하는 시간대는 언제가 좋을까요?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"오전", request:"오전", response:"오전"},
          {selected : false, key:"오후", request:"오후", response:"오후"},
          {selected : false, key:"저녁", request:"저녁", response:"저녁"},
          {selected : false, key:"하루종일", request:"하루종일", response:"하루종일"},
         ]
    },
    
    {type:"response", responseshow : true, show:false, index:7,requesttype:REQUESTINFO.CLEANINGTIME, result:""},


    {
        type:"request", 
        show:false, 
        index:8,
        info:"누구를 간병해야 하나요?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"아이", request:"아이", response:"아이"},
          {selected : false, key:"10대", request:"10대", response:"10대"},
          {selected : false, key:"20대", request:"20대", response:"20대"},
          {selected : false, key:"30대", request:"30대", response:"30대"},
          {selected : false, key:"40대", request:"40대", response:"40대"},
          {selected : false, key:"50대", request:"50대", response:"50대"},
          {selected : false, key:"60대", request:"60대", response:"60대"},
          {selected : false, key:"70대이상", request:"70대이상", response:"70대이상"},
         ]
    },
    
      
    {type:"response", responseshow : true, show:false, index:9, requesttype:REQUESTINFO.DATE,  result:""},

    {
        type:"request", 
        show:false, 
        index:10, 
        info:"간병하는곳을 선택해주세요",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"집", request:"집", response:"집"},
          {selected : false, key:"병원", request:"병원", response:"병원"},]
      },
    
    
      {type:"response", responseshow : true, show:false, index:11, requesttype:REQUESTINFO.TARGET,  result:""},

    {
      type:"request", 
      show:false, 
      index:12, 
      info:"금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"시급9860원", request:"시급9860원", response:"시급9860원"},
        {selected : false, key:"2만원", request:"2만원", response:"2만원"},
        {selected : false, key:"2만원~4만원", request:"2만원~4만원", response:"2만원~4만원"},
        {selected : false, key:"4만원~6만원", request:"4만원~6만원", response:"4만원~6만원"},
        {selected : false, key:"6만원~8만원", request:"6만원~8만원", response:"6만원~8만원"},
        {selected : false, key:"8만원~10만원", request:"8만원~10만원", response:"8만원~10만원"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:13, requesttype:REQUESTINFO.MONEY,  result:""},

  
    {
      type:"request", 
      show:false, 
      index:14, 
      info:"간병이 필요한 사람의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:15,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:16, 
      info:"도움주실분의 연령대을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"20대", request:"20대", response:"20대"},
      {selected : false, key:"30대", request:"30대", response:"30대"},
      {selected : false, key:"40대", request:"40대", response:"40대"},
      {selected : false, key:"50대", request:"50대", response:"50대"},
      {selected : false, key:"60대", request:"60대", response:"60대"},
    ]},
  
    {type:"response", responseshow : true, show:false, index:17,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:18,
      info:"도움이 필요한곳의 지역을 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:19, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
        {
      type:"request",
      show:false,
      index:20,
      info:"거동은 어느 정도 가능하신가요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"스스로 가능", request:"스스로 가능", response:"스스로 가능"},
        {selected : false, key:"부축 필요", request:"부축 필요", response:"부축 필요"},
        {selected : false, key:"거동 어려움", request:"거동 어려움", response:"거동 어려움"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:21, requesttype:REQUESTINFO.MOBILITY,  result:""},

    {
      type:"request",
      show:false,
      index:22,
      info:"어디에서 돌봐드리나요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"집", request:"집", response:"집"},
        {selected : false, key:"병원", request:"병원", response:"병원"},
        {selected : false, key:"요양원", request:"요양원", response:"요양원"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:23, requesttype:REQUESTINFO.CAREPLACE,  result:""},

{
      type:"requestcomment", 
      show:false, 
      index:24,
      info:"도움이 필요한내용을 적어주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:25, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:26, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestcarryloadmessages =[

    {
     type:"initialize", 
     show:true, 
     index:1, 
     info:"몇가지 정보만 알려주시면 실시간으로 견적을 받을수 있어요",
     selected: false,
     multiselect_enable: false,
     selectitems :[
       {selected : false, key:"",request:"", response:""}
     ]
    },
    {
        type:"request", 
        show:false, 
        index:2, 
        info:"언제마다 도움받기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:3, requesttype:REQUESTINFO.PERIOD,  result:""},
    
  
    {
      type:"requestdate", 
      show:false, 
      index:4,
      info:"도움받는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:5, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:6, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"최저임금", request:"최저임금", response:"최저임금"},
        {selected : false, key:"2만원대", request:"2만원대", response:"2만원대"},
        {selected : false, key:"3만원대", request:"3만원대", response:"3만원대"},
        {selected : false, key:"4만원대", request:"4만원대", response:"4만원대"},
        {selected : false, key:"5만원대", request:"5만원대", response:"5만원대"},
        {selected : false, key:"6만원대", request:"6만원대", response:"6만원대"},
        {selected : false, key:"7만원대", request:"7만원대", response:"7만원대"},
        {selected : false, key:"8만원대", request:"8만원대", response:"8만원대"},
        {selected : false, key:"9만원대", request:"9만원대", response:"9만원대"},
        {selected : false, key:"10만원대", request:"10만원대", response:"10만원대"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:7, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:8, 
      info:"어떤 도움을 받기를 원하시나요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"가구설치조립", request:"가구설치조립", response:"가구설치조립"},
        {selected : false, key:"전등조명교체", request:"전등조명교체", response:"전등조명교체"},
        {selected : false, key:"커튼설치", request:"커튼설치", response:"커튼설치"},
        {selected : false, key:"못박기", request:"못박기", response:"못박기"},
        {selected : false, key:"집수리", request:"집수리", response:"집수리"},
        {selected : false, key:"변기수리", request:"변기수리", response:"변기수리"},
        {selected : false, key:"컴퓨터조립수리", request:"컴퓨터조립수리", response:"컴퓨터조립수리"},
        {selected : false, key:"조명수리교체", request:"조명수리교체", response:"조명수리교체"},
        {selected : false, key:"블라인드설치", request:"블라인드설치", response:"블라인드설치"},
    ]
    },
  
  
    {type:"response", responseshow : true, show:false, index:9, requesttype:REQUESTINFO.TARGET,  result:""},

  
  
    {
      type:"request", 
      show:false, 
      index:10, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:11,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:12, 
      info:"도움주실분의 연령대을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"20대", request:"20대", response:"20대"},
      {selected : false, key:"30대", request:"30대", response:"30대"},
      {selected : false, key:"40대", request:"40대", response:"40대"},
      {selected : false, key:"50대", request:"50대", response:"50대"},
      {selected : false, key:"60대", request:"60대", response:"60대"},
    ]},
  
    {type:"response", responseshow : true, show:false, index:13,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:14,
      info:"도움이 필요한곳의 지역을 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:15, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
        {
      type:"request",
      show:false,
      index:16,
      info:"층수와 엘리베이터를 알려주세요",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"1층", request:"1층", response:"1층"},
        {selected : false, key:"엘리베이터 있음", request:"엘리베이터 있음", response:"엘리베이터 있음"},
        {selected : false, key:"2~3층 계단", request:"2~3층 계단", response:"2~3층 계단"},
        {selected : false, key:"4층 이상 계단", request:"4층 이상 계단", response:"4층 이상 계단"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:17, requesttype:REQUESTINFO.FLOOR,  result:""},

    {
      type:"request",
      show:false,
      index:18,
      info:"짐 규모는 어느 정도인가요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"박스 몇 개", request:"박스 몇 개", response:"박스 몇 개"},
        {selected : false, key:"방 하나 분량", request:"방 하나 분량", response:"방 하나 분량"},
        {selected : false, key:"가구 포함", request:"가구 포함", response:"가구 포함"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:19, requesttype:REQUESTINFO.LOADSIZE,  result:""},

{
      type:"requestcomment", 
      show:false, 
      index:20,
      info:"도움이 필요한내용을 적어주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:21, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:22, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestgohospitalmessages =[

    {
     type:"initialize", 
     show:true, 
     index:1, 
     info:"몇가지 정보만 알려주시면 실시간으로 견적을 받을수 있어요",
     selected: false,
     multiselect_enable: false,
     selectitems :[
       {selected : false, key:"",request:"", response:""}
     ]
    },
    {
        type:"request", 
        show:false, 
        index:2, 
        info:"언제마다 병원같이 가는것을 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:3, requesttype:REQUESTINFO.PERIOD,  result:""},


    {
      type:"requestdate", 
      show:false, 
      index:4,
      info:"병원가는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:5, requesttype:REQUESTINFO.DATE,  result:""},


    {
        type:"request", 
        show:false, 
        index:6, 
        info:"병원가는 시간대는 언제가 좋을까요?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"오전", request:"오전", response:"오전"},
          {selected : false, key:"오후", request:"오후", response:"오후"},
         ]
    },
    
    {type:"response", responseshow : true, show:false, index:7,requesttype:REQUESTINFO.CLEANINGTIME, result:""},


    {
        type:"request", 
        show:false, 
        index:8,
        info:"누구와 같이 병원을 가야하나요?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"아이", request:"아이", response:"아이"},
          {selected : false, key:"10대", request:"10대", response:"10대"},
          {selected : false, key:"20대", request:"20대", response:"20대"},
          {selected : false, key:"30대", request:"30대", response:"30대"},
          {selected : false, key:"40대", request:"40대", response:"40대"},
          {selected : false, key:"50대", request:"50대", response:"50대"},
          {selected : false, key:"60대", request:"60대", response:"60대"},
          {selected : false, key:"70대이상", request:"70대이상", response:"70대이상"},
         ]
    },
    
      
    {type:"response", responseshow : true, show:false, index:9, requesttype:REQUESTINFO.DATE,  result:""},

    {
        type:"request", 
        show:false, 
        index:10, 
        info:"병원가는곳을 선택해주세요",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"개인병원", request:"개인병원", response:"개인병원"},
          {selected : false, key:"종합병원", request:"종합병원", response:"종합병원"},]
      },
    
    
      {type:"response", responseshow : true, show:false, index:11, requesttype:REQUESTINFO.TARGET,  result:""},

    {
      type:"request", 
      show:false, 
      index:12, 
      info:"금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"시급9860원", request:"시급9860원", response:"시급9860원"},
        {selected : false, key:"2만원", request:"2만원", response:"2만원"},
        {selected : false, key:"2만원~4만원", request:"2만원~4만원", response:"2만원~4만원"},
        {selected : false, key:"4만원~6만원", request:"4만원~6만원", response:"4만원~6만원"},
        {selected : false, key:"6만원~8만원", request:"6만원~8만원", response:"6만원~8만원"},
        {selected : false, key:"8만원~10만원", request:"8만원~10만원", response:"8만원~10만원"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:13, requesttype:REQUESTINFO.MONEY,  result:""},

  
    {
      type:"request", 
      show:false, 
      index:14, 
      info:"병원 같이갈 사람의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:15,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:16, 
      info:"도움주실분의 연령대을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"20대", request:"20대", response:"20대"},
      {selected : false, key:"30대", request:"30대", response:"30대"},
      {selected : false, key:"40대", request:"40대", response:"40대"},
      {selected : false, key:"50대", request:"50대", response:"50대"},
      {selected : false, key:"60대", request:"60대", response:"60대"},
    ]},
  
    {type:"response", responseshow : true, show:false, index:17,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:18,
      info:"도움이 필요한곳의 지역을 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:19, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
        {
      type:"request",
      show:false,
      index:20,
      info:"거동은 어느 정도 가능하신가요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"스스로 가능", request:"스스로 가능", response:"스스로 가능"},
        {selected : false, key:"부축 필요", request:"부축 필요", response:"부축 필요"},
        {selected : false, key:"휠체어", request:"휠체어", response:"휠체어"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:21, requesttype:REQUESTINFO.MOBILITY,  result:""},

    {
      type:"request",
      show:false,
      index:22,
      info:"어디까지 도와드릴까요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"동행만", request:"동행만", response:"동행만"},
        {selected : false, key:"접수·수납까지", request:"접수·수납까지", response:"접수·수납까지"},
        {selected : false, key:"약국까지", request:"약국까지", response:"약국까지"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:23, requesttype:REQUESTINFO.ACCOMPANY,  result:""},

{
      type:"requestcomment", 
      show:false, 
      index:24,
      info:"도움이 필요한내용을 적어주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:25, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:26, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestrecipetranmitmessages =[

    {
     type:"initialize", 
     show:true, 
     index:1, 
     info:"몇가지 정보만 알려주시면 실시간으로 견적을 받을수 있어요",
     selected: false,
     multiselect_enable: false,
     selectitems :[
       {selected : false, key:"",request:"", response:""}
     ]
    },
    {
        type:"request", 
        show:false, 
        index:2, 
        info:"언제마다 요리비법을 전수받기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:3, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:4,
      info:"요리전수받는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:5, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:6, 
      info:"요리전수받는금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"시급9860원", request:"시급9860원", response:"시급9860원"},
        {selected : false, key:"2만원", request:"2만원", response:"2만원"},
        {selected : false, key:"2만원~4만원", request:"2만원~4만원", response:"2만원~4만원"},
        {selected : false, key:"4만원~6만원", request:"4만원~6만원", response:"4만원~6만원"},
        {selected : false, key:"6만원~8만원", request:"6만원~8만원", response:"6만원~8만원"},
        {selected : false, key:"8만원~10만원", request:"8만원~10만원", response:"8만원~10만원"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:7, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:8, 
      info:"요리비번 전수가 필요한 곳을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"아파트", request:"아파트", response:"아파트"},
        {selected : false, key:"빌라", request:"빌라", response:"빌라"},
        {selected : false, key:"단독주택", request:"단독주택", response:"단독주택"},
        {selected : false, key:"오피스텔", request:"오피스텔", response:"오피스텔"},]
    },
  
  
    {type:"response", responseshow : true, show:false, index:9, requesttype:REQUESTINFO.TARGET,  result:""},

    {
        type:"request", 
        show:false, 
        index:10, 
        info:"요리비법 전수에 장보기를 포함할까여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
        {selected : false, key:"장보기 포함", request:"장보기 포함", response:"장보기 포함"},
        {selected : false, key:"장보기 미포함", request:"장보기 미포함", response:"장보기 미포함"},]},
    
      {type:"response", responseshow : true, show:false, index:11,requesttype:REQUESTINFO.TIME, result:""},

  
    {
      type:"request", 
      show:false, 
      index:12, 
      info:"요리비법 전수하는 시간대는 언제가 좋을까요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"협의가능", request:"협의가능", response:"협의가능"},
        {selected : false, key:"오전", request:"오전", response:"오전"},
        {selected : false, key:"오후", request:"오후", response:"오후"},
        {selected : false, key:"저녁", request:"저녁", response:"저녁"},]},
  
    {type:"response", responseshow : true, show:false, index:13,requesttype:REQUESTINFO.CLEANINGTIME, result:""},
  
  
  
    {
      type:"request", 
      show:false, 
      index:14, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:15,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:16, 
      info:"도움주실분의 연령대을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"20대", request:"20대", response:"20대"},
      {selected : false, key:"30대", request:"30대", response:"30대"},
      {selected : false, key:"40대", request:"40대", response:"40대"},
      {selected : false, key:"50대", request:"50대", response:"50대"},
      {selected : false, key:"60대", request:"60대", response:"60대"},
    ]},
  
    {type:"response", responseshow : true, show:false, index:17,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:18,
      info:"도움이 필요한곳의 지역을 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:19, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
    {
      type:"requestcomment", 
      show:false, 
      index:20,
      info:"도움이 필요한내용을 적어주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:21, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:22, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestschooleventmessages =[

    {
     type:"initialize", 
     show:true, 
     index:1, 
     info:"몇가지 정보만 알려주시면 실시간으로 견적을 받을수 있어요",
     selected: false,
     multiselect_enable: false,
     selectitems :[
       {selected : false, key:"",request:"", response:""}
     ]
    },
    {
        type:"request", 
        show:false, 
        index:2, 
        info:"언제마다 학교행사에 참석하기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:3, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:4,
      info:"학교행사에 참석하는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:5, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:6, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"최저임금", request:"최저임금", response:"최저임금"},
        {selected : false, key:"2만원대", request:"2만원대", response:"2만원대"},
        {selected : false, key:"3만원대", request:"3만원대", response:"3만원대"},
        {selected : false, key:"4만원대", request:"4만원대", response:"4만원대"},
        {selected : false, key:"5만원대", request:"5만원대", response:"5만원대"},
        {selected : false, key:"6만원대", request:"6만원대", response:"6만원대"},
        {selected : false, key:"7만원대", request:"7만원대", response:"7만원대"},
        {selected : false, key:"8만원대", request:"8만원대", response:"8만원대"},
        {selected : false, key:"9만원대", request:"9만원대", response:"9만원대"},
        {selected : false, key:"10만원대", request:"10만원대", response:"10만원대"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:7, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:8, 
      info:"어떤 도움을 받기를 원하시나요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"녹색어머니", request:"녹색어머니", response:"녹색어머니"},
        {selected : false, key:"공개수업참석", request:"공개수업참석", response:"공개수업참석"},
    ]
    },
  
  
    {type:"response", responseshow : true, show:false, index:9, requesttype:REQUESTINFO.TARGET,  result:""},

  
  
    {
      type:"request", 
      show:false, 
      index:10, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:11,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:12, 
      info:"도움주실분의 연령대을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"20대", request:"20대", response:"20대"},
      {selected : false, key:"30대", request:"30대", response:"30대"},
      {selected : false, key:"40대", request:"40대", response:"40대"},
      {selected : false, key:"50대", request:"50대", response:"50대"},
      {selected : false, key:"60대", request:"60대", response:"60대"},
    ]},
  
    {type:"response", responseshow : true, show:false, index:13,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:14,
      info:"도움이 필요한곳의 지역을 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:15, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
        {
      type:"request",
      show:false,
      index:16,
      info:"어떤 행사인가요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"녹색어머니", request:"녹색어머니", response:"녹색어머니"},
        {selected : false, key:"급식 도우미", request:"급식 도우미", response:"급식 도우미"},
        {selected : false, key:"도서 도우미", request:"도서 도우미", response:"도서 도우미"},
        {selected : false, key:"체험학습 인솔", request:"체험학습 인솔", response:"체험학습 인솔"},
        {selected : false, key:"그 외", request:"그 외", response:"그 외"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:17, requesttype:REQUESTINFO.EVENTTYPE,  result:""},

{
      type:"requestcomment", 
      show:false, 
      index:18,
      info:"도움이 필요한내용을 적어주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:19, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:20, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestshoppingmessages =[

    {
     type:"initialize", 
     show:true, 
     index:1, 
     info:"몇가지 정보만 알려주시면 실시간으로 견적을 받을수 있어요",
     selected: false,
     multiselect_enable: false,
     selectitems :[
       {selected : false, key:"",request:"", response:""}
     ]
    },
    {
        type:"request", 
        show:false, 
        index:2, 
        info:"언제마다 장보는것을 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:3, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:4,
      info:"장보는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:5, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:6, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"최저임금", request:"최저임금", response:"최저임금"},
        {selected : false, key:"2만원대", request:"2만원대", response:"2만원대"},
        {selected : false, key:"3만원대", request:"3만원대", response:"3만원대"},
        {selected : false, key:"4만원대", request:"4만원대", response:"4만원대"},
        {selected : false, key:"5만원대", request:"5만원대", response:"5만원대"},
        {selected : false, key:"6만원대", request:"6만원대", response:"6만원대"},
        {selected : false, key:"7만원대", request:"7만원대", response:"7만원대"},
        {selected : false, key:"8만원대", request:"8만원대", response:"8만원대"},
        {selected : false, key:"9만원대", request:"9만원대", response:"9만원대"},
        {selected : false, key:"10만원대", request:"10만원대", response:"10만원대"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:7, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:8, 
      info:"어디서 장보는것을 원하시나요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"동네마트", request:"동네마트", response:"동네마트"},
        {selected : false, key:"대형마트", request:"대형마트", response:"대형마트"},
        {selected : false, key:"이케아", request:"이케아", response:"이케아"},
        {selected : false, key:"코스트코", request:"대형마트", response:"대형마트"},
    ]
    },
  
  
    {type:"response", responseshow : true, show:false, index:9, requesttype:REQUESTINFO.TARGET,  result:""},

  
  
    {
      type:"request", 
      show:false, 
      index:10, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:11,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:12, 
      info:"도움주실분의 연령대을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"20대", request:"20대", response:"20대"},
      {selected : false, key:"30대", request:"30대", response:"30대"},
      {selected : false, key:"40대", request:"40대", response:"40대"},
      {selected : false, key:"50대", request:"50대", response:"50대"},
      {selected : false, key:"60대", request:"60대", response:"60대"},
    ]},
  
    {type:"response", responseshow : true, show:false, index:13,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:14,
      info:"도움이 필요한곳의 지역을 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:15, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
        {
      type:"request",
      show:false,
      index:16,
      info:"예상 장보기 금액은 얼마인가요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"5만원 이하", request:"5만원 이하", response:"5만원 이하"},
        {selected : false, key:"10만원 이하", request:"10만원 이하", response:"10만원 이하"},
        {selected : false, key:"10만원 이상", request:"10만원 이상", response:"10만원 이상"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:17, requesttype:REQUESTINFO.BUDGET,  result:""},

    {
      type:"request",
      show:false,
      index:18,
      info:"결제는 어떻게 하시나요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"미리 전달", request:"미리 전달", response:"미리 전달"},
        {selected : false, key:"나중에 정산", request:"나중에 정산", response:"나중에 정산"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:19, requesttype:REQUESTINFO.PAYMENT,  result:""},

{
      type:"requestcomment", 
      show:false, 
      index:20,
      info:"도움이 필요한내용을 적어주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:21, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:22, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestdoghospitalmessages =[

    {
     type:"initialize", 
     show:true, 
     index:1, 
     info:"몇가지 정보만 알려주시면 실시간으로 견적을 받을수 있어요",
     selected: false,
     multiselect_enable: false,
     selectitems :[
       {selected : false, key:"",request:"", response:""}
     ]
    },
    {
        type:"request", 
        show:false, 
        index:2, 
        info:"언제마다 도움받기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:3, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:4,
      info:"도움받는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:5, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:6, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"최저임금", request:"최저임금", response:"최저임금"},
        {selected : false, key:"2만원대", request:"2만원대", response:"2만원대"},
        {selected : false, key:"3만원대", request:"3만원대", response:"3만원대"},
        {selected : false, key:"4만원대", request:"4만원대", response:"4만원대"},
        {selected : false, key:"5만원대", request:"5만원대", response:"5만원대"},
        {selected : false, key:"6만원대", request:"6만원대", response:"6만원대"},
        {selected : false, key:"7만원대", request:"7만원대", response:"7만원대"},
        {selected : false, key:"8만원대", request:"8만원대", response:"8만원대"},
        {selected : false, key:"9만원대", request:"9만원대", response:"9만원대"},
        {selected : false, key:"10만원대", request:"10만원대", response:"10만원대"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:7, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:8, 
      info:"어떤 도움을 받기를 원하시나요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"사료주기", request:"사료주기", response:"사료주기"},
        {selected : false, key:"목욕", request:"목욕", response:"목욕"},
        {selected : false, key:"놀아주기", request:"놀아주기", response:"놀아주기"},
        {selected : false, key:"교육", request:"교육", response:"교육"},

    ]
    },
  
  
    {type:"response", responseshow : true, show:false, index:9, requesttype:REQUESTINFO.TARGET,  result:""},

  
  
    {
      type:"request", 
      show:false, 
      index:10, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:11,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:12, 
      info:"도움주실분의 연령대을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"20대", request:"20대", response:"20대"},
      {selected : false, key:"30대", request:"30대", response:"30대"},
      {selected : false, key:"40대", request:"40대", response:"40대"},
      {selected : false, key:"50대", request:"50대", response:"50대"},
      {selected : false, key:"60대", request:"60대", response:"60대"},
    ]},
  
    {type:"response", responseshow : true, show:false, index:13,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:14,
      info:"도움이 필요한곳의 지역을 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:15, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
        {
      type:"request",
      show:false,
      index:16,
      info:"반려견 크기를 알려주세요",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"소형견", request:"소형견", response:"소형견"},
        {selected : false, key:"중형견", request:"중형견", response:"중형견"},
        {selected : false, key:"대형견", request:"대형견", response:"대형견"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:17, requesttype:REQUESTINFO.DOGSIZE,  result:""},

    {
      type:"request",
      show:false,
      index:18,
      info:"몇 마리인가요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"1마리", request:"1마리", response:"1마리"},
        {selected : false, key:"2마리", request:"2마리", response:"2마리"},
        {selected : false, key:"3마리 이상", request:"3마리 이상", response:"3마리 이상"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:19, requesttype:REQUESTINFO.DOGCOUNT,  result:""},

{
      type:"requestcomment", 
      show:false, 
      index:20,
      info:"도움이 필요한내용을 적어주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:21, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:22, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestdogwalkmessages =[

    {
     type:"initialize", 
     show:true, 
     index:1, 
     info:"몇가지 정보만 알려주시면 실시간으로 견적을 받을수 있어요",
     selected: false,
     multiselect_enable: false,
     selectitems :[
       {selected : false, key:"",request:"", response:""}
     ]
    },
    {
        type:"request", 
        show:false, 
        index:2, 
        info:"언제마다 도움받기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:3, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:4,
      info:"도움받는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:5, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:6, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"최저임금", request:"최저임금", response:"최저임금"},
        {selected : false, key:"2만원대", request:"2만원대", response:"2만원대"},
        {selected : false, key:"3만원대", request:"3만원대", response:"3만원대"},
        {selected : false, key:"4만원대", request:"4만원대", response:"4만원대"},
        {selected : false, key:"5만원대", request:"5만원대", response:"5만원대"},
        {selected : false, key:"6만원대", request:"6만원대", response:"6만원대"},
        {selected : false, key:"7만원대", request:"7만원대", response:"7만원대"},
        {selected : false, key:"8만원대", request:"8만원대", response:"8만원대"},
        {selected : false, key:"9만원대", request:"9만원대", response:"9만원대"},
        {selected : false, key:"10만원대", request:"10만원대", response:"10만원대"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:7, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:8, 
      info:"어떤 도움을 받기를 원하시나요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"오전산책", request:"오전산책", response:"오전산책"},
        {selected : false, key:"오후산책", request:"오후산책", response:"오후산책"},
        {selected : false, key:"저녁산책", request:"저녁산책", response:"저녁산책"},
        {selected : false, key:"하루종일산책", request:"하루종일산책", response:"하루종일산책"},

    ]
    },
  
  
    {type:"response", responseshow : true, show:false, index:9, requesttype:REQUESTINFO.TARGET,  result:""},

  
  
    {
      type:"request", 
      show:false, 
      index:10, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:11,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:12, 
      info:"도움주실분의 연령대을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"20대", request:"20대", response:"20대"},
      {selected : false, key:"30대", request:"30대", response:"30대"},
      {selected : false, key:"40대", request:"40대", response:"40대"},
      {selected : false, key:"50대", request:"50대", response:"50대"},
      {selected : false, key:"60대", request:"60대", response:"60대"},
    ]},
  
    {type:"response", responseshow : true, show:false, index:13,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:14,
      info:"도움이 필요한곳의 지역을 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:15, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
        {
      type:"request",
      show:false,
      index:16,
      info:"반려견 크기를 알려주세요",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"소형견", request:"소형견", response:"소형견"},
        {selected : false, key:"중형견", request:"중형견", response:"중형견"},
        {selected : false, key:"대형견", request:"대형견", response:"대형견"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:17, requesttype:REQUESTINFO.DOGSIZE,  result:""},

    {
      type:"request",
      show:false,
      index:18,
      info:"몇 마리인가요?",
      selected : false,
      multiselect_enable:false,
      selectitems:[
        {selected : false, key:"1마리", request:"1마리", response:"1마리"},
        {selected : false, key:"2마리", request:"2마리", response:"2마리"},
        {selected : false, key:"3마리 이상", request:"3마리 이상", response:"3마리 이상"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:19, requesttype:REQUESTINFO.DOGCOUNT,  result:""},

{
      type:"requestcomment", 
      show:false, 
      index:20,
      info:"도움이 필요한내용을 적어주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:21, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:22, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]