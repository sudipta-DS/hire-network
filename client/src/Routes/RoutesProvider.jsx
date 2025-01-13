import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import ApplyJob from "../pages/ApplyJob";
import Applications from "../pages/Applications";
import Dashboard from "../pages/Dashboard";
import Addjob from "../pages/Addjob";
import Managejobs from "../pages/Managejobs";
import ViewApplications from "../pages/ViewApplications";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const RoutesProvider = ({ children }) => {
  const { recruiterToken } = useContext(AppContext);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/apply-jobs/:id" element={<ApplyJob />} />
        <Route path="/dashboard" element={<Dashboard />}>
          {recruiterToken && (
            <>
              <Route path="add-job" element={<Addjob />} />
              <Route path="manage-jobs" element={<Managejobs />} />
              <Route path="view-applications" element={<ViewApplications />} />
            </>
          )}
        </Route>
      </Routes>
      {children}
    </BrowserRouter>
  );
};

export default RoutesProvider;
