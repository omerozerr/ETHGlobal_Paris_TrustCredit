import styles from './Details.module.css';
import React, { useState } from 'react';
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from '@wagmi/core';

const DetailsSupply = ({ isOpen, onClose, name, SupplyStatusSetter }) => {
  if (!isOpen) return null;
  const [supplyValue, setsupplyValue] = useState('');

  const handleChange = (event) => {
    const val = event.target.value;
    setsupplyValue(val);
  };
  async function supply() {
    const config = await prepareWriteContract({
      // TO DO: FILL THE CONTRACT DETAILS
      address: 'ADDRESS',
      abi: RegistryABI,
      functionName: 'createAccount',
      chainId: 137,
      args: [
        '0x4C748B52B130106D49978ad937C0f65BC8bd5a86',
        137,
        '0xAccD4112dCC20B6a40068eC5DCC695e5cD8Ee87F',
        tokenId,
        0,
        '0x',
      ],
    });

    const { hash } = await writeContract(config);
    const data = await waitForTransaction({
      hash,
    });
    // TODO SET SUPPLY STATUS
    //SupplyStatusSetter(true)
  }

  async function supllysetterDENEME(newValue) {
    SupplyStatusSetter(newValue);
  }

  return (
    <div className={styles.detailOverlay}>
      <div className={styles.detail}>
        <h2>Supply {name} </h2>
        <input type="text" value={supplyValue} onChange={handleChange} />
        <button
          // TODO CHANGE THE FUNCTİON
          onClick={() => supllysetterDENEME(true)}
          className={styles.assetSupplyButton}
        >
          Supply
        </button>

        <br />
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DetailsSupply;
