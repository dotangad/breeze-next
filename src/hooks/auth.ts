import useSWR from "swr";
import axios from "@/lib/axios";
import { useEffect } from "react";
import { useRouter } from "next/router";

export const useAuth = ({
  middleware,
  redirectIfAuthenticated,
}: {
  middleware: string;
  redirectIfAuthenticated: string;
}) => {
  const router = useRouter();

  const {
    data: user,
    error,
    mutate,
  } = useSWR("/api/user", () =>
    axios
      .get("/api/user")
      .then(res => res.data)
      .catch(error => {
        if (error.response.status !== 409) throw error;

        router.push("/verify-email");
      }),
  );

  const csrf = () => axios.get("/sanctum/csrf-cookie");

  // @ts-ignore
  const register = async ({ setErrors, ...props }) => {
    await csrf();

    typeof setErrors === "function" && setErrors([]);

    axios
      .post("/register", props)
      .then(() => mutate())
      .catch(error => {
        if (error.response.status !== 422) throw error;

        typeof setErrors === "function" &&
          setErrors(error.response.data.errors);
      });
  };

  // @ts-ignore
  const login = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    typeof setErrors === "function" && setErrors([]);
    typeof setStatus === "function" && setStatus(null);

    axios
      .post("/login", props)
      .then(() => mutate())
      .catch(error => {
        if (error.response.status !== 422) throw error;

        typeof setErrors === "function" &&
          setErrors(error.response.data.errors);
      });
  };

  // @ts-ignore
  const forgotPassword = async ({ setErrors, setStatus, email }) => {
    await csrf();

    typeof setErrors === "function" && setErrors([]);
    typeof setStatus === "function" && setStatus(null);

    axios
      .post("/forgot-password", { email })
      .then(response => setStatus(response.data.status))
      .catch(error => {
        if (error.response.status !== 422) throw error;

        typeof setErrors === "function" &&
          setErrors(error.response.data.errors);
      });
  };

  // @ts-ignore
  const resetPassword = async ({ setErrors, setStatus, ...props }) => {
    await csrf();

    setErrors([]);
    setStatus(null);
    typeof setErrors === "function" && setErrors([]);
    typeof setStatus === "function" && setStatus(null);

    axios
      .post("/reset-password", { token: router.query.token, ...props })
      .then(response =>
        router.push("/login?reset=" + btoa(response.data.status)),
      )
      .catch(error => {
        if (error.response.status !== 422) throw error;

        typeof setErrors === "function" &&
          setErrors(error.response.data.errors);
      });
  };

  // @ts-ignore
  const resendEmailVerification = ({ setStatus }) => {
    axios
      .post("/email/verification-notification")
      .then(
        response =>
          typeof setStatus === "function" && setStatus(response.data.status),
      );
  };

  const logout = async () => {
    if (!error) {
      await axios.post("/logout").then(() => mutate());
    }

    window.location.pathname = "/login";
  };

  useEffect(() => {
    if (middleware === "guest" && redirectIfAuthenticated && user)
      router.push(redirectIfAuthenticated);
    if (window.location.pathname === "/verify-email" && user?.email_verified_at)
      router.push(redirectIfAuthenticated);
    if (middleware === "auth" && error) logout();
  }, [user, error]);

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  };
};
