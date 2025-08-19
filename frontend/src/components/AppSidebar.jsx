import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Button } from "@/components/ui/button";
import Chat from "@/components/Chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  UserCircleIcon,
  MenuIcon,
  LogOut,
  ArrowRightIcon,
  PlusIcon,
} from "lucide-react";

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 border-b-2 border-b-accent">
        <div className="flex justify-evenly">
          <img
            src="https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/svg/arch-linux.svg"
            alt="Logo"
            className="w-12 h-12 object-cover rounded-md"
          />
          <div>
            <p className="text-lg font-semibold">Generic AI</p>
            <p className="text-sm text-muted-foreground">Made By Amol Vyas</p>
          </div>
        </div>
        <div>
          <Button variant="outline" className="w-full mt-4">
            <PlusIcon className="w-4 h-4" /> <span>New Chat</span>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <p className="text-muted-foreground text-sm">Chat History:</p>
      </SidebarContent>
      <SidebarFooter className="px-8 py-4 border-t-2 border-t-accent">
        <div className="flex justify-between">
          <div className="flex items-center">
            <Avatar className="rounded-md w-9 h-9 ">
              <AvatarImage
                className="object-cover"
                src="https://cdn.prod.website-files.com/62d84e447b4f9e7263d31e94/6399a4d27711a5ad2c9bf5cd_ben-sweet-2LowviVHZ-E-unsplash-1.jpeg"
              />
              <AvatarFallback>AV</AvatarFallback>
            </Avatar>
            <div className="ml-4 font-medium text-sm">
              <p>User Name</p>
              <p className="text-muted-foreground">Email</p>
            </div>
          </div>
          <Popover>
            <PopoverTrigger className="hover:cursor-pointer hover:bg-accent p-2 rounded-md">
              <MenuIcon />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col justify-between w-auto min-w-[200px] px-3 py-4">
              <div className="flex items-center hover:bg-accent p-2 hover:cursor-pointer rounded-md">
                <div className="flex items-center">
                  <UserCircleIcon />
                  <p className="text-sm mx-4">Profile</p>
                </div>
                <Button variant="inactive" className="absolute right-3">
                  <ArrowRightIcon />
                </Button>
              </div>
              <div className="flex items-center hover:bg-accent p-2 hover:cursor-pointer rounded-md">
                <div className="flex justify-between">
                  <LogOut className="text-red-500" />
                  <p className="text-sm mx-4">Logout</p>
                </div>
                <Button variant="inactive" className="absolute right-3 ">
                  <ArrowRightIcon />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
