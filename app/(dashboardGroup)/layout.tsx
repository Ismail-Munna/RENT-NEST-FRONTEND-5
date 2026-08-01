import { Navbar } from "@/components/shared/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getMe } from "@/service/getMe";
import DashboardSidebar from "./_components/DashboardSidebar";

const DashboardLayout = async (
    {
        children
    } : {
        children: React.ReactNode
    }
) => {
   const user = await getMe();
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar user={user} />
      <SidebarProvider>
        <div className="flex flex-1">
          <DashboardSidebar user={user} />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout