import styles from './AssetRow.module.css';
import { useState } from 'react';
import DetailsSupply from '@/components/actionDetails/DetailsSupply';
import Image from 'next/image';

const SupplyRow = ({ asset, SupplyStatusSetter }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  console.log(asset)

  return (
    <div className={styles.assetRow}>
    {asset.name === "DAI" ? 
    <Image src="/dai-logo.svg"
    className={styles.assetLogo}
    width={50}
    height={50}
    alt="Logo" />:
      <Image src="/eth-logo.svg"
      className={styles.assetLogo}
              width={50}
              height={50}
        alt="Logo" />}
      <div className={styles.assetName}>{asset.name}</div>
      <div className={styles.assetApy}>{asset.apy}</div>
      <div className={styles.asseteRate}>{asset.extraRate}</div>
      <button onClick={openModal} className={styles.assetSupplyButton}>
        Supply
      </button>
      {isModalOpen && (
        <DetailsSupply
          SupplyStatusSetter={SupplyStatusSetter}
          isOpen={isModalOpen}
          onClose={closeModal}
          name={asset.name}
        />
      )}
    </div>
  );
};

export default SupplyRow;
