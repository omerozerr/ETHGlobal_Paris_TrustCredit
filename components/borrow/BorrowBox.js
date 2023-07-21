import styles from './BorrowBox.module.css';
import BorrowRow from '../lend/Assets/BorrowRow';

const assets = [
  {
    name: 'Bitcoin',
    balance: '1.5 BTC',
    apy: '4%',
    canBeCollateral: true,
  },
  {
    name: 'Ethereum',
    balance: '5 ETH',
    apy: '2%',
    canBeCollateral: false,
  },
];

const BorrowBox = () => {
  return (
    <div className={styles.borrowbox}>
      <h2>Borrow Assets</h2>
      <div>
        <div className={styles.headerRow}>
          <span>Name</span>
          <span>Balance</span>
          <span>APY</span>
          <span>CanBeCollateral</span>
        </div>
        {assets.map((asset) => (
          <BorrowRow key={asset.name} asset={asset} />
        ))}
      </div>
    </div>
  );
};

export default BorrowBox;
