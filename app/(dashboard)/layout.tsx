import Navbar from "@/components/navbar/Navbar";
import { Sidebar } from "@/components/sidebar/Sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full relative">
      <div
        className="
				hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-80 bg-neutral-900"
      >
        <Sidebar apiLimitCount={0} isPro={false} />
      </div>
      <main className="md:pl-72 pb-10">
        <Navbar />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
