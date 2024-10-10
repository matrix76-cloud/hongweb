import {createSlice} from "@reduxjs/toolkit";

import { REFRESH, REFRESHTYPE, RESETTYPE, WORKNAME } from "../../utility/work";
import { ROOMSIZE } from "../../utility/room";
import { CONVENIENCEMENU, MEDICALMENU, PERFORMANCEMENU, TOURISTMENU } from "../../utility/life";

const menuSlice = createSlice({
    name :"menu",
    initialState :{value : ""},
    reducers :{
        ALLWORK : (state)=>{
            state.value  = WORKNAME.ALLWORK;
        },
        HOMECLEAN : (state)=>{
            state.value  = WORKNAME.HOMECLEAN;
        },
        BUSINESSCLEAN : (state)=>{
            state.value  = WORKNAME.BUSINESSCLEAN;
        },
        MOVECLEAN : (state)=>{
            state.value  = WORKNAME.MOVECLEAN;
        },
        FOODPREPARE : (state)=>{
            state.value  = WORKNAME.FOODPREPARE;
        },
        ERRAND : (state)=>{
            state.value  = WORKNAME.ERRAND;
        },
        GOOUTSCHOOL : (state)=>{
            state.value  = WORKNAME.GOOUTSCHOOL;
        },
        BABYCARE : (state)=>{
            state.value  = WORKNAME.BABYCARE;
        },
        LESSON : (state)=>{
            state.value  = WORKNAME.LESSON;
        },
        PATIENTCARE : (state)=>{
            state.value  = WORKNAME.PATIENTCARE;
        },
        CARRYLOAD : (state)=>{
            state.value  = WORKNAME.CARRYLOAD;
        },
        GOHOSPITAL : (state)=>{
            state.value  = WORKNAME.GOHOSPITAL;
        },
        RECIPETRANSMIT : (state)=>{
            state.value  = WORKNAME.RECIPETRANSMIT;
        },
        GOSCHOOLEVENT : (state)=>{
            state.value  = WORKNAME.GOSCHOOLEVENT;
        },
        SHOPPING : (state)=>{
            state.value  = WORKNAME.SHOPPING;
        },
        GODOGHOSPITAL : (state)=>{
            state.value  = WORKNAME.GODOGHOSPITAL;
        },
        GODOGWALK : (state)=>{
            state.value  = WORKNAME.GODOGWALK;
        },
        ALLROOM : (state)=>{
            state.value  = ROOMSIZE.ALLROOM;
        },
        SMALLROOM : (state)=>{
            state.value  = ROOMSIZE.SMALL;
        },
        MEDIUMROOM : (state)=>{
            state.value  = ROOMSIZE.MEDIUM;
        },
        LARGEROOM : (state)=>{
            state.value  = ROOMSIZE.LARGE;
        },
        TOURREGION : (state) =>{
            state.value = TOURISTMENU.TOURREGION;
        },
        TOURFESTIVAL : (state) =>{
            state.value = TOURISTMENU.TOURFESTIVAL;
        },
        TOURCOUNTRY : (state) =>{
            state.value = TOURISTMENU.TOURCOUNTRY;
        },
        TOURCITY : (state) =>{
            state.value = TOURISTMENU.TOURCITY;
        },
        TOURPICTURE : (state) =>{
            state.value = TOURISTMENU.TOURPICTURE;
        },
        PERFORMANCEEVENT : (state) =>{
            state.value = PERFORMANCEMENU.PERFORMANCEEVENT;
        },
        PERFORMANCECINEMA : (state) =>{
            state.value = PERFORMANCEMENU.PERFORMANCECINEMA;
        },
        MEDICALMEDICINE : (state) =>{
            state.value = MEDICALMENU.MEDICALMEDICINE;
        },
        MEDICALHOSPITAL : (state) =>{
            state.value = MEDICALMENU.MEDICALHOSPITAL;
        },
        FOODINFOMATION : (state) =>{
            state.value = MEDICALMENU.FOODINFOMATION;
        },
        CONVENIENCECAMPING: (state) =>{
            state.value = CONVENIENCEMENU.CONVENIENCECAMPING;
        },
        ALLREFRESH: (state) =>{
            state.value = REFRESHTYPE;
        },
        RESET: (state) =>{
            state.value = RESETTYPE;
        }
    }
}
);
const {actions, reducer} = menuSlice;
export const {ALLWORK, HOMECLEAN,BUSINESSCLEAN,
    MOVECLEAN,FOODPREPARE,ERRAND,GOOUTSCHOOL,BABYCARE,LESSON,PATIENTCARE,CARRYLOAD,
    GOHOSPITAL,RECIPETRANSMIT,GOSCHOOLEVENT,SHOPPING,GODOGHOSPITAL,GODOGWALK,ALLROOM, 
    SMALLROOM, MEDIUMROOM, LARGEROOM,
    TOURREGION,TOURFESTIVAL,TOURCOUNTRY,TOURCITY,TOURPICTURE,PERFORMANCEEVENT,PERFORMANCECINEMA,
    MEDICALMEDICINE,MEDICALHOSPITAL, FOODHISTORY,FOODINFOMATION,CONVENIENCECAMPING,ALLREFRESH, RESET} = actions;
export default reducer;