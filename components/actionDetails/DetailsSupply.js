import styles from './Details.module.css';
import React, { useState } from 'react';

const DetailsSupply = ({ isOpen, onClose, name }) => {
  if (!isOpen) return null;
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    const val = event.target.value;
    setValue(val);
  };
  const supply = () => {};

  return (
    <div className={styles.detailOverlay}>
      <div className={styles.detail}>
        <h2>Supply {name} </h2>
        <input type="text" value={value} onChange={handleChange} />
        <button onClick={supply} className={styles.assetSupplyButton}>
          Supply
        </button>

        <br />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DetailsSupply;
