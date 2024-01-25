import PropTypes from 'prop-types';
import Header from '../components/header/header';
import Footer from '../components/footer/footer';
import './layout.css'; // Import your CSS file for styling

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Header />
      <div className="body-section">
        <main>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
