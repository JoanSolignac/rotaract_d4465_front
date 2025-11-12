import PanelNavbar from '../components/navigation/PanelNavbar.jsx';

const PanelLayout = ({ children }) => (
  <div className="app-shell app-shell--panel">
    <header className="app-shell__nav">
      <PanelNavbar />
    </header>
    <main className="app-shell__main app-shell__main--panel">{children}</main>
  </div>
);

export default PanelLayout;
