import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@chainlink/hardhat-chainlink';

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.17',
  },
  networks: {
    hardhat: {
      forking: {
        url: 'https://frosty-few-surf.matic.quiknode.pro/995c8c0956bdbeee62ac02feed067e5bc55b9495/',
      },
      chainId: 137,
    },
  },
  mocha: {
    timeout: 100_000, // ethparis wifi is too slow
  },
};

export default config;
