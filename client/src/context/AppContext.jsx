import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth, useUser } from "@clerk/clerk-react";

const AppContext = createContext();

const ContextProvider = ({ children }) => {
  const backend_url = import.meta.env.VITE_BACKEND_URL;
  const [searchFilter, setSearchFilter] = useState({ title: "", location: "" });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);
  const [recruiterToken, setRecruiterToken] = useState(null);
  const [recruiterData, setRecruiterData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [userApplications, setUserApplications] = useState([]);

  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchUserData = async () => {
    // console.log(user.id);
    try {
      const token = await getToken();

      const { data } = await axios.get(`${backend_url}/api/users/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(data);
      if (data.success) {
        // console.log(data);
        setUserData(data.user);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchUserApplications = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(
        `${backend_url}/api/users/applications`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        console.log(data.applications);
        setUserApplications(data.applications);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(`${backend_url}/api/company/company`, {
        headers: { token: recruiterToken },
      });
      if (data.success) {
        setRecruiterData(data.company);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const fetchJobs = async () => {
    try {
      const { data } = await axios.get(`${backend_url}/api/jobs`);
      if (data.success) {
        setJobs(data.allJobs);
        console.log(data.allJobs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchJobs();

    const companyToken = localStorage.getItem("companyItem");
    if (companyToken) {
      setRecruiterToken(companyToken);
    }
  }, []);

  useEffect(() => {
    if (recruiterToken) {
      fetchCompanyData();
    }
  }, [recruiterToken]);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchUserApplications();
    }
  }, [user]);

  let value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    recruiterData,
    recruiterToken,
    setRecruiterData,
    setRecruiterToken,
    backend_url,
    userData,
    setUserData,
    userApplications,
    setUserApplications,
    fetchUserData,
    fetchUserApplications,
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { ContextProvider, AppContext };
