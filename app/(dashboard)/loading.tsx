export default function DashboardLoading() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Visão geral do seu pipeline e desempenho de vendas.
          </p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
      
      <div className="h-64 bg-muted animate-pulse rounded-lg" />
      <div className="h-96 bg-muted animate-pulse rounded-lg" />
    </div>
  );
}
