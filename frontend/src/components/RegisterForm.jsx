import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { register: registerUser } = useAuth();

  // Function to run when the form is submitted
  const onRegister = async (data) => {
    try {
      const formData = new FormData();
      formData.append("username", data.username);
      formData.append("email", data.email);
      formData.append("password", data.password);
      // Append the file. data.avatar will be a FileList, so take the first file.
      if (data.avatar && data.avatar[0]) {
        formData.append("avatar", data.avatar[0]);
      }
      await registerUser(formData);
      console.log("Registration successful");
    } catch (error) {
      console.error("Registration failed:", error);
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

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
