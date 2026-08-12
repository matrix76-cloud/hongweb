import * as React from 'react';
import { FILTERITEMPERIOD } from '../../utility/screen';
import { PiCalendarBlankBold } from 'react-icons/pi';
import MobileFilterSheet, { FilterOption, OptionGrid } from '../common/MobileFilterSheet';

const WorkItems = [
  FILTERITEMPERIOD.ONE,
  FILTERITEMPERIOD.TWO,
  FILTERITEMPERIOD.THREE,
  FILTERITEMPERIOD.FOUR,
  FILTERITEMPERIOD.FIVE,
  FILTERITEMPERIOD.SIX,
];

/** 기간 — 하나만 고른다 */
export default function MobilePeriodFilter({ filterhistory, callback }) {
  const [picked, setPicked] = React.useState(() => (filterhistory || [])[0] || '');

  const handleClose = () => callback([]);
  const handleApply = () => callback(picked ? [picked] : []);

  return (
    <MobileFilterSheet title={'홍여사 기간 선택'} icon={<PiCalendarBlankBold size={19}/>} onClose={handleClose} onApply={handleApply} minheight={200}>
      <OptionGrid>
        {WorkItems.map((name) => (
          <FilterOption key={name} label={name} selected={picked == name} onClick={() => setPicked(name)} />
        ))}
      </OptionGrid>
    </MobileFilterSheet>
  );
}
