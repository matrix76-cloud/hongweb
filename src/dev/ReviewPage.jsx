import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SCREENS, STATUS_LABEL, STATUS_COLOR } from './reviewScreens';

/**
 * 개발 전용 리뷰 화면 (/review)
 * 형이 화면별로 메모를 남기면 _docs/review_thread.json 에 저장되고, 카스가 읽고 조치한다.
 * vite-plugin-review-notes.mjs 가 apply:'serve' 라 프로덕션에는 포함되지 않는다.
 */

const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 20px 80px;
  font-family: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Malgun Gothic', sans-serif;
  color: #131313;
`;

const H1 = styled.div`
  font-size: 23px;
  font-weight: 700;
  margin-bottom: 6px;
`;

const Lead = styled.div`
  font-size: 15px;
  color: #6b6b6b;
  line-height: 1.6;
  margin-bottom: 28px;
`;

const GroupTitle = styled.div`
  font-size: 17px;
  font-weight: 700;
  margin: 28px 0 12px;
`;

const Card = styled.div`
  border: 1px solid #e3e3e3;
  border-radius: 12px;
  padding: 16px 18px;
  margin-bottom: 12px;
  background: #fff;
`;

const CardHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: pointer;
`;

const Name = styled.div`
  font-size: 17px;
  font-weight: 600;
`;

const Status = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${({ s }) => STATUS_COLOR[s]};
  margin-left: 10px;
`;

const Path = styled.a`
  font-size: 14px;
  color: #4a6fa5;
  text-decoration: none;
  &:hover { text-decoration: underline; }
`;

const Note = styled.div`
  font-size: 14px;
  color: #8a8a8a;
  margin-top: 6px;
  line-height: 1.5;
`;

const Thread = styled.div`
  margin-top: 14px;
  border-top: 1px solid #f0f0f0;
  padding-top: 14px;
  min-height: 40px;
`;

const Entry = styled.div`
  display: flex;
  gap: 10px;
  padding: 8px 0;
  font-size: 15px;
  line-height: 1.6;
`;

const By = styled.div`
  flex-shrink: 0;
  font-weight: 700;
  color: ${({ by }) => (by === '카스' ? '#4a6fa5' : '#131313')};
`;

const At = styled.span`
  font-size: 13px;
  color: #a3a3a3;
  margin-left: 8px;
  font-weight: 400;
`;

const InputRow = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 10px;
`;

const Input = styled.textarea`
  flex: 1;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid #d8d8d8;
  border-radius: 8px;
  font-size: 15px;
  font-family: inherit;
  line-height: 1.5;
  resize: vertical;
  outline: none;
  &:focus { border-color: #FF4E19; }
`;

const Send = styled.button`
  flex-shrink: 0;
  padding: 0 18px;
  height: 44px;
  align-self: flex-end;
  border: none;
  border-radius: 8px;
  background: #FF4E19;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
`;

const ReviewPage = () => {
  const [thread, setThread] = useState({});
  const [open, setOpen] = useState({});
  const [draft, setDraft] = useState({});

  const load = () => {
    fetch('/__review_thread')
      .then((r) => r.json())
      .then(setThread)
      .catch(() => setThread({}));
  };

  useEffect(() => { load(); }, []);

  const post = async (id) => {
    const text = (draft[id] || '').trim();
    if (!text) return;
    await fetch('/__review_thread', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, by: '형', text }),
    });
    setDraft((d) => ({ ...d, [id]: '' }));
    load();
  };

  const total = SCREENS.reduce((n, g) => n + g.items.length, 0);
  const noteCount = Object.values(thread).reduce((n, arr) => n + (arr?.length || 0), 0);

  return (
    <Page>
      <H1>홍여사 화면 리뷰</H1>
      <Lead>
        화면별로 메모를 남기면 <code>_docs/review_thread.json</code> 에 저장돼. 카스가 그걸 읽고 고친 뒤 답글을 단다.<br />
        화면 {total}개 · 기록 {noteCount}건
      </Lead>

      {SCREENS.map((group) => (
        <div key={group.group}>
          <GroupTitle>{group.group}</GroupTitle>
          {group.items.map((s) => {
            const entries = thread[s.id] || [];
            const isOpen = open[s.id] ?? entries.length > 0;
            return (
              <Card key={s.id}>
                <CardHead onClick={() => setOpen((o) => ({ ...o, [s.id]: !isOpen }))}>
                  <Name>
                    {s.name}
                    <Status s={s.status}>{STATUS_LABEL[s.status]}</Status>
                    {entries.length > 0 && <Status s="wip">· 메모 {entries.length}</Status>}
                  </Name>
                  {s.path ? (
                    <Path href={s.path} onClick={(e) => e.stopPropagation()}>{s.path}</Path>
                  ) : (
                    <span style={{ fontSize: 14, color: '#c02020' }}>화면 없음</span>
                  )}
                </CardHead>

                {s.note && <Note>{s.note}</Note>}

                {isOpen && (
                  <Thread>
                    {entries.map((e, i) => (
                      <Entry key={e.pid || i}>
                        <By by={e.by}>{e.by}</By>
                        <div>
                          {e.text}
                          <At>{e.at}</At>
                        </div>
                      </Entry>
                    ))}
                    <InputRow>
                      <Input
                        value={draft[s.id] || ''}
                        placeholder="이 화면에 대한 메모"
                        onChange={(ev) => setDraft((d) => ({ ...d, [s.id]: ev.target.value }))}
                        onKeyDown={(ev) => {
                          if (ev.key === 'Enter' && (ev.metaKey || ev.ctrlKey)) post(s.id);
                        }}
                      />
                      <Send onClick={() => post(s.id)}>남기기</Send>
                    </InputRow>
                  </Thread>
                )}
              </Card>
            );
          })}
        </div>
      ))}
    </Page>
  );
};

export default ReviewPage;
