export type CustomerStatus = "active" | "inactive";

export interface ContactHistoryEntry {
  id: string;
  date: string;
  type: "email" | "call" | "meeting" | "note";
  description: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  status: CustomerStatus;
  lastPurchase: string;
  totalRevenue: number;
  company?: string;
  phone?: string;
  contactHistory: ContactHistoryEntry[];
}

const COMPANY_NAMES = [
  "Tech Solutions", "Indústria Beta", "Comércio Digital", "Logística Norte",
  "Startup Inova", "Grupo Alfa", "Serviços Pro", "Distribuidora Central",
  "Consultoria Estratégica", "Retail Plus", "Agropecuária Sul", "Software House",
  "Construtora Nacional", "Farmacêutica Vida", "Energia Verde", "Transportes Rápido",
  "Alimentos Sabor", "Moda & Estilo", "Educação Futuro", "Saúde Plus",
  "Automotiva Brasil", "Metalúrgica Forte", "Têxtil Premium", "Química Avançada",
  "Turismo & Viagens", "Seguros Total", "Banco Digital", "Imobiliária Prime",
  "Mídia Digital", "Games Studio", "Pet Shop Feliz", "Restaurante Sabor",
  "Academia Fit", "Clínica Odonto", "Advocacia Legal", "Contabilidade Certa",
  "Marketing Pro", "Limpeza Express", "Segurança Total", "Telecom Connect",
];

const FIRST_NAMES = [
  "Ana", "Bruno", "Carla", "Diego", "Elena", "Felipe", "Gabriela", "Henrique",
  "Isabela", "João", "Larissa", "Marcos", "Natália", "Otávio", "Patricia", "Rafael",
  "Sandra", "Thiago", "Úrsula", "Vitor", "William", "Yasmin", "André", "Beatriz",
];

const LAST_NAMES = [
  "Silva", "Santos", "Oliveira", "Souza", "Rodrigues", "Ferreira", "Alves", "Pereira",
  "Lima", "Gomes", "Costa", "Ribeiro", "Martins", "Carvalho", "Rocha", "Almeida",
];

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDate(daysBack: number): string {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * daysBack));
  return d.toISOString().split("T")[0];
}

function generateContactHistory(customerId: string): ContactHistoryEntry[] {
  const types: ContactHistoryEntry["type"][] = ["email", "call", "meeting", "note"];
  const descriptions: Record<ContactHistoryEntry["type"], string[]> = {
    email: ["Proposta enviada", "Follow-up comercial", "Confirmação de reunião"],
    call: ["Ligação de qualificação", "Retorno ao cliente", "Alinhamento de expectativas"],
    meeting: ["Reunião presencial", "Demo do produto", "Apresentação da proposta"],
    note: ["Cliente solicitou orçamento", "Prazo de validade discutido", "Decisor identificado"],
  };
  const count = 2 + Math.floor(Math.random() * 4);
  const entries: ContactHistoryEntry[] = [];
  const usedDates = new Set<string>();
  for (let i = 0; i < count; i++) {
    const date = randomDate(90);
    if (usedDates.has(date)) continue;
    usedDates.add(date);
    const type = randomItem(types);
    entries.push({
      id: `${customerId}-contact-${i}`,
      date,
      type,
      description: randomItem(descriptions[type]),
    });
  }
  entries.sort((a, b) => b.date.localeCompare(a.date));
  return entries;
}

function generateCustomer(index: number): Customer {
  const name = `${randomItem(FIRST_NAMES)} ${randomItem(LAST_NAMES)}`;
  const company = randomItem(COMPANY_NAMES);
  const slug = name.toLowerCase().replace(/\s+/g, ".") + index;
  const email = `${slug}@${company.toLowerCase().replace(/\s/g, "")}.com.br`;
  const status: CustomerStatus = Math.random() > 0.2 ? "active" : "inactive";
  const lastPurchase = randomDate(365);
  const totalRevenue = Math.round((5000 + Math.random() * 295000) / 100) * 100;
  const id = `cust-${index + 1}`;
  const contactHistory = generateContactHistory(id);
  return {
    id,
    name,
    email,
    status,
    lastPurchase,
    totalRevenue,
    company,
    phone: `(11) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
    contactHistory,
  };
}

export const MOCK_CUSTOMERS: Customer[] = Array.from({ length: 50 }, (_, i) =>
  generateCustomer(i)
);

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatDate(isoDate: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(isoDate));
}
