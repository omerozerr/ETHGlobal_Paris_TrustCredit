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
        <div className={styles.closeButton}>
          <button className={styles.xbutton} onClick={onClose}>X</button>
        </div>
        <div className={styles.details}>
          <h2>Supply {name} </h2> 
          <div className={styles.wrapper}>
            <div className={styles.inputAmount}>Amount
            <input className={styles.inputBox} type="text" value={supplyValue} onChange={handleChange} />
          </div>
          <div className={styles.detailWrapper}>
              Details
              <div className={styles.txBox}>Hi</div>
          </div>
          <button
            onClick={() => supllysetterDENEME(true)}
            className={styles.assetSupplyButton}
          >
            Supply
          </button>
          </div>
        </div>
      </div>
    </div>
  );
};



export default DetailsSupply;
