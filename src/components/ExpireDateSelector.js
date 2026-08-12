import React, { useState } from 'react';

const options = [
  { label: '오늘', days: 0 },
  { label: '내일', days: 1 },
  { label: '3일 후', days: 3 },
  { label: '7일 후', days: 7 },
  { label: '직접 입력', days: null },
];

const ExpireDateSelector = ({ onChange }) => {
  const [selected, setSelected] = useState(null);
  const [customDate, setCustomDate] = useState('');
  
  const handleSelect = (option) => {
    setSelected(option.label);
    if (option.days === null) {
      setCustomDate('');
      onChange(null); // 직접입력 선택 시 초기화
    } else {
      const date = new Date();
      date.setDate(date.getDate() + option.days);
      const dateStr = date.toISOString().slice(0, 10);
      setCustomDate(dateStr);
      onChange(dateStr);
    }
  };

  const handleCustomDateChange = (e) => {
    const dateStr = e.target.value;
    setCustomDate(dateStr);
    setSelected('직접 입력');
    onChange(dateStr);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {options.map((option) => (
          <button
            key={option.label}
            onClick={() => handleSelect(option)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: selected === option.label ? '2px solid #ff6b00' : '1px solid #ccc',
              backgroundColor: selected === option.label ? '#fff4e6' : '#fff',
              cursor: 'pointer',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>

      {selected === '직접 입력' && (
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
      )}
    </div>
  );
};

export default ExpireDateSelector;
