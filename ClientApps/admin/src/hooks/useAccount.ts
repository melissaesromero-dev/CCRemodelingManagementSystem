import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { LoginSchema } from "../lib/schemas/loginSchema";
import agent from "../lib/api/agent";
import { useLocation, useNavigate } from "react-router";
import { useState } from "react";
import axios from "axios";

export const useAccount = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const [loginError, setLoginError] = useState<string | null>(null);

  const loginUser = useMutation({
    mutationFn: async (creds: LoginSchema) => {
      //clear previous errors
      setLoginError(null);
      await agent.post("/login?useCookies=true", creds);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
    onError: async (error: unknown) => {
        if (axios.isAxiosError(error))
            {
                const status = error.response?.status;

                if(status === 401)
                    {
                        setLoginError("Login failed. Please check your email/username and password.")}
                else 
                    {
                        setLoginError("Something went wrong. Please try again.");
                    }
            } 
        else 
            {
                setLoginError("Something went wrong, please try again.");
            }
    },
    
});

  const logoutUser = useMutation({
    mutationFn: async () => {
      await agent.post("/account/logout");
    },
    onSuccess: async () => {
      queryClient.removeQueries({
        queryKey: ["user"],
      });
      queryClient.removeQueries({
        queryKey: ["quotes"],
      });
      queryClient.removeQueries({
        queryKey: ["serviceRequests"],
      });
      queryClient.removeQueries({
        queryKey: ["customers"],
      });
      queryClient.removeQueries({
        queryKey: ["estimateAppts"],
      });
      await navigate("/login");
    },
  });

  const { data: currentUser, isLoading: loadingUserInfo } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await agent.get<User>("/account/user-info");
      return response.data;
    },
    enabled: !queryClient.getQueryData(["user"])
             && location.pathname !== "/login"
             && location.pathname !== "/",
  });

  return {
    loginUser,
    currentUser,
    logoutUser,
    loadingUserInfo,
    loginError,
  };
};
