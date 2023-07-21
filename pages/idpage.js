import styles from '../styles/Home.module.css';
import Menubar from '@/components/global/Menubar';
import StatBox from '@/components/statbox/StatBox';
import dynamic from 'next/dynamic';

const IdBar = dynamic(() => import('@/components/id/IdBar'), {
  ssr: false,
});

const Home = () => {
  return (
  <Menubar>
      <div className={styles.container}>
      <div className={styles.wrapper}>
          <IdBar />
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
