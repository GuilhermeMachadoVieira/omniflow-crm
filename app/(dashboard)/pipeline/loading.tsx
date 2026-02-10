export default function PipelineLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Pipeline de Vendas
          </h1>
          <p className="text-muted-foreground">
            Gerencie suas oportunidades de vendas.
          </p>
        </div>
      </div>
      
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
        ))}
      </div>
    </div>
  );
}
