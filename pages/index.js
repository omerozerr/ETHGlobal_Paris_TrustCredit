import Menubar from '../components/global/Menubar';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import LendBox from '@/components/lend/LendBox';
import BorrowBox from '@/components/borrow/BorrowBox';
import { useState } from 'react';

const Home = () => {
  const [isSupplied, setisSupplied] = useState(false);

  function SupplyStatusSetter(newValue) {
    setisSupplied(newValue);
  }
  return (
    // Then wrap your page's content with the Menubar component
    <Menubar>
      <div className={styles.container}>
        <Head>
          <title>TrustCredit</title>
          <meta
            content="Built by ODTU Blockchain for ETHGlobal Paris"
            name="description"
          />
          <link href="/favicon.ico" rel="icon" />
        </Head>

        <LendBox SupplyStatusSetter={SupplyStatusSetter} />
        <BorrowBox isSupplied={isSupplied} />

        <footer className={styles.footer}>
          <a
            href="https://linktr.ee/odtubc"
            rel="noopener noreferrer"
            target="_blank"
          >
            Made with ❤️ by ODTÜ Blockchain
          </a>
        </footer>
      </div>
    </Menubar>
  );
};

export default Home;
