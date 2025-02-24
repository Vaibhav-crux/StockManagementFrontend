import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [apiError, setApiError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm();

  const fromRoute = location.state?.from || "/";

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const onSubmit = async (data) => {
    setApiError(null);
    try {
      const response = await axios.post(`${baseURL}/users/login`, data, {
        headers: { "Content-Type": "application/json" },
      });

      const { access_token } = response.data;

      if (access_token) {
        login(access_token);
        navigate(fromRoute, { replace: true });
      }
    } catch (error) {
      setApiError(
        error.response?.data?.message || "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email format",
                  },
                })}
                error={errors.email?.message}
                success={isSubmitted && !errors.email}
                variant="underline"
              />
            </div>
            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                error={errors.password?.message}
                success={isSubmitted && !errors.password} // Show success only after form submission
                variant="underline"
              />
            </div>
            <div className="text-sm font-semibold text-blue-600">
              <button type="button" onClick={() => navigate("/signup")}>
                Create an account
              </button>
            </div>
            {apiError && <p className="text-red-500 text-sm">{apiError}</p>}
            <div className="text-center">
              <button type="submit">Submit</button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
