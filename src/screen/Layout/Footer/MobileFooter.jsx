import React, { Fragment } from "react";
import './Footer.css';
import { useNavigate } from "react-router-dom";
import { IoChatbubbleEllipses, IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { imageDB } from '../../../utility/imageData';
import { MOBILEMAINMENU } from "../../../utility/screen";

const ON_COLOR = '#FF4E19';
const OFF_COLOR = '#9b9b9b';

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

const MobileFooter = ({ type, unreadCount = 0 }) => {
  const navigate = useNavigate();

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
                      <img src={imageDB[active ? tab.on : tab.off]} width={24} alt={tab.label} />
                    )}

                    {tab.key === MOBILEMAINMENU.CHATMENU && unreadCount > 0 && (
                      <div className="footerBadge">{unreadCount > 99 ? '99+' : unreadCount}</div>
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
