import styles from './LendTitles.module.css'

const LendTitles = () => {
    return (
        <div className={styles.titleContainer}> 
            <div className={styles.name}>Name</div>
            <div className={styles.rate}>Rate</div>
            <div className={styles.eRate}>Extra Rate</div>
        </div>
    )
}

export default LendTitles