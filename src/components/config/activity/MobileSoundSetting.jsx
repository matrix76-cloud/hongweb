import React, { useContext, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { PiCheckBold } from "react-icons/pi";
import { UserContext } from "../../../context/User";
import { Update_userinfobyusersid } from "../../../service/UserService";
import { NOTI_SOUNDS, DEFAULT_NOTI_SOUND, loadNotiSound, rememberNotiSound } from "../../../utility/notiSound";

/**
 * 내 정보 > 앱 설정 > 알림음 설정 (형 지시 2026-08-22 — 도우미 앱 마이페이지와 같은 기능)
 *
 * 몇 가지 소리 중에 하나를 고른다. 고르면 그 소리를 바로 들려주고 계정에 저장한다.
 * 실제 푸시가 올 때 이 소리로 울리는 건 앱(HongLady)과 functions/fcm.js 가 맡는다.
 */

const Container = styled.div`
  padding: 20px 20px 40px;
  min-height: 420px;
`;
const Head = styled.div`
  font-size: 17px;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 6px;
`;
const Desc = styled.div`
  font-size: 15px;
  line-height: 1.6;
  color: #71717a;
  margin-bottom: 18px;
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 2px;
  border-bottom: 1px solid var(--border-soft);
  cursor: pointer;
  user-select: none;
`;
const RowText = styled.div`
  min-width: 0;
  flex: 1;
`;
const RowTitle = styled.div`
  font-size: 16px;
  font-weight: ${({ $on }) => ($on ? 700 : 600)};
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 6px;
`;
const RowDesc = styled.div`
  font-size: 13px;
  color: #8A8A8A;
  margin-top: 4px;
  line-height: 1.5;
`;
/* 미리듣기 — 누른 게 보여야 한다. 소리가 작거나 무음이면 버튼이 죽은 줄 안다 */
const PlayBtn = styled.button`
  flex-shrink: 0;
  height: 36px;
  padding: 0 14px;
  border: 1px solid var(--border);
  background: ${({ $playing }) => ($playing ? '#1b1f27' : 'var(--surface)')};
  color: ${({ $playing }) => ($playing ? '#fff' : 'var(--text)')};
  font-size: 14px;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: background .12s ease, color .12s ease, transform .12s ease;
  &:active { transform: scale(0.95); }
`;
/* 음원이 아직 없는 항목 — 버튼을 두면 눌러도 소리가 안 나 고장처럼 보인다 */
const Pending = styled.span`
  flex-shrink: 0;
  font-size: 13px;
  color: #8A8A8A;
`;
const Saved = styled.div`
  margin-top: 14px;
  font-size: 14px;
  color: #1b1f27;
  font-weight: 600;
`;
const Note = styled.div`
  margin-top: 18px;
  padding: 14px 16px;
  border: 1px solid var(--border-soft);
  background: var(--bg-soft);
  font-size: 14px;
  line-height: 1.6;
  color: #666;
`;

const MobileSoundSetting = () => {
  const { user, dispatch } = useContext(UserContext);
  const [sound, setSound] = useState(DEFAULT_NOTI_SOUND);
  const [playing, setPlaying] = useState('');
  const [saved, setSaved] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    let alive = true;
    loadNotiSound(user).then((v) => { if (alive) setSound(v); });
    return () => {
      alive = false;
      audioRef.current?.pause();
    };
  }, []);

  /* 이름만 보고는 어떤 소리인지 알 수 없다 — 고르는 즉시 들려준다 */
  const play = (opt) => {
    if (!opt.file || opt.pending) return;
    audioRef.current?.pause();
    const audio = new Audio(opt.file);
    audioRef.current = audio;
    setPlaying(opt.key);
    const done = () => setPlaying((k) => (k === opt.key ? '' : k));
    audio.onended = done;
    audio.onerror = done;
    audio.play().catch(done);   // 자동재생 차단·파일 없음 — 조용히 넘긴다
  };

  const pick = async (opt) => {
    setSound(opt.key);
    play(opt);
    setSaved(true);
    await rememberNotiSound(opt.key);
    if (user?.users_id) {
      user.notisound = opt.key;
      dispatch(user);
      await Update_userinfobyusersid({ USERINFO: user, USERS_ID: user.users_id }).catch(() => {});
    }
    setTimeout(() => setSaved(false), 1400);
  };

  return (
    <Container>
      <Head>알림음 설정</Head>
      <Desc>알림이 올 때 울릴 소리를 고르세요. 고르면 바로 저장됩니다.</Desc>

      {NOTI_SOUNDS.map((opt) => {
        const on = sound === opt.key;
        return (
          <Row key={opt.key} onClick={() => pick(opt)}>
            <RowText>
              <RowTitle $on={on}>
                {on && <PiCheckBold size={16} />}
                {opt.label}
              </RowTitle>
              <RowDesc>{opt.desc}</RowDesc>
            </RowText>
            {opt.pending ? (
              <Pending>준비 중</Pending>
            ) : opt.file ? (
              <PlayBtn
                type="button"
                $playing={playing === opt.key}
                onClick={(e) => { e.stopPropagation(); play(opt); }}
              >
                미리듣기
              </PlayBtn>
            ) : null}
          </Row>
        );
      })}

      {saved && <Saved>저장했습니다</Saved>}

      <Note>
        여기서 고른 소리는 앱으로 오는 알림에 적용됩니다. 휴대폰에서 이 앱의 알림을 꺼두었거나 무음이면 소리가 나지 않습니다.
      </Note>
    </Container>
  );
};

export default MobileSoundSetting;
