
import moment from 'moment';
import axios from "axios";

export const CommaFormatted = (amount) => {

    if(amount == 0){
        return "협의필요";
    }
    let amount_ = Number(amount);


    return amount_.toLocaleString(navigator.language, { minimumFractionDigits: 0 });
}
