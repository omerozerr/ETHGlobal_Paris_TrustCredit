import { ConnectButton } from '@rainbow-me/rainbowkit';
import Link from 'next/link';
import styles from './Navbar.module.css';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>
        <Image src="/logo.png"
              width={100}
              height={75}
        alt="Logo" />
      </div>
      <div className={styles.menu}>
        <Link className={styles.card} href="/">
          Markets
        </Link>
        <Link className={styles.card} href="/idpage">
            ID page
          </Link>
        <Link className={styles.card} href="/contact">
          github
        </Link>
      </div>
      <div className={styles.wallet}>
        <ConnectButton />
      </div>
    </nav>
  );
};

export default Navbar;
