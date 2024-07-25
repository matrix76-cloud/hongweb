
import moment from 'moment';
import axios from "axios";

export const CommaFormatted = (amount) => {
    let amount_ = Number(amount);

    return amount_.toLocaleString(navigator.language, { minimumFractionDigits: 0 });
}
