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

type LoginFormData = Pick<User, "email" | "password">;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (formData: LoginFormData) => {
    console.log("Form Submitted: ", formData);
    // API call to login user has to come here
  };

  return (
    <MainContainer>
      <div className="min-h-dvh flex flex-col justify-between">
        <div className="grid grid-cols-[1fr_auto_1fr] px-8 py-4">
          <IconButton icon={ArrowIcon} type="button" />
          <h1 className="flex justify-center items-center font-title font-bold text-3xl tracking-wide pt-1">
            Sign in
          </h1>
        </div>
        <div className="mt-1.5 pt-8 pb-6 px-8 rounded-t-3xl bg-secondary-800">
          <h2 className="font-title font-bold text-2xl tracking-wide pb-2.5">
            Welcome again! 👋
          </h2>
          <div className="h-2.5 bg-primary-500/20 rounded-full"></div>
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
                  required: "This field is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email address",
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
                validation={{ required: "This field is required." }}
              />
            </div>
            <Button
              label="Sign in"
              type="submit"
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
              <a className="text-neutral-50 opacity-75" href="/login">
                Don't have an account?{" "}
                <span className="font-bold text-primary-500 underline underline-offset-1.5">
                  Sign up!
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainContainer>
  );
};

export default Login;
