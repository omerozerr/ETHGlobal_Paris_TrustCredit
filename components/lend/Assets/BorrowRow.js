import styles from './AssetRow.module.css';
import { useState } from 'react';
import DetailsBorrow from '@/components/actionDetails/DetailsBorrow';
import Image from 'next/image';

const BorrowRow = ({ asset, isSupplied }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className={styles.assetRow}>
      <Image src="/eth-logo.svg"
              width={50}
              height={50}
        alt="Logo" />
      <div className={styles.assetName}>{asset.name}</div>
      <div className={styles.assetBalance}>{asset.balance}</div>
      <div className={styles.assetApy}>{asset.apy}</div>

      <button onClick={openModal} className={styles.assetSupplyButton}>
        Borrow
      </button>
      {isModalOpen && (
        <DetailsBorrow
          isSupplied={isSupplied}
          isOpen={isModalOpen}
          onClose={closeModal}
          name={asset.name}
        />
      )}
    </div>
  );
};

export default BorrowRow;
