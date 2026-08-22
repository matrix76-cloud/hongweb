# [HongLady 앱] 지시서 — 알림음 설정 (앱 쪽 작업)

목표: 웹(내 정보 > 앱 설정 > 알림음 설정)에서 고른 소리로 실제 푸시가 울리게 한다.
도우미(2026Mobile/Doum) 앱에 같은 기능이 이미 있으니 그 코드를 그대로 옮기면 된다.

작업 폴더: `/Users/a1111/Downloads/2026Dev/mainproject/2026Mobile/HongLady` (패키지 `com.hongapp`)
건드리지 마: 웹(hongweb)·functions 는 카스가 이미 끝냈다. 앱만 하면 된다.

## 웹·서버가 이미 해둔 것 (앱은 여기에 맞추면 된다)
- 사용자가 고른 값은 USERS 문서 `notisound` 에 저장. 키는 다섯 개:
  `honglady`(기본) · `bell` · `chime` · `soft` · `system`(기기 기본음)
- functions/fcm.js 가 푸시를 보낼 때
  - 안드로이드: `android.notification.channelId = "sound_<키>"`, `sound = "<키>"`
  - iOS: `aps.sound = "<키>.caf"` (system 이면 `default`)
  → 앱은 **그 이름의 채널과 음원 파일만 갖고 있으면** 된다. FCM 수신 서비스를 갈아끼울 필요 없음
    (도우미는 서버가 sound 만 보내서 서비스를 덮었지만, 홍여사는 서버가 채널 id 를 직접 보낸다).

## 음원 파일 — 이미 변환까지 해뒀다. 복사만 하면 된다
- 안드로이드용: `hongweb/_docs/app_sounds/android/{honglady,bell,chime,soft}.mp3`
- iOS용:       `hongweb/_docs/app_sounds/ios/{honglady,bell,chime,soft}.caf`
- honglady = "홍여사 알림이에요" 목소리 (형 확정 2026-08-22). 네 개 전부 있으니 아래에서 "honglady 없으면" 같은 예외 처리는 필요 없다.

## 1. 안드로이드
1. `android/app/src/main/res/raw/` 에 `honglady.mp3` `bell.mp3` `chime.mp3` `soft.mp3` 복사 (`_docs/app_sounds/android/`)
   - res/raw 파일명은 소문자·숫자·밑줄만.
2. `android/app/src/main/java/com/hongapp/NotificationChannels.kt` 새로 만든다.
   도우미 것을 복사해서 고친다: `2026Mobile/Doum/android/app/src/main/java/kr/co/isuperhero/DouMe/NotificationChannels.kt`
   - package → `com.hongapp`
   - 채널 id: `sound_honglady` `sound_bell` `sound_chime` `sound_soft` `sound_system` (무음 채널은 필요 없음)
   - 채널 라벨: "알림 (홍여사 소리)" "알림 (벨)" "알림 (차임)" "알림 (부드러운 소리)" "알림 (기기 기본음)"
   - 그룹 이름: "홍여사 알림"
   - RAW_BY_CHANNEL: honglady→honglady, bell→bell, chime→chime, soft→soft
   - `channelIdForSound()` 는 안 써도 되지만 두어도 무방.
   - **주의: 채널은 한 번 만들어지면 소리를 못 바꾼다.** 개발 중 소리를 바꿔 테스트하려면 앱을 지우고 다시 깐다.
3. `MainApplication.kt` `onCreate()` 에 `NotificationChannels.ensure(this)` 한 줄 추가 (도우미 MainApplication.kt 42행 참고).
4. `AndroidManifest.xml` `<application>` 안에 기본 채널 메타를 넣어 구버전 payload 도 홍여사 채널로 가게 한다:
   ```xml
   <meta-data android:name="com.google.firebase.messaging.default_notification_channel_id"
              android:value="sound_honglady" />
   ```
5. 현재 서버가 통화 알림에 `voicecall` 채널을 지정하는데 앱에 그 채널이 없다. 같은 파일에서
   `voicecall` 채널(IMPORTANCE_HIGH, 소리는 honglady 와 동일)도 함께 만들어 둔다.

## 2. iOS
1. `honglady.caf` `bell.caf` `chime.caf` `soft.caf` (`_docs/app_sounds/ios/`) 를 Xcode 프로젝트 `hongappios` 타깃에 추가
   (Copy Bundle Resources 에 들어가야 한다. 파일을 ios/hongappios/ 에 두고 Xcode 에서 Add Files…).
2. 코드 변경 없음 — APNs 가 `aps.sound` 이름으로 번들에서 찾는다. 없으면 기본음.

## 3. 확인
1. 웹 내 정보 > 앱 설정 > 알림음 설정에서 "벨" 선택.
2. 즉시 발송 테스트 (스케줄 안 기다림):
   `curl -X POST https://asia-northeast3-<프로젝트>.cloudfunctions.net/sendTestPush -H 'Content-Type: application/json' -d '{"uid":"<USERS_ID>","title":"알림음 테스트","body":"벨 소리가 나야 함"}'`
   (uid 는 USERS 문서의 USERS_ID. Auth UID 아님)
3. 앱이 백그라운드/종료 상태에서 벨 소리가 나면 끝. 안 나면:
   - 안드로이드: 기기 설정 > 앱 > 홍여사 > 알림 에 "알림 (벨)" 채널이 있는지 → 없으면 ensure() 호출 안 됨
   - 채널은 있는데 소리가 기본음이면 → 채널이 음원 없던 시절에 먼저 만들어진 것. 앱 삭제 후 재설치
   - `adb logcat | grep -i "FirebaseMessaging\|NotificationChannels"`

## 완료 조건
- 안드로이드·iOS 모두 웹에서 고른 소리(벨/차임/부드러운)로 푸시가 울린다.
- 기기 기본음을 고르면 기본음, 아무것도 안 고른 사용자는 홍여사 소리("홍여사 알림이에요").
- 완료 보고에 res/raw 파일 목록과 Xcode 번들에 들어간 caf 목록을 적는다.
