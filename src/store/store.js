import {configureStore, combineReducers} from "@reduxjs/toolkit";
import menu from  "./menu/MenuSlice";

const combineReducer = combineReducers({
    menu
});

const store = configureStore({
    reducer : combineReducer
})

export default store;