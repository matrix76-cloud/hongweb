import React, { Fragment, useContext, useEffect, useState } from "react";
import './Footer.css';
import { useNavigate } from "react-router-dom";
import { IoChatbubbleEllipses, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { imageDB } from '../../../utility/imageData';
import { MOBILEMAINMENU } from "../../../utility/screen";
import { UserContext } from "../../../context/User";
import { SubscribeChatRooms, UnreadTotalOf } from "../../../service/ChatService";

// 선택된 탭만 포인트색, 나머지는 회색이 아니라 검정 (형 리뷰 2026-08-12)
const ON_COLOR = '#FF4E19';
const OFF_COLOR = '#131313';

/**
 * 하단 탭 — 홈 / 지도 / 채팅 / 내 정보
 * 공간대여·커뮤니티는 제거했다. 채팅은 ④연결 단계라 하단에 둔다. (CORE.md 참조)
 */
const TABS = [
  { key: MOBILEMAINMENU.HOMEMENU,   label: '홈',      path: '/Mobilemain',   on: 'home_e',   off: 'home_d' },
  { key: MOBILEMAINMENU.MAPMENU,    label: '지도',    path: '/Mobilemap',    on: 'map_e',    off: 'map_d' },
  { key: MOBILEMAINMENU.CHATMENU,   label: '채팅',    path: '/Mobilechat',   icon: true },
  { key: MOBILEMAINMENU.CONFIGMENU, label: '내 정보', path: '/Mobileconfig', on: 'myinfo_e', off: 'myinfo_d' },
];

const MobileFooter = ({ type, unreadCount }) => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [unread, setUnread] = useState(0);

  // 안읽은 대화 수를 실시간으로 받아 채팅 탭에 표시한다.
  // 전엔 이 값을 아무도 안 넘겨줘서 뱃지가 항상 0 이었다. (형 리뷰 2026-08-12)
  useEffect(() => {
    if (unreadCount != null) return;          // 부모가 직접 넘기면 그 값을 쓴다
    const USERS_ID = user?.users_id;
    if (!USERS_ID) return;

    const unsubscribe = SubscribeChatRooms({ USERS_ID }, (rooms) => {
      setUnread(UnreadTotalOf(rooms, USERS_ID));
    });
    return () => { if (typeof unsubscribe === 'function') unsubscribe(); };
  }, [user?.users_id, unreadCount]);

  const badgeCount = unreadCount != null ? unreadCount : unread;

  const go = (tab) => {
    if (tab.key === MOBILEMAINMENU.MAPMENU) {
      navigate(tab.path, { state: { WORK_ID: "", TYPE: "" } });
      return;
    }
    navigate(tab.path);
  };

  return (
    <Fragment>
      <footer>
        <div className="site-mobile-footer2">
          <div className="buttonview">
            {TABS.map((tab) => {
              const active = type === tab.key;
              return (
                <div className="button" key={tab.label} onClick={() => go(tab)}>
                  <div className="imageicon" style={{ position: 'relative' }}>
                    {tab.icon ? (
                      active
                        ? <IoChatbubbleEllipses size={24} color={ON_COLOR} />
                        : <IoChatbubbleEllipsesOutline size={24} color={OFF_COLOR} />
                    ) : (
                      <img src={imageDB[active ? tab.on : tab.off]} width={24} alt={tab.label}
                        className={active ? undefined : "tabIconOff"} />
                    )}

                    {tab.key === MOBILEMAINMENU.CHATMENU && badgeCount > 0 && (
                      <div className="footerBadge">{badgeCount > 99 ? '99+' : badgeCount}</div>
                    )}
                  </div>
                  <div className={active ? "buttonEnableText" : "buttonDisableText"}>
                    {tab.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </footer>
    </Fragment>
  );
};

export default MobileFooter;
