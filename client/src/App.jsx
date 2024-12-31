import { useContext } from "react";
import RoutesProvider from "./Routes/RoutesProvider";
import RecruiterLogin from "./components/RecruiterLogin";
import { AppContext } from "./context/AppContext";
import "quill/dist/quill.snow.css";

const App = () => {
  const { showRecruiterLogin } = useContext(AppContext);
  return (
    <RoutesProvider>
      {showRecruiterLogin ? <RecruiterLogin /> : <></>}
    </RoutesProvider>
  );
};

export default App;
