import NavBar from '../components/NavBar.jsx';

const DashboardLayout = ({ children }) => (
  <div className="dashboard-layout">
    <NavBar />
    <main className="dashboard-content">{children}</main>
  </div>
);

export default DashboardLayout;
