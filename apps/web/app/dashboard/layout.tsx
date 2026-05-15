export default function DashboardLayout({ children }: { readonly children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
