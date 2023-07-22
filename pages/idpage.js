import styles from '../styles/Home.module.css';
import Menubar from '@/components/global/Menubar';
import StatBox from '@/components/statbox/StatBox';
import dynamic from 'next/dynamic';
import { useState, useEffect, useCallback } from 'react';
import { init, useLazyQuery } from '@airstack/airstack-react';
import { useAccount } from 'wagmi';
init('ddfcc652b902475e99ee40f6db959ff9');

const IdBar = dynamic(() => import('@/components/id/IdBar'), {
  ssr: false,
});

const Home = () => {

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
  
  function TokenIdSetter(NewValue) {
    setTokenId(NewValue);
  }

  const [tokenId, setTokenId] = useState(null);

  const tba = `{
    Accounts(
      input: {blockchain: polygon, limit: 200, filter: {tokenAddress: {_eq: "0xAccD4112dCC20B6a40068eC5DCC695e5cD8Ee87F"}, tokenId: {_eq: "9"}}}
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

    const tbaNFTs = `
    query MyQuery {
      TokenBalances(
        input: {filter: {owner: {_eq: "0x0f83864604Bdde4685fa5eBe677C7bd59D0069A3"}}, blockchain: polygon, limit: 50}
      ) {
        TokenBalance {
          tokenAddress
          amount
          formattedAmount
          tokenType
          tokenNfts {
            address
            tokenId
            blockchain
          }
        }
      }
    }
    `;
  
    const [tbAccNFTs, setTbAccNFTs] = useState([])
    const [fetch_tbaNFTs, tbaNFTs_queryResponse] = useLazyQuery(tbaNFTs)

    useEffect(() => {
      if(tbAccounts.length > 0) {  // check if tbAccounts array is populated
        fetch_tbaNFTs();
      }
    }, [tbAccounts]);
    
    useEffect(() => {
      if(tbaNFTs_queryResponse.data) {
        console.log(tbaNFTs_queryResponse.data)
        setTbAccNFTs(tbaNFTs_queryResponse.data)
      }
    }, [tbaNFTs_queryResponse.data]);

    console.log(tbAccNFTs)
    
  return (
  <Menubar>
      <div className={styles.container}>
      <div className={styles.wrapper}>
          <IdBar tbAccounts={tbAccounts} tokenId={tokenId} TokenIdSetter={TokenIdSetter} />
          <StatBox />
        </div>
        <footer className={styles.footer}>
          <a href="https://rainbow.me" rel="noopener noreferrer" target="_blank">
            Made with ❤️ Oğuz Utku Yıldız hehe
          </a>
        </footer>
      </div>
    </Menubar>
  );
};

export default Home;
