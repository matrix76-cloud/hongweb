// components/AbilityCategoryEditSheet.jsx
import React, { useMemo, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { getFontSize } from "../utility/fontsize";
import { abilityOptions } from "../utility/abilityOptions";
import { imageDB } from "../utility/imageData";

const STORAGE_KEY = "seek_ability.visibleKeys.v1";

export default function AbilityCategoryEditSheet({
    open = false,
    onClose,
    onSaved,
    options = abilityOptions,
    countsMap = {},
    visibleKeys = [],
}) {
    const list = useMemo(() => {
        return (options || []).map((opt) => ({
            key: opt.tag,
            label: opt.title || opt.tag,
            title: opt.line || "",
            image: opt.image || imageDB?.hongladywebtoon,
        }));
    }, [options]);

    const [selected, setSelected] = useState(new Set(visibleKeys));
    useEffect(() => {
        if (!open) return;
        setSelected(new Set(visibleKeys));
    }, [open, visibleKeys]);

    // ESC 닫기
    useEffect(() => {
        if (!open) return;
        const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    const persist = (nextSet) => {
        const ordered = list.filter(it => nextSet.has(it.key)).map(it => it.key);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ordered)); } catch { }
        onSaved?.(ordered);
    };

    const pushChange = (nextSet) => {
        setSelected(new Set(nextSet));
        persist(nextSet);
    };

    const toggleAdd = (key) => {
        const next = new Set(selected);
        next.add(key);
        pushChange(next);
    };
    const toggleRemove = (key) => {
        const next = new Set(selected);
        next.delete(key);
        pushChange(next);
    };

    return createPortal(
        <Backdrop onClick={onClose}>
            <Sheet role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
                <SheetHeader>
                    <Title>능력자 카테고리 편집</Title>
                    <CloseDiv
                        role="button"
                        tabIndex={0}
                        aria-label="닫기"
                        onClick={onClose}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClose?.(); }
                        }}
                    >
                        ✕
                    </CloseDiv>
                </SheetHeader>

                <List>
                    {list.map((it) => {
                        const active = selected.has(it.key);
                        const count = countsMap[it.key] ?? 0;
                        return (
                            <Row key={it.key}>
                                <Thumb style={{ backgroundImage: `url(${it.image})` }} />
                                <Mid>
                                    <NameLine>
                                        <Name>{it.label}</Name>
                                        <Count>· {count}명</Count>
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
            </Sheet>
        </Backdrop>,
        document.body
    );
}

/* helpers */
function oneLine(text = "") { return String(text).replace(/\n/g, " · "); }

/* styles */
const Backdrop = styled.div`
  position: fixed; inset: 0;
  background: rgba(0,0,0,.35);
  display: flex; align-items: flex-end; justify-content: center;
  z-index: 1000;
`;
const Sheet = styled.div`
  width: 100%; max-height: 78vh;
  background: #fff; border-radius: 16px 16px 0 0;
  box-shadow: 0 -6px 24px rgba(0,0,0,.12);
  overflow: hidden; display: flex; flex-direction: column;
`;
const SheetHeader = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px; border-bottom: 1px solid #f0f0f0;
`;
const Title = styled.div`
  font-weight: 800; font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(16)}px !important; letter-spacing: -0.2px;
`;
const CloseDiv = styled.div`
  width: 32px; height: 32px; border-radius: 50%;
  display: grid; place-items: center; background: rgba(0,0,0,.06);
  cursor: pointer; user-select: none;
  &:active { transform: scale(.96); }
`;
const List = styled.div`overflow: auto; padding: 6px 8px 16px;`;
const Row = styled.div`
  display: grid; grid-template-columns: 56px 1fr auto; align-items: center;
  gap: 10px; padding: 10px; border-radius: 12px; background: #fafafa;
  &:not(:last-child) { margin-bottom: 8px; }
`;
const Thumb = styled.div`
  width: 46px; height: 46px; border-radius: 12px;
  background-size: cover; background-position: center; background-color: #f3f3f3;
  box-shadow: inset 0 0 0 1px rgba(0,0,0,.04);
`;
const Mid = styled.div`min-width: 0;`;
const NameLine = styled.div`display: flex; align-items: center; gap: 8px;`;
const Name = styled.div`
  font-weight: 700; letter-spacing: -0.2px; font-family: Pretendard-SemiBold;
  font-size: ${() => getFontSize(14)}px !important;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
`;
const Desc = styled.div`
  margin-top: 2px; font-size: ${() => getFontSize(12)}px !important;
  color: #666; letter-spacing: -0.2px;
  white-space: pre-line; overflow: hidden; text-overflow: ellipsis;
`;
const Right = styled.div`display: flex; align-items: center; gap: 8px;`;
const BtnDiv = styled.div`
  padding: 8px 12px; border-radius: 10px; user-select: none; cursor: pointer;
  font-weight: 700; font-size: ${() => getFontSize(13)}px !important; letter-spacing: -0.2px;
  ${({ $variant }) =>
        $variant === "danger"
            ? `color:#c62828; background:rgba(198,40,40,.08); border:1px solid rgba(198,40,40,.25);`
            : `color:#1E88E5; background:rgba(30,136,229,.10); border:1px solid rgba(30,136,229,.25);`}
  &:active { transform: scale(.98); }
`;
const Count = styled.div`font-size: ${() => getFontSize(12)}px !important; color: #666;`;
