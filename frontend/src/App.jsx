import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import UserInput from "./components/UserInput.jsx";
import ChatArea from "./components/ChatArea.jsx";
import AppSidebar from "./components/AppSidebar.jsx";

function App() {
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
      <SidebarTrigger />
      <div className="flex flex-col w-full h-screen">
        <ChatArea />
        <UserInput />
      </div>
    </SidebarProvider>
  );
}

export default App;
