import React, { useState } from 'react';
import { convertToDateInputFormat } from '../utility/date';

const options = [
  { label: '오늘', days: 0 },
  { label: '내일', days: 1 },
  { label: '3일 후', days: 3 },
  { label: '7일 후', days: 7 },
  { label: '직접 입력', days: null },
];

const ExpireDateSelectormin = ({ onChange, lastdate }) => {





  const [selected, setSelected] = useState(null);
  const [customDate, setCustomDate] = useState(convertToDateInputFormat(lastdate));
  

  console.log("ExpireDateSelectormin last date", lastdate, customDate);

  const handleCustomDateChange = (e) => {
    const dateStr = e.target.value;
    setCustomDate(dateStr);
    setSelected('직접 입력');
    onChange(dateStr);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>

        <input
          type="date"
          value={customDate}
          onChange={handleCustomDateChange}
          style={{
            marginTop: '4px',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            width: '100%',
          }}
        />

    </div>
  );
};

export default ExpireDateSelectormin;
