import * as React from 'react';
import { PiUserBold } from 'react-icons/pi';
import MobileFilterSheet, { FilterOption, OptionGrid } from '../common/MobileFilterSheet';

/* 홍여사 나이대 — 지원서의 age 값("40대")과 같은 표기. 하나만 고른다 (2026-08-23) */
export const AGE_ITEMS = ['20대', '30대', '40대', '50대', '60대 이상'];

export default function MobileAgeFilter({ filterhistory, callback }) {
  const [picked, setPicked] = React.useState(() => (filterhistory || [])[0] || '');

  const handleClose = () => callback([]);
  const handleApply = () => callback(picked ? [picked] : []);

  return (
    <MobileFilterSheet title={'홍여사 나이대 선택'} icon={<PiUserBold size={19}/>} onClose={handleClose} onApply={handleApply} minheight={200}>
      <OptionGrid>
        {AGE_ITEMS.map((name) => (
          <FilterOption key={name} label={name} selected={picked == name} onClick={() => setPicked(name)} />
        ))}
      </OptionGrid>
    </MobileFilterSheet>
  );
}
