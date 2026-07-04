import { AppProvider, useAppContext } from "./context/AppContext";
import TopNavbar from "./components/TopNavbar";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";

import Login from "./components/login";

import Products from "./components/Products";
import DashboardCRUD from "./components/DashboardCRUD";
import Profile from "./components/Profile";

function AppContent() {
  const { data, searchQuery, activeTopNav } = useAppContext();

  if (!data.profile) {
    return <Login />;
  }

  return (
    <div className="flex min-h-svh flex-col bg-slate-100">
      <TopNavbar />

      <div className="flex min-h-0 flex-1">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col px-8 pt-7 max-md:px-4 max-md:pt-5">
          {activeTopNav === "Trang chủ" && (
            <>
              <Header userName={data.profile?.fullname || data.userName} />
              <StatsCards stats={data.stats} />
              <MainContent
                chartData={data.chartData}
                activities={data.activities}
                searchQuery={searchQuery}
              />
            </>
          )}
          {activeTopNav === "Sản phẩm" && <Products />}
          {activeTopNav === "Bảng điều khiển" && <DashboardCRUD />}
          {activeTopNav === "Hồ sơ" && <Profile />}
          <Footer />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
