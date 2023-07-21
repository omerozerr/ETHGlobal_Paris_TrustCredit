import styles from './LendBox.module.css';
import SupplyRow from './Assets/SupplyRow';

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

const LendBox = ({ SupplyStatusSetter }) => {
  return (
    <div className={styles.lendbox}>
      <h2>Supply Assets</h2>
      <div>
        <div className={styles.headerRow}>
          <span>Name</span>
          <span>Balance</span>
          <span>APY</span>
          <span>CanBeCollateral</span>
        </div>
        {assets.map((asset) => (
          <SupplyRow
            key={asset.name}
            asset={asset}
            SupplyStatusSetter={SupplyStatusSetter}
          />
        ))}
      </div>
    </div>
  );
};

export default LendBox;
