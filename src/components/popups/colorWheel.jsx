import React, { useState, Fragment } from 'react';
import Wheel from '@uiw/react-color-wheel';
import { hsvaToHex, hexToHsva } from '@uiw/color-convert';

function Demo({ onColorChange, color }) {
  // const [hsva, setHsva] = useState({ h: 214, s: 43, v: 90, a: 1 });
  const [hsva, setHsva] = useState(hexToHsva(color));
  // const hexColor = hsvaToHex(hsva);
  const handleChange = (color) => {
    setHsva({ ...hsva, ...color.hsva });
    onColorChange(hsvaToHex({ ...hsva, ...color.hsva }));
  };
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Wheel color={hsva} onChange={handleChange} />
    </div>
  );
}

export default Demo;