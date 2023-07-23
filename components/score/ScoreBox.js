import Image from 'next/image'
import styles from './ScoreBox.module.css'

const ScoreBox = () => {
    return(
        <div className={styles.boxOverlay}>
            <div className={styles.scoreBoxes}>
                <div className={styles.myRate}>My Rates</div>
                <div className={styles.rateOther}>X +</div>
                <div className={styles.rateOther}>Y +</div>
                <div className={styles.rateOther}>Z +</div>
            </div>
            <div className={styles.mainBox}>
            <Image src="/circle.svg"
                className={styles.profileLogo}
                width={92}
                height={92}
                alt="Logo" />
                <div className={styles.nftCount}>2 NFT</div>
                <div className={styles.csNum}>750</div>
                <div className={styles.csWritten}>Credit Score</div>
            </div>
            
        </div>
    )
}

export default ScoreBox