import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function RegisterForm({ onRegister }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
      <div>
        <Label htmlFor="username" className="mb-3 block">
          Username
        </Label>
        <Input
          id="username"
          {...register("username", { required: "Username is required" })}
          placeholder="Username"
        />
        {errors.username && (
          <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="email" className="mb-3 block">
          Email
        </Label>
        <Input
          id="email"
          {...register("email", { required: "Email is required" })}
          placeholder="Email"
          type="email"
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="password" className="mb-3 block">
          Password
        </Label>
        <Input
          id="password"
          {...register("password", {
            required: "Password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          })}
          type="password"
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>
      <div>
        <Label htmlFor="avatar" className="mb-3 block">
          Avatar
        </Label>
        <Input
          id="avatar"
          {...register("avatar", {
            required: "Avatar is required",
            validate: {
              acceptedFormats: (files) =>
                ["image/jpeg", "image/png", "image/jpg"].includes(
                  files[0]?.type
                ) || "Only PNG, JPEG, and JPG formats are accepted",
            },
          })}
          type="file"
          accept="image/png, image/jpeg, image/jpg"
        />
        {errors.avatar && (
          <p className="text-red-500 text-xs mt-1">{errors.avatar.message}</p>
        )}
      </div>
      <Button type="submit">Register</Button>
    </form>
  );
}
