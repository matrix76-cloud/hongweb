import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import localforage from "localforage";
import { UserContext } from "../../../context/User";
import { Update_userinfobyusersid } from "../../../service/UserService";

/**
 * 내 정보 > 실시간 알림설정 (형 리뷰 2026-08-12 "기능 구현 필요").
 *
 * 눌러도 "준비 중입니다" 만 뜨던 자리다.
 * 어떤 알림을 받을지 항목별로 켜고 끈다. 계정에 저장하므로 기기를 바꿔도 따라온다.
 * 기기 자체가 알림을 막아둔 경우(브라우저 권한 거부)는 여기서 켜도 안 오므로 그 상태도 알려준다.
 */

const ITEMS = [
  { key: 'SUPPORT',  title: '내 일감에 지원이 오면',   desc: '내가 올린 일감에 홍여사가 지원했을 때' },
  { key: 'CHAT',     title: '새 채팅 메시지',          desc: '대화방에 새 글이 올라왔을 때' },
  { key: 'MATCHED',  title: '거래가 성사되면',          desc: '지원한 일감이 나로 정해졌을 때' },
  { key: 'NEARWORK', title: '가까운 새 일감',          desc: '내 범위 안에 새 일감이 올라왔을 때' },
  { key: 'NOTICE',   title: '공지·안내',               desc: '서비스 점검, 약관 변경 같은 알림' },
];

/* 기본값 — 공지 빼고 다 켜둔다 */
const DEFAULTS = { SUPPORT: true, CHAT: true, MATCHED: true, NEARWORK: true, NOTICE: false };
const STORE_KEY = 'hong.noti.settings';

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
  gap: 14px;
  padding: 16px 2px;
  border-bottom: 1px solid var(--border-soft);
  cursor: pointer;
  user-select: none;
`;
const RowText = styled.div`
  min-width: 0;
`;
const RowTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
`;
const RowDesc = styled.div`
  font-size: 13px;
  color: #8A8A8A;
  margin-top: 4px;
  line-height: 1.5;
`;
const Switch = styled.div`
  flex-shrink: 0;
  width: 50px;
  height: 30px;
  border-radius: 100px;
  background: ${({ $on }) => ($on ? '#FF4E19' : '#D8D8D8')};
  padding: 3px;
  box-sizing: border-box;
  transition: background .18s ease;
`;
const Knob = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 100px;
  background: var(--surface);
  transform: translateX(${({ $on }) => ($on ? '20px' : '0')});
  transition: transform .18s ease;
`;
/* 기기가 알림을 막아둔 경우 안내 */
const Blocked = styled.div`
  margin-top: 18px;
  padding: 14px 16px;
  border: 1px solid var(--border-soft);
  border-radius: 12px;
  background: var(--bg-soft);
  font-size: 14px;
  line-height: 1.6;
  color: #666;
`;
const Saved = styled.div`
  margin-top: 14px;
  font-size: 14px;
  color: #FF4E19;
  font-weight: 600;
`;

const MobileNotiSetting = () => {
  const { user, dispatch } = useContext(UserContext);
  const [set, setSet] = useState(DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [perm, setPerm] = useState('default');

  useEffect(() => {
    let alive = true;
    (async () => {
      // 계정에 저장된 값이 먼저, 없으면 이 기기에 남은 값, 그것도 없으면 기본값
      const fromUser = user?.notisettings;
      const fromDevice = await localforage.getItem(STORE_KEY);
      if (!alive) return;
      setSet({ ...DEFAULTS, ...(fromDevice || {}), ...(fromUser || {}) });
      try {
        if (typeof Notification !== 'undefined') setPerm(Notification.permission);
      } catch (e) { /* 브라우저가 지원 안 하면 그냥 둔다 */ }
    })();
    return () => { alive = false; };
  }, []);

  const toggle = async (key) => {
    const next = { ...set, [key]: !set[key] };
    setSet(next);
    setSaved(true);

    await localforage.setItem(STORE_KEY, next).catch(() => {});
    if (user?.users_id) {
      user.notisettings = next;
      dispatch(user);
      await Update_userinfobyusersid({ USERINFO: user, USERS_ID: user.users_id }).catch(() => {});
    }
    setTimeout(() => setSaved(false), 1400);
  };

  return (
    <Container>
      <Head>실시간 알림설정</Head>
      <Desc>받고 싶은 알림만 켜두세요. 바꾸면 바로 저장됩니다.</Desc>

      {ITEMS.map((it) => (
        <Row key={it.key} onClick={() => toggle(it.key)}>
          <RowText>
            <RowTitle>{it.title}</RowTitle>
            <RowDesc>{it.desc}</RowDesc>
          </RowText>
          <Switch $on={set[it.key] === true}><Knob $on={set[it.key] === true} /></Switch>
        </Row>
      ))}

      {saved && <Saved>저장했습니다</Saved>}

      {perm === 'denied' && (
        <Blocked>
          기기에서 이 앱의 알림을 막아두셨습니다. 여기서 켜도 알림이 오지 않습니다.
          휴대폰 설정 &gt; 알림에서 홍여사를 허용해주세요.
        </Blocked>
      )}
    </Container>
  );
};

export default MobileNotiSetting;
