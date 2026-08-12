// 📄 CategoryEditSheet.jsx
import React, { useMemo, useEffect, useState, useContext } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { DEFAULT_ITEMS } from "../utility/categories";
import { getFontSize } from "../utility/fontsize";
import { UserContext } from "../context/User";              // ✅ 추가
import useWorkStatus from "../hooks/useWorkStatus";         // ✅ 추가

const STORAGE_KEY = "jobcat.visibleKeys.v1";

// 🔎 단기 알바 판별 (키/라벨 모두 대응)
function isAlbaItem(item) {
    const k = (item?.key || "").toLowerCase();
    const label = item?.label || "";
    return (
        k === "alba" ||
        k === "short" ||
        k === "shortalba" ||
        k === "short_job" ||
        k === "shortjob" ||
        /단기|알바/.test(label)
    );
}

export default function CategoryEditSheet({
    open = false,
    onClose,
    onSaved,            // ✅ 토글마다 즉시 부모에 반영
    items = DEFAULT_ITEMS,
    countsMap = {},
    visibleKeys = [],   // ✅ 부모로부터 현재 적용중 키
}) {
    const list = useMemo(() => items, [items]);

    // ✅ 사용자 위치 기반 단기 알바 카운트 (OPEN)
    const { user } = useContext(UserContext);
    const { status } = useWorkStatus(
        user?.USERINFO?.latitude,
        user?.USERINFO?.longitude
    );

    // 시트 내부 표시용 선택 상태 (열릴 때 동기화)
    const [selected, setSelected] = useState(new Set(visibleKeys));
    useEffect(() => {
        if (!open) return;
        setSelected(new Set(visibleKeys));
    }, [open, visibleKeys]);

    if (!open) return null;

    // ▼ 저장 유틸 (순서 보존 + 로컬스토리지 + 부모 콜백)
    const persist = (nextSet) => {
        // items 순서 보존한 배열
        const ordered = list.filter(it => nextSet.has(it.key)).map(it => it.key);

        // 로컬스토리지 즉시 저장
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(ordered));
        } catch (e) {
            console.warn("[CategoryEditSheet] failed to save visible keys:", e);
        }

        // 부모에도 즉시 전달 (부모가 상태/리스트 갱신)
        onSaved?.(ordered);
    };

    // ▼ 내부와 저장을 한 번에
    const pushChange = (nextSet) => {
        setSelected(new Set(nextSet));  // 시트 내 강조/배지 즉시 갱신
        persist(nextSet);               // 저장 + 부모 업데이트
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
                    <Title>카테고리 편집</Title>
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

                        // ✅ 단기 알바만 위치기반 OPEN 개수로 덮어쓰기
                        const base = countsMap[it.key] ?? it.count ?? 0;
                        const count = isAlbaItem(it)
                            ? (Number.isFinite(status?.newCount) ? status.newCount : base)
                            : base;

                        return (
                            <Row key={it.key}>
                                <Thumb style={{ backgroundImage: `url(${it.image})` }} />
                                <Mid>
                                    <NameLine>
                                        <Name>{it.label}</Name>
                                        {count > 0 && <Count>· {count}건</Count>}
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
  width: 28px; height: 28px; border-radius: 50%;
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
  width: 56px; height: 56px; border-radius: 12px;
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
const Badge = styled.div`
  font-size: ${() => getFontSize(11)}px !important;
  color: #1E88E5; background: rgba(30,136,229,.1);
  padding: 2px 6px; border-radius: 999px; font-weight: 700;
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
const Count = styled.div`
  font-size: ${() => getFontSize(12)}px !important;
  color: #666;
`;
