import { Route, Routes } from "react-router-dom"
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage"
import BusDashboardPage from "./pages/BusDashboardPage"
import RouteDashboardPage from "./pages/RouteDashboardPage";
import Header from "./components/Header";
import { getAdminRefreshToken } from "./apiServices";
import BusDetailsPage from "./pages/BusDetailsPage";
import RouteDetailsPage from "./pages/RouteDetailsPage";
import NewRouteFormPage from "./pages/NewRouteFormPage";
import AnalyticsPage from "./pages/AnalyticsPage"

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      <div className='app__main'>
        {children}
      </div>
    </>
  )
}

function App() {
  const token = getAdminRefreshToken()

  return (
    <Routes>
      {<Route path="/" element={<Layout><AnalyticsPage /></Layout>} />}
      <Route path="/login" element={<LoginPage />} />
      
      <Route path="/bus/dashboard" element={<Layout><BusDashboardPage /></Layout>} />
      <Route path="/route/dashboard" element={<Layout><RouteDashboardPage /></Layout>} />
      <Route path="/analytics" element={<Layout> <AnalyticsPage/> </Layout>} />

      <Route path="/bus/:id" element={<Layout> <BusDetailsPage/> </Layout>} />
      <Route path="/route/:id" element={<Layout> <RouteDetailsPage/> </Layout>} />
      
      <Route path="/bus/route-form/:id" element={<Layout> <NewRouteFormPage/> </Layout>} />
    </Routes>
  )
}

export default App
