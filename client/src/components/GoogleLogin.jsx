import React, { useState } from "react";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/helpers/firebase";
import { RouteIndex } from "@/helpers/RouteName";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/user.slice";
import { apiFetch } from "@/helpers/api";
import { setCSRFToken } from "@/helpers/csrf";

const GoogleLogin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const googleResponse = await signInWithPopup(auth, provider);
      const user = googleResponse.user;
      const bodyData = {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      };
      const response = await apiFetch(
        `${getEnv("VITE_API_BASE_URL")}/auth/google-login`,
        {
          method: "POST",
          body: JSON.stringify(bodyData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        return showToast("error", data.message);
      }

      // Store CSRF token if provided
      if (data.csrfToken) {
        setCSRFToken(data.csrfToken);
      }

      dispatch(setUser(data.user));
      navigate(RouteIndex);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full h-12 bg-muted/30 border-border hover:bg-muted/50 font-medium transition-all duration-300"
      onClick={handleLogin}
      disabled={isLoading}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-muted-foreground/30 border-t-muted-foreground rounded-full animate-spin" />
      ) : (
        <>
          <FcGoogle className="w-5 h-5 mr-2" />
          Continue with Google
        </>
      )}
    </Button>
  );
};

export default GoogleLogin;
