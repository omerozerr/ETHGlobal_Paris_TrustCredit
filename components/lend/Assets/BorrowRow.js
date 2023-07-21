import styles from './AssetRow.module.css';
import { useState } from 'react';
import Details from '@/components/actionDetails/Details';

const BorrowRow = ({ asset }) => {
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
        Borrow
      </button>
      {isModalOpen && <Details isOpen={isModalOpen} onClose={closeModal} />}
    </div>
  );
};

export default BorrowRow;
