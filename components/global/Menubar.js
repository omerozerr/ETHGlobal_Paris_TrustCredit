// components/Menubar.js
import Navbar from './Navbar';

const Menubar = ({ children }) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
};

export default Menubar;
