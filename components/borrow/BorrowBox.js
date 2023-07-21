import styles from './BorrowBox.module.css'
import AssetRow from '../lend/Assets/AssetRow'

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

    return(
        <div className={styles.borrowbox}>
        <h2>Borrow Assets</h2>
          <div>
            {assets.map((asset) => (
              <AssetRow key={asset.name} asset={asset} />
            ))}
          </div>
      </div>
    )
}

export default BorrowBox