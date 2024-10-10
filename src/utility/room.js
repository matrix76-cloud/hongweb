import { REQUESTINFO } from "./work_"

export const ROOMSIZEDISPALY={
    ALLROOM : '전체보기',
    SMALL : 'Small 사이즈',
    MEDIUM : 'Medium 사이즈',
    LARGE : 'Large 사이즈',

}
export const ROOMSIZE={
    ALLROOM : '전체보기',
    ONESIZE : '0.25평',
    TWOSIZE : '0.5평',
    THREESIZE : '0.75평',
    FOURSIZE : '1평',
    FIVESIZE : '1.25평',
    SIXSIZE : '1.5평',
    SEVENSIZE: '1.75평',
    EIGHTSIZE:'2평'

}

export const ROOMTYPE={
    APT :"아파트",
    BILLAR : "빌라",
    HOUSE : "단독주택",
    STORAGE : "창고",
    OFFICE : "개인사무실"
}

export const ROOMENABLE ={
    ALWAYS : "상시",
    WEEKS : "주1회가능",
    HALFMONTH :"월2회가능",
    MONTH : "월1회가능",

}

export const ROOM_INFO= {
    ROOMTYPE :"",
    ROOMENABLE:"",
    ROOMSIZE:[],
    ROOMIMAGE:"",
    REGION:"",
    DATE:"",
    PRICE:"",
    LATITUDE:"",
    LONGITUE:""


}

export const ROOMPOLICY ={
    SMALLER : 8,
    SMALL :  8,
    MEDIUM : 8,
    LARGE :  8,
    LARGER :  8,
    EXLARGE :  8,
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

export const Requestroommessages =[

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
    type:"requestdate", 
    show:false, 
    index:1,
    info:"언제부터 장소를 대여하길 원하시나여?",
    selected : false,
  },
  
  {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.DATE,  result:""},
  {
    type:"request", 
    show:false, 
    index:3, 
    info:"공간 대여 금액을 얼마로 하기를 원하시나여?",
    selected : false,
    multiselect_enable:false, 
    selectitems:[

      {selected : false, key:"월3만원", request:"월3만원", response:"월3만원"},
      {selected : false, key:"월4만원", request:"월4만원", response:"월4만원"},
      {selected : false, key:"월5만원", request:"월5만원", response:"월5만원"},
      {selected : false, key:"월6만원", request:"월6만원", response:"월6만원"},
      {selected : false, key:"월7만원", request:"월7만원", response:"월7만원"},
      {selected : false, key:"월8만원", request:"월8만원", response:"월8만원"},
    ]
  },
  {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.MONEY,  result:""},
  {
    type:"request", 
    show:false, 
    index:5, 
    info:"공간을 대여할곳을 선택해주세요",
    selected : false,
    multiselect_enable:false, 
    selectitems:[
      {selected : false, key:"아파트", request:"아파트", response:"아파트"},
      {selected : false, key:"빌라", request:"빌라", response:"빌라"},
      {selected : false, key:"단독주택", request:"단독주택", response:"단독주택"},
      {selected : false, key:"별도창고", request:"별도창고", response:"별도창고"},
      {selected : false, key:"지식산업센타", request:"지식산업센타", response:"지식산업센타"},
      {selected : false, key:"오피스텔", request:"오피스텔", response:"오피스텔"},]
  },


  {type:"response", responseshow : true, show:false, index:6, requesttype:REQUESTINFO.TARGET,  result:""},

  {
    type:"request", 
    show:false, 
    index:7, 
    info:"공간을 대여할곳을 어디에 할것인가요?",
    selected : false,
    multiselect_enable:false, 
    selectitems:[
    {selected : false, key:"빈방", request:"빈방", response:"빈방"},
    {selected : false, key:"거실", request:"거실", response:"거실"},
    {selected : false, key:"테라스", request:"테라스", response:"테라스"},
    {selected : false, key:"기타", request:"기타", response:"기타"},]},

  {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.TARGETAREA,  result:""},

  {
    type:"request", 
    show:false, 
    index:9, 
    info:"짐을 수시로 찾을수 있나요?",
    selected : false,
    multiselect_enable:false, 
    selectitems:[
    {selected : false, key:"주1회가능", request:"주1회가능", response:"주1회가능"},
    {selected : false, key:"주2회가능", request:"주2회가능", response:"주2회가능"},
    {selected : false, key:"월1회가능", request:"월1회가능", response:"월1회가능"},
    {selected : false, key:"언제든지가능", request:"언제든지", response:"언제든지"},]},

  {type:"response", responseshow : true, show:false, index:10, requesttype:REQUESTINFO.ROOMCHECK,  result:""},


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
    type:"requestroom", 
    show:false, 
    index:13,
    info:"짐 보관할 장소의 사진을 등록해주세요",
    selected : false,
  
  },
  {type:"response", responseshow : false,  show:false, index:14, requesttype:REQUESTINFO.ROOM, result:""},
  {
    type:"requestregion", 
    show:false, 
    index:15,
    info:"짐을 보관할 지역을 지도에서 클릭해주세요",
    selected : false,
  
  },
  {type:"response", responseshow : false,  show:false, index:16, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},

  {type:"requestcomplete", show: false, index:17, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},

]
export const Requestsmallmessages =[

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
          {selected : true, key:"1회만", request:"1회만", response:"1회만"}
        ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:"1회만"},

    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"언제부터 장소를 대여하길 원하시나여?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:5, 
      info:"공간 대여 금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[

        {selected : false, key:"월3만원", request:"월3만원", response:"월3만원"},
        {selected : false, key:"월4만원", request:"월4만원", response:"월4만원"},
        {selected : false, key:"월5만원", request:"월5만원", response:"월5만원"},
        {selected : false, key:"월6만원", request:"월6만원", response:"월6만원"},
        {selected : false, key:"월7만원", request:"월7만원", response:"월7만원"},
        {selected : false, key:"월8만원", request:"월8만원", response:"월8만원"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:6, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:7, 
      info:"공간을 대여할곳을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"아파트", request:"아파트", response:"아파트"},
        {selected : false, key:"빌라", request:"빌라", response:"빌라"},
        {selected : false, key:"단독주택", request:"단독주택", response:"단독주택"},
        {selected : false, key:"별도창고", request:"별도창고", response:"별도창고"},
        {selected : false, key:"지식산업센타", request:"지식산업센타", response:"지식산업센타"},
        {selected : false, key:"오피스텔", request:"오피스텔", response:"오피스텔"},]
    },
  
  
    {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.TARGET,  result:""},
  
    {
      type:"request", 
      show:false, 
      index:9, 
      info:"공간을 대여할곳을 어디에 할것인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"빈방", request:"빈방", response:"빈방"},
      {selected : false, key:"거실", request:"거실", response:"거실"},
      {selected : false, key:"테라스", request:"테라스", response:"테라스"},
      {selected : false, key:"기타", request:"기타", response:"기타"},]},
  
    {type:"response", responseshow : true, show:false, index:10, requesttype:REQUESTINFO.TARGETAREA,  result:""},

    {
      type:"request", 
      show:false, 
      index:11, 
      info:"짐을 수시로 찾을수 있나요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"주1회가능", request:"주1회가능", response:"주1회가능"},
      {selected : false, key:"주2회가능", request:"주2회가능", response:"주2회가능"},
      {selected : false, key:"월1회가능", request:"월1회가능", response:"월1회가능"},
      {selected : false, key:"언제든지가능", request:"언제든지", response:"언제든지"},]},
  
    {type:"response", responseshow : true, show:false, index:12, requesttype:REQUESTINFO.ROOMCHECK,  result:""},
  
  
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
      type:"requestroom", 
      show:false, 
      index:15,
      info:"짐 보관할 장소의 사진을 등록해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:16, requesttype:REQUESTINFO.ROOM, result:""},
    {
      type:"requestregion", 
      show:false, 
      index:17,
      info:"짐을 보관할 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:18, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
  
    {type:"requestcomplete", show: false, index:19, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestmediummessages =[

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
          {selected : true, key:"1회만", request:"1회만", response:"1회만"}
        ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:"1회만"},

    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"언제부터 장소를 대여하길 원하시나여?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:5, 
      info:"공간 대여 금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[

        {selected : false, key:"월3만원", request:"월3만원", response:"월3만원"},
        {selected : false, key:"월4만원", request:"월4만원", response:"월4만원"},
        {selected : false, key:"월5만원", request:"월5만원", response:"월5만원"},
        {selected : false, key:"월6만원", request:"월6만원", response:"월6만원"},
        {selected : false, key:"월7만원", request:"월7만원", response:"월7만원"},
        {selected : false, key:"월8만원", request:"월8만원", response:"월8만원"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:6, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:7, 
      info:"공간을 대여할곳을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"아파트", request:"아파트", response:"아파트"},
        {selected : false, key:"빌라", request:"빌라", response:"빌라"},
        {selected : false, key:"단독주택", request:"단독주택", response:"단독주택"},
        {selected : false, key:"별도창고", request:"별도창고", response:"별도창고"},
        {selected : false, key:"지식산업센타", request:"지식산업센타", response:"지식산업센타"},
        {selected : false, key:"오피스텔", request:"오피스텔", response:"오피스텔"},]
    },
  
  
    {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.TARGET,  result:""},
  
    {
      type:"request", 
      show:false, 
      index:9, 
      info:"공간을 대여할곳을 어디에 할것인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"빈방", request:"빈방", response:"빈방"},
      {selected : false, key:"거실", request:"거실", response:"거실"},
      {selected : false, key:"테라스", request:"테라스", response:"테라스"},
      {selected : false, key:"기타", request:"기타", response:"기타"},]},
  
      {type:"response", responseshow : true, show:false, index:10, requesttype:REQUESTINFO.TARGETAREA,  result:""},
      {
        type:"request", 
        show:false, 
        index:11, 
        info:"짐을 수시로 찾을수 있나요?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
        {selected : false, key:"주1회가능", request:"주1회가능", response:"주1회가능"},
        {selected : false, key:"주2회가능", request:"주2회가능", response:"주2회가능"},
        {selected : false, key:"월1회가능", request:"월1회가능", response:"월1회가능"},
        {selected : false, key:"언제든지가능", request:"언제든지", response:"언제든지"},]},
    
      {type:"response", responseshow : true, show:false, index:12, requesttype:REQUESTINFO.ROOMCHECK,  result:""},
    
  
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
      type:"requestroom", 
      show:false, 
      index:15,
      info:"짐 보관할 장소의 사진을 등록해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:16, requesttype:REQUESTINFO.ROOM, result:"", latitude:"", longitude:""},
    {
      type:"requestregion", 
      show:false, 
      index:17,
      info:"짐을 보관할 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:18, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
 
    {type:"requestcomplete", show: false, index:19, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]
export const Requestlargemessages =[

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
          {selected : true, key:"1회만", request:"1회만", response:"1회만"}
        ]
    },
    {type:"response", responseshow : true, show:false, index:2, requesttype:REQUESTINFO.PERIOD,  result:"1회만"},

    {
      type:"requestdate", 
      show:false, 
      index:3,
      info:"언제부터 장소를 대여하길 원하시나여?",
      selected : false,
    },
    
    {type:"response", responseshow : true, show:false, index:4, requesttype:REQUESTINFO.DATE,  result:""},
    {
      type:"request", 
      show:false, 
      index:5, 
      info:"공간 대여 금액을 얼마로 하기를 원하시나여?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[

        {selected : false, key:"월3만원", request:"월3만원", response:"월3만원"},
        {selected : false, key:"월4만원", request:"월4만원", response:"월4만원"},
        {selected : false, key:"월5만원", request:"월5만원", response:"월5만원"},
        {selected : false, key:"월6만원", request:"월6만원", response:"월6만원"},
        {selected : false, key:"월7만원", request:"월7만원", response:"월7만원"},
        {selected : false, key:"월8만원", request:"월8만원", response:"월8만원"},
      ]
    },
    {type:"response", responseshow : true, show:false, index:6, requesttype:REQUESTINFO.MONEY,  result:""},
    {
      type:"request", 
      show:false, 
      index:7, 
      info:"공간을 대여할곳을 선택해주세요",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
        {selected : false, key:"아파트", request:"아파트", response:"아파트"},
        {selected : false, key:"빌라", request:"빌라", response:"빌라"},
        {selected : false, key:"단독주택", request:"단독주택", response:"단독주택"},
        {selected : false, key:"별도창고", request:"별도창고", response:"별도창고"},
        {selected : false, key:"지식산업센타", request:"지식산업센타", response:"지식산업센타"},
        {selected : false, key:"오피스텔", request:"오피스텔", response:"오피스텔"},]
    },
  
  
    {type:"response", responseshow : true, show:false, index:8, requesttype:REQUESTINFO.TARGET,  result:""},
  
    {
      type:"request", 
      show:false, 
      index:9, 
      info:"공간을 대여할곳을 어디에 할것인가요?",
      selected : false,
      multiselect_enable:false, 
      selectitems:[
      {selected : false, key:"빈방", request:"빈방", response:"빈방"},
      {selected : false, key:"거실", request:"거실", response:"거실"},
      {selected : false, key:"테라스", request:"테라스", response:"테라스"},
      {selected : false, key:"기타", request:"기타", response:"기타"},]},
  
      {type:"response", responseshow : true, show:false, index:10, requesttype:REQUESTINFO.TARGETAREA,  result:""},
  
  
      {
        type:"request", 
        show:false, 
        index:11, 
        info:"짐을 수시로 찾을수 있나요?",
        selected : false,
        multiselect_enable:false, 
        selectitems:[
        {selected : false, key:"주1회가능", request:"주1회가능", response:"주1회가능"},
        {selected : false, key:"주2회가능", request:"주2회가능", response:"주2회가능"},
        {selected : false, key:"월1회가능", request:"월1회가능", response:"월1회가능"},
        {selected : false, key:"언제든지가능", request:"언제든지", response:"언제든지"},]},
    
      {type:"response", responseshow : true, show:false, index:12, requesttype:REQUESTINFO.TARGETAREA,  result:""},
    
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
      type:"requestroom", 
      show:false, 
      index:15,
      info:"짐 보관할 장소의 사진을 등록해주세요",
      selected : false,
      selectitems:[
        {selected : true, key:"장소", request:"장소", response:"장소"},
      ]
  
    },
    {type:"response", responseshow : false,  show:false, index:16, requesttype:REQUESTINFO.ROOM, result:""},
    {
      type:"requestregion", 
      show:false, 
      index:17,
      info:"짐을 보관할 지역을 지도에서 클릭해주세요",
      selected : false,
    
    },
    {type:"response", responseshow : false,  show:false, index:18, requesttype:REQUESTINFO.CUSTOMERREGION, result:"", latitude:"", longitude:""},
 
    {type:"requestcomplete", show: false, index:19, info:"고객님이 작성하신 요구사항은 다음과 같습니다"},
  
]

