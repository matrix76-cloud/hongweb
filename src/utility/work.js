
export const WORKNAME={
    ALLWORK : '전체보기',
    HOMECLEAN : '집 청소',
    BUSINESSCLEAN : '사무실청소',
    MOVECLEAN : '이사청소',
    FOODPREPARE : '식사준비',
    ERRAND : '도와주기',
    GOOUTSCHOOL : '등원하원',
    BABYCARE : '아이돌봄',
    LESSON : '아이레슨',
    PATIENTCARE : '간병하기',
    CARRYLOAD : '집안수리',
    GOHOSPITAL : '병원가기',
    RECIPETRANSMIT : '요리비법',
    GOSCHOOLEVENT : '학교행사',
    SHOPPING : '장봐주기',
    GODOGHOSPITAL : '애견돌봄',
    GODOGWALK : '애견산책',

}

export const WORKPOLICY ={
    HOMECLEAN :12,
    BUSINESSCLEAN :12,
    MOVECLEAN:12,
    FOODPREPARE: 12,
    ERRAND: 9,
    GOOUTSCHOOL: 10,
    BABYCARE :11,
    LESSON: 11,
    PATIENTCARE :11,
    CARRYLOAD : 9,
    GOHOSPITAL :11,
    RECIPETRANSMIT : 11,
    GOSCHOOLEVENT: 9,
    SHOPPING: 9,
    GODOGHOSPITAL: 9,
    GODOGWALK : 9,
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
    PERIOD : "주기",
    DATE : "일자",
    MONEY : "금액",
    TARGET : "대상",
    TARGETAREA : "대상평수",
    TIME : "시간",
    CLEANINGTIME: "도움받을 시간대",
    CUSTOMERGENDER : "고객님 성별",
    HELPGENDER : "도움주실분 성별",
    HELPAGE : "도움주실분 연령대",
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
     index:0, 
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
      index:1, 
      info:"언제마다 청소하시기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"정기적", request:"정기적", response:"정기적"},
        {selected : false, key:"1회만", request:"1회만", response:"1회만"}
      ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:""},
  
    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"청소하는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:5, 
      info:"청소금액을 얼마로 하기를 원하시나여?",
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
    {type:"response", responseshow : true, show:false, index:6, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:7, 
      info:"청소가 필요한 곳을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"아파트", request:"아파트", response:"아파트"},
        {selected : false, key:"빌라", request:"빌라", response:"빌라"},
        {selected : false, key:"단독주택", request:"단독주택", response:"단독주택"},
        {selected : false, key:"오피스텔", request:"오피스텔", response:"오피스텔"},]
    },
  
  
    {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.TARGET,  result:""},
  
    {
      type:"request", 
      show:false, 
      index:9, 
      info:"집은 몇평인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"10평미만", request:"10평미만", response:"10평미만"},
      {selected : false, key:"10평대", request:"10평대", response:"10평대"},
      {selected : false, key:"20평대", request:"20평대", response:"20평대"},
      {selected : false, key:"30평대", request:"30평대", response:"30평대"},
      {selected : false, key:"40평대", request:"40평대", response:"40평대"},
      {selected : false, key:"50평대", request:"50평대", response:"50평대"},]},
  
      {type:"response", responseshow : true, show:false, index:10, requesttype:REQUESTINFO.TARGETAREA,  result:""},
  
    {
      type:"request", 
      show:false, 
      index:11, 
      info:"청소시간을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"3시간", request:"3시간", response:"3시간"},
      {selected : false, key:"4시간", request:"4시간", response:"4시간"},
      {selected : false, key:"5시간", request:"5시간", response:"5시간"},
      {selected : false, key:"청소끝날때까지", request:"하루종일", response:"하루종일"},]},
  
    {type:"response", responseshow : true, show:false, index:12,requesttype:REQUESTINFO.TIME, result:""},
  
    {
      type:"request", 
      show:false, 
      index:13, 
      info:"청소하는 시간대는 언제가 좋을까요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"협의가능", request:"협의가능", response:"협의가능"},
        {selected : false, key:"오전시간", request:"오전시간", response:"오전시간"},
        {selected : false, key:"오후시간", request:"오후시간", response:"오후시간"},
        {selected : false, key:"저녁시간", request:"저녁시간", response:"저녁시간"},]},
  
    {type:"response", responseshow : true, show:false, index:14,requesttype:REQUESTINFO.CLEANINGTIME, result:""},
  
  
  
    {
      type:"request", 
      show:false, 
      index:15, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:16,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:17, 
      info:"도움주실분의 원하는 성별을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:18,requesttype:REQUESTINFO.HELPGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:19, 
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
  
    {type:"response", responseshow : true, show:false, index:20,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:21,
      info:"도움이 필요한곳의 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:22, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},

    {
      type:"requestcomment", 
      show:false, 
      index:23,
      info:"도움이 필요한내용을 간단하게 적어주세요(20자내외, 필수사항 아님)",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:24, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},
  
    {type:"requestcomplete", show: false, index:25, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestbusinesscleanmessages =[

    {
     type:"initialize", 
     show:true, 
     index:0, 
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
      index:1, 
      info:"언제마다 청소하시기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"정기적", request:"정기적", response:"정기적"},
        {selected : false, key:"1회만", request:"1회만", response:"1회만"}
      ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:""},
  
    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"청소하는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:5, 
      info:"청소금액을 얼마로 하기를 원하시나여?",
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
    {type:"response", responseshow : true, show:false, index:6, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:7, 
      info:"청소가 필요한 곳을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"사무실", request:"사무실", response:"사무실"},
        {selected : false, key:"상가", request:"상가", response:"상가"},]
    },
  
  
    {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.TARGET,  result:""},
  
    {
      type:"request", 
      show:false, 
      index:9, 
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
  
      {type:"response", responseshow : true, show:false, index:10, requesttype:REQUESTINFO.TARGETAREA,  result:""},
  
    {
      type:"request", 
      show:false, 
      index:11, 
      info:"청소시간을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"3시간", request:"3시간", response:"3시간"},
      {selected : false, key:"4시간", request:"4시간", response:"4시간"},
      {selected : false, key:"5시간", request:"5시간", response:"5시간"},
      {selected : false, key:"청소끝날때까지", request:"하루종일", response:"하루종일"},]},
  
    {type:"response", responseshow : true, show:false, index:12,requesttype:REQUESTINFO.TIME, result:""},
  
    {
      type:"request", 
      show:false, 
      index:13, 
      info:"청소하는 시간대는 언제가 좋을까요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"협의가능", request:"협의가능", response:"협의가능"},
        {selected : false, key:"오전시간", request:"오전시간", response:"오전시간"},
        {selected : false, key:"오후시간", request:"오후시간", response:"오후시간"},
        {selected : false, key:"저녁시간", request:"저녁시간", response:"저녁시간"},]},
  
    {type:"response", responseshow : true, show:false, index:14,requesttype:REQUESTINFO.CLEANINGTIME, result:""},
  
  
  
    {
      type:"request", 
      show:false, 
      index:15, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:16,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:17, 
      info:"도움주실분의 원하는 성별을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:18,requesttype:REQUESTINFO.HELPGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:19, 
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
  
    {type:"response", responseshow : true, show:false, index:20,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:21,
      info:"도움이 필요한곳의 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:22, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
    {
      type:"requestcomment", 
      show:false, 
      index:23,
      info:"도움이 필요한내용을 간단하게 적어주세요(20자내외, 필수사항 아님)",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:24, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:25, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestmovecleanmessages =[

    {
     type:"initialize", 
     show:true, 
     index:0, 
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
        index:1, 
        info:"언제마다 청소하시기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"청소하는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:5, 
      info:"청소금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"시급9860원", request:"시급9860원", response:"시급9860원"},
        {selected : false, key:"6만원~8만원", request:"6만원~8만원", response:"6만원~8만원"},
        {selected : false, key:"8만원~10만원", request:"8만원~10만원", response:"8만원~10만원"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:6, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:7, 
      info:"청소가 필요한 곳을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"사무실", request:"사무실", response:"사무실"},
        {selected : false, key:"상가", request:"상가", response:"상가"},]
    },
  
  
    {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.TARGET,  result:""},
  
    {
      type:"request", 
      show:false, 
      index:9, 
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
  
      {type:"response", responseshow : true, show:false, index:10, requesttype:REQUESTINFO.TARGETAREA,  result:""},
  
    {
      type:"request", 
      show:false, 
      index:11, 
      info:"청소시간을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"3시간", request:"3시간", response:"3시간"},
      {selected : false, key:"4시간", request:"4시간", response:"4시간"},
      {selected : false, key:"5시간", request:"5시간", response:"5시간"},
      {selected : false, key:"청소끝날때까지", request:"하루종일", response:"하루종일"},]},
  
    {type:"response", responseshow : true, show:false, index:12,requesttype:REQUESTINFO.TIME, result:""},
  
    {
      type:"request", 
      show:false, 
      index:13, 
      info:"청소하는 시간대는 언제가 좋을까요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"협의가능", request:"협의가능", response:"협의가능"},
        {selected : false, key:"오전시간", request:"오전시간", response:"오전시간"},
        {selected : false, key:"오후시간", request:"오후시간", response:"오후시간"},
        {selected : false, key:"저녁시간", request:"저녁시간", response:"저녁시간"},]},
  
    {type:"response", responseshow : true, show:false, index:14,requesttype:REQUESTINFO.CLEANINGTIME, result:""},
  
  
  
    {
      type:"request", 
      show:false, 
      index:15, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:16,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:17, 
      info:"도움주실분의 원하는 성별을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:18,requesttype:REQUESTINFO.HELPGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:19, 
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
  
    {type:"response", responseshow : true, show:false, index:20,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:21,
      info:"도움이 필요한곳의 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:22, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
    {
      type:"requestcomment", 
      show:false, 
      index:23,
      info:"도움이 필요한내용을 간단하게 적어주세요(20자내외, 필수사항 아님)",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:24, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:25, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestfoodpreparemessages =[

    {
     type:"initialize", 
     show:true, 
     index:0, 
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
        index:1, 
        info:"언제마다 식사준비하시기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"식사준비하는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:5, 
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
    {type:"response", responseshow : true, show:false, index:6, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:7, 
      info:"식사준비가 필요한 곳을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"아파트", request:"아파트", response:"아파트"},
        {selected : false, key:"빌라", request:"빌라", response:"빌라"},
        {selected : false, key:"단독주택", request:"단독주택", response:"단독주택"},
        {selected : false, key:"오피스텔", request:"오피스텔", response:"오피스텔"},]
    },
  
  
    {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.TARGET,  result:""},

    {
        type:"request", 
        show:false, 
        index:9, 
        info:"식사준비에 장보기를 포함할까여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
        {selected : false, key:"장보기 포함", request:"장보기 포함", response:"장보기 포함"},
        {selected : false, key:"장보기 미포함", request:"장보기 미포함", response:"장보기 미포함"},]},
    
      {type:"response", responseshow : true, show:false, index:10,requesttype:REQUESTINFO.TIME, result:""},

    
    {
      type:"request", 
      show:false, 
      index:11, 
      info:"식사준비를 어떤걸로 하는지 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"찌개+반찬1개", request:"찌개+반찬1개", response:"찌개+반찬1개"},
      {selected : false, key:"찌개+반찬2개", request:"찌개+반찬2개", response:"찌개+반찬2개"},
      {selected : false, key:"찌개+반찬3개", request:"찌개+반찬3개", response:"찌개+반찬3개"},
      {selected : false, key:"찌개+반찬4개", request:"찌개+반찬4개", response:"찌개+반찬4개"},]},
  
    {type:"response", responseshow : true, show:false, index:12,requesttype:REQUESTINFO.TIME, result:""},
  
    {
      type:"request", 
      show:false, 
      index:13, 
      info:"식사준비하는 시간대는 언제가 좋을까요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"협의가능", request:"협의가능", response:"협의가능"},
        {selected : false, key:"아침식사", request:"아침식사", response:"아침식사"},
        {selected : false, key:"점심식사", request:"점심식사", response:"점심식사"},
        {selected : false, key:"저녁식사", request:"저녁식사", response:"저녁식사"},]},
  
    {type:"response", responseshow : true, show:false, index:14,requesttype:REQUESTINFO.CLEANINGTIME, result:""},
  
  
  
    {
      type:"request", 
      show:false, 
      index:15, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:16,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:17, 
      info:"도움주실분의 원하는 성별을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:18,requesttype:REQUESTINFO.HELPGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:19, 
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
  
    {type:"response", responseshow : true, show:false, index:20,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:21,
      info:"도움이 필요한곳의 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:22, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
    {
      type:"requestcomment", 
      show:false, 
      index:23,
      info:"도움이 필요한내용을 간단하게 적어주세요(20자내외, 필수사항 아님)",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:24, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:25, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requesterrandmessages =[

    {
     type:"initialize", 
     show:true, 
     index:0, 
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
        index:1, 
        info:"언제마다 도움받기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"도움받는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:5, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
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
    {type:"response", responseshow : true, show:false, index:6, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:7, 
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
  
  
    {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.TARGET,  result:""},

  
  
    {
      type:"request", 
      show:false, 
      index:9, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:10,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:11, 
      info:"도움주실분의 원하는 성별을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:12,requesttype:REQUESTINFO.HELPGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:13, 
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
  
    {type:"response", responseshow : true, show:false, index:14,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:15,
      info:"도움이 필요한곳의 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:16, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
    {
      type:"requestcomment", 
      show:false, 
      index:17,
      info:"도움이 필요한내용을 간단하게 적어주세요(20자내외, 필수사항 아님)",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:18, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:19, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestgooutschoolmessages =[

    {
     type:"initialize", 
     show:true, 
     index:0, 
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
        index:1, 
        info:"언제마다 도움받기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"등원하원 도와주는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},


    {
        type:"request", 
        show:false, 
        index:5, 
        info:"등원하원 도와주는 시간대는 언제가 좋을까요?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"아침", request:"아침", response:"아침"},
          {selected : false, key:"오후", request:"오후", response:"오후"},
          {selected : false, key:"저녁", request:"저녁", response:"저녁"},
          {selected : false, key:"하루종일", request:"하루종일", response:"하루종일"},]},
    
    {type:"response", responseshow : true, show:false, index:6,requesttype:REQUESTINFO.CLEANINGTIME, result:""},


    {
        type:"request", 
        show:false, 
        index:7, 
        info:"등원하원 대상은 무엇인가요?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"학교", request:"학교", response:"학교"},
          {selected : false, key:"학원", request:"학원", response:"학원"},
          {selected : false, key:"학교/학원", request:"학교/학원", response:"학교/학원"},
        ]},
    
    {type:"response", responseshow : true, show:false, index:8,requesttype:REQUESTINFO.CLEANINGTIME, result:""},

    {
      type:"request", 
      show:false, 
      index:9, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
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
    {type:"response", responseshow : true, show:false, index:10, requesttype:REQUESTINFO.MONEY,  result:""},

  
    {
      type:"request", 
      show:false, 
      index:11, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:12,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:13, 
      info:"도움주실분의 원하는 성별을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:14,requesttype:REQUESTINFO.HELPGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:15, 
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
  
    {type:"response", responseshow : true, show:false, index:16,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:17,
      info:"도움이 필요한곳의 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:18, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
    {
      type:"requestcomment", 
      show:false, 
      index:19,
      info:"도움이 필요한내용을 간단하게 적어주세요(20자내외, 필수사항 아님)",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:20, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:21, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestbabycaremessages =[

    {
     type:"initialize", 
     show:true, 
     index:0, 
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
        index:1, 
        info:"언제마다 아이돌보는것을 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"아이 돌봐주는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},


    {
        type:"request", 
        show:false, 
        index:5, 
        info:"아이돌봐주는 시간대는 언제가 좋을까요?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"아침", request:"아침", response:"아침"},
          {selected : false, key:"오후", request:"오후", response:"오후"},
          {selected : false, key:"저녁", request:"저녁", response:"저녁"},
          {selected : false, key:"하루종일", request:"하루종일", response:"하루종일"},]},
    
    {type:"response", responseshow : true, show:false, index:6,requesttype:REQUESTINFO.CLEANINGTIME, result:""},


    {
        type:"request", 
        show:false, 
        index:7, 
        info:"아이돌보는  대상은 무엇인가요?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"1명", request:"1명", response:"1명"},
          {selected : false, key:"2명", request:"2명", response:"2명"},
        ]},
    
    {type:"response", responseshow : true, show:false, index:8,requesttype:REQUESTINFO.CLEANINGTIME, result:""},

    {
        type:"request", 
        show:false, 
        index:9, 
        info:"아이 돌봐줄곳을 선택해주세요",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"아파트", request:"아파트", response:"아파트"},
          {selected : false, key:"빌라", request:"빌라", response:"빌라"},
          {selected : false, key:"단독주택", request:"단독주택", response:"단독주택"},
          {selected : false, key:"오피스텔", request:"오피스텔", response:"오피스텔"},]
      },
    
    
      {type:"response", responseshow : true, show:false, index:10, requesttype:REQUESTINFO.TARGET,  result:""},

    {
      type:"request", 
      show:false, 
      index:11, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
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
    {type:"response", responseshow : true, show:false, index:12, requesttype:REQUESTINFO.MONEY,  result:""},

  
    {
      type:"request", 
      show:false, 
      index:13, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:14,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:15, 
      info:"도움주실분의 원하는 성별을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:16,requesttype:REQUESTINFO.HELPGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:17, 
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
  
    {type:"response", responseshow : true, show:false, index:18,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:19,
      info:"도움이 필요한곳의 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:20, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
    {
      type:"requestcomment", 
      show:false, 
      index:21,
      info:"도움이 필요한내용을 간단하게 적어주세요(20자내외, 필수사항 아님)",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:22, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:23, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestlessonmessages =[

    {
     type:"initialize", 
     show:true, 
     index:0, 
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
        index:1, 
        info:"언제마다 레슨 하는것을 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:""},


    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"아이 레슨하는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},


    {
        type:"request", 
        show:false, 
        index:5, 
        info:"아이레슨 시간대는 언제가 좋을까요?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"오후", request:"오후", response:"오후"},
          {selected : false, key:"저녁", request:"저녁", response:"저녁"},
         ]
    },
    
    {type:"response", responseshow : true, show:false, index:6,requesttype:REQUESTINFO.CLEANINGTIME, result:""},


    {
        type:"request", 
        show:false, 
        index:7,
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
    
      
    {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.DATE,  result:""},

    {
        type:"request", 
        show:false, 
        index:9, 
        info:"아이 레슨하는곳을 선택해주세요",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"아파트", request:"아파트", response:"아파트"},
          {selected : false, key:"빌라", request:"빌라", response:"빌라"},
          {selected : false, key:"단독주택", request:"단독주택", response:"단독주택"},
          {selected : false, key:"오피스텔", request:"오피스텔", response:"오피스텔"},]
      },
    
    
      {type:"response", responseshow : true, show:false, index:10, requesttype:REQUESTINFO.TARGET,  result:""},

    {
      type:"request", 
      show:false, 
      index:11, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
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
    {type:"response", responseshow : true, show:false, index:12, requesttype:REQUESTINFO.MONEY,  result:""},

  
    {
      type:"request", 
      show:false, 
      index:13, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:14,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:15, 
      info:"도움주실분의 원하는 성별을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:16,requesttype:REQUESTINFO.HELPGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:17, 
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
  
    {type:"response", responseshow : true, show:false, index:18,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:19,
      info:"도움이 필요한곳의 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:20, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
    {
      type:"requestcomment", 
      show:false, 
      index:21,
      info:"도움이 필요한내용을 간단하게 적어주세요(20자내외, 필수사항 아님)",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:22, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:23, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestpatientcaremessages =[

    {
     type:"initialize", 
     show:true, 
     index:0, 
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
        index:1, 
        info:"언제마다 간병 하는것을 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:""},


    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"간병하는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},


    {
        type:"request", 
        show:false, 
        index:5, 
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
    
    {type:"response", responseshow : true, show:false, index:6,requesttype:REQUESTINFO.CLEANINGTIME, result:""},


    {
        type:"request", 
        show:false, 
        index:7,
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
    
      
    {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.DATE,  result:""},

    {
        type:"request", 
        show:false, 
        index:9, 
        info:"간병하는곳을 선택해주세요",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"집", request:"집", response:"집"},
          {selected : false, key:"병원", request:"병원", response:"병원"},]
      },
    
    
      {type:"response", responseshow : true, show:false, index:10, requesttype:REQUESTINFO.TARGET,  result:""},

    {
      type:"request", 
      show:false, 
      index:11, 
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
    {type:"response", responseshow : true, show:false, index:12, requesttype:REQUESTINFO.MONEY,  result:""},

  
    {
      type:"request", 
      show:false, 
      index:13, 
      info:"간병이 필요한 사람의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:14,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:15, 
      info:"도움주실분의 원하는 성별을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:16,requesttype:REQUESTINFO.HELPGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:17, 
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
  
    {type:"response", responseshow : true, show:false, index:18,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:19,
      info:"도움이 필요한곳의 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:20, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
    {
      type:"requestcomment", 
      show:false, 
      index:21,
      info:"도움이 필요한내용을 간단하게 적어주세요(20자내외, 필수사항 아님)",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:22, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:23, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestcarryloadmessages =[

    {
     type:"initialize", 
     show:true, 
     index:0, 
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
        index:1, 
        info:"언제마다 도움받기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:""},
    
  
    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"도움받는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:5, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
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
    {type:"response", responseshow : true, show:false, index:6, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:7, 
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
  
  
    {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.TARGET,  result:""},

  
  
    {
      type:"request", 
      show:false, 
      index:9, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:10,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:11, 
      info:"도움주실분의 원하는 성별을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:12,requesttype:REQUESTINFO.HELPGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:13, 
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
  
    {type:"response", responseshow : true, show:false, index:14,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:15,
      info:"도움이 필요한곳의 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:16, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
    {
      type:"requestcomment", 
      show:false, 
      index:17,
      info:"도움이 필요한내용을 간단하게 적어주세요(20자내외, 필수사항 아님)",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:18, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:19, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestgohospitalmessages =[

    {
     type:"initialize", 
     show:true, 
     index:0, 
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
        index:1, 
        info:"언제마다 병원같이 가는것을 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:""},


    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"병원가는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},


    {
        type:"request", 
        show:false, 
        index:5, 
        info:"병원가는 시간대는 언제가 좋을까요?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"오전", request:"오전", response:"오전"},
          {selected : false, key:"오후", request:"오후", response:"오후"},
         ]
    },
    
    {type:"response", responseshow : true, show:false, index:6,requesttype:REQUESTINFO.CLEANINGTIME, result:""},


    {
        type:"request", 
        show:false, 
        index:7,
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
    
      
    {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.DATE,  result:""},

    {
        type:"request", 
        show:false, 
        index:9, 
        info:"병원가는곳을 선택해주세요",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
          {selected : false, key:"개인병원", request:"개인병원", response:"개인병원"},
          {selected : false, key:"종합병원", request:"종합병원", response:"종합병원"},]
      },
    
    
      {type:"response", responseshow : true, show:false, index:10, requesttype:REQUESTINFO.TARGET,  result:""},

    {
      type:"request", 
      show:false, 
      index:11, 
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
    {type:"response", responseshow : true, show:false, index:12, requesttype:REQUESTINFO.MONEY,  result:""},

  
    {
      type:"request", 
      show:false, 
      index:13, 
      info:"병원 같이갈 사람의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:14,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:15, 
      info:"도움주실분의 원하는 성별을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:16,requesttype:REQUESTINFO.HELPGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:17, 
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
  
    {type:"response", responseshow : true, show:false, index:18,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:19,
      info:"도움이 필요한곳의 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:20, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
    {
      type:"requestcomment", 
      show:false, 
      index:21,
      info:"도움이 필요한내용을 간단하게 적어주세요(20자내외, 필수사항 아님)",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:22, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:23, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestrecipetranmitmessages =[

    {
     type:"initialize", 
     show:true, 
     index:0, 
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
        index:1, 
        info:"언제마다 요리비법을 전수받기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"요리전수받는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:5, 
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
    {type:"response", responseshow : true, show:false, index:6, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:7, 
      info:"요리비번 전수가 필요한 곳을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"아파트", request:"아파트", response:"아파트"},
        {selected : false, key:"빌라", request:"빌라", response:"빌라"},
        {selected : false, key:"단독주택", request:"단독주택", response:"단독주택"},
        {selected : false, key:"오피스텔", request:"오피스텔", response:"오피스텔"},]
    },
  
  
    {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.TARGET,  result:""},

    {
        type:"request", 
        show:false, 
        index:9, 
        info:"요리비법 전수에 장보기를 포함할까여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
        {selected : false, key:"장보기 포함", request:"장보기 포함", response:"장보기 포함"},
        {selected : false, key:"장보기 미포함", request:"장보기 미포함", response:"장보기 미포함"},]},
    
      {type:"response", responseshow : true, show:false, index:10,requesttype:REQUESTINFO.TIME, result:""},

  
    {
      type:"request", 
      show:false, 
      index:11, 
      info:"요리비법 전수하는 시간대는 언제가 좋을까요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"협의가능", request:"협의가능", response:"협의가능"},
        {selected : false, key:"오전", request:"오전", response:"오전"},
        {selected : false, key:"오후", request:"오후", response:"오후"},
        {selected : false, key:"저녁", request:"저녁", response:"저녁"},]},
  
    {type:"response", responseshow : true, show:false, index:12,requesttype:REQUESTINFO.CLEANINGTIME, result:""},
  
  
  
    {
      type:"request", 
      show:false, 
      index:13, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:14,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:15, 
      info:"도움주실분의 원하는 성별을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:16,requesttype:REQUESTINFO.HELPGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:17, 
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
  
    {type:"response", responseshow : true, show:false, index:18,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:19,
      info:"도움이 필요한곳의 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:20, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
    {
      type:"requestcomment", 
      show:false, 
      index:21,
      info:"도움이 필요한내용을 간단하게 적어주세요(20자내외, 필수사항 아님)",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:22, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:23, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestschooleventmessages =[

    {
     type:"initialize", 
     show:true, 
     index:0, 
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
        index:1, 
        info:"언제마다 학교행사에 참석하기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"학교행사에 참석하는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:5, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
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
    {type:"response", responseshow : true, show:false, index:6, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:7, 
      info:"어떤 도움을 받기를 원하시나요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"녹색어머니", request:"녹색어머니", response:"녹색어머니"},
        {selected : false, key:"공개수업참석", request:"공개수업참석", response:"공개수업참석"},
    ]
    },
  
  
    {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.TARGET,  result:""},

  
  
    {
      type:"request", 
      show:false, 
      index:9, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:10,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:11, 
      info:"도움주실분의 원하는 성별을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:12,requesttype:REQUESTINFO.HELPGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:13, 
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
  
    {type:"response", responseshow : true, show:false, index:14,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:15,
      info:"도움이 필요한곳의 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:16, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
    {
      type:"requestcomment", 
      show:false, 
      index:17,
      info:"도움이 필요한내용을 간단하게 적어주세요(20자내외, 필수사항 아님)",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:18, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:19, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestshoppingmessages =[

    {
     type:"initialize", 
     show:true, 
     index:0, 
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
        index:1, 
        info:"언제마다 장보는것을 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"장보는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:5, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"시급9860원", request:"시급9860원", response:"시급9860원"},
        {selected : false, key:"2만원", request:"2만원", response:"2만원"},
        {selected : false, key:"2만원~4만원", request:"2만원~4만원", response:"2만원~4만원"},
        {selected : false, key:"4만원~6만원", request:"4만원~6만원", response:"4만원~6만원"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:6, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:7, 
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
  
  
    {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.TARGET,  result:""},

  
  
    {
      type:"request", 
      show:false, 
      index:9, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:10,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:11, 
      info:"도움주실분의 원하는 성별을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:12,requesttype:REQUESTINFO.HELPGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:13, 
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
  
    {type:"response", responseshow : true, show:false, index:14,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:15,
      info:"도움이 필요한곳의 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:16, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
    {
      type:"requestcomment", 
      show:false, 
      index:17,
      info:"도움이 필요한내용을 간단하게 적어주세요(20자내외, 필수사항 아님)",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:18, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:19, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestdoghospitalmessages =[

    {
     type:"initialize", 
     show:true, 
     index:0, 
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
        index:1, 
        info:"언제마다 도움받기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"도움받는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:5, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
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
    {type:"response", responseshow : true, show:false, index:6, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:7, 
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
  
  
    {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.TARGET,  result:""},

  
  
    {
      type:"request", 
      show:false, 
      index:9, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:10,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:11, 
      info:"도움주실분의 원하는 성별을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:12,requesttype:REQUESTINFO.HELPGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:13, 
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
  
    {type:"response", responseshow : true, show:false, index:14,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:15,
      info:"도움이 필요한곳의 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:16, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
    {
      type:"requestcomment", 
      show:false, 
      index:17,
      info:"도움이 필요한내용을 간단하게 적어주세요(20자내외, 필수사항 아님)",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:18, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:19, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestdogwalkmessages =[

    {
     type:"initialize", 
     show:true, 
     index:0, 
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
        index:1, 
        info:"언제마다 도움받기를 원하시나여?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
            {selected : false, key:"정기적", request:"정기적", response:"정기적"},
            {selected : false, key:"1회만", request:"1회만", response:"1회만"}
          ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:""},
    
    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"도움받는 시기를 언제로 할까요 ?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:5, 
      info:"도움받기 금액을 얼마로 하기를 원하시나여?",
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
    {type:"response", responseshow : true, show:false, index:6, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:7, 
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
  
  
    {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.TARGET,  result:""},

  
  
    {
      type:"request", 
      show:false, 
      index:9, 
      info:"고객님의 성별은 무엇인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"남성", request:"남성", response:"남성"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:10,requesttype:REQUESTINFO.CUSTOMERGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:11, 
      info:"도움주실분의 원하는 성별을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"상관없음", request:"상관없음", response:"상관없음"},
      {selected : false, key:"여성", request:"여성", response:"여성"},]},
  
    {type:"response", responseshow : true, show:false, index:12,requesttype:REQUESTINFO.HELPGENDER, result:""},
  
  
    {
      type:"request", 
      show:false, 
      index:13, 
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
  
    {type:"response", responseshow : true, show:false, index:14,requesttype:REQUESTINFO.HELPAGE, result:""},
  
    {
      type:"requestregion", 
      show:false, 
      index:15,
      info:"도움이 필요한곳의 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:16, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
    {
      type:"requestcomment", 
      show:false, 
      index:17,
      info:"도움이 필요한내용을 간단하게 적어주세요(20자내외, 필수사항 아님)",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:18, requesttype:REQUESTINFO.COMMENT, result:"", latitude:"", longitude:""},


    {type:"requestcomplete", show: false, index:19, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]