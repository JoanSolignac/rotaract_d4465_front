import NavBar from '../components/NavBar.jsx';

const PublicLayout = ({ children, navbarScrolled = false }) => (
  <div className="app">
    <div className={navbarScrolled ? 'navbar scrolled' : 'navbar'}>
      <NavBar />
    </div>
    {children}
  </div>
);

export default PublicLayout;
