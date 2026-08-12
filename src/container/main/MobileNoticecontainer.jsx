import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ReadNotices } from "../../service/NoticeService";
import LottieAnimation from "../../common/LottieAnimation";
import { imageDB } from "../../utility/imageData";
import Empty from "../../components/Empty";
import { RiArrowDownSLine } from "react-icons/ri";

/**
 * 공지사항 (형 리뷰 2026-08-12).
 * 제목을 누르면 그 자리에서 내용이 펼쳐진다. 별도 상세 화면으로 넘기지 않는다.
 */

const Container = styled.div`
  padding: 62px 0 60px;
  background: var(--bg-soft);
  min-height: 100vh;
  box-sizing: border-box;
`;

const List = styled.div`
  background: var(--surface);
  border-radius: 12px;
  width: 92%;
  margin: 10px auto;
  overflow: hidden;
`;

const Item = styled.div`
  border-bottom: 1px solid var(--border);
  &:last-child { border-bottom: none; }
`;

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 18px 18px;
  cursor: pointer;
  &:active { background: var(--bg-soft); }
`;

const HeadText = styled.div`
  min-width: 0;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: var(--text);
  line-height: 1.45;
  word-break: keep-all;
`;

/* 고정 공지는 뱃지 대신 글자 색으로만 표시한다 */
const Pinned = styled.span`
  color: #FF4E19;
  font-weight: 700;
  margin-right: 6px;
`;

const Date = styled.div`
  font-size: 13px;
  color: #A3A3A3;
  margin-top: 6px;
`;

const Chevron = styled.div`
  flex-shrink: 0;
  color: #B0B0B0;
  transform: rotate(${({ $open }) => ($open ? "180deg" : "0deg")});
  transition: transform .18s ease;
  display: flex;
`;

const Body = styled.div`
  padding: 0 18px 20px;
  font-size: 15px;
  line-height: 1.7;
  color: #444;
  white-space: pre-wrap;
  word-break: break-word;
`;

const LoadingAnimationStyle = {
  zIndex: 11,
  position: "absolute",
  top: "40%",
  left: "35%",
};

const dateText = (ms) => {
  if (!ms) return "";
  const d = new window.Date(ms);
  return `${d.getFullYear()}. ${String(d.getMonth() + 1).padStart(2, "0")}. ${String(d.getDate()).padStart(2, "0")}`;
};

const MobileNoticecontainer = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openid, setOpenid] = useState(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const list = await ReadNotices();
      if (!alive) return;
      setItems(list);
      // 첫 공지는 펼쳐서 보여준다
      if (list.length) setOpenid(list[0].NOTICE_ID);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  if (loading) {
    return (
      <Container>
        <LottieAnimation containerStyle={LoadingAnimationStyle} animationData={imageDB.loadinglarge} width={"100px"} height={"100px"} />
      </Container>
    );
  }

  if (!items.length) {
    return (
      <Container>
        <Empty content={"아직 등록된 공지가 없습니다"} height={200} />
      </Container>
    );
  }

  return (
    <Container>
      <List>
        {items.map((n) => {
          const open = openid === n.NOTICE_ID;
          return (
            <Item key={n.NOTICE_ID}>
              <Head onClick={() => setOpenid(open ? null : n.NOTICE_ID)}>
                <HeadText>
                  <Title>
                    {n.PINNED === true && <Pinned>중요</Pinned>}
                    {n.TITLE}
                  </Title>
                  <Date>{dateText(n.CREATEDT)}</Date>
                </HeadText>
                <Chevron $open={open}><RiArrowDownSLine size={22} /></Chevron>
              </Head>
              {open && <Body>{n.CONTENT}</Body>}
            </Item>
          );
        })}
      </List>
    </Container>
  );
};

export default MobileNoticecontainer;
