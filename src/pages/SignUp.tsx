import errorImage from "assets/img/error.png";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "services/api";
import { useAuthStorage } from "store/authStorage";
import { ErrorResponse } from "types/error-response.types";
import { User } from "types/user.types";

import {
  AppleIcon,
  ArrowIcon,
  FacebookIcon,
  GoogleIcon,
} from "components/@icons";
import Button from "components/Button";
import FormInput from "components/FormInput";
import IconButton from "components/IconButton";
import LogoButton from "components/LogoButton";
import MainContainer from "components/MainContainer";

const TOTAL_FORM_STEPS = 3;

type SignUpData = Omit<User, "isArtist" | "profilePicture" | "tokens">;

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const targetPath = location.state?.from ?? "/";
  const { setToken } = useAuthStorage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setError,
    reset,
    getValues,
  } = useForm<SignUpData>();

  const [formStep, setFormStep] = useState(1);
  const [signUpError, setSignUpError] = useState<ErrorResponse | null>(null);

  const handleNextFormStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      setFormStep((prev) => prev + 1);
    }
  };

  const handlePreviousFormStep = () => {
    setFormStep((prev) => prev - 1);
  };

  const onSubmit = async (data: SignUpData) => {
    if (data.password !== data.confirmPassword) {
      const currentValues = getValues();

      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });

      reset(
        {
          ...currentValues,
          password: "",
          confirmPassword: "",
        },
        { keepErrors: true }
      );

      return;
    }

    try {
      const userData = {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: data.password,
        isArtist: true,
      };

      const response = await authService.signup(userData);

      setToken(response.data.token);
      navigate(targetPath, { replace: true });
    } catch (error) {
      if (error instanceof AxiosError) {
        setSignUpError(error.response?.data);
      } else {
        setSignUpError({
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
    setSignUpError(null);
    const currentValues = getValues();
    const errorMessage = signUpError?.data?.message?.toLowerCase() || "";

    if (errorMessage.includes("email")) {
      setFormStep(2);
      reset(
        {
          ...currentValues,
          email: "",
        },
        { keepErrors: true }
      );
    } else if (errorMessage.includes("username")) {
      setFormStep(2);
      reset(
        {
          ...currentValues,
          username: "",
        },
        { keepErrors: true }
      );
    } else if (errorMessage.includes("password")) {
      setFormStep(3);
      reset(
        {
          ...currentValues,
          password: "",
          confirmPassword: "",
        },
        { keepErrors: true }
      );
    } else {
      setFormStep(1);
      reset();
    }
  };

  return (
    <MainContainer>
      {signUpError ? (
        <div className="min-h-dvh mx-8 flex flex-col justify-center items-center">
          <h2 className="font-title font-medium text-2xl text-center mb-8">
            {signUpError.data.message}
          </h2>
          <img className="w-1/2" src={errorImage} alt="Error Image" />
          <div className="flex flex-col items-center gap-4 mt-6">
            <span className="uppercase text-xs text-neutral-200 bg-secondary-800 px-2.5 py-1.5 rounded-md tracking-wide">
              {signUpError.status}_{signUpError.code}
            </span>
            {signUpError.data.details && (
              <p className="text-sm text-neutral-200 p-5 text-center bg-secondary-800 rounded-lg">
                {signUpError.data.details}
              </p>
            )}
          </div>
          <Button label="Try Again" type="button" onClick={handleErrorReset} />
        </div>
      ) : (
        <div className="min-h-dvh flex flex-col justify-between">
          <div className="h-12 grid grid-cols-[1fr_auto_1fr] mx-8 my-4">
            {formStep > 1 && (
              <IconButton
                icon={ArrowIcon}
                type="button"
                onClick={handlePreviousFormStep}
              />
            )}
            <h1 className="flex justify-center items-center font-title font-bold text-3xl col-start-2 tracking-wide pt-1">
              Sign up
            </h1>
          </div>
          <div className="mt-1.5 pt-8 pb-6 px-8 rounded-t-3xl bg-secondary-800">
            <h2 className="font-title font-bold text-2xl tracking-wide pb-2.5">
              Goodmorning! 👋
            </h2>
            <div className="h-2.5 flex items-center relative">
              <div className="h-3/4 absolute inset-x-0 bg-primary-500/20 rounded-full"></div>
              <div
                className="absolute inset-0 bg-primary-500 rounded-full transition-all duration-500 ease-in-out"
                style={{
                  width: `${(formStep / TOTAL_FORM_STEPS) * 100}%`,
                }}
              ></div>
            </div>
            <form className="pt-6">
              {formStep === 1 && (
                <div className="flex flex-col gap-4">
                  <FormInput
                    label="First name"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    register={register}
                    errors={errors}
                    validation={{ required: "First name is required" }}
                  />
                  <FormInput
                    label="Last name"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    register={register}
                    errors={errors}
                    validation={{ required: "Last name is required" }}
                  />
                </div>
              )}
              {formStep === 2 && (
                <div className="flex flex-col gap-4">
                  <FormInput
                    label="Username"
                    name="username"
                    type="text"
                    placeholder="john.doe"
                    register={register}
                    errors={errors}
                    validation={{ required: "Username is required" }}
                  />
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
                </div>
              )}
              {formStep === 3 && (
                <div className="flex flex-col gap-4">
                  <FormInput
                    label="Password"
                    name="password"
                    type="password"
                    placeholder="••••••••••"
                    register={register}
                    errors={errors}
                    validation={{ required: "Password is required" }}
                  />
                  <FormInput
                    label="Confirm password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••••"
                    register={register}
                    errors={errors}
                    validation={{ required: "Confirm password is required" }}
                  />
                </div>
              )}
              {formStep === 3 ? (
                <Button
                  label="Sign up"
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                />
              ) : (
                <Button
                  label="Next"
                  type="button"
                  onClick={handleNextFormStep}
                />
              )}
            </form>
            <div>
              <div className="flex items-center py-6">
                <div className="flex-1 h-px bg-neutral-300"></div>
                <span className="px-2 text-xs text-neutral-200">
                  or sign up with
                </span>
                <div className="flex-1 h-px bg-neutral-300"></div>
              </div>
              <div className="flex gap-2.5">
                <LogoButton icon={GoogleIcon} type="button" />
                <LogoButton icon={AppleIcon} type="button" />
                <LogoButton icon={FacebookIcon} type="button" />
              </div>
              <div className="flex justify-center pt-12">
                <Link to="/signin" className="text-neutral-50 opacity-75">
                  Already have an account?{" "}
                  <span className="font-bold text-primary-500 underline underline-offset-1.5">
                    Sign in!
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

export default SignUp;
