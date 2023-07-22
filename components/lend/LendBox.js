import styles from './LendBox.module.css';
import SupplyRow from './Assets/SupplyRow';
import LendTitles from './LendTitles';

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

const LendBox = ({ SupplyStatusSetter }) => {
  return (
    <div className={styles.lendbox}>
      <div className={styles.supplyTitle}>Assets to Supply</div>
      <LendTitles />
      <div>
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
