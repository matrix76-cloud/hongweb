
import moment from 'moment';
import axios from "axios";


export const serverUrl = () =>{
	return "http://13.125.229.243:3000/"

}

export const useSleep = delay => new Promise(resolve => setTimeout(resolve, delay));

export const validateEmail = email =>{
    const regex = /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return regex.test(email);
}	

export const removeWhitespace = text =>{
    const regex = /\s/g;
    return text.replace(regex, '');
}

export const removeemail = text =>{
    const regex = /\s/g;
    return text.replace('@gmail.com', '');
}

export const ArrayIncludeData = (arraydata, data)=>{

	if(data ==''){
		return false;
	}
    if(arraydata == undefined){
        return false;
    }
    const FindIndex = arraydata.findIndex(x=>x == data);

    return FindIndex == -1 ? false : true;
}

export const fn_smsShare =(phone) =>
{
		var sBody = "[RELATION.CO.KR~~!! ]n"
		+ "안녕하세요. n"
		+ "마원 앱보고 문자드립니다.~n"
		+ "SMS 테스트 페이지 입니다.n"
		+ "n"
		+ "감사합니다.";
	
		sBody = sBody.replace(/(n|rn)/g,"%0a");
		return  "sms:"+phone+"?body=" + sBody;
}
export const fn_telShare =(phone) =>
{

	return  "tel:"+phone;
}

