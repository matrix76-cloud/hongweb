import { atom } from 'jotai';
import { LIFEMENU } from '../utility/life';
import { DayRecalculate2, getDateEx2 } from '../utility/date';
import moment from 'moment';
import axios from "axios";



export const lifemenustore = atom(LIFEMENU.AI); // 초기값을 0으로 설정한 atom
export const recipemenuitem = atom({});
export const TotalFcstAtom = atom('');
export const ShortFcstAtom = atom([]);
export const SelectedDate = atom('');
export const Recipemenus = atom([]);
export const TourCourse = atom([]);
export const TourCourseCodeItem = atom([]);
export const FreezeItems = atom([]);
export const HomeWorkItems = atom([]);
export const TourPicture = atom([]);

export const fetchDataTotalFcst = atom(async (get) => get(TotalFcstAtom), async(get, set)=>{

    const controller = new AbortController();
    const signal = controller.signal;

    const currentTime = moment().format('HH');

    let searchDate ="";
    // 새벽시간 이면
   if(parseInt(currentTime) <6){searchDate = DayRecalculate2(1) +"1800";}
   if(parseInt(currentTime) >=6 && parseInt(currentTime) <18  ){searchDate = getDateEx2() +"0600";}
   if(parseInt(currentTime) >=18  ){searchDate = getDateEx2() +"1800"}


    console.log("search data", searchDate);
    let jsonPayload = {date: searchDate};

    let cleanweather = "";
    await axios.post('https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/TotalFcst',  jsonPayload, {signal})
    .then((response) =>{

      if(response.data.response.body.items.item[0] != undefined){
        let original = response.data.response.body.items.item[0].wfSv;
        cleanweather = original.replace(/○/g, '');  // 느낌표 제거
        console.log("MATRIX cleanweather:", cleanweather)

        set(TotalFcstAtom, cleanweather); // 가져온 데이터로 atom 업데이트 
      }
    })
    .catch((error) => console.error('Error:', error));






});

export const fetchDataShortFcst = atom(async (get) => get(ShortFcstAtom), async(get, set, latitude, longitude)=>{


    const currentTime = moment().format('HH');

    let searchDate = "";
    
  console.log("latitude", latitude);
  console.log("longitude", longitude);


    searchDate = getDateEx2();

      
      let jsonPayload = {
        date: searchDate,
        latitude : parseInt(latitude),
        longitude : parseInt(longitude)
      };

     await axios.post('https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/ShortFcst',  jsonPayload, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((response) => {


          if(response.data.response.body.items.item[0] != undefined){

            let shortfcstitems = response.data.response.body.items.item;

            const groupedItemsTmp = shortfcstitems.reduce((result, item) => {
      
              // item.category 값이 이미 존재하는지 확인
              const key = item.fcstDate + item.fcstTime;
              
              if (!result[key]) {
                result[key] = []; // category 값이 없으면 배열 초기화
              }
              
              result[key].push(item); // 해당 category에 item 추가
              return result;
            }, {});
            
            const keysWithSizes = Object.keys(groupedItemsTmp).map((key) => ({
              key,
              size: groupedItemsTmp[key].length,
              items: groupedItemsTmp[key]
            }));
        
            set(ShortFcstAtom, keysWithSizes); // 가져온 데이터로 atom 업데이트
 
          }

      })
      .catch((error) => {

        console.error('Error:', error)
      });





});


