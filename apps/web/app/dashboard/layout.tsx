import { Sidebar } from '@/components/dashboard/Sidebar';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MobileNav } from '@/components/dashboard/MobileNav';

export default function DashboardLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-ground)]">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-y-auto p-5 pb-20 md:p-6 md:pb-6">{children}</main>
      </div>
      <MobileNav />
    </div>
  );
}
