// src/utils/navigationUtil.ts

/**
 * 각 페이지 ID(pageId)에 따라 헤더의 뒤로가기 버튼이 이동해야 할 경로를 정의합니다.
 */
export const HEADER_BACK_TARGET_MAP: Record<string, string | number> = {
    Mobile_map: "/mobilemain",
    Mobile_list: "/mobilemap",
    Mobile_workermap: "/mobilemain",
    Mobile_workerlist: "/mobileworkermap",
    Mobile_chatcontent : -1,
    registerWorker: -1, // ✅ 숫자로 수정
    registerWork: -1, // ✅ 숫자로 수정
    workerList: "/mobileworker?view=map",
    recipeDetail: "/mobilerecipeboard",
    workDetail: "/mobileworklist",
    contract: "/chat",
    lifeMain: "/mobilemain",
    // 필요한 페이지 계속 추가
  };

/**
 * 주어진 pageId에 해당하는 뒤로가기 대상 경로를 반환합니다.
 * 매핑이 없으면 null을 반환합니다.
 */
export function getBackTarget(pageId?: string): string | number | null {
    if (!pageId) return null;
    return HEADER_BACK_TARGET_MAP[pageId] ?? null;
}