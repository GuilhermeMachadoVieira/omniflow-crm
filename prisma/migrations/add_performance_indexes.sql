-- Add performance indexes for multi-tenant queries

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_organization_id ON "users"(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON "users"(email);

-- Customers table indexes
CREATE INDEX IF NOT EXISTS idx_customers_organization_id ON "customers"(organization_id);
CREATE INDEX IF NOT EXISTS idx_customers_org_email ON "customers"(organization_id, email);
CREATE INDEX IF NOT EXISTS idx_customers_org_status ON "customers"(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_customers_org_user ON "customers"(organization_id, user_id);
CREATE INDEX IF NOT EXISTS idx_customers_org_created ON "customers"(organization_id, created_at);

-- Pipeline columns indexes
CREATE INDEX IF NOT EXISTS idx_pipeline_columns_org_id ON "pipeline_columns"(organization_id);
CREATE INDEX IF NOT EXISTS idx_pipeline_columns_org_sort ON "pipeline_columns"(organization_id, sort_order);

-- Opportunities indexes
CREATE INDEX IF NOT EXISTS idx_opportunities_org_id ON "opportunities"(organization_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_org_column ON "opportunities"(organization_id, column_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_org_priority ON "opportunities"(organization_id, priority);
CREATE INDEX IF NOT EXISTS idx_opportunities_org_created ON "opportunities"(organization_id, created_at);

-- Activities indexes
CREATE INDEX IF NOT EXISTS idx_activities_org_id ON "activities"(organization_id);
CREATE INDEX IF NOT EXISTS idx_activities_org_customer ON "activities"(organization_id, customer_id);
CREATE INDEX IF NOT EXISTS idx_activities_org_user ON "activities"(organization_id, user_id);
CREATE INDEX IF NOT EXISTS idx_activities_org_created ON "activities"(organization_id, created_at);
