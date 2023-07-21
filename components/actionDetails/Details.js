import styles from './Details.module.css'

const Details = ({isOpen, onClose}) => {
    if (!isOpen) return null;

    return(
    <div className={styles.detailOverlay}>
        <div className={styles.detail}>
          <h2>Supply details</h2>
          <br/>
          <button onClick={onClose}>Close</button>
        </div>
    </div>
    )
}

export default Details