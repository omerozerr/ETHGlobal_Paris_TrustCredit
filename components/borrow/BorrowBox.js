import styles from './BorrowBox.module.css';
import BorrowRow from '../lend/Assets/BorrowRow';
import LendTitles from '../lend/LendTitles';

const assets = [
  {
    name: 'DAI',
    apy: '65%',
    extraRate: '5%',
    canBeCollateral: true,
  },
  {
    name: 'ETH',
    apy: '64%',
    extraRate: '5%',
    canBeCollateral: false,
  },
];

const BorrowBox = ({ isSupplied }) => {
  return (
    <div className={styles.borrowbox}>
    <div className={styles.supplyTitle}>Assets to Borrow</div>
      <LendTitles />
      <div>
        {assets.map((asset) => (
          <BorrowRow key={asset.name} asset={asset} isSupplied={isSupplied} />
        ))}
      </div>
    </div>
  );
};

export default BorrowBox;
