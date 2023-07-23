import styles from './IdBar.module.css';
import { init} from '@airstack/airstack-react';
import NftDisplay from '../nftDisplay/NftDisplay';
init('ddfcc652b902475e99ee40f6db959ff9');


const IdBar = ({tokenBalances}) => {

  console.log(tokenBalances)

  return (
    <div className={styles.idbar}>
        <div className={styles.titleName}>Address</div>
        <div className={styles.titleValue}>Value</div>
      <div className={styles.nftDisplays}>
      {tokenBalances?.map((balance, index) => (
                <NftDisplay tokenBalances={balance} key={index}/>
      ))}

      </div>
    </div>
  );
};

export default IdBar;
