import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";

export default function LoginForm({ onLoginSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { login } = useAuth();

  const onLogin = async (data) => {
    login(data);
  };

  return (
    <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
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
        <Label htmlFor="password" className="mb-3 block">
          Password
        </Label>
        <Input
          id="password"
          {...register("password", { required: "Password is required" })}
          type="password"
          placeholder="Password"
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit">Login</Button>
    </form>
  );
}
