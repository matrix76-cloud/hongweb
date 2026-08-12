import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../api/config";

/**
 * 공지사항 (형 리뷰 2026-08-12 "공지사항 보는 아이콘 하나 만들구 페이지도 만들어줘").
 *
 * NOTICE 컬렉션 문서 하나가 공지 한 건이다.
 *   { TITLE, CONTENT, CREATEDT(ms), PINNED(bool) }
 *
 * 아직 공지를 한 건도 안 올렸을 수 있으니, 비어 있으면 서비스 기본 안내를 보여준다.
 * 관리자 화면이 생기기 전까지는 콘솔에서 문서를 직접 넣으면 된다.
 */
export const ReadNotices = async () => {
  try {
    const snap = await getDocs(query(collection(db, "NOTICE"), orderBy("CREATEDT", "desc")));
    const items = [];
    snap.forEach((d) => items.push({ NOTICE_ID: d.id, ...d.data() }));
    // 고정 공지를 위로
    items.sort((a, b) => (b.PINNED === true) - (a.PINNED === true));
    return items;
  } catch (e) {
    console.log("ReadNotices error", e.message);
    return [];
  }
};
