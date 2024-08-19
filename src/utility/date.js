
import moment from 'moment';
import axios from "axios";


export const getDateOrTime = ts =>{
    const now = moment().startOf('day');
    const target = moment(ts).startOf('day');
    return moment(ts).format(now.diff(target, 'days') > 0 ? 'MM/DD' : 'HH:mm');
}
export const getDateFullTime = ts =>{
    const now = moment().startOf('day');
    const target = moment(ts).startOf('day');
    return moment(ts).format('YYYY.MM.DD HH:mm');
}

export const getDate = ts =>{
    const now = moment().startOf('day');
    const target = moment(ts).startOf('day');
    return moment(ts).format('YYYY.MM.DD');
}

export const getTime = ts =>{
    const now = moment().startOf('day');
    const target = moment(ts).startOf('day');
    return moment(ts).format('HH:mm');
}
export const getFullTime = ts =>{
    const now = moment().startOf('day');
    const target = moment(ts).startOf('day');
    return moment(ts).format();
}
export const StartTimeCurrentTimeDiff = (start, end) =>{

    const current = new Date();

	// 현재 시간이 영업시작 시간 안에 들어오면서

	const CurrentHour = Number(current.getHours()); // 현재시간
	const CurrentMinutes = Number(current.getMinutes());

	const starttime_time = Number(start.substr(0,2));
	const starttime_minute = Number(start.substr(3,2));

	const endtime_time = Number(end.substr(0,2));
	const endtime_minute =Number(end.substr(3,2));

	// 시작 현재 시간 비교 24시간 전이라면

	if(starttime_time < CurrentHour){
		return true;
	}else if(starttime_time == CurrentHour){

		if(endtime_minute <= CurrentMinutes ){
			return true
		}
	}

	if(CurrentHour < endtime_time){
		return true;
	}else if(endtime_time == CurrentHour){

		if(endtime_minute >= CurrentMinutes ){
			return true
		}
	}

	return false;

}

/**
 * 기록된 시간이 주어진 시간 보다 경과 하지 않았다면 true 경과 햇다면 false 반환
 */
export const WriteTimeCurrentTimeDiff = (write, elapsetime) =>{

    const current = new Date();

	let writetime = new Date(write);

	writetime.setHours(writetime.getHours() + elapsetime);


	if(writetime < current){
		return false;
	}else{

		return true;
	}


}