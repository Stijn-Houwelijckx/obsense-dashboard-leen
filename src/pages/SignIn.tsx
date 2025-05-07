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
import MainContainer from "components/MainContainer";

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

  return (
    <MainContainer>
      {signInError ? (
        <div className="min-h-dvh mx-8 flex flex-col justify-center items-center">
          <h2 className="font-title font-medium text-2xl text-center mb-8">
            {signInError.data.message}
          </h2>
          <img className="w-1/2" src={errorImage} alt="Error Image" />
          <div className="flex flex-col items-center gap-4 mt-6">
            <span className="uppercase text-xs text-neutral-200 bg-secondary-800 px-2.5 py-1.5 rounded-md tracking-wide">
              {signInError.status}_{signInError.code}
            </span>
            {signInError.data.details && (
              <p className="text-sm text-neutral-200 p-5 text-center bg-secondary-800 rounded-lg">
                {signInError.data.details}
              </p>
            )}
          </div>
          <Button label="Try Again" type="button" onClick={handleErrorReset} />
        </div>
      ) : (
        <div className="min-h-dvh flex flex-col justify-between">
          <div className="h-12 grid grid-cols-[1fr_auto_1fr] mx-8 my-4">
            <h1 className="flex justify-center items-center font-title font-bold text-3xl col-start-2 tracking-wide pt-1">
              Sign in
            </h1>
          </div>
          <div className="mt-1.5 pt-8 pb-6 px-8 rounded-t-3xl bg-secondary-800">
            <h2 className="font-title font-bold text-2xl tracking-wide pb-2.5">
              Welcome again! 👋
            </h2>
            <div className="h-2.5 flex items-center relative">
              <div className="h-3/4 absolute inset-x-0 bg-primary-500/20 rounded-full"></div>
              <div className="absolute inset-0 bg-primary-500 rounded-full transition-all duration-500 ease-in-out"></div>
            </div>
            <form className="pt-6">
              <div className="flex flex-col gap-4">
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
                      message: "This email is invalid",
                    },
                  }}
                />
                <FormInput
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="••••••••••••"
                  register={register}
                  errors={errors}
                  validation={{ required: "Password is required" }}
                />
              </div>
              <Button
                label="Sign in"
                type="button"
                onClick={handleSubmit(onSubmit)}
              />
            </form>
            <div>
              <div className="flex items-center py-6">
                <div className="flex-1 h-px bg-neutral-300"></div>
                <span className="px-2 text-xs text-neutral-200">
                  or sign in with
                </span>
                <div className="flex-1 h-px bg-neutral-300"></div>
              </div>
              <div className="flex gap-2.5">
                <LogoButton icon={GoogleIcon} type="button" />
                <LogoButton icon={AppleIcon} type="button" />
                <LogoButton icon={FacebookIcon} type="button" />
              </div>
              <div className="flex justify-center pt-12">
                <Link to="/signup" className="text-neutral-50 opacity-75">
                  Don't have an account?{" "}
                  <span className="font-bold text-primary-500 underline underline-offset-1.5">
                    Sign up!
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </MainContainer>
  );
};

export default SignIn;
