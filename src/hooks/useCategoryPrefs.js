// useCategoryPrefs.js
import { useEffect, useRef, useState, useCallback } from "react";
import { DEFAULT_VISIBLE_KEYS, LS_KEY } from "../utility/categories";

/**
 * 카테고리 표시 설정 훅
 * - 스토리지에서 로드 (없으면 DEFAULT_VISIBLE_KEYS)
 * - 저장은 기본 자동(autoSave=true) / 수동(commit) 모두 지원
 * - 저장 키/기본값은 utility/categories에서 공통 관리
 */
export function useCategoryPrefs({ autoSave = true } = {}) {
    const [visibleKeys, setVisibleKeys] = useState(DEFAULT_VISIBLE_KEYS);
    const hasLoadedRef = useRef(false);
    const MIN_COUNT = DEFAULT_VISIBLE_KEYS.length; // 기본값 개수(6 추천)

    // LOAD (+ 마이그레이션: 최소 개수 미만이면 기본값으로 보강)
    useEffect(() => {
        try {
            const raw = localStorage.getItem(LS_KEY);
            if (!raw) {
                // 스토리지 없음 → 기본값 유지
                hasLoadedRef.current = true;
                return;
            }
            const saved = JSON.parse(raw);
            const arr = Array.isArray(saved?.visibleKeys) ? saved.visibleKeys : [];

            if (!arr.length) {
                setVisibleKeys(DEFAULT_VISIBLE_KEYS);
            } else if (arr.length < MIN_COUNT) {
                // 예전 3개만 저장돼 있던 케이스 등 → 기본과 머지해 보강
                const merged = Array.from(new Set([...arr, ...DEFAULT_VISIBLE_KEYS])).slice(0, MIN_COUNT);
                setVisibleKeys(merged);
                // 즉시 저장까지
                try {
                    localStorage.setItem(LS_KEY, JSON.stringify({ visibleKeys: merged }));
                } catch { }
            } else {
                setVisibleKeys(arr);
            }
        } catch (e) {
            console.warn("prefs load error", e);
            setVisibleKeys(DEFAULT_VISIBLE_KEYS);
        } finally {
            hasLoadedRef.current = true;
        }
    }, [MIN_COUNT]);

    // SAVE (자동 저장 모드일 때만)
    useEffect(() => {
        if (!autoSave) return;
        if (!hasLoadedRef.current) return;
        try {
            localStorage.setItem(LS_KEY, JSON.stringify({ visibleKeys }));
        } catch (e) {
            console.warn("prefs save error", e);
        }
    }, [autoSave, visibleKeys]);

    // 수동 저장용 커밋 함수 (바텀시트 "저장" 눌렀을 때 호출)
    const commit = useCallback((keys = visibleKeys) => {
        try {
            localStorage.setItem(LS_KEY, JSON.stringify({ visibleKeys: keys }));
            return true;
        } catch (e) {
            console.warn("prefs commit error", e);
            return false;
        }
    }, [visibleKeys]);

    // 기본값으로 되돌리기
    const resetToDefault = useCallback(() => {
        setVisibleKeys(DEFAULT_VISIBLE_KEYS);
        try {
            localStorage.setItem(LS_KEY, JSON.stringify({ visibleKeys: DEFAULT_VISIBLE_KEYS }));
        } catch { }
    }, []);

    // 통째 대체 + 즉시 저장 옵션
    const replace = useCallback((nextKeys, { save = false } = {}) => {
        const next = Array.from(new Set(nextKeys));
        setVisibleKeys(next);
        if (save) {
            try {
                localStorage.setItem(LS_KEY, JSON.stringify({ visibleKeys: next }));
            } catch { }
        }
    }, []);

    return {
        visibleKeys,
        setVisibleKeys,   // 편집 중 임시 상태 변경
        commit,           // 수동 저장
        resetToDefault,   // 기본값으로
        replace,          // 통째 대체(옵션 저장)
    };
}
