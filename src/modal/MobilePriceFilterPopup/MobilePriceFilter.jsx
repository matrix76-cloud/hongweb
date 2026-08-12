import * as React from 'react';
import { PiCoinsBold } from 'react-icons/pi';
import MobileFilterSheet, { FilterOption, OptionGrid } from '../common/MobileFilterSheet';

export const FILTERITEMMONEY = {
  ONE: "3만원 이하",
  TWO: "3만원 ~ 4만원",
  THREE: "4만원 ~ 5만원",
  FOUR: "5만원 ~ 6만원",
  FIVE: "6만원 ~ 8만원",
  SIX: "8만원 이상",
}

const WorkItems = [
  FILTERITEMMONEY.ONE,
  FILTERITEMMONEY.TWO,
  FILTERITEMMONEY.THREE,
  FILTERITEMMONEY.FOUR,
  FILTERITEMMONEY.FIVE,
  FILTERITEMMONEY.SIX,
];

/** 가격대 — 하나만 고른다 */
export default function MobilePriceFilter({ filterhistory, callback }) {
  const [picked, setPicked] = React.useState(() => (filterhistory || [])[0] || '');

  const handleClose = () => callback([]);
  const handleApply = () => callback(picked ? [picked] : []);

  return (
    <MobileFilterSheet title={'홍여사 가격 선택'} icon={<PiCoinsBold size={19}/>} onClose={handleClose} onApply={handleApply} minheight={200}>
      <OptionGrid>
        {WorkItems.map((name) => (
          <FilterOption key={name} label={name} selected={picked == name} onClick={() => setPicked(name)} />
        ))}
      </OptionGrid>
    </MobileFilterSheet>
  );
}
