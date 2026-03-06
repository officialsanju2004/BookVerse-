import axios from 'axios';
import { GoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = () => {
  const API = "https://book-verse-snowy.vercel.app";
  const handleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${API}/api/auth/google`,
        { token: credentialResponse.credential }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Google Login Failed")}
    />
  );
};
