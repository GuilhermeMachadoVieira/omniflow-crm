import { Sidebar } from "@/components/layout/sidebar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { Header } from "@/components/layout/header";
import { UserProvider } from "@/components/providers/user-provider";
import { Toaster } from "@/components/ui/toaster";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="flex min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden md:block fixed left-0 top-0 h-full">
          <Sidebar />
        </div>
        
        {/* Mobile Sidebar */}
        <MobileSidebar />
        
        <div className="flex flex-1 flex-col md:ml-64">
          <Header />
          <main className="flex-1 p-6">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
        </div>
      </div>
      <Toaster />
    </UserProvider>
  );
}
