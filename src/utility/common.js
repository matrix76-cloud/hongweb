
import moment from 'moment';
import axios from "axios";

const isWeb = typeof window !== 'undefined'; // 웹 환경 확인


export const getPlatform = () => {
	if (isWeb) {
		const userAgent = navigator.userAgent;
		if (/iPad|iPhone|iPod/.test(userAgent)) {
			return 'ios';
		}
		if (/Android/.test(userAgent)) {
			return 'android';
		}
		return 'web';
	}
	return 'native'; // 네이티브 환경으로 간주
};


export  const isReactNativeWebView = ()=>{
	return typeof window.ReactNativeWebView !== 'undefined';
}


export  const isValidJSON = (jsonString) => {
    try {
      JSON.parse(jsonString);
      return true; // 파싱 성공
    } catch (error) {
      return false; // 파싱 실패
    }
 }

export const serverUrl = () =>{
	return "http://13.125.229.243:3000/"

}

/**
 * 전체문자열 data에서 특정 문자 위치 findstr를 발견 했을때 위치를 구한다
 */
export const searchpos = (data, findstr) =>{
	var position = data.indexOf(findstr);
	return position;
}

/**
 * 전체문자열 data의  시작위치를 pos 에서 특정 문자 위치 findstr를 발견 했을때 위치를 구한다
 */
export const searchposfrom = (data, pos, findstr) =>{

	var position = data.indexOf(findstr,pos);
	return position;
}

/**
 * 전체문자열 data에서 시작 위치 firstpos 와 끝위치 lastpost 사이에 문자열을 구한다
 */
export const searchposfromto = (data, firstpos, lastpos) =>{

	var findstsr = data.slice(firstpos, lastpos);
	return findstsr;
}

 /**
  * !html Tag를 없애 주고 실제 데이타만 뽑아줌
  */
 export const  extractTextFromHTML = (html) => {
	const parser = new DOMParser();
	const doc = parser.parseFromString(html, 'text/html');
	return doc.body.textContent || '';
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




