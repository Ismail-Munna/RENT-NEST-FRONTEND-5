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
    <div className="w-full min-h-screen flex flex-col overflow-y-auto bg-slate-50 dark:bg-slate-950">
      <Navbar user={user} />
      <SidebarProvider className="w-full flex-1 min-w-0 min-h-0 block lg:flex">
        <div className="w-full flex flex-col lg:flex-row flex-1 min-w-0">
          <DashboardSidebar user={user} />
          <main className="w-full flex-1 min-w-0 block">{children}</main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout