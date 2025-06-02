import errorImage from "assets/img/error.png";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "services/api";
import { useAuthStorage } from "store/authStorage";
import { ErrorResponse } from "types/error-response.types";
import { User } from "types/user.types";
import api from "../services/api";

import { AppleIcon, FacebookIcon, GoogleIcon } from "components/@icons";
import Button from "components/Button";
import FormInput from "components/FormInput";
import LogoButton from "components/LogoButton";
import IconButton from "components/IconButton";
import MainContainer from "components/MainContainer";

const TOTAL_FORM_STEPS = 3;

type SignUpData = Omit<User, "isArtist" | "profilePicture" | "tokens">;

const SignUp = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const targetPath = "/";
  const { setToken, setUser } = useAuthStorage();

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
      console.log("Signup response:", response);

      const token = response.data.token;
      if (!token) {
        throw new Error("Token ontbreekt in response!");
      }

      setToken(token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const currentUserResponse = await authService.getCurrentUser();
      setUser(response.data.user?.user ?? response.data.user);

      navigate(targetPath, { replace: true });
    } catch (error) {
      if (error instanceof AxiosError) {
        const message = error.response?.data?.message?.toLowerCase() || "";

        // Inject veldspecifieke foutmelding
        if (message.includes("email")) {
          setFormStep(2);
          setError("email", {
            type: "manual",
            message: "This email is already taken",
          });
        } else if (message.includes("username")) {
          setFormStep(2);
          setError("username", {
            type: "manual",
            message: "This username is already taken",
          });
        } else if (message.includes("password")) {
          setFormStep(3);
          setError("password", {
            type: "manual",
            message: "Your password is invalid",
          });
        } else {
          setFormStep(1);
          setError("firstName", {
            type: "manual",
            message: "Something went wrong. Please try again.",
          });
        }
      } else {
        // Fallback
        setFormStep(1);
        setError("firstName", {
          type: "manual",
          message: "Unexpected error. Please try again.",
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
      reset({ ...currentValues, email: "" }, { keepErrors: true });
    } else if (errorMessage.includes("username")) {
      setFormStep(2);
      reset({ ...currentValues, username: "" }, { keepErrors: true });
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
      <div className="min-h-screen flex items-center justify-center bg-secondary-900 px-4 relative overflow-hidden">
        <div className="hidden lg:block absolute top-0 left-0 w-1/2 h-full bg-[#2B2B30] z-0" />

        <div className="relative z-10 w-full flex justify-center items-center">
          <div className="hidden lg:block absolute top-0 left-0 w-1/2 h-full bg-[#2B2B30] z-0">
            <img
              src="src/assets/img/circle_small.png"
              alt="Circle Small"
              className="absolute top-4 left-[-90px] w-64 h-64 z-10"
            />
          </div>

          <div className="w-full max-w-[650px] border-0 lg:border-4 lg:border-primary-500 rounded-2xl bg-secondary-800 p-8 relative">
            <img
              src="src/assets/img/circle_big.png"
              alt="Circle Big"
              className="absolute bottom-4 right-[-550px] w-80 h-80 z-10"
            />

            <div className="flex justify-start items-center mb-6">
              <div className="w-6" />{" "}
            </div>

            <div className="hidden lg:flex flex-row items-center justify-between mb-6">
              <h2 className="font-title text-2xl text-neutral-50">
                Welcome to OBSENSE!
              </h2>
              <Link
                to="/signin"
                className="text-neutral-50 opacity-75 text-sm text-right"
              >
                <div className="flex flex-col items-end">
                  <span>Already have an account?</span>
                  <span className="font-bold text-primary-500 underline underline-offset-1.5">
                    Sign in!
                  </span>
                </div>
              </Link>
            </div>

            <h1 className="font-title font-bold text-3xl lg:text-5xl tracking-wide text-neutral-50 mb-2">
              Sign up
            </h1>

            <h2 className="font-title text-xl lg:hidden tracking-wide pb-2.5 text-neutral-50">
              Welcome to OBSENSE!
            </h2>

            <form className="space-y-4">
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
                    labelClassName="text-neutral-50"
                    inputClassName="text-neutral-50"
                  />
                  <FormInput
                    label="Last name"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    register={register}
                    errors={errors}
                    validation={{ required: "Last name is required" }}
                    labelClassName="text-neutral-50"
                    inputClassName="text-neutral-50"
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
                    labelClassName="text-neutral-50"
                    inputClassName="text-neutral-50"
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
                    labelClassName="text-neutral-50"
                    inputClassName="text-neutral-50"
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
                    labelClassName="text-neutral-50"
                    inputClassName="text-neutral-50"
                  />
                  <FormInput
                    label="Confirm password"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••••"
                    register={register}
                    errors={errors}
                    validation={{
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === getValues("password") ||
                        "Passwords do not match",
                    }}
                    labelClassName="text-neutral-50"
                    inputClassName="text-neutral-50"
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

            <div className="flex justify-center pt-12 lg:hidden">
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
    </MainContainer>
  );
};

export default SignUp;
