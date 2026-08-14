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

// 그룹별 원 배경색 — 청소 파랑 / 집안일 주황 / 아이 노랑 / 돌봄 초록 / 반려 보라.
// 원 안의 아이콘은 흰색으로 그린다 (형 확정 2026-08-15, /iconlab 케이스 15).
export const WORKCOLOR = {
  [WORKNAME.HOMECLEAN]: "#2563EB",
  [WORKNAME.BUSINESSCLEAN]: "#2563EB",
  [WORKNAME.MOVECLEAN]: "#2563EB",
  [WORKNAME.FOODPREPARE]: "#FF4E19",
  [WORKNAME.SHOPPING]: "#FF4E19",
  [WORKNAME.CARRYLOAD]: "#FF4E19",
  [WORKNAME.ERRAND]: "#FF4E19",
  [WORKNAME.BABYCARE]: "#F59E0B",
  [WORKNAME.GOOUTSCHOOL]: "#F59E0B",
  [WORKNAME.LESSON]: "#F59E0B",
  [WORKNAME.GOSCHOOLEVENT]: "#F59E0B",
  [WORKNAME.PATIENTCARE]: "#16A34A",
  [WORKNAME.GOHOSPITAL]: "#16A34A",
  [WORKNAME.GODOGWALK]: "#7C3AED",
  [WORKNAME.GODOGHOSPITAL]: "#7C3AED",
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
