import styles from './MintId.module.css'
import CreateAccount from '../CreateAccount'

const MintId = ({tokenId}) => {
    return(
        <div className={styles.container}>
            <div className={styles.title}>Social ID</div>
            <div className={styles.content}>Mint Your ID for Better Colleteral Rates</div>
            <div className={styles.mintButton}><CreateAccount tokenId={tokenId} key={tokenId} /></div>
            
        </div>
    )
}

export default MintId