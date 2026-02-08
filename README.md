# OmniFlow CRM

Plataforma SaaS B2B Enterprise para gestão de relacionamento e vendas complexas.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript (strict)
- **Estilização:** Tailwind CSS
- **Componentes UI:** Shadcn/UI (Card, Table, Button, Input, etc.)
- **Ícones:** Lucide React
- **Forms:** React Hook Form + Zod
- **Fetching:** TanStack Query (mock data inicial)
- **Gráficos:** Recharts

## Como rodar

### 1. Instalar dependências

```bash
cd omniflow-crm
npm install
```

### 2. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000). O Dashboard será exibido com:

- **KPIs:** Receita Total, Novos Leads, Taxa de Conversão (dados mockados)
- **Gráfico:** Evolução de vendas (área) com Recharts
- **Atividades recentes:** Tabela de audit log com ícones por tipo de ação

### 3. Build para produção

```bash
npm run build
npm start
```

## Estrutura (Passo 1)

- `app/` — App Router (layout, página Dashboard, placeholders para Pipeline/Clientes/Configurações)
- `components/layout/` — Sidebar fixa e Header
- `components/ui/` — Shadcn (Card, Table, Button, Input, Separator)
- `lib/mock/` — Dados mock do dashboard
- `lib/utils.ts` — Utilitário `cn()` para classes Tailwind

## Próximos passos (escopo)

- Pipeline: board Kanban com drag-and-drop
- Clientes: Data Table com filtros e paginação
