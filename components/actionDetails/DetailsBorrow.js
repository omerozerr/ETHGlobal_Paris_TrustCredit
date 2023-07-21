import styles from './Details.module.css';
import React, { useState } from 'react';

const DetailsBorrow = ({ isOpen, onClose, name, isSupplied }) => {
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
        {isSupplied ? (
          <div>
            <h2>Borrow {name} </h2>
            <input type="text" value={value} onChange={handleChange} />
            <button onClick={supply} className={styles.assetSupplyButton}>
              Borrow
            </button>
          </div>
        ) : (
          <div>You need to supply before you borrow</div>
        )}

        <br />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DetailsBorrow;
