import { useState } from "react";
import { useForm } from "react-hook-form";
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

type SignUpFormData = Omit<User, "isArtist" | "profilePicture" | "tokens">;

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    trigger,
  } = useForm<SignUpFormData>();

  const [formStep, setFormStep] = useState(1);

  const handleNextFormStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      setFormStep((prev) => prev + 1);
    }
  };

  const onSubmit = async (formData: SignUpFormData) => {
    if (formData.password !== formData.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    console.log("Form Submitted: ", formData);
    // API call to register user has to come here
  };

  return (
    <MainContainer>
      <div className="min-h-dvh flex flex-col justify-between">
        <div className="grid grid-cols-[1fr_auto_1fr] px-8 py-4">
          <IconButton icon={ArrowIcon} type="button" />
          <h1 className="flex justify-center items-center font-title font-bold text-3xl tracking-wide pt-1">
            Sign up
          </h1>
        </div>
        <div className="mt-1.5 pt-8 pb-6 px-8 rounded-t-3xl bg-secondary-800">
          <h2 className="font-title font-bold text-2xl tracking-wide pb-2.5">
            Goodmorning! 👋
          </h2>
          <div className="h-2.5 bg-primary-500/20 rounded-full"></div>
          <form className="pt-6">
            {formStep === 1 && (
              <div className="flex flex-col gap-4">
                <FormInput
                  label="First Name"
                  name="firstName"
                  type="text"
                  placeholder="John"
                  register={register}
                  errors={errors}
                  validation={{ required: "This field is required." }}
                />
                <FormInput
                  label="Last Name"
                  name="lastName"
                  type="text"
                  placeholder="Doe"
                  register={register}
                  errors={errors}
                  validation={{ required: "This field is required." }}
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
                  validation={{ required: "This field is required." }}
                />
                <FormInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="john.doe@outlook.com"
                  register={register}
                  errors={errors}
                  validation={{
                    required: "This field is required.",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
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
                  validation={{ required: "This field is required." }}
                />
                <FormInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="••••••••••"
                  register={register}
                  errors={errors}
                  validation={{ required: "This field is required." }}
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
              <Button label="Next" type="button" onClick={handleNextFormStep} />
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
              <a className="text-neutral-50 opacity-75" href="/login">
                Already have an account?{" "}
                <span className="font-bold text-primary-500 underline underline-offset-1.5">
                  Login!
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainContainer>
  );
};

export default SignUp;
