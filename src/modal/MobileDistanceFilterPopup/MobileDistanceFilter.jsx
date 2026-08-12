import * as React from 'react';
import { FILTERITEMDISTANCE } from '../../utility/screen';
import MobileFilterSheet, { FilterOption, OptionGrid } from '../common/MobileFilterSheet';

const WorkItems = [
  FILTERITEMDISTANCE.ONE,
  FILTERITEMDISTANCE.TWO,
  FILTERITEMDISTANCE.THREE,
  FILTERITEMDISTANCE.FOUR,
  FILTERITEMDISTANCE.FIVE,
  FILTERITEMDISTANCE.SIX,
];

/** 거리 — 하나만 고른다 */
export default function MobileDistanceFilter({ filterhistory, callback }) {
  const [picked, setPicked] = React.useState(() => (filterhistory || [])[0] || '');

  const handleClose = () => callback([]);
  const handleApply = () => callback(picked ? [picked] : []);

  return (
    <MobileFilterSheet title={'홍여사 거리 선택'} onClose={handleClose} onApply={handleApply} minheight={200}>
      <OptionGrid>
        {WorkItems.map((name) => (
          <FilterOption key={name} label={name} selected={picked == name} onClick={() => setPicked(name)} />
        ))}
      </OptionGrid>
    </MobileFilterSheet>
  );
}
