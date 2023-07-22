import styles from './ScoreBox.module.css'

const ScoreBox = () => {
    return(
        <div className={styles.boxOverlay}>
            <div className={styles.scoreBoxes}>score boxes</div>
            <div className={styles.mainBox}>ScoreBox Component</div>
            
        </div>
    )
}

export default ScoreBox