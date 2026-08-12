
import moment from 'moment';
import axios from "axios";

/**
 * 위치를 아직 못 잡았을 때(GPS 거부·최초 진입·주소 미저장) 쓰는 임시 지역.
 * 이게 없으면 헤더에 "undefined undefined" 가 그대로 노출된다.
 */
export const DEFAULT_REGION = "경기도 남양주시 다산동";

// 주소 문자열을 [시도, 시군구, 읍면동] 으로 쪼갠다. 값이 없거나 모자라면 임시 지역으로 대체.
const regionParts = (address) => {
	const addr = String(address ?? "").trim().split(" ").filter(Boolean);
	return addr.length >= 3 ? addr : DEFAULT_REGION.split(" ");
}

export const KeywordAddress =(address)=>{

	const addr = regionParts(address);

	return addr[0] + ' '+ addr[1] + ' ' + addr[2];
}

export const ChatAddress =(address)=>{

	const addr = regionParts(address);

	return addr[2];
}


export const HeaderAddress =(address)=>{

	const addr = regionParts(address);

	return addr[1] + ' ' + addr[2];
}

export const CountryAddress =(address)=>{

	const addr = regionParts(address);

	return  addr[2];
}


export const SearchAddress = async(x, y) =>{    
	let addr ='https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x='+x+'&y='+y;
  
	let success = false;
	let data = {
		region1 : "",
		region2 : "",
		latitude :"",
		longitude : ""
	};
	try {
		let res = await axios
		  .get(
			addr,
			{
			  headers: {
				Authorization: 'KakaoAK 11ba702a58a4deb18f8dcd3f940d0a3d',  // REST API 키
			  },
		 
			},
		  )
		  .then(res => {
		
			data.region1 = res.data.documents[0].region_2depth_name;
			data.region2 = res.data.documents[0].region_3depth_name;
			data.longitude = x;
			data.latitude = y;
	  

			success= true;
	
		  });

	  } catch (error) {

		console.log(error.message);

	  }

	  return new Promise((resolve, reject)=>{
		if(success){
			resolve(data);
		}else{
			resolve(-1);
		}
	  })

}
export const distanceFunc = (lat1, lon1, lat2, lon2) => {
	const R = 6371; // 지구 반지름 (단위: km)
	const dLat = deg2rad(lat2 - lat1);
	const dLon = deg2rad(lon2 - lon1);
	const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
			  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
			  Math.sin(dLon/2) * Math.sin(dLon/2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	const distance = R * c; // 두 지점 간의 거리 (단위: km)
	return distance;
}
  
export const  deg2rad = (deg)=> {
	return deg * (Math.PI/180);
}
export const AddressSummmary =(address)=>{

	if(address == '' || address == undefined){
		return "";
	}
	let addr = [];
	addr = address.split(" ");

	return addr[0] + ' '+ addr[1];
}