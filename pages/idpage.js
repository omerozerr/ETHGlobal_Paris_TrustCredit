import styles from '../styles/Home.module.css';
import Menubar from '@/components/global/Menubar';
import StatBox from '@/components/statbox/StatBox';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
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

  const [tokenId, setTokenId] = useState(null);

  const tba = `{
    Accounts(
      input: {blockchain: polygon, limit: 200, filter: {tokenAddress: {_eq: "0xAccD4112dCC20B6a40068eC5DCC695e5cD8Ee87F"}, tokenId: {_eq:$tokenId }}
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

    const [fetch_tba, tba_queryResponse] = useLazyQuery(tba);

    useEffect(() => {
      fetch_tba();
    }, [fetch_tba, tokenId]);
    
    useEffect(() => {
      if(
        tba_queryResponse.data && 
        tba_queryResponse.data.Accounts && 
        tba_queryResponse.data.Accounts.Account
      ) {
        console.log(tba_queryResponse.data.Accounts.Account);
        const customImplementation = '0x4C748B52B130106D49978ad937C0f65BC8bd5a86'
        const newAccounts = tba_queryResponse.data.Accounts.Account
        .filter(account => account.implementation === customImplementation)
        .map(account => account.address.addresses)
        .flat()
    
        setTbAccounts(newAccounts)
      }
    }, [tba_queryResponse.data]);

    const tbaNFTs = (accountAddress) => `
    {
      Accounts(
        input: {filter: {address: {_eq: "${accountAddress}"}, standard: {_eq: ERC6551}}, blockchain: polygon, limit: 50}
      ) {
        Account {
          address {
            addresses
          }
          nft {
            address
            tokenId
            contentValue{
              image{
                original
              }
            }
          }
        }
      }
    }
    `;
  
    // Use state to manage NFT data
    const [tbaNFTData, setTbaNFTData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
  
    // Fetch NFTs for the first account initially
    const [fetchTbaNFTs, tbaNFTsResponse] = useLazyQuery(tbaNFTs(tbAccounts[currentIndex]));
  
    useEffect(() => {
      if (tbAccounts.length > 0) {
        fetchTbaNFTs();
      }
    }, [tbAccounts, fetchTbaNFTs]);
  
    useEffect(() => {
      if (tbaNFTsResponse.data) {
        setTbaNFTData(prevData => [...prevData, tbaNFTsResponse.data]);
        
        // Move to next account
        if (currentIndex < tbAccounts.length - 1) {
          setCurrentIndex(prevIndex => prevIndex + 1);
        }
      }
    }, [tbaNFTsResponse.data, currentIndex, tbAccounts.length]);

    console.log(tbaNFTData)

    function TokenIdSetter(NewValue) {
      setTokenId(NewValue);
    }
    
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
