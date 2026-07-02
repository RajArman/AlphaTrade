import { useEffect, useState } from "react";
import axios from "axios";
import Dashboard from "./Dashboard";
import TopBar from "./TopBar";
import Loading from "./Loading";

const Home = () => {
  const [isVerified, setIsVerified] = useState(null); // null = loading, true = verified, false = not verified

  useEffect(() => {
  const verifyUser = async () => {
    try {
      // get token from URL after login
      const params = new URLSearchParams(window.location.search);
      const urlToken = params.get("token");

      if (urlToken) {
        localStorage.setItem("token", urlToken);

        // remove token from URL after saving
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const token = urlToken || localStorage.getItem("token");

      const res = await axios.get("https://alpha-trade-iota.vercel.app/auth/me", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data && res.data.success) {
        console.log("User verified successfully");
        setIsVerified(true);
      } else {
        console.log("Verification failed - redirecting to login");
        setIsVerified(false);
      }
    } catch (err) {
      console.error("Error verifying user:", err);
      setIsVerified(false);
    }
  };

  verifyUser();
}, []);

  // Show loading while verifying
 if (isVerified === null) {
  return <Loading />;
}

  // Redirect if not verified
  if (isVerified === false) {
    window.location.href = "https://alpha-trade-6k67.vercel.app/login";
    return null;
  }

  return (
    <>
      <TopBar />
      <Dashboard />
    </>
  );
};

export default Home;
