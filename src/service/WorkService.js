import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';
import { collection, getDocs, query, updateDoc,where,doc,setDoc, deleteDoc, orderBy } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { COMMUNITYSTATUS, WORKSTATUS } from '../utility/status';
import randomLocation from 'random-location'
import { useSleep } from '../utility/common';
import Axios from 'axios';
import { getSearchRange } from '../utility/searchRange';
const authService = getAuth(firebaseApp);


/**
 * 카카오맵 SDK 는 이 모듈이 뜨는 시점에 아직 없을 수 있다.
 * (index.html 이 autoload=false 로 붙이고, 앱 웹뷰에서는 아예 못 붙는 경우도 있다)
 * 그래서 최상단에서 const { kakao } = window 로 굳히지 않고,
 * 쓰는 자리에서 await ensureKakao() 로 그때그때 가져온다. (2026-08-18)
 */
import { ensureKakao } from "../utility/kakaoReady";


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
 * Work 관련 서비스
 *! Create 
 * ① CreateWork : 
 * 요청 일감 생성 
 * USER_ID(요청자 정보 인덱스),
 * WORK_INFO(일감 정보 object)
 * WORK_STATUS(일감상태: 기본값 WORKSTATUS.OPEN), 
 * CREATEDT(일감요청일시: 현재시간), 
 *! Read
 * ① ReadWork : 모든 일감 가져오기
 *! Update
 
 *! Delete

 */


export const CreateWork = async({USERS_ID,WORKTYPE, WORK_INFO, WORK_OPTION, WORK_PHOTOS}) =>{
  clearWorkCache();   // 목록이 바뀌었으니 보관해둔 것은 버린다 (2026-08-19)

  return new Promise(async (resolve, reject) => {
    let success = true;
    const WORKREF = doc(collection(db, "WORK"));
    const id = WORKREF.id;

    try{
       const newdata = {
           WORK_ID : id,
           USERS_ID : USERS_ID,
           WORKTYPE : WORKTYPE,
           WORK_INFO : WORK_INFO,
           // 올린 사람이 고른 연락 옵션. 지금은 보이스톡 허용 여부 하나뿐이다 (형 리뷰 2026-08-12)
           WORK_OPTION : { VOICETALK : false, ...(WORK_OPTION || {}) },
           // 참고 사진 URL 목록 (형 리뷰 2026-08-12). 올릴 때 이미 압축된 것만 들어온다
           WORK_PHOTOS : WORK_PHOTOS || [],
           WORK_STATUS : WORKSTATUS.OPEN,
           CREATEDT : Date.now(),
       }
       await setDoc(WORKREF, newdata);

       resolve(id);
    
    }catch(e){
      console.log("TCL: CreateWork -> error ",e.message )
       
        alert( e.message);
        success =false;
        resolve(-1);
    }finally{
    
    }

  });

}

export const CreateWorkInfo = async({USERS_ID,WORKTYPE, WORK_INFO}) =>{
  clearWorkCache();   // 목록이 바뀌었으니 보관해둔 것은 버린다 (2026-08-19)

  let success = true;
  const WORKREF = doc(collection(db, "WORKINFO"));
  const id = WORKREF.id;

  try{
     const newdata = {
         WORK_ID : id,
         WORKTYPE : WORKTYPE,
         WORK_INFO : WORK_INFO,
         WORK_STATUS : WORKSTATUS.OPEN,
         CREATEDT : Date.now(),
     }
     await setDoc(WORKREF, newdata);
  
  }catch(e){
    console.log("TCL: CreateWork -> error ",e.message )
     
      alert( e.message);
      success =false;
      return -1;
  }finally{
    return id;
  }
}

export const ReadAllWork = async()=>{
  const workRef = collection(db, "WORK");

  let workitems = [];
  let success = false;
  const q = query(workRef,orderBy("CREATEDT", "desc"));

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      workitems.push(doc.data());
  
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(workitems);
      } else {
        resolve(-1);
      }
    });
  }
}

/* 일감 목록 잠깐 보관 (형 지적 2026-08-19 "지도 클릭하고 들어갔을 때 너무 늦게 뜸")
 *
 * 홈·지도·검색이 모두 같은 목록을 쓰는데 탭을 옮길 때마다 처음부터 다시 받고 있었다.
 * WORK 는 문서를 통째로 받아 거리로 걸러내는 구조라 그 왕복이 그대로 대기 시간이 된다.
 * 같은 자리·같은 범위라면 잠깐 동안은 방금 받은 걸 그대로 쓴다.
 *
 * 새 일감이 늦게 보이면 안 되니 수명은 짧게 둔다. 등록·수정 뒤에는 clearWorkCache() 로 버린다.
 */
const WORK_CACHE_MS = 60 * 1000;
let workCache = null;   // { key, at, items }

export const clearWorkCache = () => { workCache = null; };

export const ReadWork = async({latitude, longitude, checkdistance})=>{
  // 범위를 넘기지 않으면 사용자가 설정한 값을 쓴다 (내 정보 > 나의 범위설정)
  // 0(지역 상관 없음) 이면 거리로 거르지 않는다 (형 리뷰 2026-08-21)
  const limitKm = checkdistance == null || checkdistance === '' ? getSearchRange() : Number(checkdistance);

  // 소수 셋째 자리면 100m 남짓 — 그 안에서 움직인 건 같은 자리로 본다
  const cacheKey = `${Number(latitude).toFixed(3)}|${Number(longitude).toFixed(3)}|${limitKm}`;
  if (workCache && workCache.key === cacheKey && Date.now() - workCache.at < WORK_CACHE_MS) {
    return workCache.items;
  }

  const workRef = collection(db, "WORK");

  let workitems = [];
  let success = false;
  const q = query(workRef,orderBy("CREATEDT", "desc"));

  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {

      let WORK_INFONEW = doc.data().WORK_INFO;

      const FindIndex = WORK_INFONEW.findIndex(x=>x.requesttype == '지역');

      // 지역 정보가 없는 문서는 건너뛴다.
      // 예전에 등록 도중 끊긴 문서가 다수 있는데, 이걸 거르지 않으면
      // WORK_INFO[-1].latitude 에서 예외가 나 조회 전체가 실패했다. (2026-08-12)
      if(FindIndex === -1 || WORK_INFONEW[FindIndex].latitude === undefined){
        return;
      }

      const distance = distanceFunc(WORK_INFONEW[FindIndex].latitude , WORK_INFONEW[FindIndex].longitude,latitude,longitude );
      

      if(!(limitKm > 0) || distance < limitKm){
        workitems.push(doc.data());
      }
  
    });

    if (querySnapshot.size > 0) {
      success = true;
      workCache = { key: cacheKey, at: Date.now(), items: workitems };
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(workitems);
      } else {
        resolve(-1);
      }
    });
  }
}


export const ReadWorkByIndividually = async({WORK_ID})=>{
  return new Promise(async (resolve, reject) => {
    const workRef = collection(db, "WORK");

    let workitem = {};
    let success = false;
    const q = query(workRef,where("WORK_ID", "==", WORK_ID));
   
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        workitem = doc.data();
      });
  
      if (querySnapshot.size > 0) {
        resolve(workitem);
      }else{
        resolve(-1);
      }

    } catch (e) {
      console.log("error", e.message);
      resolve(-1);
    } finally {

    }

  });

}

export const ReadRoomByIndividually = async({ROOM_ID})=>{
  const workRef = collection(db, "ROOM");

  let roomitem = {};
  let success = false;
  const q = query(workRef,where("ROOM_ID", "==", ROOM_ID));
 
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      roomitem = doc.data();
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(roomitem);
      } else {
        resolve(-1);
      }
    });
  }
}


export const DeleteWorkByUSER_ID = async({USER_ID}) =>{
  clearWorkCache();   // 목록이 바뀌었으니 보관해둔 것은 버린다 (2026-08-19)


  const workRef = collection(db, "WORK");

  let success = false;
  const q = query(workRef,where("USERS_ID", "==", USER_ID));
 
  try {
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async(doc) => {
      await deleteDoc(doc.ref);
    });

    if (querySnapshot.size > 0) {
      success = true;
    }
  } catch (e) {
    console.log("error", e.message);
  } finally {
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(0);
      } else {
        resolve(-1);
      }
    });
  }


}

export const DefaultReadWork = async({currentlatitude, currentlongitude})=>{

  /* 이 함수는 반드시 끝나야 한다.
   *
   * 예전에는 resolve 가 카카오 지오코더 콜백 안에만 있었다. 그래서
   *   · 카카오 SDK 가 안 떠 있거나 (앱 웹뷰에서 실제로 이랬다)
   *   · 읽어올 문서가 없거나
   *   · 좌표→주소 변환이 하나라도 실패하면
   * Promise 가 영영 끝나지 않았고, 이걸 await 하던 스플래시가 그 자리에 멈췄다.
   * 로딩 아이콘만 계속 도는 증상의 원인이다. (2026-08-18)
   *
   * 이제는 어떤 길로 가든 반드시 끝난다.
   */
  const kakaoSdk = await ensureKakao();

  return new Promise(async (resolve) => {
    const workRef = collection(db, "WORKINFO");

    const workitems = [];
    let done = false;
    const finish = () => { if (!done) { done = true; resolve(workitems); } };

    // 무슨 일이 있어도 10초 뒤에는 끝낸다
    const giveup = setTimeout(() => {
      console.log("TCL: DefaultReadWork -> 시간 초과, 모은 것만 넘긴다", workitems.length);
      finish();
    }, 10000);

    const settle = () => { clearTimeout(giveup); finish(); };

    try {
      const querySnapshot = await getDocs(query(workRef));

      let pending = 0;      // 주소 변환을 걸어둔 건수
      let scanned = false;  // 문서를 다 훑었는가
      const maybeDone = () => { if (scanned && pending === 0) settle(); };

      querySnapshot.forEach((doc) => {
        const item = { CREATEDT: "", WORKTYPE: "", WORK_INFO: [], WORK_STATUS: "" };
        item.WORKTYPE = doc.data().WORKTYPE;

        const WORK_INFONEW = doc.data().WORK_INFO;

        // 지역 정보가 없는 문서는 건너뛴다.
        // 등록 도중 끊긴 문서가 다수 있는데, 안 거르면 WORK_INFO[-1].latitude 에서
        // 예외가 나 조회 전체가 실패했다. (2026-08-12)
        const FindIndex = WORK_INFONEW.findIndex(x => x.requesttype == '지역');
        if (FindIndex === -1 || WORK_INFONEW[FindIndex].latitude === undefined) {
          return;
        }

        const P = { latitude: currentlatitude, longitude: currentlongitude };
        const R = 5000; // meters
        const randomPoint = randomLocation.randomCirclePoint(P, R);

        // 카카오 SDK 가 없으면 주소는 비워두고 좌표만 넣는다 — 멈추지 않는 게 우선이다
        if (!kakaoSdk?.maps?.services) {
          WORK_INFONEW[FindIndex].latitude = randomPoint.latitude;
          WORK_INFONEW[FindIndex].longitude = randomPoint.longitude;
          item.WORK_INFO = WORK_INFONEW;
          item.WORK_STATUS = 1;
          workitems.push(item);
          return;
        }

        pending += 1;
        const geocoder = new kakaoSdk.maps.services.Geocoder();
        geocoder.coord2Address(randomPoint.longitude, randomPoint.latitude, (result, status) => {
          try {
            if (status === kakaoSdk.maps.services.Status.OK) {
              WORK_INFONEW[FindIndex].result = result[0].address.address_name;
            }
            WORK_INFONEW[FindIndex].latitude = randomPoint.latitude;
            WORK_INFONEW[FindIndex].longitude = randomPoint.longitude;
            item.WORK_INFO = WORK_INFONEW;
            item.WORK_STATUS = 1;
            workitems.push(item);
          } catch (e) {
            console.log("TCL: DefaultReadWork -> 주소 변환 실패, 건너뛴다", e.message);
          } finally {
            pending -= 1;   // 성공이든 실패든 한 건은 처리됐다
            maybeDone();
          }
        });
      });

      scanned = true;
      maybeDone();          // 변환할 게 하나도 없으면 여기서 끝난다
    } catch (e) {
      console.log("TCL: DefaultReadWork -> 조회 실패, 빈 목록으로 끝낸다", e.message);
      settle();
    }
  });

}
export const findWorkAndFunctionCallFromCurrentPosition = async({currentlatitude, currentlongitude, checkdistance}) =>{

  let success = false;
  try{

    const readworkitems = await ReadAllWork();
    console.log("TCL: findWorkAndFunctionCallFromCurrentPosition -> readworkitems", readworkitems)

    let bExist =false;

    if(readworkitems != -1){
      readworkitems.map((data)=>{
  
        let WORK_INFONEW = data.WORK_INFO;
    
        const FindIndex = WORK_INFONEW.findIndex(x=>x.requesttype == '지역');

        if(FindIndex === -1 || WORK_INFONEW[FindIndex].latitude === undefined){
          return;
        }

      // 지역 정보가 없는 문서는 건너뛴다.
      // 예전에 등록 도중 끊긴 문서가 다수 있는데, 이걸 거르지 않으면
      // WORK_INFO[-1].latitude 에서 예외가 나 조회 전체가 실패했다. (2026-08-12)
      if(FindIndex === -1 || WORK_INFONEW[FindIndex].latitude === undefined){
        return;
      }
    
        const distance = distanceFunc(WORK_INFONEW[FindIndex].latitude , WORK_INFONEW[FindIndex].longitude,currentlatitude,currentlongitude );
    
        if(distance < checkdistance){
          bExist = true;
        }
      })
    }

  
    if(!bExist){
      // function에 호출하자
      const defaultreadworkitems = await DefaultReadWork({currentlatitude, currentlongitude});
      console.log("TCL: findWorkAndFunctionCallFromCurrentPosition -> defaultreadworkitems", defaultreadworkitems)
  
      const jsonPayload = {
        workitems: defaultreadworkitems,
      
      };
      console.log("TCL: firebase function call", defaultreadworkitems);
  
      Axios.post('https://asia-northeast1-help-bbcb5.cloudfunctions.net/api/newwork',  jsonPayload, {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(async(response) =>{
        console.log("TCL: StartProcess -> newwork post url", );
  
        success = true;
      })
      .catch((error) => {
  
      })
  
    }else{
      
      success = false;             
    
    }

  }catch(e){


  }finally{
    return new Promise((resolve, resject) => {
      if (success) {
        resolve(0);
      } else {
        resolve(-1);
      }
    });
  }


}

/**
 * 내가 올린 일감 — 내 정보 > 등록한 일감 / 마감한 일감
 * status 를 주면 그 상태만(0=진행중, 1=마감), 안 주면 전부.
 */
export const ReadWorkByUSERS_ID = async({USERS_ID, status})=>{
  const workRef = collection(db, "WORK");
  let workitems = [];
  try {
    const q = query(workRef, where("USERS_ID", "==", USERS_ID));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      if(status === undefined || data.WORK_STATUS === status){
        workitems.push(data);
      }
    });
    workitems.sort((a, b) => (b.CREATEDT || 0) - (a.CREATEDT || 0));
  } catch (e) {
    console.log("ReadWorkByUSERS_ID error", e.message);
  }
  return workitems;
}
