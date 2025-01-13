import { useContext } from "react";
import RoutesProvider from "./Routes/RoutesProvider";
import RecruiterLogin from "./components/RecruiterLogin";
import { AppContext } from "./context/AppContext";
import { ToastContainer } from "react-toastify";
import "quill/dist/quill.snow.css";

const App = () => {
  const { showRecruiterLogin } = useContext(AppContext);
  return (
    <RoutesProvider>
      <ToastContainer />
      {showRecruiterLogin ? <RecruiterLogin /> : <></>}
    </RoutesProvider>
  );
};

export default App;
