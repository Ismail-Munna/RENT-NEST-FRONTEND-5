import { Navbar } from "@/components/shared/navbar";
import { getMe } from "@/service/getMe";

const AuthGroupLayout = async (
    { children }: { children: React.ReactNode }) => {

         const user = await getMe();
  return <div>
    <Navbar user={user}/>
    {children}
  
  </div>;
};

export default AuthGroupLayout;
