import React, { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styled from 'styled-components';
import TimeAgo from 'react-timeago';
import koreanStrings from "react-timeago/lib/language-strings/ko";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

import { UserContext } from "../context/User";
import ChatprofileImage from "./ChatprofileImage";
import { getFullTime } from "../utility/date";
import { workOf } from "../utility/chat";

const formatter = buildFormatter(koreanStrings);

/**
 * 대화 목록 한 줄. (형 지시 2026-08-12 — 다시 만듦)
 *
 * 예전엔 absolute 로 좌표를 박아 글자가 길어지면 겹치고 넘쳤다.
 * [프로필] [이름·구분·시간 / 마지막 대화] [안읽음] 한 줄짜리 flex 로 바꿨다.
 */
const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  box-sizing: border-box;
  padding: 14px 20px;
  background: #fff;
  border-bottom: 1px solid #F2F2F2;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  &:active { background: #FAFAFA; }
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

const TopLine = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
`;

const Name = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #131313;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 45%;
`;

const Role = styled.div`
  flex: none;
  font-size: 13px;
  color: #A3A3A3;
`;

const Time = styled.div`
  flex: none;
  margin-left: auto;
  font-size: 13px;
  color: #A3A3A3;
  white-space: nowrap;
`;

const Preview = styled.div`
  margin-top: 3px;
  font-size: 15px;
  color: #636363;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Unread = styled.div`
  flex: none;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 10px;
  background: #FF4E19;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
  box-sizing: border-box;
`;

const Chatgate = ({ containerStyle, item }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  // 내가 일감 주인이면 상대는 지원자, 아니면 상대가 주인이다
  const iAmOwner = item.SUPPORTER_ID !== user.users_id;
  const partner = iAmOwner ? item.SUPPORTER : item.OWNER;
  const info = partner?.USERINFO || {};

  const unread = (item.UNREAD && item.UNREAD[user.users_id]) || 0;
  const at = item.LASTMESSAGE_AT || item.CREATEDT;

  // 주고받은 대화가 있으면 마지막 대화를, 없으면 어떻게 시작된 방인지 보여준다
  const preview = useMemo(() => {
    if (item.LASTMESSAGE) return item.LASTMESSAGE;
    const type = workOf(item).WORKTYPE || '일감';
    return iAmOwner
      ? `${type}에 ${info.nickname || '홍여사'}님이 지원하였습니다`
      : `${type}에 지원하였습니다`;
  }, [item, iAmOwner, info.nickname]);

  const _handleChat = () => {
    navigate("/Mobilecontent", {
      state: {
        ITEM: item,
        OWNER: iAmOwner,
        NAME: info.nickname || '',
        LEFTIMAGE: info.userimg || '',
        LEFTNAME: info.nickname || '',
      },
    });
  };

  return (
    <Row style={containerStyle} onClick={_handleChat}>
      <ChatprofileImage source={info.userimg} size={46} />

      <Body>
        <TopLine>
          <Name>{info.nickname || '이름 없음'}</Name>
          <Role>{iAmOwner ? '지원' : '의뢰'}</Role>
          {at ? <Time><TimeAgo date={getFullTime(at)} formatter={formatter} /></Time> : null}
        </TopLine>
        <Preview>{preview}</Preview>
      </Body>

      {unread > 0 && <Unread>{unread > 99 ? '99+' : unread}</Unread>}
    </Row>
  );
};

export default Chatgate;
