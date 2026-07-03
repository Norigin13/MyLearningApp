import { AppProvider, useAppContext } from "./context/AppContext";
import TopNavbar from "./components/TopNavbar";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import MainContent from "./components/MainContent";
import Footer from "./components/Footer";

function AppContent() {
  const { data, searchQuery, handleSearch, handleNew } = useAppContext();

  return (
    <div className="flex min-h-svh flex-col bg-slate-100">
      <TopNavbar />

      <div className="flex min-h-0 flex-1">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col px-8 pt-7 max-md:px-4 max-md:pt-5">
          <Header
            userName={data.userName}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            onNew={handleNew}
          />
          <StatsCards stats={data.stats} />
          <MainContent
            chartData={data.chartData}
            activities={data.activities}
            searchQuery={searchQuery}
          />
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
