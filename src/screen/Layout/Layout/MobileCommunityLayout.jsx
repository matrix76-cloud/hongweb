import React from "react";
import MobilePrevheader from "../Header/MobilePrevheader";
import MobileTitleheader from "../Header/MobileTitleheader";
import MobileFooter from "../Footer/MobileFooter";

/**
 * 제목 + 뒤로가기 헤더를 쓰는 공통 레이아웃.
 * 이름은 커뮤니티지만 실제로는 채팅·지도·일감 상세·내 정보 상세가 함께 쓴다.
 *
 * footer={true} 를 주면 하단 탭이 유지된다.
 * 하단 탭 화면(홈/지도/채팅/내 정보)에서는 탭이 항상 보여야 한다 — 형 지시 2026-08-12.
 *
 * titleonly={true} 를 주면 뒤로가기 대신 좌측 정렬 제목만 나온다.
 * 하단 탭이 있는 최상위 화면은 뒤로 갈 곳이 탭이라 화살표가 필요 없다 — 형 지시 2026-08-12.
 */
const MobileCommunityLayout = (props) => {
  return (
    <div>
      {props.titleonly
        ? <MobileTitleheader name={props.name} />
        : <MobilePrevheader name={props.name} />}
      <main style={props.footer ? { paddingBottom: 86 } : undefined}>
        {props.children}
      </main>
      {props.footer && <MobileFooter type={props.type} />}
    </div>
  );
};

export default MobileCommunityLayout;
