/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { Blob } = require("buffer");
if (typeof globalThis.File === "undefined") {
  globalThis.File = class File extends Blob {
    constructor(chunks = [], name = "file", options = {}) {
      super(chunks, options);
      this.name = String(name);
      this.lastModified = options.lastModified ?? Date.now();
      this.type = options.type ?? "";
    }
  };
}



const { onRequest } = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");
const cors = require("cors")({ origin: true });
const request = require("request");
const functions = require("firebase-functions");
const { getFirestore, doc, getDoc, setDoc } = require("firebase-admin/firestore");


const admin = require('firebase-admin');

const express = require('express');
const bodyParser = require('body-parser');

var popbill = require('popbill');

const serviceAccount = require('./serviceAccountKey.json');

const admin2 = require('firebase-admin');

const cheerio = require('cheerio');
const axios = require('axios');

const { subDays, format } = require("date-fns");

const moment = require('moment-timezone');
const puppeteer = require("puppeteer");



const fetch = require("node-fetch");
const path = require("path");
const xml2js = require("xml-js"); 


admin.initializeApp();

const db = admin.firestore();
const storage = admin.storage();


const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const os = require("os");
const fs = require("fs");

const { v4: uuidv4 } = require("uuid");



exports.syncWorknetV2 = require("./worknetV2").syncWorknetV2;

exports.scheduleWorknetJob = require("./worknet").scheduleWorknetJob;
exports.batchUpdateCategoriesS0 = require("./worknet").batchUpdateCategoriesS0;
exports.batchUpdateCategoriesS1 = require("./worknet").batchUpdateCategoriesS1;
exports.batchUpdateCategoriesS2 = require("./worknet").batchUpdateCategoriesS2;
exports.batchUpdateCategoriesS3 = require("./worknet").batchUpdateCategoriesS3;
exports.batchUpdateCategoriesS4 = require("./worknet").batchUpdateCategoriesS4;
exports.batchUpdateCategoriesS5 = require("./worknet").batchUpdateCategoriesS5;
exports.batchUpdateCategoriesS6 = require("./worknet").batchUpdateCategoriesS6;
exports.batchUpdateCategoriesS7 = require("./worknet").batchUpdateCategoriesS7;
exports.batchUpdateCategoriesS8 = require("./worknet").batchUpdateCategoriesS8;
exports.batchUpdateCategoriesS9 = require("./worknet").batchUpdateCategoriesS9;
exports.batchUpdateCategoriesS10 = require("./worknet").batchUpdateCategoriesS10;
exports.batchUpdateCategoriesS11 = require("./worknet").batchUpdateCategoriesS11;

// push (형이 만든 pushV2)

exports.pushTestEvery5min = require("./pushV2").pushTestEvery5min; // ← 이거



// AIV2 (이번에 만든 AI 전용)
exports.aiTranslateGemini = require("./aiV2").aiTranslateGemini;
exports.aiRewritePrompt = require("./aiV2").aiRewritePrompt;
exports.aiGenerateImage = require("./aiV2").aiGenerateImage;
exports.aiKoPromptToImage = require("./aiV2").aiKoPromptToImage;
exports.generateAudioForVerifiedWorkers = require("./aiV2").generateAudioForVerifiedWorkers;
exports.generateCreateTTSFromPrompt = require("./aiV2").generateCreateTTSFromPrompt;
exports.translateKoToEn = require("./aiV2").translateKoToEn;
exports.scheduledGenerateAiGallery = require("./aiV2").scheduledGenerateAiGallery;


exports.pushWorknetDaily = require("./pushWorknetDaily").pushWorknetDaily;

exports.careworkerJobs = require("./aiV2").careworkerJobs;


 const WORKIMAGE={
  HOMECLEAN : 'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Fhouse.png?alt=media&token=47fe418e-06a2-4b91-9a3e-381e5f3f9cec',
  BUSINESSCLEAN : 'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Fbusiness.png?alt=media&token=b15f5e59-8d20-4e48-ae93-1de75e899cc1',
  MOVECLEAN : 'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Fmovesmall.png?alt=media&token=4eea98e8-f33b-4d32-9c1b-04bf52d09ae9',
  FOODPREPARE : 'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Fcook.png?alt=media&token=d8d16405-4bfd-4e09-af19-11f726211ace',
  ERRAND : 'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Fhelp.png?alt=media&token=ac1db2dc-39d9-4a60-93e3-a7c11aedad55',
  GOOUTSCHOOL : 'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Fgooutschool.png?alt=media&token=b2cf9d23-bfda-4db0-b736-6d6383f71816',
  BABYCARE : 'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Fbabycare.png?alt=media&token=3ab5acd7-98bc-498d-ac29-354c7a2adac0',
  LESSON : 'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Flesson.png?alt=media&token=014b4afe-735a-4065-8c1f-1edfea12ce8b',
  PATIENTCARE : 'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Fpatientcare.png?alt=media&token=6f038eae-2a49-4e1f-94e7-5efd2dcb371b',
  CARRYLOAD : 'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Fcarry.png?alt=media&token=1e264f2f-06e0-4955-a935-7e3e1deb2672',
  GOHOSPITAL : 'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Fhospital.png?alt=media&token=7b04831f-7de4-44f5-aa8c-f729478341a7',
  RECIPETRANSMIT : 'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Frecipesmall.png?alt=media&token=e18b52af-542a-47e0-8e19-1f82c46e65e8',
  GOSCHOOLEVENT : 'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Fschoolevent.png?alt=media&token=679546fa-369b-494d-9c8a-38de66d3c0d7',
  SHOPPING : 'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Fshopping.png?alt=media&token=e46076d9-9271-4636-a12e-a4bda73a4951',
  GODOGHOSPITAL : 'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Fdoghospital.png?alt=media&token=2a926852-e7c5-4ceb-9ba8-4155b213a556',
  GODOGWALK : 'https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Fdogsmall.png?alt=media&token=abed92b4-e26c-4735-88b3-166ce0bc7d22',
  ROOM :"https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Froomsize1.webp?alt=media&token=547fa539-fa90-43de-8512-951ff53ad26d"

}

const prefix = ['','다산동','평내동','호평동','구리시','나주시','양정동','오남읍','진접읍','반도','빛나는',
'대찬', '홍제동', '수원팔달구', '인계동','신속한', '광대한','남양주','석촌동','새하얀','수원시',
'구리', '마석', '진건', '도봉구','방학동', '높은','창동','금강2차','금강1차','석관동','신안인스빌','유보라','팔달구','마지막','소홀리','대단한','대부리',
'오래된'];

const suffix = ['','오리','개','새','독수리','가위','거북이','까치','종달새','참새','부엉이',
'기러기','올빼미','참새','까마귀','거위','강아지','고양이','거미','잠자리','메뚜기',
'표범', '송골매','기린','너구리','늑대','노루','사슴','재규어','오소리','송아지','청설모',
'악어','여우','하마','까치','토끼','얼룩말','말','돼지','사자','호랑이',
'코뿔소','타조','돌고래','팬더','생쥐','젖소','문어','염소','코알라',
'원숭이','병아리','닭','뱀','양','도마뱀','아나콘다','두더쥐','학','삵',
'기린','코끼리','낙타','햄스터','학생','인간','수달','고라니','사슴',
'곰','고래','북극곰','폐귄','두더지','코뿔소','소','레드판다','캥거루',
'박쥐','제비','닭','공작새','앵무새','비둘기','딱다구리','도룡뇽','산토끼',
'멧돼지','금붕어','퓨마','승냥이','들개','치타','하이에나','족제비','코요테',
'독사','물고기','복숭아','바나나','살구','사과','산딸기','석류','수박',
'오렌지','자두','자몽','귤','단감','두리안','대추','딸기','레몬','망고',
'무화과','매실','멜론','참외','체리','키위','포도','파파야','토마토','튤립',
'장미','쟈스민','코스모스','모과','데이지','난초','동백',];


function randomNumberInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

 const CreateName = (name) =>{
  return (prefix[randomNumberInRange(1,35)] + suffix[randomNumberInRange(1,100)] );
}


const WORKNAME={
  HOMECLEAN : '집 청소',
  BUSINESSCLEAN : '사무실청소',
  MOVECLEAN : '이사청소',
  FOODPREPARE : '식사준비',
  ERRAND : '도와주기',
  GOOUTSCHOOL : '등원하원',
  BABYCARE : '아이돌봄',
  LESSON : '아이레슨',
  PATIENTCARE : '간병하기',
  CARRYLOAD : '집안수리',
  GOHOSPITAL : '병원가기',
  RECIPETRANSMIT : '요리비법',
  GOSCHOOLEVENT : '학교행사',
  SHOPPING : '장봐주기',
  GODOGHOSPITAL : '애견돌봄',
  GODOGWALK : '애견산책',
  ROOM :"공간대여"

}

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


const app = express();
app.use(cors); // 모든 출처에 대해 CORS 허용

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  next();
});


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

const HeaderAddress =(address)=>{

  let addr = [];
  addr = address.split(" ");

  return addr[1] + ' ' + addr[2];
}

const SeekImage =(type)=>{
  if(type == WORKNAME.HOMECLEAN){
    return WORKIMAGE.HOMECLEAN;
  }else if(type == WORKNAME.BUSINESSCLEAN){
    return WORKIMAGE.BUSINESSCLEAN;
  }else if(type == WORKNAME.MOVECLEAN){
    return WORKIMAGE.MOVECLEAN;
  }else if(type == WORKNAME.FOODPREPARE){
    return WORKIMAGE.FOODPREPARE;
  }else if(type == WORKNAME.ERRAND){
    return WORKIMAGE.ERRAND;
  }else if(type == WORKNAME.GOOUTSCHOOL){
    return WORKIMAGE.GOOUTSCHOOL;
  }else if(type == WORKNAME.BABYCARE){
    return WORKIMAGE.BABYCARE;
  }else if(type == WORKNAME.LESSON){
    return WORKIMAGE.LESSON;
  }else if(type == WORKNAME.PATIENTCARE){
    return WORKIMAGE.PATIENTCARE;
  }else if(type == WORKNAME.CARRYLOAD){
    return WORKIMAGE.CARRYLOAD;
  }else if(type == WORKNAME.GOHOSPITAL){
    return WORKIMAGE.GOHOSPITAL;
  }else if(type == WORKNAME.RECIPETRANSMIT){
    return WORKIMAGE.RECIPETRANSMIT;
  }else if(type == WORKNAME.GOSCHOOLEVENT){
    return WORKIMAGE.GOSCHOOLEVENT;
  } else if (type == WORKNAME.SHOPPING) {
    return WORKIMAGE.SHOPPING;
  }else if(type == WORKNAME.GODOGHOSPITAL){
    return WORKIMAGE.GODOGHOSPITAL;
  }else if(type == WORKNAME.GODOGWALK){
    return WORKIMAGE.GODOGWALK;
  }else if(type == WORKNAME.ROOM){
    return WORKIMAGE.ROOM;
  }
}


const Pushalarm = (deviceToken, body, image)=>{

  const message = {
    token: deviceToken,
    notification: {
      title: '홍여사 일감 요청',
      body: body,
      image:image,  
    },
    android: {
      notification: {
        sound: 'alarm_sound',  // 'res/raw/custom_sound.mp3' (안드로이드)
        channel_id: 'custom_channel_id', // 위에서 정의한 채널 ID와 일치해야 함
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
}

const PushalarmChat = (deviceToken, body)=>{

  const message = {
    token: deviceToken,
    notification: {
      title: '홍여사 대화',
      body: body,
    },
    android: {
      notification: {
        sound: 'alarm_sound',  // 'res/raw/custom_sound.mp3' (안드로이드)
        channel_id: 'custom_channel_id', // 위에서 정의한 채널 ID와 일치해야 함
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
}

const PushalarmNoimage = (deviceToken, body)=>{

  const message = {
    token: deviceToken,
    notification: {
      title: '홍여사 게시글 등록',
      body: body,
    },
    android: {
      notification: {
        sound: 'alarm_sound',  // 'res/raw/custom_sound.mp3' (안드로이드)
        channel_id: 'custom_channel_id', // 위에서 정의한 채널 ID와 일치해야 함
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
}

const PushalarmMsg = (deviceToken, body, title) => {

  const message = {
    token: deviceToken,
    notification: {
      title: title,
      body: body,
    },
    android: {
      notification: {
        sound: 'alarm_sound',  // 'res/raw/custom_sound.mp3' (안드로이드)
        channel_id: 'custom_channel_id', // 위에서 정의한 채널 ID와 일치해야 함
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
}
  
const  deg2rad = (deg)=> {
  return deg * (Math.PI/180);
}

const sendPushAlarm = ({ token, title = '💧 수분 섭취 알림', body }) => {
  const message = {
    token,
    notification: {
      title,
      body,
    },
    android: {
      notification: {
        sound: 'alarm_sound',
        channel_id: 'custom_channel_id',
      },
    },
  };

  return admin
    .messaging()
    .send(message)
    .then((res) => console.log('✅ 푸시 발송 성공:', res))
    .catch((err) => console.error('❌ 푸시 발송 실패:', err));
};

/** 1번 물섭취관리 매1분마다 동작 */
exports.sendHydrationAlert = functions
  .region("asia-northeast1")
  .pubsub
  .schedule('* * * * *') // 매 1분
  .timeZone('Asia/Seoul')
  .onRun(async () => {

    return true;
    const now = moment().tz('Asia/Seoul');
    const currentTimeStr = now.format('HH:mm');

    const usersSnap = await db.collection('USERS').get();
    console.log(`🪖 수분 알림 작전 시작 / 사용자 수: ${usersSnap.size}`);

    let totalTarget = 0;
    let totalSuccess = 0;

    for (const doc of usersSnap.docs) {
      const data = doc.data();
      const users_id = data.users_id;
      const token = doc.data()?.USERINFO?.token;

      if (!token) {
        console.warn("❌ FCM token 없음, 푸시 생략");
        continue;
      }

      // 기본 조건 검사
      const alarmSettings = data.WATERALARM;
      const isWeekend = [0, 6].includes(now.day());

      if (!alarmSettings?.ALARMMODE) {
        console.log(`⛔ [${users_id}] 전체 알림 꺼짐`);
        continue;
      }

      if (alarmSettings?.ALARMWEEKEND && isWeekend) {
        console.log(`⛔ [${users_id}] 주말모드로 무시됨`);
        continue;
      }

      if (!token) {
        console.log(`⛔ [${users_id}] TOKEN 없음, 발송 불가`);
        continue;
      }

      const alarmChecks = alarmSettings.ALARMCHECK || [];
      let userTargeted = false;

      for (let i = 0; i < alarmChecks.length; i++) {
        const entry = alarmChecks[i];

        if (
          entry.alarm === true &&
          (entry.completed === false || entry.completed === undefined)
        ) {
          const diff = Math.abs(
            moment(currentTimeStr, 'HH:mm').diff(moment(entry.alarmtime, 'HH:mm'), 'minutes')
          );

          if (diff <= 10) {
            // 푸시 발사
            const title = '💧 수분 섭취 알림';
            const body = `${entry.alarmname} 수분 보충 타이밍이에요! 지금 한 잔 드셔보세요 💧`;

            try {
              await admin.messaging().send({
                token,
                notification: { title, body },
                android: {
                  notification: {
                    sound: 'alarm_sound',
                    channel_id: 'custom_channel_id_v2',
                  },
                },
    
              });


              console.log(`✅ [${users_id}] 발송 성공 → ${entry.alarmname} (${entry.alarmtime})`);
              totalSuccess++;
              userTargeted = true;

              // 상태 업데이트
              alarmChecks[i].completed = true;

              await db.collection('USERS').doc(doc.id).update({
                'WATERALARM.ALARMCHECK': alarmChecks,
              });

              // 기록 저장
              await db.collection('WATER').add({
                USERS_ID: users_id,
                CONTENT: 120,
                CONTENTDATE: now.toISOString(),
              });
            } catch (error) {
              console.error(`❌ [${users_id}] 푸시 실패:`, error.message);
            }
          }
        }
      }

      if (userTargeted) {
        totalTarget++;
      } else {
        console.log(`ℹ️ [${users_id}] 해당 시간대 발송 대상 없음`);
      }
    }

    console.log(`📊 발송 요약: 대상자 ${totalTarget}명 / 성공 ${totalSuccess}건`);
    return null;
  });

/** 일감등록후 동일지역의 사용자에게 1분마다 진행 */
exports.scheduledWorkRegisterFunction = functions
  .region("asia-northeast1")
  .pubsub
  .schedule('every 1 minutes')
  .timeZone('Asia/Seoul')
  .onRun(async () => {

    return true;
    functions.logger.info("📡 [5번기지] 일감 등록 감시 작전 개시");

    const snapshot = await db.collection('WORK').get();

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const workId = data.WORK_ID;

      // 이미 발송된 일감은 스킵
      if (data.PUSH === true) continue;

      const workInfo = data.WORK_INFO || [];
      const regionIndex = workInfo.findIndex(x => x.requesttype === '지역');
      if (regionIndex === -1) continue;

      const lat = workInfo[regionIndex].latitude;
      const lon = workInfo[regionIndex].longitude;
      const regionName = HeaderAddress(workInfo[regionIndex].result);
      const workType = data.WORKTYPE;
      const estimate = data.ESTIMATE || "미정";
      const creator = data.USERS_ID;

      const userSnap = await db.collection('USERS').get();

      for (const userDoc of userSnap.docs) {
        const user = userDoc.data();
        const userId = user.USERS_ID;
        const token = user?.USERINFO?.token;

        if (userId === creator) continue; // 자기 자신 제외
        if (!token) continue;

        // ALARMCONFIG 체크
        const configSnap = await db.collection('ALARMCONFIG').doc(userId).get();
        const config = configSnap.exists ? configSnap.data() : {};
        if (config.task === false) {
          functions.logger.info(`⛔ [${userId}] task 알림 OFF → 푸시 제외`);
          continue;
        }

        const addressList = user.ADDRESSITEMS || [];
        for (const addr of addressList) {
          const distance = parseInt(distanceFunc(lat, lon, addr.LATITUDE, addr.LONGITUDE));

          if (distance <= addr.RADIUS) {
            const messageBody =
              `${regionName}에서 ${workType} 일감이 등록되었습니다\n` +
              `💰 견적금액: ${estimate}\n` +
              `거리: 약 ${distance}km\n` +
              `지금 확인해보세요!`;

            try {
              await admin.messaging().send({
                token,
                notification: {
                  title: '📢 홍여사 일감 알림',
                  body: messageBody,
                  image: SeekImage(workType),
                },
                android: {
                  notification: {
                    sound: 'alarm_sound',
                    channel_id: 'custom_channel_id_v2',
                  },
                },
        
              });

              functions.logger.info(`✅ [${userId}] 푸시 발송 성공 → 거리: ${distance}km / 지역: ${regionName}`);
            } catch (error) {
              functions.logger.error(`❌ [${userId}] 푸시 발송 실패 → 거리: ${distance}km / 지역: ${regionName}`);
              functions.logger.error(`↪️ 에러 코드: ${error.code} / 메시지: ${error.message}`);
            }

            break; // 한 사용자에 1회 발사
          }
        }
      }

      // 푸시 발사 후 기록
      await db.collection('WORK').doc(workId).update({ PUSH: true });
      functions.logger.info(`📌 [${workId}] 푸시 완료 처리 → PUSH: true`);
    }

    functions.logger.info("📊 [5번기지] 일감 감시 작전 종료");
    return null;
  });

/** 가사분담 프로젝트 매일 10시에 진행 */
exports.scheduledHomeWorkFunction = functions
  .region("asia-northeast1")
  .pubsub
  .schedule('every day 10:00')
  .timeZone('Asia/Seoul')
  .onRun(async () => {
    return null;
    const now = moment().tz('Asia/Seoul').startOf('day');
    const snapshot = await db.collection('HOMEWORK').get();

    let totalTarget = 0;
    let totalSuccess = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const docId = doc.id;

      const limitDate = moment(data.STARTDATE).startOf('day');
      const phone = data.PHONE;
      const memo = data.MEMO || "가사분담";
      const alarm = data.ALARM;

      // 필수 조건 체크
      if (!alarm) {
        functions.logger.info(`⛔ [${docId}] ALARM off → 발송 제외`);
        continue;
      }
      if (!phone) {
        functions.logger.info(`⛔ [${docId}] PHONE 없음 → 발송 제외`);
        continue;
      }
      if (!data.STARTDATE || !moment(data.STARTDATE).isValid()) {
        functions.logger.info(`⛔ [${docId}] STARTDATE 무효`);
        continue;
      }
      if (!now.isSame(limitDate, 'day')) {
        functions.logger.info(`ℹ️ [${docId}] 오늘 일정 아님`);
        continue;
      }

      // 발송 대상 확인
      totalTarget++;

      const payload = {
        userid: "kkan2222",
        api_key: "qquhto3r46ixis9v1sjwe8k7bfpuryz4fz8eljgm",
        template_id: "50042",
        messages: [
          {
            no: "1234",
            tel_num: phone,
            use_sms: "0",
            msg_content: `안녕하세요 구해줘 홍여사 가사분담 프로젝트 입니다.\n오늘은 "${memo}" 가사분담 마감일입니다.\n\n구해줘 홍여사는 가족 모두가 함께하는 가정 문화를 응원합니다.\n\n※ 본 알림은 사전 동의하신 고객님께만 전송됩니다.`,
            title: `가사분담: ${memo}`,
            sms_content: "",
            btn_url: [{ url_pc: "", url_mobile: "" }],
          },
        ],
      };

      try {
        const res = await axios.post(
          'https://jupiter.lunasoft.co.kr/api/AlimTalk/message/send',
          payload,
          { headers: { "Content-Type": "application/json" } }
        );

        totalSuccess++;
        functions.logger.info(`✅ [${docId}] 알림톡 발송 성공 → ${phone}`);
      } catch (error) {
        functions.logger.error(`❌ [${docId}] 발송 실패: ${error.message}`);
      }
    }

    functions.logger.info(`📊 가사분담 알림 결과: 총 대상 ${totalTarget}명 / 성공 ${totalSuccess}건`);
    return null;
  });

/** 기념일 프로젝트 매일 9시에 진행 */
exports.scheduledAnniversaryAlert = functions
  .region("asia-northeast1")
  .pubsub
  .schedule('every day 10:00') // ✅ 매일 오전 10시
  .timeZone('Asia/Seoul')
  .onRun(async () => {
    const today = moment().tz('Asia/Seoul').startOf('day');
    const memoSnap = await db.collection('MEMO').get();

    let totalTarget = 0;
    let totalSuccess = 0;

    for (const doc of memoSnap.docs) {
      const data = doc.data();

      // 필수 조건 체크
      if (data.MEMOTYPE !== '기념일관리') continue;
      if (!data.DATE || !moment(data.DATE, 'YYYY-MM-DD', true).isValid()) continue;
      if (data.ALARM === false) continue;

      const dday = moment(data.DATE).diff(today, 'days');
      if (![3, 1, 0].includes(dday)) continue;

      const users_id = data.USERS_ID;
      const name = data.NAME || '기념일';

      // 사용자 정보
      const userDoc = await db.collection('USERS').doc(users_id).get();
      const userData = userDoc.data();
      const token = userData?.USERINFO?.token;

      if (!token) {
        console.log(`⛔ [${users_id}] TOKEN 없음`);
        continue;
      }

      // 알람 설정 체크
      const configDoc = await db.collection('ALARMCONFIG').doc(users_id).get();
      const config = configDoc.exists ? configDoc.data() : {};
      if (config.anniversary === false) {
        console.log(`⛔ [${users_id}] ALARMCONFIG.anniversary == false`);
        continue;
      }

      // 메시지 정의
      let body = '';
      if (dday === 3) {
        body = `3일 뒤는 "${name}"입니다. 미리 준비하면 더 특별한 하루가 됩니다 🎁`;
      } else if (dday === 1) {
        body = `내일은 "${name}"입니다. 기억하고 계시죠? 💡`;
      } else if (dday === 0) {
        body = `오늘은 "${name}"입니다. 꼭 축하해 주세요! 💐`;
      }

      try {
        await admin.messaging().send({
          token,
          notification: {
            title: '🎉 기념일 알림',
            body,
          },
          android: {
            notification: {
              sound: 'alarm_sound',
              channel_id: 'custom_channel_id_v2',
            },
          },
 
        });

        // ✅ 발송 성공 시 push 발송 기록 남기기
        await db.collection('USERS').doc(users_id).update({
          anniversaryPushSentDate: today.format('YYYY-MM-DD'),
        });

        console.log(`✅ [${users_id}] ${name} / D-${dday === 0 ? 'DAY' : dday} 알림 발송 완료`);
        totalTarget++;
        totalSuccess++;
      } catch (error) {
        console.error(`❌ [${users_id}] 발송 실패: ${error.message}`);
      }
    }

    console.log(`📊 기념일 알림 발사 보고: 총 대상자 ${totalTarget}명 / 성공 ${totalSuccess}건`);
    return null;
  });

exports.scheduledFakeRankingEntry = functions
  .region("asia-northeast1")
  .pubsub
  .schedule('every 5 minutes')
  .timeZone("Asia/Seoul")
  .onRun(async () => {

   
    const now = moment().tz("Asia/Seoul");
    const timestamp = Date.now(); // ✅ 밀리초 타임스탬프 (게임과 동일)

    const DEFAULT_PHOTO = "https://firebasestorage.googleapis.com/v0/b/help-bbcb5.appspot.com/o/FCMImages%2Fhongwebtoon_100x100.webp?alt=media&token=42ff1a43-7694-42b8-9d57-ceef669533aa";

    if (Math.random() >= 0.5) {
      functions.logger.info("🎲 랜덤 판단: 이번 회차는 생성 생략");
      return null;
    }

    try {
      const snapshot = await db.collection("USERS").get();

      const validUsers = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data().USERINFO }))
        .filter(user => user?.nickname && user?.address_name);

      if (validUsers.length < 2) {
        functions.logger.warn("❗ 유효한 유저 수 부족 - 생략");
        return null;
      }

      const nameUser = validUsers[Math.floor(Math.random() * validUsers.length)];
      const others = validUsers.filter(u => u.id !== nameUser.id);
      const locationUser = others[Math.floor(Math.random() * others.length)];

      const record = parseFloat((32 + Math.random() * 7).toFixed(3));
      const raceRef = db.collection("RACE").doc(); // ✅ 랜덤 ID 할당
      const RACE_ID = raceRef.id;

      const raceData = {
        RACE_ID: RACE_ID,
        USERS_ID: nameUser.id,
        MINUTE: record.toFixed(3),
        COUNT: 1,
        CREATEDT: timestamp,

        // 👉 추가 필드는 참고용 (랭킹 UI 등에서 사용)
        NAME: nameUser.nickname,
        LOCATION: locationUser.address_name,
        PHOTO: DEFAULT_PHOTO,
        IS_FAKE: true
      };

      await raceRef.set(raceData);

      functions.logger.info(`✅ 가상 유저 추가됨: ${raceData.NAME} (${raceData.LOCATION}) - ${raceData.MINUTE}초`);
    } catch (e) {
      functions.logger.error(`❌ 가상 유저 삽입 실패: ${e.message}`);
    }

    return null;
  });

/**
 * 🧠 작전명: autoSupportWelcomeMessage
 *
 * ✅ 목적:
 * - 앱을 **최초 설치한 유저**에게 고객센터(chat)에서 자동으로 4개의 메시지를 보내
 *   기능 소개 및 동네 정보 안내를 감성적으로 전달한다.
 * - 메시지는 1분마다 조건에 맞는 유저를 탐색해 전송된다.
 *
 * ✅ 조건:
 * - USERS 문서의 CREATEDT가 오늘일 것 (최초 생성자)
 * - supportChatFlags.welcomeSent === undefined 또는 false일 것 (중복 방지)
 *
 * ✅ 메시지 구성 (총 4개):
 * 1. 홍여사 환영 인사
 * 2. 앱 주요 기능 소개 (룰렛, 도전 홍여사 등)
 * 3. 해당 지역 기반 아르바이트 대기 수 및 일감 수 안내
 * 4. 고객센터 문의 유도 마무리 멘트
 *
 * ✅ 기록:
 * - 메시지 전송 후 USERS 문서에 supportChatFlags.welcomeSent = true 저장
 * - supportChatFlags.welcomeSentAt = Timestamp
 *
 * ✅ Firestore 저장 위치:
 * - CHAT/support_${USERS_ID}/messages
 * - 메시지 포맷은 admin-system이 보낸 것과 동일하게 구성됨
 *
 * ✅ 향후 확장 포인트:
 * - workerCount, workCount는 현재는 더미 → 추후 위치 기반 필터링으로 계산
 * - 메시지 내용은 템플릿 구조로 분리 가능
 * - 이후 다른 작전도 supportChatFlags 내부에 기록 방식으로 확장 가능
 */


// 지역 추출
const getRegionFromAddress = (address) => {
  if (!address) return "고객님 동네";
  const parts = address.split(" ").slice(0, 3);
  return parts.join(" ") || "고객님 동네";
};

// 고정 채팅방 없으면 생성
const createFixedChatIfNotExists = async (userId, userInfo = {}) => {
  if (!userId) return null;
  const chatId = `hongyeosa_fixed_${userId}`;
  const chatRef = db.collection("CHAT").doc(chatId);
  const chatSnap = await chatRef.get();

  if (!chatSnap.exists) {
    await chatRef.set({
      OWNER_ID: userId,
      SUPPORTER_ID: "admin-system-id",
      USERS: [userId, "admin-system-id"],
      CREATEDT: Date.now(),
      LASTMESSAGE: null,
      IS_FIXED: true,
      INFO: {
        isVirtualWork: true,
        NICKNAME: userInfo.nickname || "알 수 없음",
        USERIMG: userInfo.userimg || "/img/default_profile.png"
      }
    });
  }

  return chatId;
};

// 근처 알바 수
const getNearbyWorkerCount = async ({ latitude, longitude, maxDistance = 7 }) => {
  const snapshot = await db.collection("WORKERS").get();
  let count = 0;
  snapshot.forEach((doc) => {
    const data = doc.data();
    const lat = data.LAT || data.latitude;
    const lng = data.LNG || data.longitude;
    if (lat && lng) {
      const dist = distanceFunc(lat, lng, latitude, longitude);
      if (dist <= maxDistance) count++;
    }
  });
  return count;
};

// 근처 일거리 수
const getNearbyWorkCount = async ({ latitude, longitude, maxDistance = 7 }) => {
  const snapshot = await db.collection("WORKS").where("WORKSTATUS", "==", "WAIT").get();
  let count = 0;
  snapshot.forEach((doc) => {
    const data = doc.data();
    const lat = data.LAT || data.latitude;
    const lng = data.LNG || data.longitude;
    if (lat && lng) {
      const dist = distanceFunc(lat, lng, latitude, longitude);
      if (dist <= maxDistance) count++;
    }
  });
  return count;
};

// ✅ 메인 자동 웰컴 메시지 함수
// exports.autoSupportWelcomeMessage = functions
//   .region("asia-northeast1")
//   .pubsub.schedule("every 1 minutes")
//   .timeZone("Asia/Seoul")
//   .onRun(async () => {
//     const now = moment().tz("Asia/Seoul");
//     const today = now.format("YYYY-MM-DD");
//     const snapshot = await db.collection("USERS").get();

//     for (const doc of snapshot.docs) {
//       const user = doc.data();
//       const userId = doc.id;
//       const userInfo = user.USERINFO || {};
//       const rawCreatedAt = user.CREATEDT;
//       const createdt = typeof rawCreatedAt === "number"
//         ? moment(rawCreatedAt).format("YYYY-MM-DD")
//         : moment(rawCreatedAt?.toDate?.()).format("YYYY-MM-DD");
//       if (createdt !== today) continue;
//       if (user.supportChatFlags?.welcomeSent) continue;

//       const region = getRegionFromAddress(userInfo.address_name);
//       const latitude = userInfo.latitude;
//       const longitude = userInfo.longitude;
//       const workerCount = await getNearbyWorkerCount({ latitude, longitude });
//       const workCount = await getNearbyWorkCount({ latitude, longitude });
//       const chatId = await createFixedChatIfNotExists(userId, userInfo);
//       if (!chatId) continue;
//       const baseTimestamp = Date.now();
//       const messages = [
//         `안녕하세요 😊 홍여사에 오신 걸 환영해요!
//         홍여사에서는 매일 룰렛, 도전 홍여사 게임 등 다양한 이벤트가 진행 중이에요 🎁`,
//         `지금 ${region}에는 ${workerCount}명의 홍여사님이 활동 중이에요.
//         ${workCount}개의 일이 등록돼 있어요 💼 지금 요청해보세요!`,
//                 `앱은 무료고, 일자리 요청이나 지원도 자유롭게 할 수 있어요!
//         궁금한 점은 언제든 여기 채팅창에 남겨주세요 😊`
//       ];

//       for (let i = 0; i < messages.length; i++) {
//         const msgRef = db.collection(`CHAT/${chatId}/messages`).doc();
//         await msgRef.set({
//           USERS_ID: "admin-system-id",
//           TEXT: messages[i],
//           CHAT_CONTENT_TYPE: "TEXT",
//           CREATEDT: baseTimestamp + i * 500,
//           READ: ["admin-system-id"],
//           MESSAGE_ID: msgRef.id
//         });
//       }

//       await db.collection("USERS").doc(userId).update({
//         "supportChatFlags.welcomeSent": true,
//         "supportChatFlags.welcomeSentAt": admin.firestore.FieldValue.serverTimestamp(),
//       });
//     }

//     return null;
//   });

// exports.apiSupportWelcomeMessage = functions.region("asia-northeast1").https.onRequest(async (req, res) => {
//   const now = moment().tz("Asia/Seoul");
//   const today = now.format("YYYY-MM-DD");
//   const userId = req.body.userId;
//   const userInfo = req.body.userInfo || {};
//   const createdAtRaw = req.body.CREATEDT;
//   const supportChatFlags = req.body.supportChatFlags || {};

//   if (!userId || !userInfo || !createdAtRaw) {
//     return res.status(400).send("Missing required user data");
//   }

//   const createdAt = moment(typeof createdAtRaw === "number" ? createdAtRaw : createdAtRaw?.toDate?.());
//   if (!createdAt.isValid() || createdAt.format("YYYY-MM-DD") !== today) {
//     return res.status(200).send("Not installed today");
//   }

//   if (supportChatFlags.welcomeSent) {
//     return res.status(200).send("Welcome message already sent");
//   }

//   const region = getRegionFromAddress(userInfo.address_name);
//   const latitude = userInfo.latitude;
//   const longitude = userInfo.longitude;
//   const workerCount = await getNearbyWorkerCount({ latitude, longitude });
//   const workCount = await getNearbyWorkCount({ latitude, longitude });
//   const chatId = await createFixedChatIfNotExists(userId, userInfo);
//   if (!chatId) return res.status(200).send("Chat not created");

//   const baseTimestamp = Date.now();
//   const messages = [
//     `안녕하세요 😊 홍여사에 오신 걸 환영해요!
// 홍여사에서는 매일 룰렛, 도전 홍여사 게임 등 다양한 이벤트가 진행 중이에요 🎁`,
//     `지금 ${region}에는 ${workerCount}명의 홍여사님이 활동 중이에요.
// ${workCount}개의 일이 등록돼 있어요 💼 지금 요청해보세요!`,
//     `앱은 무료고, 일자리 요청이나 지원도 자유롭게 할 수 있어요!
// 궁금한 점은 언제든 여기 채팅창에 남겨주세요 😊`
//   ];

//   for (let i = 0; i < messages.length; i++) {
//     const msgRef = db.collection(`CHAT/${chatId}/messages`).doc();
//     await msgRef.set({
//       USERS_ID: "admin-system-id",
//       TEXT: messages[i],
//       CHAT_CONTENT_TYPE: "TEXT",
//       CREATEDT: baseTimestamp + i * 500,
//       READ: ["admin-system-id"],
//       MESSAGE_ID: msgRef.id
//     });
//   }

//   await db.collection("USERS").doc(userId).update({
//     "supportChatFlags.welcomeSent": true,
//     "supportChatFlags.welcomeSentAt": admin.firestore.FieldValue.serverTimestamp()
//   });

//   functions.logger.info(`✅ [환영 메시지 전송됨] ${userId} → ${region}`);
//   return res.status(200).send("Welcome message sent");
// });

app.post('/supportWelcomeMessage', async (req, res) => {

  const Item = JSON.parse(JSON.stringify(req.body));

  const userId = encodeURIComponent(Item.userId);
  const userInfo = encodeURIComponent(Item.userInfo);
  const CREATEDT = encodeURIComponent(Item.CREATEDT);
  const supportChatFlags = encodeURIComponent(Item.supportChatFlags);

  return;

  functions.logger.info("[🔥 supportWelcomeMessage 호출됨]", {
    userId,
    userInfo,
    CREATEDT,
    supportChatFlags
  });



  if (!userId) return res.status(400).send("Missing userId");

  const region = getRegionFromAddress(userInfo.address_name);
  const latitude = userInfo.latitude;
  const longitude = userInfo.longitude;
  const workerCount = await getNearbyWorkerCount({ latitude, longitude });
  const workCount = await getNearbyWorkCount({ latitude, longitude });
  const chatId = await createFixedChatIfNotExists(userId, userInfo);
  if (!chatId) return res.status(200).send("Chat not created");

  const baseTimestamp = Date.now();
  const messages = [
    `안녕하세요 😊 홍여사에 오신 걸 환영해요!`,
    `앱은 무료고, 일자리 요청이나 지원도 자유롭게 할 수 있어요! 궁금한 점은 언제든 여기 채팅창에 남겨주세요 😊`
  ];

  for (let i = 0; i < messages.length; i++) {
    const msgRef = db.collection(`CHAT/${chatId}/messages`).doc();
    await msgRef.set({
      USERS_ID: "admin-system-id",
      TEXT: messages[i],
      CHAT_CONTENT_TYPE: "TEXT",
      CREATEDT: baseTimestamp + i * 500,
      READ: ["admin-system-id"],
      MESSAGE_ID: msgRef.id
    });
  }

  await db.collection("USERS").doc(userId).update({
    "supportChatFlags.welcomeSent": true,
    "supportChatFlags.welcomeSentAt": admin.firestore.FieldValue.serverTimestamp()
  });

  functions.logger.info(`✅ [supportWelcomeMessage] sent to ${userId}`);
  return res.status(200).send("Welcome message sent");
});


/**
 * 🧠 작전명: autoSupportRemindMessage
 *
 * ✅ 목적:
 * - 앱을 설치한 유저에게 일정 주기로 리마인드 메시지를 전송해
 *   재방문과 참여를 유도한다.
 *
 * ✅ 조건:
 * - USERS 문서의 supportChatFlags.remindSentAt 이 없거나 5일 이상 지난 경우
 *
 * ✅ 메시지 구성 (1개):
 * - "안녕하세요, 홍여사에요 😊" 포함
 * - 현재 위치 기반 활동 홍여사 수 및 일거리 수 포함
 * - "지금 요청해보세요!" 유도 문구 포함
 *
 * ✅ 기록:
 * - 메시지 전송 후 USERS 문서에 supportChatFlags.remindSentAt = Timestamp 저장
 */
// exports.autoSupportRemindMessage = functions
//   .region("asia-northeast1")
//   .pubsub.schedule("every 1 minutes")
//   .timeZone("Asia/Seoul")
//   .onRun(async () => {
//     const now = moment().tz("Asia/Seoul");
//     const snapshot = await db.collection("USERS").get();

//     for (const doc of snapshot.docs) {
//       const user = doc.data();
//       const userId = doc.id;
//       const userInfo = user.USERINFO || {};


//       const createdAtRaw = user.CREATEDT;
//       const createdAt = moment(typeof createdAtRaw === "number" ? createdAtRaw : createdAtRaw?.toDate?.());
//       if (!createdAt.isValid() || createdAt.format("YYYY-MM-DD") === now.format("YYYY-MM-DD")) continue;


//       const lastLoginRaw = user.LASTLOGINDT;
//       let lastLogin = null;
//       if (typeof lastLoginRaw === "number") {
//         lastLogin = moment(lastLoginRaw);
//       } else if (lastLoginRaw?.toDate) {
//         lastLogin = moment(lastLoginRaw.toDate());
//       }
//       if (!lastLogin || !lastLogin.isValid() || now.diff(lastLogin, 'minutes') > 1) continue;
//       if (!lastLogin || now.diff(lastLogin, 'minutes') > 1) continue;

//       const lastRemindRaw = user.supportChatFlags?.remindSentAt;
//       const lastRemind = lastRemindRaw ? moment(lastRemindRaw.toDate()) : null;
//       if (lastRemind && now.diff(lastRemind, 'days') < 5) continue;


//       const region = getRegionFromAddress(userInfo.address_name);
//       const latitude = userInfo.latitude;
//       const longitude = userInfo.longitude;
//       const workerCount = await getNearbyWorkerCount({ latitude, longitude });
//       const workCount = await getNearbyWorkCount({ latitude, longitude });
//       const chatId = await createFixedChatIfNotExists(userId, userInfo);
//       if (!chatId) continue;
//       const baseTimestamp = Date.now();
//       const messages = [
//         `안녕하세요, 홍여사에요 😊\n지금 ${region}에는 ${workerCount}명의 홍여사님이 활동 중이에요.\n${workCount}개의 일이 등록돼 있어요 💼 지금 요청해보세요!`
//       ];

//       for (let i = 0; i < messages.length; i++) {
//         const msgRef = db.collection(`CHAT/${chatId}/messages`).doc();
//         await msgRef.set({
//           USERS_ID: "admin-system-id",
//           TEXT: messages[i],
//           CHAT_CONTENT_TYPE: "TEXT",
//           CREATEDT: baseTimestamp + i * 500,
//           READ: ["admin-system-id"],
//           MESSAGE_ID: msgRef.id
//         });
//       }



//       await db.collection("USERS").doc(userId).update({
//         "supportChatFlags.remindSentAt": admin.firestore.FieldValue.serverTimestamp()
//       });

//       functions.logger.info(`✅ [리마인드 메시지 전송됨] ${userId} → ${region}`);
//     }

//     return null;
//   });

app.post('/supportRemindMessage', async (req, res) => {
  const now = moment().tz("Asia/Seoul");


  return;

  const Item = JSON.parse(JSON.stringify(req.body));

  const userId = encodeURIComponent(Item.userId);
  const userInfo = encodeURIComponent(Item.userInfo);


  if (!userId) return res.status(400).send("Missing userId");

  const region = getRegionFromAddress(userInfo.address_name);
  const latitude = userInfo.latitude;
  const longitude = userInfo.longitude;
  const workerCount = await getNearbyWorkerCount({ latitude, longitude });
  const workCount = await getNearbyWorkCount({ latitude, longitude });
  const chatId = await createFixedChatIfNotExists(userId, userInfo);
  if (!chatId) return res.status(200).send("Chat not created");

  const baseTimestamp = Date.now();
  const msgRef = db.collection(`CHAT/${chatId}/messages`).doc();
  await msgRef.set({
    USERS_ID: "admin-system-id",
    TEXT: `안녕하세요 😊 홍여사에요!
지금 ${region}에는 ${workerCount}명의 홍여사님이 활동 중이에요.
${workCount}개의 일이 등록돼 있어요 💼 지금 요청해보세요!`,
    CHAT_CONTENT_TYPE: "TEXT",
    CREATEDT: baseTimestamp,
    READ: ["admin-system-id"],
    MESSAGE_ID: msgRef.id
  });

  await db.collection("USERS").doc(userId).update({
    "supportChatFlags.remindSent": true,
    "supportChatFlags.remindSentAt": admin.firestore.FieldValue.serverTimestamp()
  });

  functions.logger.info(`✅ [supportRemindMessage] sent to ${userId}`);
  return res.status(200).send("Remind message sent");
});




// exports.sendGamePushTest = functions
//   .region("asia-northeast1")
//   .pubsub
//   .schedule("*/* * * * 1") // ✅ 1분마다 실행
//   .timeZone("Asia/Seoul")
//   .onRun(async () => {
//     const token = "c6MdmGW2Sp6NTbhKeRPCHQ:APA91bFaXdDdJM0xYM31TvZVAh1CROHWdCqf-C28gWW0Q3twyqUpGHdnl3Nr0nh0KSH99PHvVAPOMFHo1UpfpRI7DKb0f2kZ_4fqXhOik2FEiN-4l_q9hSI";

//     try {
//       await admin.messaging().send({
//         token,
//         notification: {
//           title: "☕️ 도전 홍여사 게임! 스타벅스 10만원권 쏩니다",
//           body: `내일 시상! 지금 도전하면 스타벅스 10만원권의 주인공이 될 수 있어요 🎯\n\n👉 게임 현재 현황 확인하기:\nhttps://honglady.co.kr/share?type=game&uid=gamecontest\n\n✅ 참여 방법:\n앱 실행 → 마이페이지 > 구해줘 홍여사 게임 클릭`,
//         },
//         android: {
//           notification: {
//             channel_id: "custom_channel_id_v2",
//             sound: "default",
//           },
//         },
//       });

//       console.log("✅ 테스트 FCM 발송 완료");
//     } catch (e) {
//       console.error("❌ 테스트 FCM 발송 실패:", e.message);
//     }

//     return null;
//   });


exports.sendGamePushOnce = functions
  .region("asia-northeast1")
  .pubsub
  .schedule("45 18 20 5 *") // ✅ 5월 20일 18:30 KST
  .timeZone("Asia/Seoul")
  .onRun(async () => {
    const usersSnap = await admin.firestore().collection("USERS").get();

    let total = 0;
    let sent = 0;

    for (const doc of usersSnap.docs) {
      const uid = doc.id;
      const userData = doc.data();
      const token = userData?.USERINFO?.token?.trim();

      if (!token || token.length < 10) {
        console.log(`❌ [${uid}] 유효하지 않은 토큰 → SKIP`);
        continue;
      }

      try {
        await admin.messaging().send({
          token,
          notification: {
            title: "☕️ 도전 홍여사 게임! 스타벅스 10만원권 쏩니다",
            body: `내일 시상! 지금 도전하면 스타벅스 10만원권의 주인공이 될 수 있어요 🎯\n\n👉 게임 현재 현황 확인하기:\nhttps://honglady.co.kr/share?type=game&uid=gamecontest\n\n✅ 참여 방법:\n앱 실행 → 마이페이지 > 구해줘 홍여사 게임 클릭`,
          },
          android: {
            notification: {
              channel_id: "custom_channel_id_v2",
              sound: "default",
            },
          },
        });

        console.log(`✅ [${uid}] FCM 발송 성공`);
        sent++;
      } catch (e) {
        console.error(`❌ [${uid}] FCM 발송 실패:`, e.message);
      }

      total++;
    }

    console.log(`📊 발송 요약: 총 대상 ${total}명 / 성공 ${sent}건`);
    return null;
  });


exports.autoGiftPush = functions
  .region('asia-northeast1')
  .pubsub
  .schedule('0 */3 * * *') // ✅ 3시간마다 실행 (정시: 0시, 3시, 6시, ..., 21시)
  .timeZone('Asia/Seoul')
  .onRun(async () => {

    return null;
    const now = moment().tz('Asia/Seoul');
    const today = now.format('YYYY-MM-DD');

    const usersSnap = await db.collection('USERS').get();

    let total = 0;
    let sent = 0;

    for (const doc of usersSnap.docs) {
      const uid = doc.id;
      const userData = doc.data();

      const lastSent = userData.lastGiftPushSentAt;
      if (lastSent) {
        const lastSentDay = moment(lastSent.toDate()).format('YYYY-MM-DD');
        if (lastSentDay === today) {
          console.log(`⛔ [${uid}] 오늘 이미 발송됨 → SKIP`);
          continue;
        }
      }

      // 📦 안 읽은 COUPON 이벤트 있는지 확인
      const eventSnap = await db
        .collection('USERS')
        .doc(uid)
        .collection('EVENTS')
        .where('type', '>=', 'COUPON_')
        .where('type', '<', 'COUPON_\uf8ff')
        .where('isRead', '==', false)
        .limit(1)
        .get();

      if (eventSnap.empty) continue;

      const token = userData?.USERINFO?.token?.trim();
      if (!token || token.length < 10) {
        console.log(`❌ [${uid}] 유효하지 않은 토큰 → SKIP`);
        continue;
      }

      try {
        await admin.messaging().send({
          token,
          notification: {
            title: '🎁 선물이 도착했어요!',
            body: '홍여사 선물함에서 확인해보세요 😊',
          },
          android: {
            notification: {
              channel_id: 'custom_channel_id_v2',
              sound: 'alarm_sound',
            },
          },
          data: {
            type: 'gift',
            from: 'autoGiftPush'
          }
        });

        await db.collection('USERS').doc(uid).update({
          lastGiftPushSentAt: now.toDate(),
        });

        console.log(`✅ [${uid}] FCM 발송 완료`);
        total++;
        sent++;
      } catch (e) {
        console.error(`❌ [${uid}] FCM 발송 실패:`, e.message);
      }
    }

    console.log(`📊 선물함 알림 작전 종료: 총 대상 ${total}명 / 성공 ${sent}건`);
    return null;
  });

/** 채팅 무응답 상태 감지 - 1분마다 */
exports.pushChatReminder = functions
  .region("asia-northeast1")
  .pubsub
  .schedule('* * * * *') // 매 1분
  .timeZone("Asia/Seoul")
  .onRun(async () => {
    const now = Date.now();
    let totalTarget = 0;
    let totalSuccess = 0;

    functions.logger.info("📡 [알림기지] 채팅 무응답 감시 작전 개시");

    const chatRoomsSnap = await db.collection("CHAT").get();

    for (const chatDoc of chatRoomsSnap.docs) {
      const chatId = chatDoc.id;
      const chatData = chatDoc.data();
      const roomPath = `CHAT/${chatId}/messages`;

      // ✅ 관리자 채팅은 푸시 제외
      if (chatId.startsWith("hongyeosa_fixed_")) {
        functions.logger.info(`⛔ [${chatId}] 관리자 채팅 - 푸시 제외`);
        continue;
      }

      // 마지막 메시지 1건 조회
      const msgSnap = await db
        .collection(roomPath)
        .orderBy("CREATEDAT", "desc")
        .limit(1)
        .get();

      const latestDoc = msgSnap.docs[0];
      if (!latestDoc) continue;

      const latest = latestDoc.data();
      const latestMsgId = latestDoc.id;
      const msgTime = Number(latest.CREATEDAT);
      const hoursPassed = (now - msgTime) / (1000 * 60 * 60);

      // ✅ 오래된 방 예외 처리 (선택)
      if (hoursPassed > 72) continue;

      const senderId = latest.USERS_ID;
      const type = latest.CHAT_CONTENT_TYPE;

      const receiverId = (senderId === chatData.OWNER_ID)
        ? chatData.SUPPORTER_ID
        : chatData.OWNER_ID;

      if (!receiverId) continue;

      // ✅ 읽음 여부 확인 (READ_BY 배열 기반 예시)
      if (latest.READ_BY?.includes(receiverId)) {
        functions.logger.info(`📭 [${receiverId}] 이미 읽은 메시지 - 푸시 생략`);
        continue;
      }

      // ✅ 이미 푸시한 메시지인지 확인
      if (latest.PUSH_SENT_FOR === true) {
        functions.logger.info(`🔁 [${receiverId}] 중복 푸시 방지 - 이미 전송된 메시지`);
        continue;
      }

      // FCM 토큰 가져오기
      const userDoc = await db.collection("USERS").doc(receiverId).get();
      const userData = userDoc.data();
      const token = userData?.USERINFO?.token;

      if (!token) {
        functions.logger.info(`⛔ [${receiverId}] TOKEN 없음`);
        continue;
      }

      // ALARMCONFIG 체크
      const configSnap = await db.collection("ALARMCONFIG").doc(receiverId).get();
      const config = configSnap.exists ? configSnap.data() : {};
      if (config.chat === false) {
        functions.logger.info(`⛔ [${receiverId}] ALARMCONFIG.chat == false`);
        continue;
      }

      // 푸시 메시지 내용 구성
      const body = getAlertMessage(type);
      if (!body) continue;

      try {
        await admin.messaging().send({
          token,
          notification: {
            title: "📬 홍여사 채팅 알림",
            body,
          },
          android: {
            notification: {
              sound: 'alarm_sound',
              channel_id: 'custom_channel_id_v2',
            },
          },
        });

        // ✅ 메시지에 푸시 전송 플래그 기록
        await db.collection(roomPath).doc(latestMsgId).update({
          PUSH_SENT_FOR: true
        });

        // ✅ 로그 기록 (선택)
        await db.collection("USERS")
          .doc(receiverId)
          .collection("PUSH_LOGS")
          .add({
            type: "chat",
            chatId,
            sentAt: now,
            content: body
          });

        functions.logger.info(`✅ [${receiverId}] 푸시 발송 성공 - ${body}`);
        totalTarget++;
        totalSuccess++;
      } catch (error) {
        functions.logger.error(`❌ [${receiverId}] 푸시 발송 실패 - ${error.message}`);
      }
    }

    functions.logger.info(`📊 채팅 알림 발사 결과: 대상 ${totalTarget}건 / 성공 ${totalSuccess}건`);
    return null;
  });


/** 상황에 따른 알림 메시지 텍스트 반환 */
function getAlertMessage(type) {
  switch (type) {
    case "입장":
      return "상대방이 채팅방에 입장했어요.";
    case "의뢰인서명":
      return "서명을 요청드려요. 아직 서명이 완료되지 않았습니다.";
    case "홍여사서명":
      return "홍여사가 서명하셨어요. 다음 단계로 진행해주세요.";
    case "결제":
      return "결제가 필요해요. 아래 버튼을 눌러 진행해주세요.";
    case "완료":
      return "작업이 완료되었어요. 확인해 주세요.";
    case "후기":
      return "후기가 작성되었습니다.";
    case "TEXT":
    default:
      return "홍여사가 기다리고 있어요. 답장 부탁드려요!";
  }
}


exports.scheduledFreezeFunction = functions
  .region("asia-northeast1")
  .pubsub
  .schedule('every day 08:00')
  .timeZone('Asia/Seoul')
  .onRun(async () => {
    const today = moment().tz('Asia/Seoul').startOf('day');
    const snapshot = await db.collection("FREEZER").get();

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const userId = data.USERS_ID;
      const itemName = data.NAME || "식재료";
      const endDate = data.ENDDATE;

      // 조건 체크
      if (data.ALARM === false || !endDate) continue;

      const expireMoment = moment(endDate, "YYYY-MM-DD");
      if (!expireMoment.isValid()) continue;

      const dday = expireMoment.diff(today, "days");  // 남은 일수 계산

      let message = null;
      if (dday === 3) {
        message = `3일 뒤 "${itemName}"의 유효기간이 도래해요. 미리 확인해 주세요.`;
      } else if (dday === 2) {
        message = `2일 뒤 "${itemName}"의 유효기간이 도래해요. 점검할 시간이에요.`;
      } else if (dday === 1) {
        message = `내일 "${itemName}"의 유효기간이에요. 조리할 계획 있으신가요?`;
      } else if (dday <= 0) {
        message = `"${itemName}"의 유효기간이 오늘이거나 이미 지났어요. 확인이 필요해요.`;
      } else {
        continue; // 4일 이상 남은 경우 → 알림 없음
      }

      // FCM 토큰 가져오기
      const userDoc = await db.collection("USERS").doc(userId).get();

      const token = userDoc.data()?.USERINFO?.token;

      if (!token) continue;

      // ALARMCONFIG 체크
      const configSnap = await db.collection('ALARMCONFIG').doc(userId).get();
      const config = configSnap.exists ? configSnap.data() : {};
      if (config.fridge === false) continue;

      try {
        await admin.messaging().send({
          token,
          notification: {
            title: '🥶 냉장고 식재료 알림',
            body: message,
          },
          android: {
            notification: {
              sound: 'alarm_sound',
              channel_id: 'custom_channel_id_v2',
            },
          },
        });

        functions.logger.info(`✅ [${userId}] ${itemName} / D-${dday} 알림 발송 완료`);
      } catch (error) {
        functions.logger.error(`❌ [${userId}] 푸시 실패: ${error.message}`);
      }
    }

    return null;
  });



/** 🔮 오늘의 운세 알림 - 매일 오전 10시 */
/** 🎯 오늘의 운세 미참여 알림 - 매일 오전 10시 */
/** 🎯 오늘의 운세 미참여 알림 - 매일 10:00~21:00 30분마다 검사 */
/** 🔮 홍여사 오늘의 운세 알림 - 매일 10:00~21:00 동안 30분마다 검사 */
/** 🔮 홍여사 오늘의 운세 알림 - 매일 10:00~21:00 동안 50분마다 검사 */
exports.pushFortuneReminder = functions
  .region("asia-northeast1")
  .pubsub
  .schedule("*/30 10-21 * * *")
  .timeZone("Asia/Seoul")
  .onRun(async () => {

    return null; // ✅ 테스트용으로 바로 종료
    const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    let totalTarget = 0;
    let totalSuccess = 0;

    functions.logger.info("📡 [운세기지] 운세 알림 감시 작전 개시");

    const usersSnap = await db.collection("USERS").get();

    for (const doc of usersSnap.docs) {
      const user = doc.data();
      const uid = user.USERS_ID;
     
      const token = user?.USERINFO?.token;
      

      if (!token) continue;
      if (user.fortune === today) continue; // 이미 운세 본 사람 패스
      if (user.fortunePushSentDate === today) continue; // 이미 알림 보낸 사람 패스

      const configSnap = await db.collection("ALARMCONFIG").doc(uid).get();
      const config = configSnap.exists ? configSnap.data() : {};
      if (config.fortune === false) {
        functions.logger.info(`⛔ [${uid}] ALARMCONFIG.fortune == false`);
        continue;
      }

      const title = "🔮 홍여사 오늘의 운세";
      const body = "오늘의 운세, 아직 안 보셨네요! 운세 보고 하루를 가볍게 시작해볼까요? ✨";

      try {
        await admin.messaging().send({
          token,
          notification: {
            title,
            body,
          },
          android: {
            notification: {
              sound: "alarm_sound",
              channel_id: "custom_channel_id_v2",
      
            },
          },

        });

        await db.collection("USERS").doc(uid).update({
          fortunePushSentDate: today,
        });

        functions.logger.info(`✅ [${uid}] 운세 알림 발송 및 기록 완료`);
        totalTarget++;
        totalSuccess++;
      } catch (error) {
        functions.logger.error(`❌ [${uid}] 푸시 실패 - ${error.message}`);
      }
    }

    functions.logger.info(`📊 운세 알림 작전 종료: 대상자 ${totalTarget}명 / 성공 ${totalSuccess}건`);
    return null;
  });




/** 🎯 룰렛 미참여 알림 - 매일 오전 11시 */
/** 🎯 홍여사 룰렛 미참여 알림 - 매일 오전 11시 */
/** 🎯 홍여사 룰렛 미참여 알림 - 매일 11:00~21:00 30분마다 검사 */
/** 🎯 홍여사 룰렛 미참여 알림 - 매일 11:00~21:00 동안 50분마다 검사 */
exports.pushRouletteReminder = functions
  .region("asia-northeast1")
  .pubsub
  .schedule("*/30 11-21 * * *")
  .timeZone("Asia/Seoul")
  .onRun(async () => {
    return null; // ✅ 테스트용으로 바로 종료
    const today = moment().tz("Asia/Seoul").format("YYYY-MM-DD");
    let totalTarget = 0;
    let totalSuccess = 0;

    functions.logger.info("📡 [룰렛기지] 룰렛 미참여 알림 감시 작전 개시");

    const usersSnap = await db.collection("USERS").get();

    for (const doc of usersSnap.docs) {
      const user = doc.data();
      const uid = user.USERS_ID;
  
      const token = user?.USERINFO?.token;

      if (!token) continue;

      // 오늘 룰렛 돌린 사람은 패스
      if (user.roulette) {
        const rouletteDate = moment(user.roulette.toDate()).tz("Asia/Seoul").format("YYYY-MM-DD");
        if (rouletteDate === today) continue;
      }

      // 오늘 이미 룰렛 푸시 보낸 사람은 패스
      if (user.roulettePushSentDate === today) continue;

      const configSnap = await db.collection("ALARMCONFIG").doc(uid).get();
      const config = configSnap.exists ? configSnap.data() : {};
      if (config.roulette === false) {
        functions.logger.info(`⛔ [${uid}] ALARMCONFIG.roulette == false`);
        continue;
      }

      const title = "🎯 홍여사 룰렛 미참여 알림";
      const body = "🎯 오늘의 행운, 아직 안 돌리셨어요! 홍여사가 룰렛 돌릴 시간 알려드려요!";

      try {
        await admin.messaging().send({
          token,
          notification: {
            title,
            body,
          },
          android: {
            notification: {
              sound: "alarm_sound",
              channel_id: "custom_channel_id_v2",
   
            },
          },
 
        });

        await db.collection("USERS").doc(uid).update({
          roulettePushSentDate: today,
        });

        functions.logger.info(`✅ [${uid}] 룰렛 알림 발송 및 기록 완료`);
        totalTarget++;
        totalSuccess++;
      } catch (error) {
        functions.logger.error(`❌ [${uid}] 푸시 실패 - ${error.message}`);
      }
    }

    functions.logger.info(`📊 룰렛 미참여 알림 작전 종료: 대상자 ${totalTarget}명 / 성공 ${totalSuccess}건`);
    return null;
  });



  
/**
//  * 매일 오전 10시에 한번 실행되는 스케쥴입니다
//  * 유효일지가 2일전의 식품들을 푸시 알람으로 보내는 메시지입니다
//  * every day 10:00
//  */
// exports.scheduledFreezeFunction = functions.pubsub.schedule('every day 10:00').timeZone('Asia/Seoul').onRun(async (context) => {

//   functions.logger.info("이 함수는 1분마다 한번 실행됩니다 ");
//   // 실행하고자 하는 코드
//   const current = new Date();
//   current.setHours(current.getHours() + 8);
 
//   const snapshot = await db.collection('FREEZE').get();

//   const promises = snapshot.docs.map(async (doc) => {

//     const limitdate = new Date(doc.data().ENDDATE);
//     const twoDayAgo = subDays(limitdate, 2); // 이틀 빼기

//     functions.logger.info("twoDayAgo ", twoDayAgo);

//     if (current.getTime() > twoDayAgo.getTime()
//       && doc.data().ENDDATE != ''
//       && doc.data().ALARM == true
//       && current.getTime() < limitdate.getTime()) {
      
//       functions.logger.info("유효기간이 도래 하였습니다", twoDayAgo);

//       const users = await db.collection('USERS').get();

//       const userdocuments = users.docs.map(subdoc => ({
//         id: subdoc.id, ...subdoc.data()
//       }));


//       functions.logger.info("docs :", userdocuments);
//       functions.logger.info("docs :", doc.data().USERS_ID);
//       const FindIndex = userdocuments.findIndex(x => x.USERS_ID == doc.data().USERS_ID);

//       let body = "유효기간이 다가오는";
//       body += doc.data().NAME;
//       body += "식재료가 있습니다 ";
//       body += doc.data().NAME;
//       body += "에 맞는 추천 레시피를 확인하세요";


//       functions.logger.info("FindIndex :", FindIndex);
//       if (FindIndex != -1) {
//         functions.logger.info("TOKEN :", userdocuments[FindIndex].TOKEN);
//         const title ="구해줘 홍여사 식재료 유효기간 알림"
//         PushalarmMsg(userdocuments[FindIndex].TOKEN, body, title);
//       }

//     }

//   });
//   await Promise.all(promises);  // 모든 비동기 작업이 완료될 때까지 기다림
//   return null;
// });


// /**
//  * 매일 오전 11시에 한번 실행되는 스케쥴입니다
//  * 유효일지가 경과한 식품들을 푸시 알람으로 보내는 메시지입니다
//  * every day 11:00
//  */
// exports.scheduledFreezeFunction = functions.pubsub.schedule('every day 11:00').timeZone('Asia/Seoul').onRun(async (context) => {

//   functions.logger.info("이 함수는 1분마다 한번 실행됩니다 ");
//   // 실행하고자 하는 코드
//   const current = new Date();
//   current.setHours(current.getHours() + 8);

//   const snapshot = await db.collection('FREEZE').get();

//   const promises = snapshot.docs.map(async (doc) => {

//     const limitdate = new Date(doc.data().ENDDATE);
//     const twoDayAgo = subDays(limitdate, 2); // 이틀 빼기

//     functions.logger.info("twoDayAgo ", twoDayAgo);

//     if (current.getTime() < limitdate.getTime()) {

//       functions.logger.info("유효기간이 경과 하였습니다", twoDayAgo);

//       const users = await db.collection('USERS').get();

//       const userdocuments = users.docs.map(subdoc => ({
//         id: subdoc.id, ...subdoc.data()
//       }));


//       functions.logger.info("docs :", userdocuments);
//       functions.logger.info("docs :", doc.data().USERS_ID);
//       const FindIndex = userdocuments.findIndex(x => x.USERS_ID == doc.data().USERS_ID);

//       let body = "유효기간이 경과한";
//       body += doc.data().NAME;
//       body += "식재료가 있습니다 ";
//       body += doc.data().NAME;
//       body += "에 맞는 추천 레시피를 확인하세요";


//       functions.logger.info("FindIndex :", FindIndex);
//       if (FindIndex != -1) {
//         functions.logger.info("TOKEN :", userdocuments[FindIndex].TOKEN);
//         const title = "구해줘 홍여사 식재료 유효기간 알림"
//         PushalarmMsg(userdocuments[FindIndex].TOKEN, body, title);
//       }

//     }

//   });
//   await Promise.all(promises);  // 모든 비동기 작업이 완료될 때까지 기다림
//   return null;
// });




/**
 * 스케쥴정보
 * 매시간 1분마다 실행 되는 스케쥴입니다
 * [체팅 내용에 대힌 푸시 알람을 보내주는 스케쥴]
 * 1) 체팅등록에 대한 메시지를 전송한다
 * 
 */
// exports.scheduledChatFunction = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {


//   return;

//   functions.logger.info("이 함수는 매1분마다 실행됩니다 ");
//   // 실행하고자 하는 코드

//   const snapshot = await db.collection('CHAT').get();
    
//   // 문서 데이터를 배열로 저장
//   const documents = snapshot.docs.map(doc => ({ 
//     id: doc.id, ...doc.data() 
//   }));

//   for (const doc of documents) {



//     const subcollectionRef = db.collection('CHAT').doc(doc.CHAT_ID).collection('messages');

//    // 쿼리 조건 예시
//     const snapshot2 = await subcollectionRef.get();


//     const subdocuments = snapshot2.docs.map(subdoc => ({ 
//       id: subdoc.id, ...subdoc.data() 
//     }));

//     for(const subdoc of subdocuments){

//       //subdoc에 알람 표시가 없는지 확인 하고

//       if(subdoc.PUSHALARM != true){
//         if(subdoc.READ.length == 1){

       
//           if(doc.SUPPORTER_ID == subdoc.READ[0]){
//             //  doc.USERS_ID 알람 보내고(TOKEN 구해서)

//             const users = await db.collection('USERS').get();

//             const userdocuments = users.docs.map(subdoc => ({ 
//               id: subdoc.id, ...subdoc.data() 
//             }));


//             functions.logger.info("docs :", userdocuments);
//             const FindIndex = userdocuments.findIndex(x=>x.USERS_ID == doc.OWNER_ID);

//            let body =subdoc.TEXT;

//            functions.logger.info("FindIndex :", FindIndex);
//             if(FindIndex != -1){
//               functions.logger.info("TOKEN :", userdocuments[FindIndex].TOKEN);
//               PushalarmChat(userdocuments[FindIndex].TOKEN, body, SeekImage(doc.INFO.WORKTYPE));
//             }
       

//           }else{
//             //  doc.SUPPORTER_ID 알람 보내고(TOKEN 구해서)

//             const users = await db.collection('USERS').get();

//             const userdocuments = users.docs.map(subdoc => ({ 
//               id: subdoc.id, ...subdoc.data() 
//             }));

//             const FindIndex = userdocuments.findIndex(x=>x.USERS_ID == doc.SUPPORTER_ID);

//             let body =subdoc.TEXT;
//             functions.logger.info("FindIndex :", FindIndex);

//             if(FindIndex != -1){
//               functions.logger.info("TOKEN :", userdocuments[FindIndex].TOKEN);
              
//               Pushalarm(userdocuments[FindIndex].TOKEN, body, SeekImage(doc.INFO.WORKTYPE));
//             }
//           }

//           // 알람 업데이트, 하지
//           const updateData = {
//             PUSHALARM: true, 
//           };
  
    
//           console.log(subdoc);
//           await db.collection(`CHAT/${doc.CHAT_ID}/messages`).doc(subdoc.id).update(updateData);
//         }


      
//       }
  
//     }

//   }
// })


/* eslint-disable */
/**
 * Withagit(위드아지트) — 루나소프트 알림톡 발송 모듈 + Express 라우트
 * ✅ 기존 /AuthCodeSend 패턴을 Withagit용으로 정리한 “재사용 가능한 소스”
 * ✅ 하드코딩 제거(환경변수 사용)
 * ✅ 결과/에러를 응답으로 반환(입증/디버깅 용이)
 *
 * 사용 환경(택1)
 * 1) Firebase Functions + Express
 * 2) 일반 Node(Express 서버)
 *
 * 필수 환경변수:
 * - LUNASOFT_USERID
 * - LUNASOFT_API_KEY
 * - LUNASOFT_TEMPLATE_ID   (기본 템플릿ID)
 *
 * 옵션 환경변수:
 * - LUNASOFT_ENDPOINT (기본값: https://jupiter.lunasoft.co.kr/api/AlimTalk/message/send)
 *
 * 주의:
 * - 템플릿 변수가 필요한 경우 msg_content가 템플릿 규칙을 따라야 합니다.
 * - 실제 운영 템플릿이 종류별로 다르면, route별로 templateId를 따로 주입하세요.
 */





app.use(express.json({ limit: "1mb" }));

const LUNASOFT_ENDPOINT =
  process.env.LUNASOFT_ENDPOINT ||
  "https://jupiter.lunasoft.co.kr/api/AlimTalk/message/send";

function requireEnv(name) {
  const v = String(process.env[name] || "").trim();
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function normalizePhoneKR(input) {
  // 하이픈/공백 제거. (루나소프트 예시 코드가 encodeURIComponent를 썼으므로 동일하게 적용)
  return String(input || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/-/g, "");
}

function safeStr(v) {
  return String(v == null ? "" : v).trim();
}

function safeInt(v, fallback = 0) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : fallback;
}

/**
 * 루나소프트 알림톡 발송 (공용)
 * @param {Object} args
 * @param {string} args.toPhone - 수신번호(010xxxx 등)
 * @param {string} args.msg - 알림톡 본문(템플릿 규칙에 맞게 구성)
 * @param {string} [args.title] - 타이틀
 * @param {string} [args.templateId] - 템플릿ID(없으면 env 기본 사용)
 * @param {Array} [args.btnUrl] - 버튼 url 배열(루나소프트 포맷)
 * @returns {Object} { ok, data?, error?, payload? }
 */
async function sendAlimtalk({
  toPhone,
  msg,
  title = "위드아지트 알림",
  templateId = "",
  btnUrl = [{ url_pc: "", url_mobile: "" }],
} = {}) {
  const userid = requireEnv("LUNASOFT_USERID");
  const api_key = requireEnv("LUNASOFT_API_KEY");
  const template_id = safeStr(templateId) || requireEnv("LUNASOFT_TEMPLATE_ID");

  const tel_num_raw = normalizePhoneKR(toPhone);
  const tel_num = encodeURIComponent(tel_num_raw);
  const msg_content = safeStr(msg);

  if (!tel_num_raw) throw new Error("sendAlimtalk: toPhone is required");
  if (!msg_content) throw new Error("sendAlimtalk: msg is required");

  const payload = {
    userid,
    api_key,
    template_id,
    messages: [
      {
        no: String(Date.now()),
        tel_num,
        use_sms: "0",
        msg_content,
        title: safeStr(title) || "위드아지트 알림",
        sms_content: "",
        btn_url: Array.isArray(btnUrl) ? btnUrl : [{ url_pc: "", url_mobile: "" }],
      },
    ],
  };

  try {
    const res = await axios.post(LUNASOFT_ENDPOINT, payload, {
      headers: { "Content-Type": "application/json" },
      timeout: 15000,
    });

    return { ok: true, data: res?.data ?? null, payload };
  } catch (e) {
    const status = e?.response?.status || 0;
    const data = e?.response?.data || null;
    const message = e?.message || "unknown error";
    return {
      ok: false,
      error: { status, message, data },
      payload,
    };
  }
}

/* ─────────────────────────────────────────────
 * Withagit용 “알림 메시지” 구성
 * ───────────────────────────────────────────── */

function buildAuthCodeMsg(code) {
  const c = safeStr(code);
  return `위드아지트 사용을 위한 인증번호는 ${c} 입니다. 인증번호를 입력해주세요.`;
}

function buildReservationStatusMsg({ childName, statusLabel, whenText }) {
  const cn = safeStr(childName) || "자녀";
  const s = safeStr(statusLabel) || "상태 변경";
  const w = safeStr(whenText);
  return w
    ? `위드아지트 알림: ${cn} 예약이 '${s}' 처리되었습니다. (${w})`
    : `위드아지트 알림: ${cn} 예약이 '${s}' 처리되었습니다.`;
}

function buildPassUsageMsg({ childName, usedMinutes, remainMinutes }) {
  const cn = safeStr(childName) || "자녀";
  const u = safeInt(usedMinutes, 0);
  const r = safeInt(remainMinutes, -1);
  return r >= 0
    ? `위드아지트 정액권 사용: ${cn} 이용 ${u}분 차감 완료. 잔여 ${r}분입니다.`
    : `위드아지트 정액권 사용: ${cn} 이용 ${u}분 차감 완료.`;
}

/**
 * ✅ 픽업 신청 알림톡(신규 추가)
 * - 보호자가 픽업을 신청했을 때, 센터/관리자 또는 담당자에게 보내는 용도(일반적)
 * - 수신 대상이 보호자일 수도 있으니, phone은 “실제로 받을 번호”로 넣어 사용
 */
function buildPickupRequestMsg({
  branchName,
  childName,
  pickupDate,
  pickupTime,
  fromPlace,
  toPlace,
  guardianName,
  guardianPhone,
  memo,
} = {}) {
  const b = safeStr(branchName) || "위드아지트";
  const cn = safeStr(childName) || "자녀";
  const d = safeStr(pickupDate);
  const t = safeStr(pickupTime);
  const from = safeStr(fromPlace);
  const to = safeStr(toPlace);
  const g = safeStr(guardianName);
  const gp = safeStr(guardianPhone);
  const m = safeStr(memo);

  const when = d && t ? `${d} ${t}` : d ? d : t ? t : "";

  let lines = [];
  lines.push(`[${b}] 픽업 신청이 접수되었습니다.`);
  lines.push(`대상: ${cn}`);

  if (when) lines.push(`일정: ${when}`);
  if (from) lines.push(`출발: ${from}`);
  if (to) lines.push(`도착: ${to}`);

  if (g || gp) {
    const who = [g, gp].filter(Boolean).join(" / ");
    lines.push(`보호자: ${who}`);
  }

  if (m) lines.push(`메모: ${m}`);

  return lines.join("\n");
}

/* ─────────────────────────────────────────────
 * Routes
 * ───────────────────────────────────────────── */

/**
 * POST /withagit/auth-code-send
 * body: { phone, authcode, templateId? }
 */
app.post("/withagit/auth-code-send", async (req, res) => {
  try {
    const phone = req?.body?.phone;
    const authcode = req?.body?.authcode;
    const templateId = req?.body?.templateId;

    const msg = buildAuthCodeMsg(authcode);

    const result = await sendAlimtalk({
      toPhone: phone,
      msg,
      title: "위드아지트 인증",
      templateId,
    });

    if (!result.ok) {
      return res.status(500).json({
        ok: false,
        where: "auth-code-send",
        error: result.error,
        payload: result.payload,
      });
    }

    return res.status(200).json({ ok: true, result: result.data });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      where: "auth-code-send",
      message: e?.message || "unknown error",
    });
  }
});

/**
 * POST /withagit/reservation-status-notify
 * body: { phone, childName, statusLabel, whenText, templateId? }
 */
app.post("/withagit/reservation-status-notify", async (req, res) => {
  try {
    const phone = req?.body?.phone;
    const childName = req?.body?.childName;
    const statusLabel = req?.body?.statusLabel;
    const whenText = req?.body?.whenText;
    const templateId = req?.body?.templateId;

    const msg = buildReservationStatusMsg({ childName, statusLabel, whenText });

    const result = await sendAlimtalk({
      toPhone: phone,
      msg,
      title: "위드아지트 예약 알림",
      templateId,
    });

    if (!result.ok) {
      return res.status(500).json({
        ok: false,
        where: "reservation-status-notify",
        error: result.error,
        payload: result.payload,
      });
    }

    return res.status(200).json({ ok: true, result: result.data });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      where: "reservation-status-notify",
      message: e?.message || "unknown error",
    });
  }
});

/**
 * POST /withagit/pass-usage-notify
 * body: { phone, childName, usedMinutes, remainMinutes, templateId? }
 */
app.post("/withagit/pass-usage-notify", async (req, res) => {
  try {
    const phone = req?.body?.phone;
    const childName = req?.body?.childName;
    const usedMinutes = req?.body?.usedMinutes;
    const remainMinutes = req?.body?.remainMinutes;
    const templateId = req?.body?.templateId;

    const msg = buildPassUsageMsg({ childName, usedMinutes, remainMinutes });

    const result = await sendAlimtalk({
      toPhone: phone,
      msg,
      title: "위드아지트 정액권 알림",
      templateId,
    });

    if (!result.ok) {
      return res.status(500).json({
        ok: false,
        where: "pass-usage-notify",
        error: result.error,
        payload: result.payload,
      });
    }

    return res.status(200).json({ ok: true, result: result.data });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      where: "pass-usage-notify",
      message: e?.message || "unknown error",
    });
  }
});

/**
 * ✅ 픽업 신청 알림톡 발송
 * POST /withagit/pickup-request-notify
 * body: {
 *   phone,               // 실제 수신번호(센터/관리자/담당자/보호자 중 누구든)
 *   branchName?,
 *   childName,
 *   pickupDate?,
 *   pickupTime?,
 *   fromPlace?,
 *   toPlace?,
 *   guardianName?,
 *   guardianPhone?,
 *   memo?,
 *   templateId?
 * }
 *
 * 버튼 URL을 쓰고 싶으면 body.btnUrl로 넘기면 됨:
 * btnUrl: [{ url_pc:"", url_mobile:"" }]
 */
app.post("/withagit/pickup-request-notify", async (req, res) => {
  try {
    const phone = req?.body?.phone;
    const templateId = req?.body?.templateId;

    const msg = buildPickupRequestMsg({
      branchName: req?.body?.branchName,
      childName: req?.body?.childName,
      pickupDate: req?.body?.pickupDate,
      pickupTime: req?.body?.pickupTime,
      fromPlace: req?.body?.fromPlace,
      toPlace: req?.body?.toPlace,
      guardianName: req?.body?.guardianName,
      guardianPhone: req?.body?.guardianPhone,
      memo: req?.body?.memo,
    });

    const btnUrl = Array.isArray(req?.body?.btnUrl) ? req.body.btnUrl : undefined;

    const result = await sendAlimtalk({
      toPhone: phone,
      msg,
      title: "위드아지트 픽업 신청",
      templateId,
      btnUrl,
    });

    if (!result.ok) {
      return res.status(500).json({
        ok: false,
        where: "pickup-request-notify",
        error: result.error,
        payload: result.payload,
      });
    }

    return res.status(200).json({ ok: true, result: result.data });
  } catch (e) {
    return res.status(500).json({
      ok: false,
      where: "pickup-request-notify",
      message: e?.message || "unknown error",
    });
  }
});

/**
 * 헬스체크
 */
app.get("/health", (req, res) => res.status(200).send("ok"));

module.exports = { app, sendAlimtalk };




app.post('/AuthCodeSend', async (req, response) => {
  const Item = JSON.parse(JSON.stringify(req.body));

  const tel_num = encodeURIComponent(Item.phone);
  const CODE = encodeURIComponent(Item.authcode);


  let presentInfo = {
    userid: "kkan2222",
    api_key: "qquhto3r46ixis9v1sjwe8k7bfpuryz4fz8eljgm",
    template_id: "50043",
    messages: [{
      "no": "1234",
      "tel_num": tel_num,
      "use_sms": "0",
      "msg_content": "구해줘 홍여사 사용을 위한 인증번호는 " + CODE + " 입니다.인증번호를 입력해주세요",
      "title": "구해줘 홍여사 인증",
      "sms_content": "",
      "btn_url": [
        {
          "url_pc": "",
          "url_mobile": ""
        }
      ]
    }],

  }



  try {

    // axios를 사용하여 POST 요청

    axios.post('https://jupiter.lunasoft.co.kr/api/AlimTalk/message/send', presentInfo, {
      headers: {
        "Content-Type": "application/json"
      }
    }).then((response2) => {
      functions.logger.info("response2 ", response2);
      console.log("response2", response2);
      response.status(200).json('ok');
    })
      .catch((error) => console.error('Error:', error));


  } catch (error) {
    // 에러 처리
    console.error("Error sending POST request:", error.message);
    response.status(500).send({
      message: "Failed to send POST request",
      error: error.message,
    });
  }



});



app.post('/proxy-image', async(req, res) => {
  cors(req, res, async () => {
    try {

      const response = await axios.get("https://korean.visitkorea.or.kr/kfes/list/wntyFstvlList.do", { timeout: 10000 });  // 10초 타임아웃 설정
      functions.logger.info("Axios request completed");

      // HTML 파싱
      const $ = cheerio.load(response.data);

 
      
      const data = [];
      $('#fstvlList.li').each((index, element) => {
        let item ={
          addr : "",
          image : "",
          content:"",
          date :"",
          location : ""
        }
        item.addr = element.$('a').attr('href');
        item.image = element.$('a .other_festival_content strong').text();
        item.content = element.$('a .other_festival_content strong').text();
        item.date = element.$('a .other_festival_content .date').text();
        item.location = element.$('a .other_festival_content .loc').text();
        data.push(item);
      });

      functions.logger.error("data:", data);
      res.status(200).send(data);

    } catch (error) {
      functions.logger.error("Error fetching image:", error);
      res.status(500).send({ error: 'Internal server error', details: error.message });
    }
  });
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
 * 
 * 
 */
app.post('/AlarmChat', async(req, response) => {
  const Item = JSON.parse(JSON.stringify(req.body));

  const AlarmTarget_ID = encodeURIComponent(Item.AlarmTarget_ID);


  const users = await db.collection('USERS').get();

  const userdocuments = users.docs.map(subdoc => ({
    id: subdoc.id, ...subdoc.data()
  }));


  functions.logger.info("docs :", userdocuments);
  const FindIndex = userdocuments.findIndex(x => x.USERS_ID == AlarmTarget_ID);

  let body = "대화내용이 있습니다";

  functions.logger.info("AlarmChat FindIndex :", FindIndex);
  if (FindIndex != -1) {
    functions.logger.info("TOKEN :", userdocuments[FindIndex].TOKEN);
    PushalarmChat(userdocuments[FindIndex].TOKEN, body);
  }



});

/**
 * 기상청 전체조회 MidFcst
 * FireStore 미사용 / Storage 미사용
 * 사용자 호출시마다
 */
app.post('/TotalFcst', (req, response) => {
  const Item = JSON.parse(JSON.stringify(req.body));

  const DateEncode = encodeURIComponent(Item.date);
 
  // const apiUrl = `https://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo=1&numOfRows=10&type=json&itemName=${NameEncode}`;
 
  const apiUrl = `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidFcst?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo=1&numOfRows=10&dataType=JSON&stnId=108&tmFc=${DateEncode}`;

  functions.logger.info("/MidFcst  apiUrl", apiUrl);
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
      
        functions.logger.info("MidFcst=======> error ",error);

        response.send(res.body);


      }
    );

  } else {
    res.status(400).send('No body found in the request');
  }

});

/**
 * 기상청 단기전망조회 MidFcst
 * FireStore 미사용 / Storage 미사용
 * 사용자 호출시마다
 */
app.post('/ShortFcst', (req, response) => {
  const Item = JSON.parse(JSON.stringify(req.body));

  const DateEncode = encodeURIComponent(Item.date);
  const LatitudeEncode = encodeURIComponent(Item.latitude);
  const LongitudeEncode = encodeURIComponent(Item.longitude);
 
  // const apiUrl = `https://apis.data.go.kr/1471000/DrbEasyDrugInfoService/getDrbEasyDrugList?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo=1&numOfRows=10&type=json&itemName=${NameEncode}`;
 
  const apiUrl = `https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo=1&numOfRows=1000&dataType=JSON&base_date=${DateEncode}&base_time=0500&nx=${LatitudeEncode}&ny=${LongitudeEncode}`;

  functions.logger.info("/MidFcst  apiUrl", apiUrl);
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
      
        functions.logger.info("MidFcst=======> error ",error);
        response.send(res.body);


      }
    );

  } else {
    res.status(400).send('No body found in the request');
  }

});


/**
 * 기상청 중기전망 날씨조회 MidFcst
 * FireStore 미사용 / Storage 미사용
 * 사용자 호출시마다
 */
app.post('/MidSkyFcst', (req, response) => {
  const Item = JSON.parse(JSON.stringify(req.body));

  const DateEncode = encodeURIComponent(Item.date);
  const RegionIdEncode = encodeURIComponent(Item.regionid);

 

  const apiUrl = `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidLandFcst?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo=1&numOfRows=10&dataType=JSON&regId=${RegionIdEncode}&tmFc=${DateEncode}`;

  functions.logger.info("/MidFcst  apiUrl", apiUrl);
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
      
        functions.logger.info("MidFcst=======> error ",error);
        response.send(res.body);


      }
    );

  } else {
    res.status(400).send('No body found in the request');
  }

});


/**
 * 기상청 중기전망 기온조회 MidFcst
 * FireStore 미사용 / Storage 미사용
 * 사용자 호출시마다
 */
app.post('/MidTemperateFcst', (req, response) => {
  const Item = JSON.parse(JSON.stringify(req.body));

  const DateEncode = encodeURIComponent(Item.date);
  const RegionIdEncode = encodeURIComponent(Item.regionid);


  const apiUrl = `https://apis.data.go.kr/1360000/MidFcstInfoService/getMidTa?serviceKey=LwYvzhfu2yjBXa%2FcBriqdfBE7w6CX9BuStYdUI86KWS81p61A6cYvJZOB%2BBatGsPyq%2FYUeEbaeXtwQlltJhTEg%3D%3D&pageNo=1&numOfRows=10&dataType=JSON&regId=${RegionIdEncode}&tmFc=${DateEncode}`;

  functions.logger.info("/MidTemperateFcst  apiUrl", apiUrl);
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
      
        functions.logger.info("MidFcst=======> error ",error);
        response.send(res.body);
      }
    );

  } else {
    res.status(400).send('No body found in the request');
  }

});





/**
 * 현재위치 구하기
 * FireStore 미사용 / Storage 미사용
 * 사용자 호출시마다
 */
app.post('/Location', (req, response) => {
  const Item = JSON.parse(JSON.stringify(req.body));

  const apiKey = encodeURIComponent(Item.apiKey);


  const apiUrl = `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`;

  functions.logger.info("/Location  apiUrl", apiUrl);
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
      
        functions.logger.info("Location=======> error ",error);
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


exports.api = functions.region('asia-northeast1').https.onRequest(app);




exports.get_DiscountItems = functions
  .runWith({ memory: "1GB", timeoutSeconds: 60 })
  .region("asia-northeast1")
  .https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const result = {};

      result["홈플러스"] = await fetchFromHomeplus();
      result["이마트몰"] = await fetchFromEmart();
      result["마켓컬리"] = await fetchFromKurlyWithPopup();          // puppeteer 필요시 교체
      result["G마켓"] = { section: "빅딜", items: [] };     // 추후 확장
      result["11번가"] = { section: "오늘의 특가", items: [] };
      result["쿠팡"] = { section: "핫딜", items: [] };

      res.status(200).json(result);
    } catch (e) {
      functions.logger.error("🔥 멀티크롤링 실패:", e);
      res.status(500).send("실패");
    }
  });
});
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

