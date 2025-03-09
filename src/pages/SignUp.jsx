import { useForm } from "react-hook-form";
import FormInput from "../components/FormInput";
import MainContainer from "../components/MainContainer";
import Button from "../components/Button";
import IconButton from "../components/IconButton";
import LogoButton from "../components/LogoButton";
import {
  ArrowIcon,
  GoogleIcon,
  AppleIcon,
  FacebookIcon,
} from "../components/@icons";

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      console.log(data);
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords do not match",
      });
      return;
    }
    console.log("Form Submitted: ", data);
    // API call to register user
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
        <div className="pt-8 pb-6 px-8 rounded-t-3xl bg-secondary-800">
          <h2 className="font-title font-bold text-2xl tracking-wide pb-2.5">
            Goodmorning! 👋
          </h2>
          <div className="h-2.5 bg-primary-500/20 rounded-full"></div>
          <form className="pt-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-4">
              <FormInput
                label="First Name"
                name="firstname"
                type="text"
                placeholder="John"
                register={register}
                errors={errors}
                validation={{ required: "Firstname is required" }}
              />
              <FormInput
                label="Last Name"
                name="lastname"
                type="text"
                placeholder="Doe"
                register={register}
                errors={errors}
                validation={{ required: "Lastname is required" }}
              />
            </div>
            <div style={{ display: "none" }}>
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
                    message: "Invalid email address",
                  },
                }}
              />
            </div>
            <div style={{ display: "none" }}>
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
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                placeholder="••••••••••"
                register={register}
                errors={errors}
                validation={{
                  required: "Confirm Password is required",
                }}
              />
            </div>
            <Button label="Sign up" type="submit" />
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
              <a className="text-neutral-50" href="/login">
                Have you been here before? <span className="font-bold text-primary-500 underline underline-offset-1.5">Login!</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </MainContainer>
  );
}
