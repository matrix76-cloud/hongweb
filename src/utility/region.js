
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

/**
 * 거리를 사람이 읽는 말로. (형 리뷰 2026-08-12 "미터 단위 일때는 미터로, km 을 고집하지 말기")
 *
 * distanceFunc 는 km 를 돌려준다. 그런데 카드들이 그 값을 한 번 더 1000 으로 나눠 쓰고 있어서
 * 2km 가 "0.002km" 로 찍히고 있었다. 여기 한 곳에서 단위를 정리한다.
 */
export const distanceLabel = (km) => {
	if (!Number.isFinite(km)) return '';
	const m = km * 1000;
	if (m < 10) return '10m 이내';
	if (m < 1000) return `${Math.round(m / 10) * 10}m`;
	return `${(Math.round(km * 10) / 10).toFixed(1)}km`;
}
export const AddressSummmary =(address)=>{

	if(address == '' || address == undefined){
		return "";
	}
	let addr = [];
	addr = address.split(" ");

	return addr[0] + ' '+ addr[1];
}

/**
 * 주소에서 "시/군/구 + 읍면동" 부분만 뽑는다.
 * 앞에 "대한민국"이 붙은 예전 데이터와 없는 데이터를 모두 흡수한다. (2026-08-12)
 */
/**
 * 주소를 짧게. "대한민국 경기도 남양주시 다산동" -> "남양주시 다산동"
 *
 * 시/도(경기도·서울특별시…)는 뗀다. 어차피 내 주변 일감이라 같은 도(道)이고,
 * 앞에 붙으면 줄이 길어져 옆 글자를 밀어낸다. (형 리뷰 2026-08-12 "앞에 경기 는 없어도 됨")
 */
const SIDO = /(특별시|광역시|특별자치시|특별자치도|[가-힣]*도)$/;

export const shortRegion = (address) => {
  const parts = String(address || '').trim().split(/\s+/).filter(Boolean);
  let body = parts[0] === '대한민국' ? parts.slice(1) : parts;
  // 첫 마디가 시/도면 뗀다. 단 그것뿐이면(뒤가 없으면) 그대로 둔다
  if (body.length > 1 && (SIDO.test(body[0]) || body[0] === '서울' || body[0] === '경기')) {
    body = body.slice(1);
  }
  return body.slice(0, 2).join(' ');
};
