import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
  useContractRead
} from 'wagmi';
import ABI from '@/BasemoABI';
import CreateAccount from './CreateAccount';
import { useState, useEffect } from 'react';
import { init, useQuery, useLazyQuery } from '@airstack/airstack-react';
init('ddfcc652b902475e99ee40f6db959ff9');
import styles from './id/IdBar.module.css';

const shortAddress = (address, characters = 4) => {
  return `${address.slice(0, characters + 2)}...${address.slice(-characters)}`;
};

const WalletComponent = ({ tokenId, TokenIdSetter }) => {
  const account = useAccount({
    onConnect({ address, connector, isReconnected }) {
      console.log('Connected', { address, connector, isReconnected });
    },
  });

  const ContractRead = useContractRead({
    address: '0xAccD4112dCC20B6a40068eC5DCC695e5cD8Ee87F',
    abi: ABI,
    functionName: 'balanceOf',
    args: [account.address],
    watch: false,
  });

  const { config } = usePrepareContractWrite({
    address: '0xAccD4112dCC20B6a40068eC5DCC695e5cD8Ee87F',
    abi: ABI,
    functionName: 'mint',
    chainId: 137,
  });

  const contractWrite = useContractWrite(config);

  const waitForTransaction = useWaitForTransaction({
    hash: contractWrite.data?.hash,
  });

  return (
    <div>
      {!account.address && <div> Connect your wallet</div>}
      {account.address && ContractRead.data ? (
        <div>You own an ID. Token ID: {tokenId}</div>
      ) : account.address ? (
        <button
          className={styles.buttonx}
          onClick={() => contractWrite.write?.()}
        >
          Mint the Social ID
        </button>
      ) : null}
      {contractWrite.isLoading && <div>Sign the Transaction</div>}
      {contractWrite.isSuccess && <div>Transaction sent</div>}
      {waitForTransaction.isSuccess && <div>Minted Successfully</div>}
      {account.address && shortAddress(account.address)}
      <br />
    </div>
  );
};

export default WalletComponent;
