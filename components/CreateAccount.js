import { prepareWriteContract, writeContract } from '@wagmi/core';
import RegistryABI from '@/ERC6551RegistryABI';
import { init, useQuery, useLazyQuery } from '@airstack/airstack-react';
init('ddfcc652b902475e99ee40f6db959ff9');
import styles from './id/IdBar.module.css';

const CreateAccount = (props) => {
  const { tokenId } = props;
  /*const query = `query {
    Accounts(
      input: {filter: {tokenAddress: {_in: "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"}}, blockchain: ethereum, limit: 200}
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
      }
    }
  }`;
  const queryResponse = useQuery(query);
  console.log(queryResponse.data);*/

  async function Create6551Account() {
    console.log(tokenId);
    const config = await prepareWriteContract({
      address: '0x02101dfB77FDE026414827Fdc604ddAF224F0921',
      abi: RegistryABI,
      functionName: 'createAccount',
      chainId: 137,
      args: [
        '0x4C748B52B130106D49978ad937C0f65BC8bd5a86',
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
      <div> Create 6551 Account For Your ID</div>
      <button className={styles.buttonx} onClick={Create6551Account}>
        Create Account
      </button>
    </div>
  );
};

export default CreateAccount;
