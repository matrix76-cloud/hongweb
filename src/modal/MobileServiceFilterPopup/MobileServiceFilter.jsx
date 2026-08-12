import * as React from 'react';
import { WORKNAME } from '../../utility/work';
import { PiBroomBold } from 'react-icons/pi';
import MobileFilterSheet, { FilterOption, OptionGrid } from '../common/MobileFilterSheet';

/* 가격 구간 — 예전부터 여기서 export 해가는 곳이 있어 그대로 둔다 */
export const FILTERITEMMONEY = {
  ONE: "3만원 이하",
  TWO: "3만원 이상 ~ 4만원 이하",
  THREE: "4만원 이상 ~ 5만원 이하",
  FOUR: "5만원 이상 ~ 6만원 이하",
  FIVE: "6만원 이상 ~ 8만원 이하",
  SIX: "8만원 이상",
}

const WorkItems = [
  WORKNAME.HOMECLEAN,
  WORKNAME.BUSINESSCLEAN,
  WORKNAME.MOVECLEAN,
  WORKNAME.FOODPREPARE,
  WORKNAME.ERRAND,
  WORKNAME.GOOUTSCHOOL,
  WORKNAME.BABYCARE,
  WORKNAME.LESSON,
  WORKNAME.PATIENTCARE,
  WORKNAME.CARRYLOAD,
  WORKNAME.GOHOSPITAL,
  /* 요리비법(RECIPETRANSMIT)은 폐지돼 WORKNAME 에서 빠졌다.
     남아 있던 자리가 undefined 라 빈 칸으로 보였다 (형 리뷰 2026-08-12) */
  WORKNAME.GOSCHOOLEVENT,
  WORKNAME.SHOPPING,
  WORKNAME.GODOGHOSPITAL,
  WORKNAME.GODOGWALK,
];

/** 서비스 종류 — 여러 개 고를 수 있다 */
export default function MobileServiceFilter({ filterhistory, callback }) {
  const [filterary, setFilterary] = React.useState(() => [...(filterhistory || [])]);

  /* 닫기는 취소다. 빈 배열을 주면 부르는 쪽이 기존 필터를 유지한다 */
  const handleClose = () => callback([]);
  const handleApply = () => callback(filterary);

  const toggle = (name) => {
    setFilterary((prev) => (prev.includes(name) ? prev.filter((x) => x != name) : [...prev, name]));
  };

  return (
    <MobileFilterSheet title={'홍여사 서비스 선택'} icon={<PiBroomBold size={19}/>} onClose={handleClose} onApply={handleApply} minheight={420}>
      <OptionGrid>
        {WorkItems.map((name) => (
          <FilterOption key={name} label={name} selected={filterary.includes(name)} onClick={() => toggle(name)} />
        ))}
      </OptionGrid>
    </MobileFilterSheet>
  );
}
