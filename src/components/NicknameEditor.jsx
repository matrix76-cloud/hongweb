import React, { useContext, useState } from "react";
import styled from "styled-components";
import { PiPencilSimpleBold } from "react-icons/pi";
import { UserContext } from "../context/User";
import { Update_userinfobyusersid } from "../service/UserService";
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
  color: #131313;
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

const NicknameEditor = ({ size = 18, hint = true, onChanged }) => {
  const { user, dispatch } = useContext(UserContext);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const start = () => { setDraft(user.nickname || ''); setEditing(true); };

  const save = async () => {
    const next = (draft || '').trim();
    if (!next) { alert('대화명을 입력해주세요'); return; }
    const before = user.nickname;
    if (next === before) { setEditing(false); return; }

    setSaving(true);
    try {
      user.nickname = next;
      dispatch(user);

      const USERS_ID = user.users_id;
      await Update_userinfobyusersid({ USERINFO: user, USERS_ID });
      const rooms = await NoticeNicknameChanged({ USERS_ID, beforeName: before, afterName: next });

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
            maxLength={12}
            placeholder="대화명"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') save(); }}
          />
          <SaveBtn onClick={save} disabled={saving}>{saving ? '저장 중' : '저장'}</SaveBtn>
        </EditRow>
        {hint && <Hint>바꾸면 대화방에도 알려드려요</Hint>}
      </div>
    );
  }

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <Row onClick={start}>
        <NameText $size={size}>{user.nickname || '대화명 없음'}</NameText>
        <PiPencilSimpleBold size={Math.round(size * 0.95)} color="#A3A3A3" />
      </Row>
      {hint && <Hint>이름을 눌러 대화명을 바꿀 수 있어요</Hint>}
    </div>
  );
};

export default NicknameEditor;
