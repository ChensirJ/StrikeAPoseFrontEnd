import React from 'react';
import { Button } from 'antd';

function DateSelector({ dates, onSelect, selectedDate }) {
  return (
    <div className="date-button-container">
      {dates.map((date) => (
        <Button
          key={date}
          type={selectedDate === date ? 'primary' : 'default'}
          onClick={() => onSelect(date)}
          className="date-button"
        >
          {date}
        </Button>
      ))}
    </div>
  );
}

export default DateSelector; 