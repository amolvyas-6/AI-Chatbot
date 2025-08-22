import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import UserInput from "./components/UserInput.jsx";
import ChatArea from "./components/ChatArea.jsx";
import AppSidebar from "./components/AppSidebar.jsx";
import { useAuth } from "./hooks/useAuth.jsx";

function App() {
  const { currentChat } = useAuth();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div className="flex flex-col w-full h-screen py-4">
        <ChatArea />
        {currentChat && <UserInput />}
      </div>
    </SidebarProvider>
  );
}

export default App;
