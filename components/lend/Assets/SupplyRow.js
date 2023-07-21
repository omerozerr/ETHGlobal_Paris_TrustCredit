import styles from './AssetRow.module.css';
import { useState } from 'react';
import DetailsSupply from '@/components/actionDetails/DetailsSupply';

const SupplyRow = ({ asset, SupplyStatusSetter }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className={styles.assetRow}>
      <div className={styles.assetName}>{asset.name}</div>
      <div className={styles.assetBalance}>{asset.balance}</div>
      <div className={styles.assetApy}>{asset.apy}</div>
      <div className={styles.assetCanBeCollateral}>
        {asset.canBeCollateral ? 'Yes' : 'No'}
      </div>
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
