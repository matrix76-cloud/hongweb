// CategoryEditSheet.jsx
import React, { useMemo, useEffect, useState } from "react";
import { createPortal } from "react-dom";           // ✅ react-dom v18
import styled from "styled-components";
import { DEFAULT_ITEMS } from "../utility/categories";
import { getFontSize } from "../utility/fontsize";

export default function CategoryEditSheet({
    open = false,
    onClose,
    onSaved,                    // ✅ 저장 책임은 부모
    items = DEFAULT_ITEMS,
    countsMap = {},
    visibleKeys = [],           // ✅ 부모가 내려줌
}) {
    const list = useMemo(() => items, [items]);

    // 편집 중 임시 선택 상태
    const [selected, setSelected] = useState(new Set(visibleKeys));

    // ✅ 시트 열릴 때/visibleKeys 변경 시 동기화
    useEffect(() => {
        if (!open) return;
        setSelected(new Set(visibleKeys));
    }, [open, visibleKeys]);

    if (!open) return null;

    const toggleAdd = (key) => setSelected(prev => new Set([...prev, key]));
    const toggleRemove = (key) =>
        setSelected(prev => { const n = new Set(prev); n.delete(key); return n; });

    const handleSave = () => {
        const nextVisibleKeys = Array.from(selected);
        onSaved?.(nextVisibleKeys);   // ✅ 부모에서 set + localStorage 저장
        onClose?.();
    };

    return createPortal(
        <Backdrop onClick={onClose}>
            <Sheet role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                <SheetHeader>
                    <Title>카테고리 편집</Title>
                    <CloseDiv role="button" tabIndex={0} aria-label="닫기" onClick={onClose}>✕</CloseDiv>
                </SheetHeader>

                <List>
                    {list.map((it) => {
                        const active = selected.has(it.key);
                        const count = countsMap[it.key] ?? it.count ?? 0;
                        return (
                            <Row key={it.key}>
                                <Thumb style={{ backgroundImage: `url(${it.image})` }} />
                                <Mid>
                                    <NameLine>
                                        <Name>{it.label}</Name>
                                        <Count>· {count}건</Count>
                                        {active && <Badge>적용중</Badge>}
                                    </NameLine>
                                    <Desc>{oneLine(it.title)}</Desc>
                                </Mid>
                                <Right>
                                    {active ? (
                                        <BtnDiv $variant="danger" onClick={() => toggleRemove(it.key)}>적용됨</BtnDiv>
                                    ) : (
                                        <BtnDiv $variant="primary" onClick={() => toggleAdd(it.key)}>적용</BtnDiv>
                                    )}
                                </Right>
                            </Row>
                        );
                    })}
                </List>

                <FooterBar>
                    <Cta onClick={handleSave}>저장</Cta>
                </FooterBar>
            </Sheet>
        </Backdrop>,
        document.body
    );
}

/* helpers */
function oneLine(text = "") { return String(text).replace(/\n/g, " · "); }

/* styles (네 기존 것 그대로 유지) */
const Backdrop = styled.div`position:fixed; inset:0; background:rgba(0,0,0,.35); display:flex; align-items:flex-end; justify-content:center; z-index:1000;`;
const Sheet = styled.div`width:100%; max-height:78vh; background:#fff; border-radius:16px 16px 0 0; box-shadow:0 -6px 24px rgba(0,0,0,.12); overflow:hidden; display:flex; flex-direction:column;`;
const SheetHeader = styled.div`display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid #f0f0f0;`;
const Title = styled.div`font-weight:800; font-family:Pretendard-SemiBold; font-size:${() => getFontSize(16)}px !important; letter-spacing:-0.2px;`;
const CloseDiv = styled.div`width:28px; height:28px; border-radius:50%; display:grid; place-items:center; background:rgba(0,0,0,.06); cursor:pointer; user-select:none; &:active{transform:scale(.96);} `;
const List = styled.div`overflow:auto; padding:6px 8px 16px;`;
const Row = styled.div`display:grid; grid-template-columns:56px 1fr auto; align-items:center; gap:10px; padding:10px; border-radius:12px; &:not(:last-child){margin-bottom:8px;} background:#fafafa;`;
const Thumb = styled.div`width:56px; height:56px; border-radius:12px; background-size:cover; background-position:center; background-color:#f3f3f3; box-shadow:inset 0 0 0 1px rgba(0,0,0,.04);`;
const Mid = styled.div`min-width:0;`; const NameLine = styled.div`display:flex; align-items:center; gap:8px;`;
const Name = styled.div`font-weight:700; letter-spacing:-0.2px; font-family:Pretendard-SemiBold; font-size:${() => getFontSize(14)}px !important; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;`;
const Badge = styled.div`font-size:${() => getFontSize(11)}px !important; color:#1E88E5; background:rgba(30,136,229,.1); padding:2px 6px; border-radius:999px; font-weight:700;`;


const Desc = styled.div`
  margin-top: 2px;
  font-size: ${() => getFontSize(12)}px !important;
  color: #666;
  letter-spacing: -0.2px;
  line-height: 1.35;

  /* 두 줄까지 표시 후 말줄임 */
  white-space: normal;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  word-break: keep-all;

  /* fallback: 정확히 2줄 높이 보장 */
  max-height: calc(${() => getFontSize(12)}px * 1.35 * 2);
`;

const Right = styled.div`display:flex; align-items:center; gap:8px;`;
const BtnDiv = styled.div`padding:8px 12px; border-radius:10px; user-select:none; cursor:pointer; font-weight:700; font-size:${() => getFontSize(13)}px !important; letter-spacing:-0.2px;
  ${({ $variant }) => $variant === "danger" ? `color:#c62828; background:rgba(198,40,40,.08); border:1px solid rgba(198,40,40,.25);` : `color:#1E88E5; background:rgba(30,136,229,.10); border:1px solid rgba(30,136,229,.25);`}
  &:active{transform:scale(.98);}
`;
const Count = styled.div`font-size:${() => getFontSize(12)}px !important; color:#666;`;
const FooterBar = styled.div`position:sticky; bottom:0; background:#fff; border-top:1px solid #eee; padding:12px;`;
const Cta = styled.div`width:60%; margin:0 auto; text-align:center; padding:12px; border-radius:12px; background:#1E88E5; color:#fff; font-weight:800; cursor:pointer;`;
