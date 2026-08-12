// hooks/useAbilityVisibleKeys.js
import { useEffect, useMemo, useState } from "react";
import { abilityOptions } from "../utility/abilityOptions";

const LS_KEY = "seek_ability.visibleKeys.v1";

function resolveDefaultTags(opts) {
    const norm = (s) => String(s || "").replace(/\s/g, "");
    const has = (s, kw) => norm(s).includes(norm(kw));

    // 제목·태그 어느 쪽이든 키워드로 매칭
    const findBy = (keywords) => {
        const found = opts.find((o) => {
            const t = o?.title ?? "";
            const tag = o?.tag ?? "";
            return keywords.some(
                (kw) =>
                    has(t, kw) ||
                    new RegExp(kw, "i").test(tag) ||
                    new RegExp(kw, "i").test(t)
            );
        });
        return found?.tag;
    };

    // 기본 2종
    const errandTag =
        findBy(["심부름능력자", "심부름", "errand"]) ?? null;
    const bugTag =
        findBy(["벌레잡기왕", "벌레잡기", "벌레", "해충", "pest", "bug"]) ?? null;

    // 중복 제거 + falsy 제거
    return Array.from(new Set([errandTag, bugTag].filter(Boolean)));
}

export function useAbilityVisibleKeys() {
    // 전체 유효 태그
    const allTags = useMemo(
        () => (abilityOptions || []).map((o) => o.tag).filter(Boolean),
        []
    );
    const valid = useMemo(() => new Set(allTags), [allTags]);

    // 프로젝트에서 실제 존재하는 “심부름/벌레” 태그 찾아서 기본값으로
    const defaultTags = useMemo(
        () => resolveDefaultTags(abilityOptions || []),
        []
    );

    const readLS = () => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (!raw) return []; // 저장값 없으면 일단 빈값(아래에서 기본값 적용)
            const arr = JSON.parse(raw);
            if (!Array.isArray(arr)) return [];
            // 유효 태그만 + 순서 유지 + 중복 제거
            const seen = new Set();
            const pruned = [];
            for (const t of arr) {
                if (valid.has(t) && !seen.has(t)) {
                    seen.add(t);
                    pruned.push(t);
                }
            }
            return pruned;
        } catch {
            return [];
        }
    };

    // raw 상태(사용자 선택 그대로)를 저장
    const [rawKeys, setRawKeys] = useState(readLS);

    // 로컬스토리지 동기화
    useEffect(() => {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify(rawKeys));
        } catch { }
    }, [rawKeys]);

    // ✅ 표시용 키: 사용자가 아무것도 안 골랐거나 전부 해제하면 기본(심부름/벌레)
    const visibleKeys = useMemo(
        () => (rawKeys.length > 0 ? rawKeys : defaultTags),
        [rawKeys, defaultTags]
    );

    return {
        visibleKeys,            // 화면에 실제로 쓸 키 (빈 경우 기본 두 개 반영)
        setVisibleKeys: setRawKeys,
        showAll: () => setRawKeys(allTags),
        reset: () => setRawKeys([]), // reset해도 기본값(심부름/벌레)로 보이게 됨
    };
}
