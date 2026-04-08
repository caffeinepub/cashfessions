import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const { identity, loginStatus, login, clear } = useInternetIdentity();

  const isAuthenticated = loginStatus === "success" && identity !== undefined;
  const isLoading = loginStatus === "initializing";

  return {
    identity,
    isAuthenticated,
    isLoading,
    loginStatus,
    login,
    logout: clear,
  };
}
