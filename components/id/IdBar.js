import styles from './IdBar.module.css';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
import Modal from '../modal/Modal';
import dynamic from 'next/dynamic';
import CreateAccount from '../CreateAccount';
import { init, useQuery, useLazyQuery } from '@airstack/airstack-react';
init('ddfcc652b902475e99ee40f6db959ff9');

const WalletComponent = dynamic(() => import('../WalletComponent'), {
  ssr: false,
});

const IdBar = () => {

  const tba = `{
    Accounts(
      input: {blockchain: polygon, limit: 200, filter: {tokenAddress: {_eq: "0xAccD4112dCC20B6a40068eC5DCC695e5cD8Ee87F"}, tokenId: {_eq: "2"}}}
    ) {
      Account {
        address {
          addresses
          domains {
            name
            isPrimary
          }
          socials {
            dappName
            profileName
          }
        }
        implementation
      }
    }
    }`;

  const [tbAccounts, setTbAccounts] = useState([])
  console.log(tbAccounts)
  const [tokenId, setTokenId] = useState(null);

  const query_metadata = `{
    TokenNft(
      input: {address: "0xAccD4112dCC20B6a40068eC5DCC695e5cD8Ee87F", tokenId: "${tokenId}", blockchain: polygon}
    ) {
      tokenId
      metaData {
        name
        description
        image
        attributes {
          trait_type
          value
        }
        externalUrl
        animationUrl
      }
    }
  }`;
  const [fetch_query_metadata, metadata_queryResponse] =
    useLazyQuery(query_metadata);
  
  const [fetch_tba, tba_queryResponse] = useLazyQuery(tba)

    useEffect(() => {
      fetch_tba();
    }, []);
    

    useEffect(() => {
      if(tba_queryResponse.data) {
        console.log(tba_queryResponse.data.Accounts.Account);
        const customImplementation = '0x1538db7bca51b886b9c3110e17cf64a7a6181dc1'
        const newAccounts = tba_queryResponse.data.Accounts.Account
        .filter(account => account.implementation === customImplementation)
        .map(account => account.address.addresses)
        .flat()

        setTbAccounts(newAccounts)
      }
    }, [tba_queryResponse.data]);


  const [isModalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log('Connected', { address, connector, isReconnected });
    },
    onDisconnect() {
      setTokenId(null);
    },
  });
  useEffect(() => {
    setTokenId(null);
  }, [account.address]);

  useEffect(() => {
    if (tokenId) fetch_query_metadata();
    console.log(metadata_queryResponse.data);
  }, [tokenId]);

  function TokenIdSetter(NewValue) {
    setTokenId(NewValue);
  }

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
