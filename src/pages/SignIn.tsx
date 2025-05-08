import errorImage from "assets/img/error.png";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "services/api";
import { useAuthStorage } from "store/authStorage";
import { ErrorResponse } from "types/error-response.types";
import { User } from "types/user.types";

import { AppleIcon, FacebookIcon, GoogleIcon } from "components/@icons";
import Button from "components/Button";
import FormInput from "components/FormInput";
import LogoButton from "components/LogoButton";

type SignInData = Pick<User, "email" | "password">;

const SignIn = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const targetPath = location.state?.from ?? "/";
  const { setToken } = useAuthStorage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInData>();

  const [signInError, setSignInError] = useState<ErrorResponse | null>(null);

  const onSubmit = async (data: SignInData) => {
    try {
      const response = await authService.login(data);
      setToken(response.data.token);
      navigate(targetPath, { replace: true });
    } catch (error) {
      if (error instanceof AxiosError) {
        setSignInError(error.response?.data);
      } else {
        setSignInError({
          code: 500,
          status: "error",
          data: {
            message: "Something went wrong... Please try again.",
          },
        });
      }
    }
  };

  const handleErrorReset = () => {
    setSignInError(null);
    reset();
  };

  if (signInError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary-900 px-4">
        <div className="w-full max-w-[650px] bg-secondary-800 p-8 rounded-2xl text-center">
          <h2 className="font-title font-medium text-2xl text-neutral-50 mb-4">
            {signInError.data.message}
          </h2>
          <img className="mx-auto w-1/2 mb-4" src={errorImage} alt="Error" />
          <div className="flex flex-col items-center gap-4 mt-6">
            <span className="uppercase text-xs text-neutral-200 bg-secondary-700 px-2.5 py-1.5 rounded-md tracking-wide">
              {signInError.status}_{signInError.code}
            </span>
            {signInError.data.details && (
              <p className="text-sm text-neutral-200 p-5 text-center bg-secondary-700 rounded-lg">
                {signInError.data.details}
              </p>
            )}
          </div>
          <div className="mt-6">
            <Button
              label="Try Again"
              type="button"
              onClick={handleErrorReset}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-900 px-4">
      <div className="w-full max-w-[650px] border-0 lg:border-4 lg:border-primary-500 rounded-2xl bg-secondary-800 p-8">
        <div className="flex justify-start items-center mb-6">
          <div className="w-6" /> {/* Placeholder for back button if needed */}
          <h1 className="font-title font-bold text-3xl lg:text-5xl tracking-wide text-neutral-50">
            Sign in
          </h1>
        </div>

        <h2 className="font-title font-bold text-xl lg:text-2xl tracking-wide pb-2.5 text-neutral-50">
          Welcome Back! 👋
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Email"
            name="email"
            type="email"
            placeholder="john.doe@outlook.com"
            register={register}
            errors={errors}
            validation={{
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            }}
            labelClassName="text-neutral-50"
            inputClassName="text-neutral-50"
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••••••"
            register={register}
            errors={errors}
            validation={{ required: "Password is required" }}
            labelClassName="text-neutral-50"
            inputClassName="text-neutral-50"
          />

          <div className="flex justify-end text-sm text-primary-500 underline">
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <Button
            label="Sign in"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          />
        </form>

        <div className="flex items-center py-6">
          <div className="flex-1 h-px bg-neutral-300"></div>
          <span className="px-2 text-xs text-neutral-200">or sign in with</span>
          <div className="flex-1 h-px bg-neutral-300"></div>
        </div>

        <div className="flex flex-col gap-3">
          <LogoButton
            icon={GoogleIcon}
            type="button"
            label="Sign in with Google"
          />
          <LogoButton
            icon={AppleIcon}
            type="button"
            label="Sign in with Apple"
          />
          <LogoButton
            icon={FacebookIcon}
            type="button"
            label="Sign in with Facebook"
          />
        </div>

        <div className="flex justify-center pt-12">
          <Link to="/signup" className="text-neutral-50 opacity-75 text-sm">
            Don't have an account?{" "}
            <span className="font-bold text-primary-500 underline underline-offset-1.5">
              Sign up!
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
