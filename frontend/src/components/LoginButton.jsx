import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import LoginForm from "@/components/LoginForm.jsx";
import RegisterForm from "@/components/RegisterForm";

export default function LoginButton() {
  const [open, setOpen] = useState(false);

  const handleLoginSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"default"} className="w-full">
          Log In
        </Button>
      </DialogTrigger>
      <DialogTitle></DialogTitle>
      <DialogContent className="translate-y-0 top-[30%]">
        <Tabs>
          <div className="flex justify-center items-center mb-4">
            <TabsList>
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
              <TabsTrigger value="oauth">OAuth</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="login">
            <LoginForm onLoginSuccess={handleLoginSuccess} />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
