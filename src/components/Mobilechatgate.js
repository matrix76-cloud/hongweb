// ✅ 최신 버전 Mobilechatgate 전체 코드
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from 'styled-components';
import { Column, FlexstartColumn } from "../common/Column";
import { Row } from "../common/Row";
import { UserContext } from "../context/User";
import ChatprofileImage from "./ChatprofileImage";
import { imageDB } from "../utility/imageData";
import { getFontSize } from '../utility/fontsize';
import { getRelativeOrFormattedTime } from "../utility/date";
import { ReadContactByIndividually } from "../service/ContactService";
import { collection, getDocs, query, updateDoc, where, doc, setDoc, deleteDoc, orderBy, arrayUnion, getDoc } from 'firebase/firestore';
import { db, auth, storage, firebaseConfig, firebaseApp } from '../api/config';

import {
  SwipeableListItem,
  SwipeAction,
  TrailingActions
} from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';





const Container = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: ${() => getFontSize(14)}px;
  background-color: #fff;
  width: 100%;
`;

const ItemLayer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #F0F0F0;
`;

const ContentLayer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  line-height: 1.5;
  width: 90%;
  margin-top: 5px;
`;

const ContentText = styled.div`
  font-size: ${() => getFontSize(14)}px !important;
  color: #66686F;
`;

const Name = styled.div`
  height: 20px;
  font-size: ${() => getFontSize(16)}px !important;
  white-space: nowrap;
  color: #000;
  font-family: 'Pretendard-SemiBold';
  display: flex;
  align-items: center;
`;

const Time = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #A3A3A3;
  margin-right: 30px;
`;

const UnReadLayout = styled.div`
  background: #FFA07A;
  color: #fff;
  padding: 0 8px;
  height: 20px;

  border-radius: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${() => getFontSize(10)}px !important;
  font-family: 'Pretendard-Bold';
`;

const Mobilechatgate = ({ containerStyle, item, callback, content, select, index, unReadcount, read, onLeaveChat, time }) => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [img, setImg] = useState('');
  const [name, setName] = useState('');
  const [info, setInfo] = useState(time);
  const [owner, setOwner] = useState(false);


  const [isSwipeGesture, setIsSwipeGesture] = useState(false);
  const startX = useRef(0);






  useEffect(() => {
    if (item.SUPPORTER_ID === user.USERS_ID) {
      setName(item.OWNER?.USERINFO?.nickname || "고객지원");
      setImg(item.OWNER?.USERINFO?.userimg || imageDB.consumercenter);
      setOwner(false);
    } else {
      setName(item.SUPPORTER?.USERINFO?.nickname || "고객지원");
      setImg(item.SUPPORTER?.USERINFO?.userimg || imageDB.consumercenter);
      setOwner(true);
    }
  }, [item, user]);

  const _handleChat = async () => {

    // // ✅ AI 친구 전용 처리
    // if (item.CHAT_ID?.startsWith("ai_friend_fixed_")) {
    //   navigate("/Mobilecontent", {
    //     state: {
    //       ITEM: item,
    //       OWNER: true,
    //       NAME: item.SUPPORTER?.USERINFO?.nickname || "AI 친구",
    //       LEFTIMAGE: item.SUPPORTER?.USERINFO?.userimg || imageDB.aihelper,
    //       LEFTNAME: item.SUPPORTER?.USERINFO?.nickname || "AI 친구",
    //       CONTACTITEM: null,
    //       IS_AI_CHAT: true, // ✅ 이 값 전달하면 내부에서 Gemini 대화 처리 가능
    //     }
    //   });
    //   return;
    // }


    if (item.CHAT_ID?.startsWith("hongyeosa_fixed_")) {

      const docRef = doc(db, "CHAT", item.CHAT_ID);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        await setDoc(docRef, {
          OWNER_ID: user.USERS_ID,
          SUPPORTER_ID: "admin-system-id",
          CREATEDT: new Date(),
          INFO: {
            isVirtualWork: true
          },
          TYPE: "support"
        });
      }

      navigate("/Mobilecontent", {
        state: {
          ITEM: item,
          OWNER: true,
          NAME: "고객지원",
          LEFTIMAGE: imageDB.consumercenter,
          LEFTNAME: "고객지원",
          CONTACTITEM: null
        }
      });
    } else {
      const leftimage = owner ? item.SUPPORTER.USERINFO.userimg : item.OWNER.USERINFO.userimg;
      const leftname = owner ? item.SUPPORTER.USERINFO.nickname : item.OWNER.USERINFO.nickname;
      callback(item, owner, name, leftimage, leftname, index);

      const CONTACTITEM = await ReadContactByIndividually({
        ID: item.CHAT_ID,
        OWNER_ID: item.OWNER_ID,
        SUPPORTER_ID: item.SUPPORTER_ID
      });

      navigate("/Mobilecontent", {
        state: {
          ITEM: item,
          OWNER: owner,
          NAME: name,
          LEFTIMAGE: leftimage,
          LEFTNAME: leftname,
          CONTACTITEM
        }
      });
    }
  };



  return (

    <Container style={containerStyle} onClick={_handleChat}>
      <ItemLayer>
        <FlexstartColumn style={{ width: "17%", height: "70px" }}>
          <ChatprofileImage source={img} OWNER={owner} TYPE={item.INFO.WORKTYPE} />
        </FlexstartColumn>
        <FlexstartColumn style={{ width: "83%", lineHeight: 2 }}>
          <Column style={{ width: "100%" }}>
            <Row style={{ width: "100%", justifyContent: "space-between" }}>
              <Name>{name}</Name>
              <Time>{getRelativeOrFormattedTime(time)}</Time>
            </Row>
          </Column>

          <ContentLayer>
            <ContentText>
              {item.message.CHAT_CONTENT_TYPE === 'IMAGE'
                ? "파일전송"
                : (content === '' ? "무엇이든 편하게 물어보세요" : content.slice(0, 35))}
            </ContentText>

            {(typeof read === 'boolean')
              ? (!read && <UnReadLayout>안읽음</UnReadLayout>)
              : (unReadcount > 0 && <UnReadLayout>{unReadcount}</UnReadLayout>)}
          </ContentLayer>
        </FlexstartColumn>
      </ItemLayer>
    </Container>
    

  );
};

export default Mobilechatgate;