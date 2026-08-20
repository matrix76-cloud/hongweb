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


exports.api = functions.region('asia-northeast1').https.onRequest(app);


/* ── 푸시 알림 (FCM) — functions/fcm.js ─────────────────────────
   notifications 문서 생성 -> 발송 / 즉시 발송 테스트 / 오래된 알림 정리 */
const fcm = require('./fcm');
exports.onNotificationCreate = fcm.onNotificationCreate;
exports.sendTestPush = fcm.sendTestPush;
exports.notificationCleanup = fcm.notificationCleanup;

/* 이메일 인증코드 로그인 · 이메일 찾기 (형 지시 2026-08-12)
   비밀번호 없이 코드로 들어온다. 마스킹은 서버에서 한다. */
const emailAuth = require('./emailAuth');
exports.sendLoginCode = emailAuth.sendLoginCode;
exports.verifyLoginCode = emailAuth.verifyLoginCode;
exports.findMaskedEmail = emailAuth.findMaskedEmail;
exports.withdrawAccount = emailAuth.withdrawAccount;

/* 카카오로 시작하기 (형 지시 2026-08-18)
   앱이 네이티브로 받은 카카오 토큰을 파이어베이스 커스텀 토큰으로 바꿔준다. */
const kakaoAuth = require('./kakaoAuth');
exports.kakaoCustomToken = kakaoAuth.kakaoCustomToken;


/* 토스페이먼츠 결제 (형 지시 2026-08-20)
   결제 승인은 반드시 서버에서 한다 — 앞단에서 하면 금액을 손댈 수 있다. */
const tossPay = require('./tossPay');
exports.tossPrepare = tossPay.tossPrepare;
exports.tossConfirm = tossPay.tossConfirm;
