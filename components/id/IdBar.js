import styles from './IdBar.module.css';
import { useState, useEffect } from 'react';
import Modal from '../modal/Modal';
import dynamic from 'next/dynamic';
import CreateAccount from '../CreateAccount';
import { init, useQuery, useLazyQuery } from '@airstack/airstack-react';
init('ddfcc652b902475e99ee40f6db959ff9');

const WalletComponent = dynamic(() => import('../WalletComponent'), {
  ssr: false,
});

const IdBar = ({tbAccounts, tokenId, TokenIdSetter}) => {

  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div className={styles.idbar}>
      This is the Idbar component.
      <WalletComponent tokenId={tokenId} TokenIdSetter={TokenIdSetter} />
      <br></br>
      <div>
        {tokenId && (
          <div>
            <CreateAccount tokenId={tokenId} key={tokenId} />
            <div>Select the Accounts You Want To Utilize</div>
            <button className={styles.buttonx} onClick={openModal}>
              Account Management
            </button>
            {isModalOpen && (
              <Modal accounts={tbAccounts} isOpen={isModalOpen} onClose={closeModal}></Modal>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default IdBar;
