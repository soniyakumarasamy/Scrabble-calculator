
import React from 'react';

const Tile = ({ letter, onChange }) => {
    const handleChange = (event) => {
      const newValue = event.target.value;
      // Check if the new value is not numeric
      if (!/^\d+$/.test(newValue)) {
        onChange(newValue);
      }
    };
 
  return (
    
    <input
      type="text"
      className="tile"
      value={letter}
      onChange={handleChange}
      maxLength={1} 
    />
 
  );
};

export default Tile;

