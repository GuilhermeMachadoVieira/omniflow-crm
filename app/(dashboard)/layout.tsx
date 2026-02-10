import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Header } from "@/components/layout/header";
import { UserProvider } from "@/components/providers/user-provider";
import { Toaster } from "@/components/ui/toaster";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="flex min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        {/* Mobile Sidebar */}
        <MobileSidebar />
        
        <div className="flex flex-1 flex-col pl-0 md:pl-64">
          <Header />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
      <Toaster />
    </UserProvider>
  );
}
