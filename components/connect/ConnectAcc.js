import { Web3Button } from '@web3modal/react'
import styles from './ConnectAcc.module.css'

const ConnectAcc = () => {
    return(
        <div className={styles.container}>
            <div className={styles.title}>Account</div>
            <div className={styles.content}>Connect your wallet first to mint your ID</div>
            <div className={styles.connect}><Web3Button /></div>
        </div>
        
    )
}

export default ConnectAcc