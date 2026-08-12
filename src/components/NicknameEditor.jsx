import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { PiPencilSimpleBold, PiArrowsClockwiseBold } from "react-icons/pi";
import { UserContext } from "../context/User";
import { Update_userinfobyusersid, Update_nickname_by_usersid, Read_nickname_next_at } from "../service/UserService";
import { NoticeNicknameChanged } from "../service/ChatService";

/**
 * 대화명 인라인 편집 — 이름을 눌러 그 자리에서 바꾼다.
 * 예전엔 [프로필 설정] -> [대화명 설정] 으로 두 번 들어가야 했다. (형 리뷰 2026-08-12)
 *
 * 바꾸면 참여 중인 대화방에 "대화명을 변경하였습니다" 안내가 남는다.
 */

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  min-width: 0;
`;

const NameText = styled.div`
  font-size: ${({ $size }) => $size}px;
  font-weight: 700;
  color: var(--text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const EditRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  height: 42px;
  padding: 0 12px;
  border: 1.5px solid #FF4E19;
  border-radius: 10px;
  font-size: 17px;
  font-weight: 600;
  font-family: inherit;
  outline: none;
`;

/* 대화명 자동 생성 — 비워둔 사람이 많아 직접 짓지 않아도 되게 (형 리뷰 2026-08-12) */
const GenBtn = styled.button`
  flex: none;
  width: 42px;
  height: 42px;
  border: 1px solid #E6E6E6;
  border-radius: 10px;
  background: var(--surface);
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:active { background: #F5F5F5; }
`;

/* 연필 아이콘만 (형 리뷰 2026-08-12 "수정 글씨 제거") */
const EditBtn = styled.button`
  flex: none;
  width: 30px;
  height: 30px;
  padding: 0;
  border: 1px solid #E6E6E6;
  border-radius: 8px;
  background: var(--surface);
  color: #555;
  font-size: 13px;
  font-weight: 600;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  &:active { background: #F5F5F5; }
`;

const SaveBtn = styled.button`
  flex: none;
  height: 42px;
  padding: 0 16px;
  border: none;
  border-radius: 10px;
  background: #FF4E19;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: .6; }
`;

const Hint = styled.div`
  font-size: 13px;
  color: #A3A3A3;
  margin-top: 5px;
`;

/* 대화명 만들어주기 — 앞말 + 뒷말을 붙여 6자 안에 떨어지게 짠다.
   숫자를 뒤에 붙이면 6자를 넘겨 잘리므로 안 쓴다. (형 리뷰 2026-08-12) */
const MAXLEN = 6;
const GEN_HEAD = ['든든', '다정', '따뜻', '씩씩', '성실', '밝은', '친절', '꼼꼼', '손큰', '상냥', '야무진', '부지런'];
const GEN_TAIL = ['이웃', '일꾼', '손길', '친구', '동행', '살림꾼', '파트너'];
const makeNickname = () => {
  // 6자를 넘지 않는 조합만 골라서 그 안에서 하나 뽑는다
  const pool = [];
  GEN_HEAD.forEach((h) => GEN_TAIL.forEach((t) => {
    if ((h + t).length <= MAXLEN) pool.push(h + t);
  }));
  return pool[Math.floor(Math.random() * pool.length)];
};

/* 남은 시간을 사람이 읽는 말로 */
const untilText = (nextAt) => {
  const ms = nextAt - Date.now();
  if (ms <= 0) return '';
  const h = Math.floor(ms / 3600000);
  const m = Math.ceil((ms % 3600000) / 60000);
  return h > 0 ? `${h}시간 ${m}분 뒤` : `${m}분 뒤`;
};

const NicknameEditor = ({ size = 18, hint = true, onChanged, onEditingChange }) => {
  const { user, dispatch } = useContext(UserContext);
  const [editing, setEditing] = useState(false);

  /* 편집 중에는 옆 버튼을 접어 입력칸에 폭을 내준다 (형 리뷰 2026-08-12) */
  useEffect(() => { onEditingChange?.(editing); }, [editing]);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);
  const [nextAt, setNextAt] = useState(0);   // 다음 변경 가능 시각 (하루 1회)

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!user?.users_id) return;
      const at = await Read_nickname_next_at({ USERS_ID: user.users_id });
      if (alive) setNextAt(at);
    })();
    return () => { alive = false; };
  }, [user?.users_id]);

  const locked = nextAt > Date.now();

  const start = () => {
    if (locked) {
      alert(`대화명은 하루에 한 번만 바꿀 수 있어요.\n${untilText(nextAt)} 다시 시도해주세요.`);
      return;
    }
    /* 아직 대화명이 없으면 빈칸 대신 하나 만들어 넣어준다. 마음에 안 들면 새로고침 */
    setDraft(user.nickname || makeNickname());
    setEditing(true);
  };

  const save = async () => {
    const next = (draft || '').trim();
    if (!next) { alert('대화명을 입력해주세요'); return; }
    if (next.length > MAXLEN) { alert(`대화명은 ${MAXLEN}자까지 쓸 수 있어요.`); return; }
    const before = user.nickname;
    if (next === before) { setEditing(false); return; }

    setSaving(true);
    try {
      const USERS_ID = user.users_id;

      // 하루 1회 제한은 서버 기록으로 판정한다 (형 지시 2026-08-12)
      const res = await Update_nickname_by_usersid({ USERS_ID, nickname: next });
      if (!res.ok) {
        if (res.nextAt) {
          setNextAt(res.nextAt);
          alert(`대화명은 하루에 한 번만 바꿀 수 있어요.\n${untilText(res.nextAt)} 다시 시도해주세요.`);
        } else {
          alert('대화명을 바꾸지 못했습니다.');
        }
        return;
      }

      user.nickname = next;
      dispatch(user);
      await Update_userinfobyusersid({ USERINFO: user, USERS_ID });
      const rooms = await NoticeNicknameChanged({ USERS_ID, beforeName: before, afterName: next });

      setNextAt(Date.now() + 24 * 60 * 60 * 1000);
      setEditing(false);
      onChanged?.(next, rooms);
    } catch (e) {
      console.error('[nickname] 저장 실패', e);
      alert('대화명을 바꾸지 못했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (editing) {
    return (
      <div style={{ flex: 1, minWidth: 0 }}>
        <EditRow>
          <Input
            value={draft}
            autoFocus
            maxLength={MAXLEN}
            placeholder="대화명"
            onChange={(e) => setDraft(e.target.value.slice(0, MAXLEN))}
            onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
          />
          <GenBtn onClick={() => setDraft(makeNickname())} title="대화명 새로 만들기" aria-label="대화명 새로 만들기">
            <PiArrowsClockwiseBold size={18} />
          </GenBtn>
          <SaveBtn onClick={save} disabled={saving}>{saving ? '저장 중' : '저장'}</SaveBtn>
        </EditRow>
        {hint && <Hint>새로고침을 누르면 대화명을 만들어 드려요 · 하루 한 번만 바꿀 수 있어요</Hint>}
      </div>
    );
  }

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <Row onClick={start}>
        <NameText $size={size}>{user.nickname || '대화명 없음'}</NameText>
        {/* 누를 곳이 어디인지 분명하게 — 글자만으론 눌리는 줄 몰랐다 (형 리뷰 2026-08-12) */}
        <EditBtn onClick={(e) => { e.stopPropagation(); start(); }} aria-label="대화명 수정">
          <PiPencilSimpleBold size={15} />
        </EditBtn>
      </Row>
      {hint && (
        <Hint>
          {locked
            ? `대화명은 하루 한 번 · ${untilText(nextAt)} 변경 가능`
            : '수정을 누르면 이 자리에서 바로 바꿀 수 있어요'}
        </Hint>
      )}
    </div>
  );
};

export default NicknameEditor;
