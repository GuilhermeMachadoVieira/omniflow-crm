import "dotenv/config";
import { PrismaClient, Role, Priority } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set. Crie um arquivo .env com DATABASE_URL.");
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const DEFAULT_COLUMNS = [
  { title: "Novos Leads", sortOrder: 0 },
  { title: "Qualificação", sortOrder: 1 },
  { title: "Proposta", sortOrder: 2 },
  { title: "Negociação", sortOrder: 3 },
  { title: "Fechado", sortOrder: 4 },
];

async function main() {
  console.log("🌱 Iniciando seed multi-tenant...");

  // Criar organização OmniFlow Corp
  const organization = await prisma.organization.upsert({
    where: { slug: "omniflow-corp" },
    update: {},
    create: {
      name: "OmniFlow Corp",
      slug: "omniflow-corp",
    },
  });

  console.log(`✅ Organização criada/verificada: ${organization.name}`);

  // Colunas padrão do Kanban vinculadas à organização
  const columns = [];
  for (const col of DEFAULT_COLUMNS) {
    const existing = await prisma.pipelineColumn.findFirst({
      where: { 
        title: col.title,
        organizationId: organization.id,
      },
    });
    let column;
    if (!existing) {
      column = await prisma.pipelineColumn.create({
        data: {
          title: col.title,
          sortOrder: col.sortOrder,
          organizationId: organization.id,
        },
      });
    } else {
      column = existing;
    }
    columns.push(column);
  }

  console.log("✅ Colunas do pipeline criadas/verificadas.");

  // Usuário Admin (role: OWNER)
  const adminEmail = "admin@omniflow.com";
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      nome: "Administrador",
      email: adminEmail,
      passwordHash: hashedAdminPassword,
      role: Role.OWNER,
      organizationId: organization.id,
    },
  });

  console.log(`✅ Usuário admin criado/verificado (email: ${adminEmail}, senha: admin123, role: OWNER).`);

  // Usuário Vendedor (role: MEMBER)
  const sellerEmail = "vendedor@omniflow.com";
  const hashedSellerPassword = await bcrypt.hash("vendedor123", 10);

  const sellerUser = await prisma.user.upsert({
    where: { email: sellerEmail },
    update: {},
    create: {
      nome: "Vendedor",
      email: sellerEmail,
      passwordHash: hashedSellerPassword,
      role: Role.MEMBER,
      organizationId: organization.id,
    },
  });

  console.log(`✅ Usuário vendedor criado/verificado (email: ${sellerEmail}, senha: vendedor123, role: MEMBER).`);

  // Criar algumas oportunidades de exemplo vinculadas à organização
  const sampleOpportunities = [
    { title: "Tech Solutions Ltda", value: 85000, priority: Priority.HIGH, columnIndex: 0 },
    { title: "Indústria Beta S.A.", value: 120000, priority: Priority.MEDIUM, columnIndex: 0 },
    { title: "Comércio Digital", value: 45000, priority: Priority.LOW, columnIndex: 1 },
    { title: "Logística Norte", value: 210000, priority: Priority.HIGH, columnIndex: 1 },
    { title: "Startup Inova", value: 32000, priority: Priority.LOW, columnIndex: 2 },
    { title: "Grupo Alfa Corp", value: 180000, priority: Priority.HIGH, columnIndex: 2 },
    { title: "Serviços Pro", value: 67000, priority: Priority.MEDIUM, columnIndex: 3 },
    { title: "Distribuidora Central", value: 145000, priority: Priority.HIGH, columnIndex: 3 },
    { title: "Consultoria Estratégica", value: 95000, priority: Priority.MEDIUM, columnIndex: 4 },
    { title: "Retail Plus", value: 52000, priority: Priority.LOW, columnIndex: 4 },
  ];

  for (const opp of sampleOpportunities) {
    const existing = await prisma.opportunity.findFirst({
      where: { 
        title: opp.title,
        organizationId: organization.id,
      },
    });
    if (!existing) {
      await prisma.opportunity.create({
        data: {
          title: opp.title,
          value: opp.value,
          priority: opp.priority,
          columnId: columns[opp.columnIndex].id,
          organizationId: organization.id,
        },
      });
    }
  }

  console.log("✅ Oportunidades de exemplo criadas/verificadas.");

  // Criar alguns clientes de exemplo vinculados à organização
  const sampleCustomers = [
    { nome: "Tech Solutions Ltda", email: "contato@techsolutions.com", telefone: "(11) 99999-1111", empresa: "Tech Solutions Ltda", userId: adminUser.id },
    { nome: "Indústria Beta S.A.", email: "comercial@industriabeta.com", telefone: "(21) 88888-2222", empresa: "Indústria Beta S.A.", userId: sellerUser.id },
    { nome: "Comércio Digital", email: "vendas@comerciodigital.com", telefone: "(31) 77777-3333", empresa: "Comércio Digital", userId: sellerUser.id },
  ];

  for (const customer of sampleCustomers) {
    const existing = await prisma.customer.findFirst({
      where: { 
        email: customer.email,
        organizationId: organization.id,
      },
    });
    if (!existing) {
      await prisma.customer.create({
        data: {
          ...customer,
          organizationId: organization.id,
        },
      });
    }
  }

  console.log("✅ Clientes de exemplo criados/verificados.");
  console.log("🌱 Seed multi-tenant concluído.");
  console.log("\n📋 Credenciais de acesso:");
  console.log("Admin: admin@omniflow.com / admin123 (OWNER)");
  console.log("Vendedor: vendedor@omniflow.com / vendedor123 (MEMBER)");
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
