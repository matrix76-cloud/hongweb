import * as React from 'react';
import { FILTERITEMPROCESS } from '../../utility/screen';
import { PiCheckCircleBold } from 'react-icons/pi';
import MobileFilterSheet, { FilterOption, OptionGrid } from '../common/MobileFilterSheet';

const WorkItems = [
  { value: FILTERITEMPROCESS.OPEN, label: '진행중 거래' },
  { value: FILTERITEMPROCESS.CLOSE, label: '마감된 거래' },
];

/** 진행 상태 — 여러 개 고를 수 있다 (제목이 '거리별'로 잘못 붙어 있었다) */
export default function MobileProcessFilter({ filterhistory, callback }) {
  const [filterary, setFilterary] = React.useState(() => [...(filterhistory || [])]);

  const handleClose = () => callback([]);
  const handleApply = () => callback(filterary);

  const toggle = (value) => {
    setFilterary((prev) => (prev.includes(value) ? prev.filter((x) => x != value) : [...prev, value]));
  };

  return (
    <MobileFilterSheet title={'홍여사 진행 상태 선택'} icon={<PiCheckCircleBold size={19}/>} onClose={handleClose} onApply={handleApply} minheight={120}>
      <OptionGrid>
        {WorkItems.map((item) => (
          <FilterOption
            key={item.value}
            label={item.label}
            selected={filterary.includes(item.value)}
            onClick={() => toggle(item.value)}
          />
        ))}
      </OptionGrid>
    </MobileFilterSheet>
  );
}
