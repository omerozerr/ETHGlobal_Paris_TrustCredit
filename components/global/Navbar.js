import { Web3Button } from '@web3modal/react'
import Link from 'next/link';
import styles from './Navbar.module.css';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Image src="/3credits.svg"
              width={100}
              height={75}
        alt="Logo" />
        <Image src="/TrustCredit.svg"
              width={100}
              height={75}
        alt="Logo" />
      </div>
      <div className={styles.menu}>
        <Link className={styles.card} href="/">
          Markets
        </Link>
        <Link className={styles.card} href="/idpage">
            My Profile
          </Link>
      </div>
      <div className={styles.wallet}>
        <Web3Button 
        themeVariables={{
          '--w3m-background-color': "red" }}   />
      </div>
    </nav>
  );
};

export default Navbar;
