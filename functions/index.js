/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require("cors")({ origin: true });
const request = require("request");
const functions = require("firebase-functions");
const admin = require('firebase-admin');

const express = require('express');
const bodyParser = require('body-parser');
const randomLocation = require('random-location'); // 라이브러리 import
var popbill = require('popbill');

const serviceAccount = require('./serviceAccountKey.json');

const admin2 = require('firebase-admin');


popbill.config( {

  // 링크아이디
  LinkID :'KKAN22',

  // 비밀키
  SecretKey : '0jZB2lgvJhxVFE7JbMVGoxz1o5gY45ubUDDnIVS1Ndw=',

  // 연동환경 설정, true-테스트, false-운영(Production), (기본값:false)
  IsTest : true,

  // 통신 IP 고정, true-사용, false-미사용, (기본값:true)
  IPRestrictOnOff: true,

  // 팝빌 API 서비스 고정 IP 사용여부, 기본값(false)
  UseStaticIP: false,

  // 로컬시스템 시간 사용여부, true-사용, false-미사용, (기본값:true)
  UseLocalTimeYN: true,

  defaultErrorHandler: function (Error) {
    console.log('Error Occur : [' + Error.code + '] ' + Error.message);
  }

});

// 문자 서비스 객체 초기화
var messageService = popbill.MessageService();

const SUPERADMIN_USERS_ID="IPxcQht8oijTN3sUBjhR";
const WORKSTATUS ={
	OPEN : 0,
	CLOSE : 1,
}

const GEOCODING_API_KEY = "AIzaSyBe1PFtU89t61ULsIPIfowduJyy6PgpFB4"; // Firebase 환경 변수에서 API 키를 가져옵니다

// Firebase Admin 초기화


// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });
 admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();
// const bucketName = 'help-bbcb5.appspot.com';  // 버킷 이름

const bucket = storage.bucket();


const distanceFunc = (lat1, lon1, lat2, lon2) => {
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
  
const  deg2rad = (deg)=> {
	return deg * (Math.PI/180);
}

/**
 * 스케쥴정보
 * 매시간 1분마다 실행 되는 스케쥴입니다
 * [일감이 자신의 주위에서 등록되어 있으면 푸시 알람을 보내주는 스케쥴]
 * 1) 일감 지원에 대한 메시지를 전송한다
 * 
 */

exports.scheduledWorkRegisterFunction = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {

  functions.logger.info("이 함수는 매1분마다 실행됩니다 ");
  // 실행하고자 하는 코드


  const deviceToken = 'ee7iCUGLSG6x2M4usTgrpD:APA91bFCaabMBDGn7S1mlPeaVgf1qjiQgh9OH29XqnERpsMWIg-7ARmmkyRAaPAkPOKa7rm0e-EB-s1UA7LkpkQudirufIog3dbazuYqv4QfcGhyzauWohBBwCK8NDQT5aIHTbNVQQve';

  const message = {
    token: deviceToken,
    notification: {
      title: '홍여사 일감 등록',
      body: '남양주 호평동에서 애견산책 일감이 등록하였습니다',
      image:'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Flogo.png?alt=media&token=0a27d967-e4b5-4d4d-8862-6bd77649d496'
    },
    android: {
      notification: {
        sound: 'goout_sound',  // 'res/raw/custom_sound.mp3' (안드로이드)
        channel_id: 'custom_channel_id1', // 위에서 정의한 채널 ID와 일치해야 함
      }
    },
  };

  admin
  .messaging()
  .send(message)
  .then((response) => {
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });
  return null;
});


/**
 * 스케쥴정보
 * 매시간 1분마다 실행 되는 스케쥴입니다
 * [체팅 내용에 대힌 푸시 알람을 보내주는 스케쥴]
 * 1) 체팅등록에 대한 메시지를 전송한다
 * 
 */
// exports.scheduledChatFunction = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {

//   functions.logger.info("이 함수는 매1분마다 실행됩니다 ");
//   // 실행하고자 하는 코드


//   const deviceToken = 'cMBApCILRZaSRJqa4EwnqH:APA91bHVTRgd-d9fFlBlqAPq6F1ohBryMjhkFNN6N3bqGkRJ7i8jL98zEfv34Mo9juyTEjcCyPmzn7kG-JTstdXjhgrnglpYrdSjbAcJST67n0lorIBfz8xwIdEbT4Ud0ctYnDZ2Aabp';
//   const message = {
//     token: deviceToken,
//     notification: {
//       title: '홍여사 체팅',
//       body: '홍여사에서 읽지 않은 체팅 내용이 있습니다',
//       image:'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Flogo.png?alt=media&token=0a27d967-e4b5-4d4d-8862-6bd77649d496'
//     },
//     android: {
//       notification: {
//         sound: 'chat_sound',  // 'res/raw/custom_sound.mp3' (안드로이드)
//         channel_id: 'custom_channel_id2', // 위에서 정의한 채널 ID와 일치해야 함
//       }
//     },
//   };

//   admin
//   .messaging()
//   .send(message)
//   .then((response) => {
//     console.log('Successfully sent message:', response);
//   })
//   .catch((error) => {
//     console.log('Error sending message:', error);
//   });
//   return null;
// });

/**
 * 스케쥴정보
 * 매시간 1분마다 실행 되는 스케쥴입니다
 * [홍여사 일감 내용에 대힌 푸시 알람을 보내주는 스케쥴]
 * 1) 홍여사 일감등록에 대한 메시지를 전송한다
 * 
 */
// exports.scheduledChatFunction = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {

//   functions.logger.info("이 함수는 매1분마다 실행됩니다 ");
//   // 실행하고자 하는 코드


//   const deviceToken = 'cMBApCILRZaSRJqa4EwnqH:APA91bHVTRgd-d9fFlBlqAPq6F1ohBryMjhkFNN6N3bqGkRJ7i8jL98zEfv34Mo9juyTEjcCyPmzn7kG-JTstdXjhgrnglpYrdSjbAcJST67n0lorIBfz8xwIdEbT4Ud0ctYnDZ2Aabp';
//   const message = {
//     token: deviceToken,
//     notification: {
//       title: '홍여사 일감',
//       body: '홍여사에서 등록된 홍여사 일감이 있습니다',
//       image:'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Flogo.png?alt=media&token=0a27d967-e4b5-4d4d-8862-6bd77649d496'
//     },
//     android: {
//       notification: {
//         sound: 'workregist_sound',  // 'res/raw/custom_sound.mp3' (안드로이드)
//         channel_id: 'custom_channel_id3', // 위에서 정의한 채널 ID와 일치해야 함
//       }
//     },
//   };

//   admin
//   .messaging()
//   .send(message)
//   .then((response) => {
//     console.log('Successfully sent message:', response);
//   })
//   .catch((error) => {
//     console.log('Error sending message:', error);
//   });
//   return null;
// });


/**
 * 스케쥴정보
 * 매시간 1분마다 실행 되는 스케쥴입니다
 * [일감 내용에 대힌 푸시 알람을 보내주는 스케쥴]
 * 1) 체팅등록에 대한 메시지를 전송한다
 * 
 */
// exports.scheduledChatFunction = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {

//   functions.logger.info("이 함수는 매1분마다 실행됩니다 ");
//   // 실행하고자 하는 코드


//   const deviceToken = 'cMBApCILRZaSRJqa4EwnqH:APA91bHVTRgd-d9fFlBlqAPq6F1ohBryMjhkFNN6N3bqGkRJ7i8jL98zEfv34Mo9juyTEjcCyPmzn7kG-JTstdXjhgrnglpYrdSjbAcJST67n0lorIBfz8xwIdEbT4Ud0ctYnDZ2Aabp';
//   const message = {
//     token: deviceToken,
//     notification: {
//       title: '홍여사 알람',
//       body: '홍여사에서 알람 내용이 있습니다',
//       image:'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Flogo.png?alt=media&token=0a27d967-e4b5-4d4d-8862-6bd77649d496'
//     },
//     android: {
//       notification: {
//         sound: 'alarm_sound',  // 'res/raw/custom_sound.mp3' (안드로이드)
//         channel_id: 'custom_channel_id4', // 위에서 정의한 채널 ID와 일치해야 함
//       }
//     },
//   };

//   admin
//   .messaging()
//   .send(message)
//   .then((response) => {
//     console.log('Successfully sent message:', response);
//   })
//   .catch((error) => {
//     console.log('Error sending message:', error);
//   });
//   return null;
// });

/**
 * 스케쥴정보
 * 매시간 1분마다 실행 되는 스케쥴입니다


 * 
 */
exports.scheduledCommunityFunction = functions.pubsub.schedule('every 2 hours').onRun(async (context) => {

  functions.logger.info("scheduledCommunityFunction 이 함수는 2시간 마다 실행됩니다 ");
  // 실행하고자 하는 코드

  const now = new Date();
  const currentHour = now.getHours();
  
  // 특정 시간 범위 (예: 오전 9시 ~ 오전 11시)에 동작 실행
  if (currentHour >= 6 && currentHour < 23) {
    console.log("지금은 오전 6시에서 22시 사이입니다. 작업을 실행합니다.");

    const randomNumber = Math.random();

    // 0일때만 동작한다
    if(randomNumber){

      const snapshot = await db.collection('COMMUNITYSUMMARY').get();
    
    
      // 문서 데이터를 배열로 저장
      const documents = snapshot.docs.map(doc => ({ 
        id: doc.id, ...doc.data() 
      }));
  
      // 데이타 업데이트 하기 

 

      for (const doc of documents) {
        if(doc.show == undefined){
          const newData = {
            show: true, 
            CREATEDT : Date.now()
          };

          console.log(doc.id);
          await db.collection('COMMUNITYSUMMARY').doc(doc.COMMUNITYSUMMARY_ID).update(newData);
          break;

          
        }
      }
 
  


    }


    // 여기에 원하는 작업 추가
  } else {
    console.log("지정된 시간이 아닙니다. 작업을 실행하지 않습니다.");
  }



});


/**
 * 스케쥴정보
 * TMP 사용하지 않음
 * 
 */
// exports.scheduledWorkFunction = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {


//   functions.logger.info("scheduledWorkFunction 이 함수는 5분 마다 실행됩니다 ");
//   // 실행하고자 하는 코드

//   const snapshot = await db.collection('WORK').get();
    
    
//   // 문서 데이터를 배열로 저장
//   const documents = snapshot.docs.map(doc => ({ 
//     id: doc.id, ...doc.data() 
//   }));

//   // 데이타 업데이트 하기 

//   for (const doc of documents) {
//     db.collection('WORKINFO').add({
//       CREATEDT : Date.now(),
//       USERS_ID : doc.USERS_ID,
//       WORKTYPE : doc.WORKTYPE,
//       WORK_INFO: doc.WORK_INFO,
//       WORK_STATUS : doc.WORK_STATUS,
//     })
//     .then(async(docRef) => {
//       const updateData = {
//         WORK_ID: docRef.id, 
//       };

//       console.log( docRef.id);
//       await db.collection('WORKINFO').doc( docRef.id).update(updateData);

//       })
//     .catch((error) => {
//       console.error('Error adding document: ', error);
//     });
//   }
// });

// const app = express();
// app.use(cors); // 모든 출처에 대해 CORS 허용

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use((req, res, next) => {
//   next();
// });

exports.scheduledRoomFunction = functions.pubsub.schedule('every 5 minutes').onRun(async (context) => {


  functions.logger.info("scheduledWorkFunction 이 함수는 5분 마다 실행됩니다 ");
  // 실행하고자 하는 코드

  const snapshot = await db.collection('ROOM').get();
    
    
  // 문서 데이터를 배열로 저장
  const documents = snapshot.docs.map(doc => ({ 
    id: doc.id, ...doc.data() 
  }));

  // 데이타 업데이트 하기 

  for (const doc of documents) {
    db.collection('ROOMINFO').add({
      CREATEDT : Date.now(),
      USERS_ID : doc.USERS_ID,
      ROOMTYPE : doc.ROOMTYPE,
      ROOM_INFO: doc.ROOM_INFO,
      ROOM_STATUS : doc.ROOM_STATUS,
    })
    .then(async(docRef) => {
      const updateData = {
        ROOM_ID: docRef.id, 
      };

      console.log( docRef.id);
      await db.collection('ROOMINFO').doc( docRef.id).update(updateData);

      })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });
  }
});

const app = express();
app.use(cors); // 모든 출처에 대해 CORS 허용

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  next();
});


/**
 * 의약품정보
 * FireStore 미사용 / Storage 미사용
 * 사용자 호출시마다
 */
app.post('/medicalmedicine', (req, response) => {
  const Item = JSON.parse(JSON.stringify(req.body));

  const NameEncode = encodeURIComponent(Item.name);
 
  const apiUrl = `https://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo=1&numOfRows=10&type=json&itemName=${NameEncode}`;

  functions.logger.info("/medicalmedicine  apiUrl", apiUrl);
  if (req.body) {
      request.get(
      {
        headers: {
          "Access-Control-Allow-Origin": '*',
          "auth-token": '*',
          "Content-Type": "application/json",
          "Accept" :'*/*'
        },
        url : apiUrl  
      },
      async function (error, res) {
      
        functions.logger.info("MEDICALMEDICINE=======> error ",error);

        response.send(res.body);


      }
    );

  } else {
    res.status(400).send('No body found in the request');
  }

});

/**
 *  병원 서비스(특수진료서비스)
 * FireStore 미사용 / Storage 미사용
 * 사용자 호출시마다
 */
app.post('/medicalspecial', (req, response) => {
  const Item = JSON.parse(JSON.stringify(req.body));

  // const NameEncode = encodeURIComponent(Item.name);
 
  const apiUrl = `https://apis.data.go.kr/B551182/MadmDtlInfoService2.6/getSpclDiagInfo2.6?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&_type=json&pageNo=1&numOfRows=20&ykiho=${Item.name}`;

  functions.logger.info("/medicalspecial  apiUrl", apiUrl);
  if (req.body) {
      request.get(
      {
        headers: {
          "Access-Control-Allow-Origin": '*',
          "auth-token": '*',
          "Content-Type": "application/json",
          "Accept" :'*/*'
        },
        url : apiUrl  
      },
      async function (error, res) {
      
        functions.logger.info("medicalspecial=======> error ",error);

        response.send(res.body);

      }
    );

  } else {
    res.status(400).send('No body found in the request');
  }

});


/**
 *  병원 서비스(시설정보)
 * FireStore 미사용 / Storage 미사용
 * 사용자 호출시마다
 */
app.post('/medicalfacility', (req, response) => {
  const Item = JSON.parse(JSON.stringify(req.body));

  // const NameEncode = encodeURIComponent(Item.name);
 
  const apiUrl = `https://apis.data.go.kr/B551182/MadmDtlInfoService2.6/getEqpInfo2.6?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&_type=json&pageNo=1&numOfRows=10&ykiho=${Item.name}`;


  functions.logger.info("/medicalfacility  apiUrl", apiUrl);
  if (req.body) {
      request.get(
      {
        headers: {
          "Access-Control-Allow-Origin": '*',
          "auth-token": '*',
          "Content-Type": "application/json",
          "Accept" :'*/*'
        },
        url : apiUrl  
      },
      async function (error, res) {
      
        functions.logger.info("medicalfacility=======> error ",error);

        response.send(res.body);

      }
    );

  } else {
    res.status(400).send('No body found in the request');
  }

});


/**
 *  병원 서비스(진료과목)
 * FireStore 미사용 / Storage 미사용
 * 사용자 호출시마다
 */
app.post('/medicaldepartment', (req, response) => {
  const Item = JSON.parse(JSON.stringify(req.body));


 
  const apiUrl = `https://apis.data.go.kr/B551182/MadmDtlInfoService2.6/getSpcSbjtSdrInfo2.6?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&_type=json&pageNo=1&numOfRows=40&ykiho=${Item.name}`;



  functions.logger.info("/medicaldepartment  apiUrl", apiUrl);
  if (req.body) {
      request.get(
      {
        headers: {
          "Access-Control-Allow-Origin": '*',
          "auth-token": '*',
          "Content-Type": "application/json",
          "Accept" :'*/*'
        },
        url : apiUrl  
      },
      async function (error, res) {
      
        functions.logger.info("medicaldepartment=======> error ",error);

        response.send(res.body);

      }
    );

  } else {
    res.status(400).send('No body found in the request');
  }

});

/**
 *  병원 서비스(장비)
 * FireStore 미사용 / Storage 미사용
 * 사용자 호출시마다
 */
app.post('/medicalequipment', (req, response) => {
  const Item = JSON.parse(JSON.stringify(req.body));


 
  const apiUrl = `https://apis.data.go.kr/B551182/MadmDtlInfoService2.6/getMedOftInfo2.6?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&_type=json&pageNo=1&numOfRows=40&ykiho=${Item.name}`;



  functions.logger.info("/medicalequipment  apiUrl", apiUrl);
  if (req.body) {
      request.get(
      {
        headers: {
          "Access-Control-Allow-Origin": '*',
          "auth-token": '*',
          "Content-Type": "application/json",
          "Accept" :'*/*'
        },
        url : apiUrl  
      },
      async function (error, res) {
      
        functions.logger.info("medicalequipment=======> error ",error);

        response.send(res.body);

      }
    );

  } else {
    res.status(400).send('No body found in the request');
  }

});


/**
 * 건강기증식품정보
 * FireStore 미사용 / Storage 미사용
 * 사용자 호출시마다
 */
app.post('/foodhealth', (req, response) => {
  const Item = JSON.parse(JSON.stringify(req.body));

  const NameEncode = encodeURIComponent(Item.name);
 
  const apiUrl =`https://apis.data.go.kr/1471000/HtfsInfoService03/getHtfsItem01?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo=1&numOfRows=50&type=json&Prduct=${NameEncode}`;

  functions.logger.info("/foodhealth  apiUrl", apiUrl);
  if (req.body) {
      request.get(
      {
        headers: {
          "Access-Control-Allow-Origin": '*',
          "auth-token": '*',
          "Content-Type": "application/json",
          "Accept" :'*/*'
        },
        url : apiUrl  
      },
      async function (error, res) {
      
        functions.logger.info("foodhealth=======> error ",error);

        response.send(res.body);


      }
    );

  } else {
    res.status(400).send('No body found in the request');
  }

});

app.post('/smssend', (req, res) => {
  cors(req, res, async() => {

    const Item = JSON.parse(JSON.stringify(req.body));

    const RECEIVENUM = Item.receivenum;
    const AUTHCODE = Item.authcode;

    functions.logger.info("receiptNum", RECEIVENUM);

    functions.logger.info("receiptNum", AUTHCODE);

    // 팝빌회원 사업자번호, '-' 제외 10자리
    var testCorpNum = '7651302236';
    // 발신번호
    var sendNum = '01062149756';
    // 발신자명
    var sendName = '[홍여사웹발신]';
    // 수신번호
    var receiveNum = RECEIVENUM;
    var receiveName ='';
    // 메시지 내용, 90Byte 초과시 길이가 조정되어 전송
    var contents = '본인확인 인증번호는['+AUTHCODE+']입니다. 타인노출금지';
    // 예약전송일시(yyyyMMddHHmmss), 미기재시 즉시전송
    var reserveDT = '';
    // 광고문자 전송여부
    var adsYN = false;

    // 요청번호
    // 파트너가 전송 건에 대해 관리번호를 구성하여 관리하는 경우 사용.
    // 1~36자리로 구성. 영문, 숫자, 하이픈(-), 언더바(_)를 조합하여 팝빌 회원별로 중복되지 않도록 할당.
    var requestNum = "";

    messageService.sendSMS(testCorpNum, sendNum, receiveNum, receiveName, contents,
    reserveDT, adsYN, sendName, requestNum,
    function (receiptNum) {
      functions.logger.info("receiptNum", receiptNum);
        res.render('result', {path: req.path, result: receiptNum});
    }, function (Error) {
      functions.logger.info("sendSMS Error", Error.message);
        res.render('response', {path: req.path, code: Error.code, message: Error.message});
    });


  });
});


app.post('/newwork', (req, res) => {
  cors(req, res, async() => {

    const Item = JSON.parse(JSON.stringify(req.body));

    const WORKITEMS = Item.workitems;


    WORKITEMS.map(async(data)=>{

      functions.logger.info("WORKITEMS", data.WORK_INFO[9]);

      const docRef = await db.collection('WORK').add({
        WORK_STATUS : data.WORK_STATUS,
        WORK_INFO : data.WORK_INFO,
        WORKTYPE : data.WORKTYPE,
        USERS_ID : SUPERADMIN_USERS_ID,
        CREATEDT: Date.now(),  // 서버 시간을 타임스탬프로 저장
      });
  
      const docId = docRef.id; // HTTP 요청에서 docId를 쿼리로 받아옵니다.

      // 업데이트할 데이터
      const newData = {
          WORK_ID: docId, 
      };
  
      // 문서 업데이트
      await db.collection('WORK').doc(docId).update(newData);

    })


    // 응답으로 데이터 전송
    res.status(200).json('ok');
    

  });
});

app.post('/newroom', (req, res) => {
  cors(req, res, async() => {

    const Item = JSON.parse(JSON.stringify(req.body));

    const ROOMITEMS = Item.roomitems;


    ROOMITEMS.map(async(data)=>{

      functions.logger.info("ROOMITEMS", data.ROOM_INFO[7]);

      const docRef = await db.collection('ROOM').add({
        ROOM_STATUS : data.ROOM_STATUS,
        ROOM_INFO : data.ROOM_INFO,
        ROOMTYPE : data.ROOMTYPE,
        USERS_ID : SUPERADMIN_USERS_ID,
        CREATEDT: Date.now(),  // 서버 시간을 타임스탬프로 저장
      });
  
      const docId = docRef.id; // HTTP 요청에서 docId를 쿼리로 받아옵니다.

      // 업데이트할 데이터
      const newData = {
          ROOM_ID: docId, 
      };
  
      // 문서 업데이트
      await db.collection('ROOM').doc(docId).update(newData);

    })


    // 응답으로 데이터 전송
    res.status(200).json('ok');
    

  });
});


exports.api = functions.region('asia-northeast1').https.onRequest(app);



/**
 * 한국관광공사 관광지 사진:  관광지 정보 / 매일 스케줄에 의해 동작
 * FireStore 미사용 / Storage 사용
 */
exports.get_TOURPICTURE = functions.region('asia-northeast1').https.onRequest((req, response) => {
  cors(req, response, () => {


    request.get(
      {
        headers: {
          "Access-Control-Allow-Origin": '*',
          "auth-token": '*',
          "Content-Type": "application/json;",
          "Accept" :'*/*'
        },
        url : "https://apis.data.go.kr/B551011/PhotoGalleryService1/galleryList1?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo=1&numOfRows=1000&MobileOS=ETC&MobileApp=AppTest&_type=json",
   
      },
      async function (error, res) {
        functions.logger.info("get_TOURPICTURE: ", res.body);


        // 대용량 데이터를 Firebase Storage에 업로드
        const file = bucket.file('images/tourpicture.json');
        await file.save(JSON.stringify(res.body), {
          contentType: 'application/json',
        });

       
        response.send(res.body);
      }
    );
  });
});

/**
* 전국문화축제 정보 api : 전국문화축제 정보 / 매일 스케줄에 의해 동작
* FireStore 사용 / Storage 미사용
*/
exports.get_TOURFESTIVAL = functions.region('asia-northeast1').https.onRequest((req, response) => {
  cors(req, response, () => {


    request.get(
      {
        headers: {
          "Access-Control-Allow-Origin": '*',
          "auth-token": '*',
          "Content-Type": "application/json;",
          "Accept" :'*/*'
        },
        url : "http://api.data.go.kr/openapi/tn_pubr_public_cltur_fstvl_api?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo=1&numOfRows=10000&type=json",
   
      },
      async function (error, res) {
        functions.logger.info("get_TOURREGION: ", res.body);

        const sanitizedData = {};

        const dataToSave = JSON.parse(JSON.stringify(res.body));

     
        await db.collection('TOURFESTIVAL').doc('RAWDATA').set({ data : dataToSave });


        response.send(res.body);
      }
    );
  });
});



/**
 * 향토문화유적 정보 api : 향토문화유적 정보 / 매일 스케줄에 의해 동작
 * FireStore 미사용 / Storage 사용
 */
exports.get_TOURCOUNTRY = functions.region('asia-northeast1').https.onRequest((req, response) => {
  cors(req, response, () => {


    request.get(
      {
        headers: {
          "Access-Control-Allow-Origin": '*',
          "auth-token": '*',
          "Content-Type": "application/json;",
          "Accept" :'*/*'
        },
        url : "http://api.data.go.kr/openapi/tn_pubr_public_nvpc_cltur_relics_api?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo=1&numOfRows=1000&type=json",
   
      },
      async function (error, res) {
        functions.logger.info("get_TOURCOUNTRY: ", res.body);


        // 대용량 데이터를 Firebase Storage에 업로드
        const file = bucket.file('images/tourcountry.json');
        await file.save(JSON.stringify(res.body), {
          contentType: 'application/json',
        });


        response.send(res.body);
      }
    );
  });
});




/**
 * 관광지:  / 매일 스케줄에 의해 동작
 * FireStore 미사용 / Storage 사용
 */

exports.get_TOURREGION = functions.region('asia-northeast1').https.onRequest((req, response) => {
  cors(req, response, () => {


    request.get(
      {
        headers: {
          "Access-Control-Allow-Origin": '*',
          "auth-token": '*',
          "Content-Type": "application/json;",
          "Accept" :'*/*'
        },
        url : "http://api.data.go.kr/openapi/tn_pubr_public_trrsrt_api?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo=1&numOfRows=10000&type=json",
   
      },
      async function (error, res) {
        functions.logger.info("get_TOURREGION: ", res.body);


        const file = bucket.file('images/tourregion.json');
        await file.save(JSON.stringify(res.body), {
          contentType: 'application/json',
        });


        response.send(res.body);
      }
    );
  });
});


/**
 * 공연정보:  / 매일 스케줄에 의해 동작
 * FireStore 미사용 / Storage 사용
 * 일자 별로 쿼리 를 하기때문에 5분 걸림
 */
exports.get_PERFORMANCEEVENT = functions.region('asia-northeast1').runWith({
  timeoutSeconds: 500,  // 최대 실행 시간을 500초로 설정
}).https.onRequest((req, response) => {
  cors(req, response, async () => {

    // 현재 날짜 가져오기
    const today = new Date();

    // 올해의 12월 31일 날짜 설정
    const endOfYear = new Date(today.getFullYear(), 11, 31);

    // 날짜 반복을 위한 변수 초기화
    let currentDate = new Date(today);

    // 결과를 저장할 배열
    const results = [];

    // 현재 날짜부터 12월 31일까지 일자 순으로 반복
    while (currentDate <= endOfYear) {
        // 예시 로직: 날짜를 YYYY-MM-DD 형식으로 저장
        const formattedDate = currentDate.toISOString().split('T')[0];
    
        
        functions.logger.info("POLICY DATE: ", formattedDate);
        request.get(
          {
            headers: {
              "Access-Control-Allow-Origin": '*',
              "auth-token": '*',
              "Content-Type": "application/json;",
              "Accept" :'*/*'
            },
            url : "http://api.data.go.kr/openapi/tn_pubr_public_pblprfr_event_info_api?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo=1&numOfRows=100&type=json&eventStartDate="+formattedDate,
       
          },
          async function (error, res) {
            functions.logger.info("get_PERFORMANCEEVENT: ", res.body);
            results.push({"dateitem" : res.body});
  
          
          }
        );

        await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 지연
        // 다음 날짜로 이동
        currentDate.setDate(currentDate.getDate() + 1);
    }


    const file = bucket.file('images/performanceevent.json');
    file.save(JSON.stringify(results), {
      contentType: 'application/json',
    });
    
    setTimeout(() => {
      res.send('Function completed after a long execution time.');
    }, 30000);  // 예: 30초 동안 대기

            

  });
});

/**
 * 공공시설 개발:  / 매일 스케줄에 의해 동작
 * FireStore 미사용 / Storage 사용
 */

exports.get_PERFORMANCECINEMA = functions.region('asia-northeast1').https.onRequest((req, response) => {
  cors(req, response, () => {


    request.get(
      {
        headers: {
          "Access-Control-Allow-Origin": '*',
          "auth-token": '*',
          "Content-Type": "application/json;",
          "Accept" :'*/*'
        },
        url : "http://api.data.go.kr/openapi/tn_pubr_public_pblfclt_opn_info_api?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo=1&numOfRows=1000&type=json",
   
      },
      async function (error, res) {
        functions.logger.info("get_PERFORMANCECINEMA: ", res.body);


        const file = bucket.file('images/performancecinema.json');
        await file.save(JSON.stringify(res.body), {
          contentType: 'application/json',
        });


        response.send(res.body);
      }
    );
  });
});


/**
 * 건강기능 식품 목록정보 :  / 매일 스케줄에 의해 동작
 * FireStore 미사용 / Storage 사용
 * 한페이지당 가능 건수가 100 건이므로 100 페이를 기본으로 돌되 데이타 없으면 멈춘다
 * 사용안함
 */

exports.get_HEALTHFOOD = functions.region('asia-northeast1').runWith({
  timeoutSeconds: 500,  // 최대 실행 시간을 500초로 설정
}).https.onRequest((req, response) => {
  cors(req, response, async () => {



    // 날짜 반복을 위한 변수 초기화
    let currentpage = 1;
    let endpage =400;

    // 결과를 저장할 배열
    const results = [];

    // 현재 날짜부터 12월 31일까지 일자 순으로 반복
    while (currentpage < endpage) {
        // 예시 로직: 날짜를 YYYY-MM-DD 형식으로 저장
   
        request.get(
          {
            headers: {
              "Access-Control-Allow-Origin": '*',
              "auth-token": '*',
              "Content-Type": "application/json;",
              "Accept" :'*/*'
            },
            url : "https://apis.data.go.kr/1471000/HtfsInfoService03/getHtfsList01?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo="+currentpage+"&numOfRows=100&type=json",
       
          },
          async function (error, res) {
            functions.logger.info("get_HEALTHFOOD: ", res.body);
            results.push({"fooditem" : res.body});
  
          
          }
        );

        await new Promise((resolve) => setTimeout(resolve, 100)); 
        // 다음 날짜로 이동
        currentpage++;
    }


    const file = bucket.file('images/healthfood.json');
    file.save(JSON.stringify(results), {
      contentType: 'application/json',
    });
    
    setTimeout(() => {
      res.send('Function completed after a long execution time.');
    }, 30000);  // 예: 30초 동안 대기

          
  });
});

/**
 * 병원 정보 서비스 :  / 매일 스케줄에 의해 동작
 * FireStore 미사용 / Storage 사용
 * 한페이지당 가능 건수가 1000 건에  20 페이지를 기본으로 돈다(77000건 정도 등록 되어 있음)
 * 사용안함
 */
exports.get_HOSPITAL1 = functions.region('asia-northeast1').runWith({
  timeoutSeconds: 500,  // 최대 실행 시간을 500초로 설정
}).https.onRequest((req, response) => {
  cors(req, response, async () => {

    // 최초 페이지 설정
    let currentpage = 1;
    let endpage =20;

    // 결과를 저장할 배열
    const results = [];


    while (currentpage < endpage) {
        // 예시 로직: 날짜를 YYYY-MM-DD 형식으로 저장
   
        request.get(
          {
            headers: {
              "Access-Control-Allow-Origin": '*',
              "auth-token": '*',
              "Content-Type": "application/json;",
              "Accept" :'*/*'
            },
            url : "https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo="+currentpage+"&numOfRows=1000&type=json",
          },
          async function (error, res) {
            functions.logger.info("get_HOSPITAL1: ", res.body);
            results.push({"hospitalitem" : res.body});
  
          
          }
        );

        await new Promise((resolve) => setTimeout(resolve, 5000)); 
        // 다음 날짜로 이동
        currentpage++;
    }


    const file = bucket.file('images/hospital1.json');
    file.save(JSON.stringify(results), {
      contentType: 'application/json',
    });
    
    setTimeout(() => {
      response.send('Function completed after a long execution time.');
    }, 30000);  // 예: 30초 동안 대기

          
  });
});

exports.get_HOSPITAL2 = functions.region('asia-northeast1').runWith({
  timeoutSeconds: 500,  // 최대 실행 시간을 500초로 설정
}).https.onRequest((req, response) => {
  cors(req, response, async () => {

    // 최초 페이지 설정
    let currentpage = 21;
    let endpage =40;

    // 결과를 저장할 배열
    const results = [];


    while (currentpage < endpage) {
        // 예시 로직: 날짜를 YYYY-MM-DD 형식으로 저장
   
        request.get(
          {
            headers: {
              "Access-Control-Allow-Origin": '*',
              "auth-token": '*',
              "Content-Type": "application/json;",
              "Accept" :'*/*'
            },
            url : "https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo="+currentpage+"&numOfRows=1000&type=json",
          },
          async function (error, res) {
            functions.logger.info("get_HOSPITAL2: ", res.body);
            results.push({"hospitalitem" : res.body});
  
          
          }
        );

        await new Promise((resolve) => setTimeout(resolve, 5000)); 
        // 다음 날짜로 이동
        currentpage++;
    }


    const file = bucket.file('images/hospital2.json');
    file.save(JSON.stringify(results), {
      contentType: 'application/json',
    });
    
    setTimeout(() => {
      response.send('Function completed after a long execution time.');
    }, 30000);  // 예: 30초 동안 대기

          
  });
});

exports.get_HOSPITAL3 = functions.region('asia-northeast1').runWith({
  timeoutSeconds: 500,  // 최대 실행 시간을 500초로 설정
}).https.onRequest((req, response) => {
  cors(req, response, async () => {

    // 최초 페이지 설정
    let currentpage = 41;
    let endpage =60;

    // 결과를 저장할 배열
    const results = [];


    while (currentpage < endpage) {
        // 예시 로직: 날짜를 YYYY-MM-DD 형식으로 저장
   
        request.get(
          {
            headers: {
              "Access-Control-Allow-Origin": '*',
              "auth-token": '*',
              "Content-Type": "application/json;",
              "Accept" :'*/*'
            },
            url : "https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo="+currentpage+"&numOfRows=1000&type=json",
          },
          async function (error, res) {
            functions.logger.info("get_HOSPITAL3: ", res.body);
            results.push({"hospitalitem" : res.body});
  
          
          }
        );

        await new Promise((resolve) => setTimeout(resolve, 5000)); 
        // 다음 날짜로 이동
        currentpage++;
    }


    const file = bucket.file('images/hospital4json');
    file.save(JSON.stringify(results), {
      contentType: 'application/json',
    });
    
    setTimeout(() => {
      response.send('Function completed after a long execution time.');
    }, 30000);  // 예: 30초 동안 대기

          
  });
});

exports.get_HOSPITAL4 = functions.region('asia-northeast1').runWith({
  timeoutSeconds: 500,  // 최대 실행 시간을 500초로 설정
}).https.onRequest((req, response) => {
  cors(req, response, async () => {

    // 최초 페이지 설정
    let currentpage = 61;
    let endpage =77;

    // 결과를 저장할 배열
    const results = [];


    while (currentpage < endpage) {
        // 예시 로직: 날짜를 YYYY-MM-DD 형식으로 저장
   
        request.get(
          {
            headers: {
              "Access-Control-Allow-Origin": '*',
              "auth-token": '*',
              "Content-Type": "application/json;",
              "Accept" :'*/*'
            },
            url : "https://apis.data.go.kr/B551182/hospInfoServicev2/getHospBasisList?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo="+currentpage+"&numOfRows=1000&type=json",
          },
          async function (error, res) {
            functions.logger.info("get_HOSPITAL4: ", res.body);
            results.push({"hospitalitem" : res.body});
  
          
          }
        );

        await new Promise((resolve) => setTimeout(resolve, 5000)); 
        // 다음 날짜로 이동
        currentpage++;
    }


    const file = bucket.file('images/hospital4.json');
    file.save(JSON.stringify(results), {
      contentType: 'application/json',
    });
    
    setTimeout(() => {
      response.send('Function completed after a long execution time.');
    }, 30000);  // 예: 30초 동안 대기

          
  });
});
/**
 * 캠핑장 정보 서비스 :  / 매일 스케줄에 의해 동작
 * FireStore 미사용 / Storage 사용
 * 한페이지당 가능 건수가 1000 건이므로 4 페이지를 기본으로 돈다(4000건 정도 등록 되어 있음)
 * 사용안함
 */
exports.get_CAMPING = functions.region('asia-northeast1').runWith({
  timeoutSeconds: 500,  // 최대 실행 시간을 500초로 설정
}).https.onRequest((req, response) => {
  cors(req, response, async () => {

    // 최초 페이지 설정
    let currentpage = 1;
    let endpage =4;

    // 결과를 저장할 배열
    const results = [];

    // 현재 날짜부터 12월 31일까지 일자 순으로 반복
    while (currentpage < endpage) {
        // 예시 로직: 날짜를 YYYY-MM-DD 형식으로 저장
   
        request.get(
          {
            headers: {
              "Access-Control-Allow-Origin": '*',
              "auth-token": '*',
              "Content-Type": "application/json;",
              "Accept" :'*/*'
            },
            url : "https://apis.data.go.kr/B551011/GoCamping/basedList?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&numOfRows=1000&pageNo="+currentpage+"&MobileOS=ETC&MobileApp=AppTest",
          },
          async function (error, res) {
            functions.logger.info("get_CAMPING: ", res.body);
            results.push({"campingitem" : res.body});
  
          
          }
        );

        await new Promise((resolve) => setTimeout(resolve, 10000)); 
        // 다음 날짜로 이동
        currentpage++;
    }


    const file = bucket.file('images/camping.json');
    file.save(JSON.stringify(results), {
      contentType: 'application/json',
    });
    
    setTimeout(() => {
      response.send('Function completed after a long execution time.');
    }, 30000);  // 예: 30초 동안 대기

          
  });
});

