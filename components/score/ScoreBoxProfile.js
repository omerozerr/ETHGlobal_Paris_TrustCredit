import Image from 'next/image'
import styles from './ScoreBoxProfile.module.css'
import CreateAccount from '../CreateAccount'
import { useState } from 'react'
import Modal from '../modal/Modal'

const ScoreBoxProfile = ({tokenId, tbAccounts}) => {

    const [isModalOpen, setModalOpen] = useState(false);
    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

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
                <div className={styles.createAcc}><CreateAccount tokenId={tokenId} key={tokenId} /></div>
                <div className={styles.manageAcc}>      <div>
        {tokenId && (
          <div>
            <div className={styles.buttonx} onClick={openModal}>
              Account Management
            </div>
            {isModalOpen && (
              <Modal accounts={tbAccounts} isOpen={isModalOpen} onClose={closeModal}></Modal>
            )}
          </div>
        )}
      </div></div>
                <div className={styles.csNum}>750</div>
                <div className={styles.csWritten}>Credit Score</div>
            </div>
            
        </div>
    )
}

export default ScoreBoxProfile