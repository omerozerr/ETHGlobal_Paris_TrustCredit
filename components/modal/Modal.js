import Accounts from './accounts/Accounts';
import styles from './Modal.module.css'

const Modal = ({ isOpen, onClose, accounts }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h2>Account Management</h2>
        {accounts.map((acc) => (
          <Accounts acc={acc} key={acc} />
        ))}
        <br/>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal