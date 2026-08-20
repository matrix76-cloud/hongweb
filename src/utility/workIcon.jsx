// 일 종류별 아이콘 — 원색 일러스트 png 를 먹색 라인 아이콘으로 전부 교체
// (형 리뷰 2026-08-14 "너무 화려한색이라"). 메인 격자·일 등록·PC 필터가 같이 쓴다.
import {
  LuHome, LuBuilding2, LuTruck, LuChefHat, LuShoppingBag, LuPackage, LuFootprints,
  LuBaby, LuBackpack, LuBookOpen, LuSchool, LuHeartPulse, LuStethoscope, LuDog, LuCross,
} from "react-icons/lu";
import { WORKNAME } from "./work";

export const WORKICON = {
  [WORKNAME.HOMECLEAN]: LuHome,
  [WORKNAME.BUSINESSCLEAN]: LuBuilding2,
  [WORKNAME.MOVECLEAN]: LuTruck,
  [WORKNAME.FOODPREPARE]: LuChefHat,
  [WORKNAME.SHOPPING]: LuShoppingBag,
  [WORKNAME.CARRYLOAD]: LuPackage,
  [WORKNAME.ERRAND]: LuFootprints,
  [WORKNAME.BABYCARE]: LuBaby,
  [WORKNAME.GOOUTSCHOOL]: LuBackpack,
  [WORKNAME.LESSON]: LuBookOpen,
  [WORKNAME.GOSCHOOLEVENT]: LuSchool,
  [WORKNAME.PATIENTCARE]: LuHeartPulse,
  [WORKNAME.GOHOSPITAL]: LuStethoscope,
  [WORKNAME.GODOGWALK]: LuDog,
  [WORKNAME.GODOGHOSPITAL]: LuCross,
};

// 그룹별 원 배경색 — 청소 / 집안일 / 아이 / 돌봄 / 반려.
// 원 안의 아이콘은 흰색으로 그린다.
//
// 채도를 한 톤 낮춘 판이다 (형 확정 2026-08-20 — /gridlab 02안).
// 원색 다섯 가지가 나란히 있으니 격자가 알록달록해서 소란스러웠다.
// 구성은 그대로 두고 색만 죽였다.
//
// 반려는 원래 보라(#7C3AED)였는데 청록으로 바꿨다 — 형이 안 쓰는 색이다.
export const WORKCOLOR = {
  [WORKNAME.HOMECLEAN]: "#3C6E9F",
  [WORKNAME.BUSINESSCLEAN]: "#3C6E9F",
  [WORKNAME.MOVECLEAN]: "#3C6E9F",
  [WORKNAME.FOODPREPARE]: "#C4562F",
  [WORKNAME.SHOPPING]: "#C4562F",
  [WORKNAME.CARRYLOAD]: "#C4562F",
  [WORKNAME.ERRAND]: "#C4562F",
  [WORKNAME.BABYCARE]: "#B8862E",
  [WORKNAME.GOOUTSCHOOL]: "#B8862E",
  [WORKNAME.LESSON]: "#B8862E",
  [WORKNAME.GOSCHOOLEVENT]: "#B8862E",
  [WORKNAME.PATIENTCARE]: "#3E7D5A",
  [WORKNAME.GOHOSPITAL]: "#3E7D5A",
  [WORKNAME.GODOGWALK]: "#3F7D85",
  [WORKNAME.GODOGHOSPITAL]: "#3F7D85",
};

// 마감·완료된 일감의 원 — 색 대신 회색
export const WORKDONE_BG = "#C6C6C6";

export const workColor = (name) => WORKCOLOR[name] || "var(--icon-fg)";

// 이름으로 찾아 그린다. 구 표기 등 매핑에 없는 이름이면 아무것도 안 그린다.
// color 를 안 주면 그 일감의 그룹색 — 원 없이 제목 옆에 단독으로 쓰일 때 용도.
// 색 원 안에 넣을 때는 color="#fff" 를 명시할 것.
export function WorkIcon({ name, size = 30, color, ...rest }) {
  const Icon = WORKICON[name];
  return Icon ? <Icon size={size} strokeWidth={1.6} color={color || workColor(name)} aria-label={name} {...rest} /> : null;
}
