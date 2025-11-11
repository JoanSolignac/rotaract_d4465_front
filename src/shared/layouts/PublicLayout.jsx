import PrimaryNavbar from '../components/navigation/PrimaryNavbar.jsx';
import SiteFooter from '../components/navigation/SiteFooter.jsx';

const PublicLayout = ({ children, navbarScrolled = false }) => (
  <div className="app-shell">
    <header className="app-shell__nav">
      <PrimaryNavbar isSolid={navbarScrolled} />
    </header>
    <main className="app-shell__main">{children}</main>
    <SiteFooter />
  </div>
);

export default PublicLayout;
