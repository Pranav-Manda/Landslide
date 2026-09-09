import {
  Activity,
  Bell,
  Brain,
  ChevronRight,
  CloudRain,
  Gauge,
  Map,
  MapPin,
  Mountain,
  Menu,
  ShieldAlert,
  SlidersHorizontal,
  TrendingUp,
  PlayCircle,
} from "lucide-react";

import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";

import RiskMap from "./components/map/RiskMap";

import LocationDetails from "./pages/LocationDetails";
import Simulation from "./pages/Simulation";
import DemoMode from "./pages/DemoMode";
import Sidebar from "./components/layout/Sidebar";
import AlertCenter from "./pages/AlertCenter";
import PublicWarning from "./pages/PublicWarning";
import Analytics from "./pages/Analytics";
import MonitoringStations from "./pages/MonitoringStations";
import RiskMapPage from "./pages/RiskMapPage";
import Weather from "./pages/Weather";
import Locations from "./pages/Locations";
import Settings from "./pages/Settings";



import { AppProvider, useAppStore } from "./store/appStore";


/* =========================================================
   DASHBOARD
========================================================= */

function Dashboard() {
  const { locations, alerts } = useAppStore();

  /* =======================================================
     ACTIVE ALERTS
  ======================================================= */

  const activeAlerts = alerts.filter(
    (alert) => alert.status === "ACTIVE"
  );


  /* =======================================================
     RISK CATEGORIES
  ======================================================= */

  const criticalLocations = locations.filter(
    (location) => location.risk.level === "CRITICAL"
  );

  const highRiskLocations = locations.filter(
    (location) => location.risk.level === "HIGH"
  );

  const moderateLocations = locations.filter(
    (location) => location.risk.level === "MODERATE"
  );

  const lowRiskLocations = locations.filter(
    (location) => location.risk.level === "LOW"
  );


  /* =======================================================
     TOTAL LOCATIONS
  ======================================================= */

  const totalLocations = locations.length;


  /* =======================================================
     HIGHEST RISK LOCATIONS
  ======================================================= */

  const highestRiskLocations = [...locations]
    .sort((a, b) => b.risk.score - a.risk.score)
    .slice(0, 5);


  /* =======================================================
     AVERAGE RISK
  ======================================================= */

  const averageRisk =
    locations.length > 0
      ? Math.round(
          locations.reduce(
            (total, location) =>
              total + location.risk.score,
            0
          ) / locations.length
        )
      : 0;


  return (
    <div className="app">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside className="sidebar">

        {/* LOGO */}

        <div className="logo">

          <div className="logo-icon">
            <Mountain size={20} />
          </div>

          <div>
            <h2>LANDWATCH</h2>

            <span>
              LANDSLIDE EARLY WARNING
            </span>
          </div>

        </div>
       


        {/* NAVIGATION */}

        <nav>

          <div className="nav-title">
            MONITORING
          </div>
        <Link to="/public-warning" className="nav-item">
  <ShieldAlert size={18} />
  <span>Public Warning</span>
</Link>

          <Link
            to="/"
            className="nav-item active"
          >
            <Gauge size={17} />
            Dashboard
          </Link>


          <Link
            to="/map"
            className="nav-item"
          >
            <Map size={17} />
            Risk Map
          </Link>


          <Link
            to="/locations"
            className="nav-item"
          >
            <MapPin size={17} />
            Locations
          </Link>


          <div className="nav-title">
            ANALYSIS
          </div>


          <Link
            to="/"
            className="nav-item"
          >
            <Brain size={17} />
            AI Analysis
          </Link>


          <Link
            to="/simulation"
            className="nav-item"
          >
            <Activity size={17} />
            Simulation Center
          </Link>
          <Link
            to="/demo"
            className="nav-item"
>
             <PlayCircle size={17} />
            Demo Mode
            </Link>


          <Link
            to="/analytics"
            className="nav-item"
          >
            <TrendingUp size={17} />
            Analytics
          </Link>


          <div className="nav-title">
            ALERTS
          </div>


          <Link
            to="/alerts"
            className="nav-item"
          >
            <Bell size={17} />
            Alert Center

            {activeAlerts.length > 0 && (
              <span className="nav-alert-count">
                {activeAlerts.length}
              </span>
            )}
          </Link>


          <Link
            to="/stations"
            className="nav-item"
          >
            <Activity size={17} />
            Monitoring Stations
          </Link>


          <Link
            to="/weather"
            className="nav-item"
          >
            <CloudRain size={18} />
            Weather & Rainfall
          </Link>


          <Link
            to="/settings"
            className="nav-item"
          >
            <SlidersHorizontal size={17} />
            Settings
          </Link>

        </nav>


        {/* SYSTEM STATUS */}

        <div className="system-status">

          <div className="status-dot" />

          <div>
            <strong>
              System Operational
            </strong>

            <span>
              Monitoring active
            </span>
          </div>

        </div>

      </aside>


      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <main className="main">

        {/* ===================================================
            TOP BAR
        =================================================== */}

        <div className="topbar">

          <div>

            <h1>
              Landslide Risk Dashboard
            </h1>

            <p>
              Northeast India Early Warning & Monitoring System
            </p>

          </div>


          <div className="topbar-right">

            <div className="live">
              <span />
              LIVE MONITORING
            </div>


            {/* NOTIFICATION BUTTON */}

            <Link
              to="/alerts"
              className="notification"
              style={{
                textDecoration: "none",
                position: "relative",
              }}
            >

              <Bell size={17} />

              {activeAlerts.length > 0 && (
                <span className="notification-badge">
                  {activeAlerts.length}
                </span>
              )}

            </Link>

          </div>

        </div>


        {/* ===================================================
            STAT CARDS
        =================================================== */}

        <div className="stats">

          {/* MONITORED LOCATIONS */}

          <div className="stat-card">

            <span>
              MONITORED LOCATIONS
            </span>

            <strong>
              {totalLocations}
            </strong>

            <small>
              Across Northeast India
            </small>

          </div>


          {/* CRITICAL RISK */}

          <div className="stat-card">

            <span>
              CRITICAL RISK
            </span>

            <strong className="critical-number">
              {criticalLocations.length}
            </strong>

            <small>
              Immediate attention required
            </small>

          </div>


          {/* HIGH RISK */}

          <div className="stat-card">

            <span>
              HIGH RISK
            </span>

            <strong>
              {highRiskLocations.length}
            </strong>

            <small>
              Enhanced monitoring required
            </small>

          </div>


          {/* AVERAGE RISK */}

          <div className="stat-card">

            <span>
              AVERAGE RISK
            </span>

            <strong>
              {averageRisk}
            </strong>

            <small>
              Current regional risk score
            </small>

          </div>

        </div>


        {/* ===================================================
            ACTIVE ALERT SUMMARY
        =================================================== */}

        {activeAlerts.length > 0 && (
          <Link
            to="/alerts"
            className="active-alert-banner"
            style={{
              textDecoration: "none",
            }}
          >

            <div className="active-alert-banner-icon">
              <Bell size={18} />
            </div>

            <div>
              <strong>
                {activeAlerts.length} Active Alert
                {activeAlerts.length !== 1 ? "s" : ""}
              </strong>

              <span>
                Immediate attention may be required at monitored
                locations
              </span>
            </div>

            <ChevronRight size={18} />

          </Link>
        )}


        {/* ===================================================
            MAP + RISK DISTRIBUTION
        =================================================== */}

        <div className="dashboard-grid">


          {/* =================================================
              MAP
          ================================================= */}

          <div className="panel">

            <div className="panel-header">

              <div>

                <h2>
                  Live Risk Map
                </h2>

                <p>
                  Current estimated landslide risk across
                  monitored locations
                </p>

              </div>


              <Link
                to="/map"
                className="panel-button"
              >
                View Full Map
              </Link>

            </div>


            <div className="real-map">

              <RiskMap />

            </div>

          </div>


          {/* =================================================
              RISK DISTRIBUTION
          ================================================= */}

          <div className="panel">

            <div className="panel-header">

              <div>

                <h2>
                  Risk Distribution
                </h2>

                <p>
                  Current location severity
                </p>

              </div>

            </div>


            <div className="risk-bars">


              {/* CRITICAL */}

              <div>

                <span>
                  Critical
                </span>

                <div className="bar">

                  <i
                    className="bar-critical"
                    style={{
                      width: `${
                        totalLocations
                          ? (
                              criticalLocations.length /
                              totalLocations
                            ) * 100
                          : 0
                      }%`,
                    }}
                  />

                </div>

                <b>
                  {criticalLocations.length}
                </b>

              </div>


              {/* HIGH */}

              <div>

                <span>
                  High
                </span>

                <div className="bar">

                  <i
                    className="bar-high"
                    style={{
                      width: `${
                        totalLocations
                          ? (
                              highRiskLocations.length /
                              totalLocations
                            ) * 100
                          : 0
                      }%`,
                    }}
                  />

                </div>

                <b>
                  {highRiskLocations.length}
                </b>

              </div>


              {/* MODERATE */}

              <div>

                <span>
                  Moderate
                </span>

                <div className="bar">

                  <i
                    className="bar-moderate"
                    style={{
                      width: `${
                        totalLocations
                          ? (
                              moderateLocations.length /
                              totalLocations
                            ) * 100
                          : 0
                      }%`,
                    }}
                  />

                </div>

                <b>
                  {moderateLocations.length}
                </b>

              </div>


              {/* LOW */}

              <div>

                <span>
                  Low
                </span>

                <div className="bar">

                  <i
                    className="bar-low"
                    style={{
                      width: `${
                        totalLocations
                          ? (
                              lowRiskLocations.length /
                              totalLocations
                            ) * 100
                          : 0
                      }%`,
                    }}
                  />

                </div>

                <b>
                  {lowRiskLocations.length}
                </b>

              </div>

            </div>

          </div>

        </div>


        {/* ===================================================
            BOTTOM GRID
        =================================================== */}

        <div className="bottom-grid">


          {/* =================================================
              HIGHEST RISK
          ================================================= */}

          <div className="panel">

            <div className="panel-header">

              <div>

                <h2>
                  Highest Risk Locations
                </h2>

                <p>
                  Locations requiring closest attention
                </p>

              </div>

            </div>


            {highestRiskLocations.map(
              (location) => (

                <Link
                  key={location.id}
                  to={`/location/${location.id}`}
                  className="alert"
                  style={{
                    textDecoration: "none",
                  }}
                >

                  <div
                    className={`alert-icon ${
                      location.risk.level === "CRITICAL"
                        ? "critical-bg"
                        : location.risk.level === "HIGH"
                        ? "high-bg"
                        : "moderate-bg"
                    }`}
                  >

                    <ShieldAlert size={17} />

                  </div>


                  <div
                    style={{
                      flex: 1,
                    }}
                  >

                    <strong>
                      {location.name}
                    </strong>

                    <p>
                      {location.state} • Risk Score{" "}
                      {location.risk.score}/100
                    </p>

                    <small>
                      Rainfall: {location.rainfall} mm
                    </small>

                  </div>


                  <ChevronRight
                    size={17}
                    style={{
                      alignSelf: "center",
                      color: "#70757b",
                    }}
                  />

                </Link>

              )
            )}

          </div>


          {/* =================================================
              AI SUMMARY
          ================================================= */}

          <div className="panel">

            <div className="panel-header">

              <div>

                <h2>
                  AI Risk Summary
                </h2>

                <p>
                  Automated regional assessment
                </p>

              </div>

              <Brain size={18} />

            </div>


            {/* RISK ASSESSMENT */}

            <div className="ai-summary">

              <Brain size={20} />

              <p>

                <strong>
                  Regional assessment:
                </strong>{" "}

                {criticalLocations.length > 0
                  ? `${criticalLocations.length} location${
                      criticalLocations.length > 1
                        ? "s are"
                        : " is"
                    } currently at critical risk. `
                  : "No locations are currently at critical risk. "}

                {highRiskLocations.length > 0
                  ? `${highRiskLocations.length} high-risk location${
                      highRiskLocations.length > 1
                        ? "s require"
                        : " requires"
                    } enhanced monitoring.`
                  : "Current conditions remain relatively stable across monitored locations."}

              </p>

            </div>


            {/* ENVIRONMENTAL FACTORS */}

            <div className="ai-summary">

              <CloudRain size={20} />

              <p>

                The current assessment considers
                rainfall, soil moisture, terrain
                slope and historical landslide
                susceptibility.

              </p>

            </div>


            {/* MONITORING STATUS */}

            <div className="ai-summary">

              <Activity size={20} />

              <p>

                <strong>
                  Monitoring status:
                </strong>{" "}

                Environmental risk indicators are
                being continuously evaluated in
                this prototype.

              </p>

            </div>


            {/* ACTIVE ALERT INFORMATION */}

            {activeAlerts.length > 0 && (
              <div className="ai-summary">

                <Bell size={20} />

                <p>

                  <strong>
                    Alert status:
                  </strong>{" "}

                  {activeAlerts.length} active warning
                  {activeAlerts.length !== 1 ? "s are" : " is"}
                  currently being tracked by the system.

                </p>

              </div>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}


/* =========================================================
   APPLICATION ROUTES
========================================================= */

export default function App() {
  return (
    <BrowserRouter>

      <AppProvider>

        <Routes>

          {/* DASHBOARD */}

          <Route
            path="/"
            element={<Dashboard />}
          />

            <Route path="/demo" element={<DemoMode />} />
          {/* LOCATION DETAILS */}

          <Route
            path="/location/:id"
            element={<LocationDetails />}
          />


          {/* SIMULATION */}

          <Route
            path="/simulation"
            element={<Simulation />}
          />


          {/* ALERT CENTER */}

          <Route
            path="/alerts"
            element={<AlertCenter />}
          />


          {/* ANALYTICS */}

          <Route
            path="/analytics"
            element={<Analytics />}
          />


          {/* MONITORING STATIONS */}

          <Route
            path="/stations"
            element={<MonitoringStations />}
          />


          {/* RISK MAP */}

          <Route
            path="/map"
            element={<RiskMapPage />}
          />


          {/* LOCATIONS */}

          <Route
            path="/locations"
            element={<Locations />}
          />


          {/* SETTINGS */}

          <Route
            path="/settings"
            element={<Settings />}
          />
          <Route path="/public-warning" element={<PublicWarning />} />


          {/* WEATHER */}

          <Route
            path="/weather"
            element={<Weather />}
          />

        </Routes>

      </AppProvider>

    </BrowserRouter>
  );
}