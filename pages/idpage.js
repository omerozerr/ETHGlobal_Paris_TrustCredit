import styles from '../styles/Home.module.css';
import Menubar from '@/components/global/Menubar';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { init, useLazyQuery } from '@airstack/airstack-react';
import { useAccount,   useContractRead } from 'wagmi';
import ABI from '@/BasemoABI';
import ScoreBox from '@/components/score/ScoreBox';
import ScoreBoxProfile from '@/components/score/ScoreBoxProfile';
init('ddfcc652b902475e99ee40f6db959ff9');

const IdBar = dynamic(() => import('@/components/id/IdBar'), {
  ssr: false,
});

const ConnectAcc = dynamic(() => import('@/components/connect/ConnectAcc'), {
  ssr: false,
});

const MintId = dynamic(() => import('@/components/connect/MintId'), {
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

  const [tbAccounts, setTbAccounts] = useState([])
  const [tokenId, setTokenId] = useState(null);
  const [tbAccNFTs, setTbAccNFTs] = useState([])
  const [isMounted, setIsMounted] = useState(false);

  const query = `query MyQuery {
    TokenBalances(
      input: {filter: {owner: {_eq: "${account.address}"}, 
      tokenAddress: {_eq: "0xAccD4112dCC20B6a40068eC5DCC695e5cD8Ee87F"}}, 
      blockchain: polygon}
    ) {
      TokenBalance {
        tokenNfts {
          tokenId
        }
      }
    }
  }`;
  const [fetch, queryResponse] = useLazyQuery(query);

  useEffect(() => {
    console.log(account.address);
    console.log(ContractRead.data);
    if (account.address && ContractRead.data) {
      console.log('fetching');
      fetch();
    }
  }, [account.address]);

  useEffect(() => {
    console.log('sad');
    if (queryResponse.data) {
      let tokenID =
        queryResponse.data.TokenBalances.TokenBalance[0].tokenNfts.tokenId;
      console.log(tokenID);
      TokenIdSetter(tokenID);
    }
  }, [queryResponse.data]);

  const ContractRead = useContractRead({
    address: '0xAccD4112dCC20B6a40068eC5DCC695e5cD8Ee87F',
    abi: ABI,
    functionName: 'balanceOf',
    args: [account.address],
    watch: false,
  });

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

    const [fetch_tba, tba_queryResponse] = useLazyQuery(tba)
  
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
            metaData {
              image
            }
          }
        }
      }
    }
    `;

    const [fetch_tbaNFTs, tbaNFTs_queryResponse] = useLazyQuery(tbaNFTs)

  useEffect(() => {
    setIsMounted(true);
  }, []);


  useEffect(() => {
    if(tbAccounts.length > 0) { 
      fetch_tbaNFTs();
    }
  }, [tbAccounts]);
  
  useEffect(() => {
    if(tbaNFTs_queryResponse.data && tbaNFTs_queryResponse.data.TokenBalances && tbaNFTs_queryResponse.data.TokenBalances.TokenBalance) {
      setTbAccNFTs(tbaNFTs_queryResponse.data.TokenBalances.TokenBalance)
    }
  }, [tbaNFTs_queryResponse.data]);

  if (tbaNFTs_queryResponse.data && tbaNFTs_queryResponse.data.TokenBalances) {
    console.log(tbaNFTs_queryResponse.data.TokenBalances.TokenBalance)
}

  function TokenIdSetter(NewValue) {
    setTokenId(NewValue);
  }

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


    console.log(tokenId)
    
  return (
  <Menubar>
      <div className={styles.container}>
      {isMounted && (
            <>
              {account.address ? (
                tokenId ? (
                <div className={styles.box}>
                  <div className={styles.highlightF}></div>
                  <div className={styles.highlightS}></div>
                  <ScoreBoxProfile tokenId={tokenId} tbAccounts={tbAccounts} />
                  <IdBar
                    tokenBalances={tbaNFTs_queryResponse?.data?.TokenBalances?.TokenBalance}
                  />
                  <div className={styles.highlightT}></div>
                </div>
                ) : (
                <div className={styles.accContainer}>
                  <div className={styles.highlightF}></div>
                  <div className={styles.highlightS}></div>
                  <MintId tokenId={tokenId} />
                  <div className={styles.highlightT}></div>
                </div>
                )
              ) : (
                <div className={styles.accContainer}>
                <div className={styles.highlightF}></div>
                <div className={styles.highlightS}></div>
                <ConnectAcc />
                <div className={styles.highlightT}></div>
              </div>
              )}
            </>
          )}
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
