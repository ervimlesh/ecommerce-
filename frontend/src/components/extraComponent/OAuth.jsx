import { AiFillGoogleCircle } from "react-icons/ai";
import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";

import { useNavigate } from "react-router-dom";
import { app } from "../../firebase.js";
import toast from "react-hot-toast";
import { useAuth } from "../../context/Auth.jsx";

export default function OAuth() {
  const [auth, setAuth] = useAuth();
  

  const navigate = useNavigate();
  const authorize = getAuth(app);

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      const resultsFromGoogle = await signInWithPopup(authorize, provider);
      const res = await fetch("/api/v1/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFromGoogle.user.displayName,
          email: resultsFromGoogle.user.email,
          googlePhotoUrl: resultsFromGoogle.user.photoURL,
        }),
      });
      const data = await res.json();
      if (data) {
        setAuth({
          ...auth,
          user: data.name,
          token: data.token,
        });
        localStorage.setItem("auth", JSON.stringify(data));
      }

      console.log(data);
      if (res.ok) {
        toast.success("User Registered Successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button type="button" onClick={handleGoogleClick}>
      <AiFillGoogleCircle className="w-6" />
      Continue with Google
    </button>
  );
}
