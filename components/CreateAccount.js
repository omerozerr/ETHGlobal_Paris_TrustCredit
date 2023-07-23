import { prepareWriteContract, writeContract } from '@wagmi/core';
import RegistryABI from '@/ERC6551RegistryABI';
import { init, useQuery, useLazyQuery } from '@airstack/airstack-react';
init('ddfcc652b902475e99ee40f6db959ff9');
import styles from './id/IdBar.module.css';

const CreateAccount = (props) => {
  const { tokenId } = props;

  async function Create6551Account() {
    console.log(tokenId);
    const config = await prepareWriteContract({
      address: '0x02101dfB77FDE026414827Fdc604ddAF224F0921',
      abi: RegistryABI,
      functionName: 'createAccount',
      chainId: 137,
      args: [
        '0x1538DB7bca51b886b9c3110e17cF64A7A6181DC1',
        137,
        '0xAccD4112dCC20B6a40068eC5DCC695e5cD8Ee87F',
        tokenId,
        0,
        '0x',
      ],
    });

    const { contractWrite } = await writeContract(config);
    console.log(contractWrite);
  }

  return (
    <div>
      <div onClick={Create6551Account}>
        Create Account
      </div>
    </div>
  );
};

export default CreateAccount;
