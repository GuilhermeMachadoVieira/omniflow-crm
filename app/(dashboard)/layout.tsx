import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Header } from "@/components/layout/header";
import { UserProvider } from "@/components/providers/user-provider";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import { DashboardContent } from "@/components/layout/dashboard-content";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <SidebarProvider>
        <div className="flex min-h-screen bg-background">
          {/* Desktop Sidebar */}
          <div className="hidden md:block fixed left-0 top-0 h-full z-40">
            <Sidebar />
          </div>
          
          {/* Mobile Sidebar */}
          <MobileSidebar />
          
          <DashboardContent>
            <Header />
            <main className="flex-1 p-6">
              <ErrorBoundary>
                {children}
              </ErrorBoundary>
            </main>
          </DashboardContent>
        </div>
        <Toaster />
      </SidebarProvider>
    </UserProvider>
  );
}
