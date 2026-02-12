#!/bin/bash

echo "🚀 Iniciando testes completos do OmniFlow CRM..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para verificar se comando deu certo
check_success() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ $1${NC}"
        return 0
    else
        echo -e "${RED}❌ $1${NC}"
        return 1
    fi
}

echo -e "${YELLOW}📦 1. Verificando dependências...${NC}"
npm install > /dev/null 2>&1
check_success "Dependências instaladas"

echo ""
echo -e "${YELLOW}🔨 2. Testando build...${NC}"
npm run build > /dev/null 2>&1
check_success "Build sem erros"

echo ""
echo -e "${YELLOW}🧪 3. Rodando testes unitários...${NC}"
npm run test > /dev/null 2>&1
check_success "Testes unitários passando"

echo ""
echo -e "${YELLOW}🔍 4. Verificando lint...${NC}"
npm run lint > /dev/null 2>&1
check_success "Lint sem erros"

echo ""
echo -e "${YELLOW}📊 5. Verificando tipos TypeScript...${NC}"
npx tsc --noEmit > /dev/null 2>&1
check_success "TypeScript sem erros"

echo ""
echo -e "${YELLOW}🔐 6. Verificando configurações de segurança...${NC}"

# Verificar se CSP está configurado
if grep -q "Content-Security-Policy" next.config.ts; then
    check_success "CSP configurado"
else
    echo -e "${RED}❌ CSP não encontrado${NC}"
fi

# Verificar se Sentry está configurado
if [ -f ".env.example" ] && grep -q "SENTRY_DSN" .env.example; then
    check_success "Sentry configurado"
else
    echo -e "${RED}❌ Sentry não configurado${NC}"
fi

echo ""
echo -e "${YELLOW}📱 7. Verificando PWA...${NC}"

# Verificar manifest.json
if [ -f "public/manifest.json" ]; then
    check_success "Manifest PWA existe"
else
    echo -e "${RED}❌ Manifest PWA não encontrado${NC}"
fi

# Verificar ícones
if [ -d "public/icons" ]; then
    check_success "Ícones PWA existem"
else
    echo -e "${RED}❌ Ícones PWA não encontrados${NC}"
fi

echo ""
echo -e "${YELLOW}🌐 8. Verificando Web Vitals...${NC}"

# Verificar se web-vitals está instalado
if npm list web-vitals > /dev/null 2>&1; then
    check_success "Web Vitals configurado"
else
    echo -e "${RED}❌ Web Vitals não configurado${NC}"
fi

echo ""
echo -e "${YELLOW}📁 9. Verificando estrutura de testes...${NC}"

# Verificar Playwright
if [ -f "playwright.config.ts" ]; then
    check_success "Playwright configurado"
else
    echo -e "${RED}❌ Playwright não configurado${NC}"
fi

# Verificar Jest
if [ -f "jest.config.js" ]; then
    check_success "Jest configurado"
else
    echo -e "${RED}❌ Jest não configurado${NC}"
fi

echo ""
echo -e "${YELLOW}♿ 10. Verificando acessibilidade...${NC}"

# Contar aria-labels em componentes
ARIA_LABELS=$(grep -r "aria-label" components/ --include="*.tsx" | wc -l)
if [ "$ARIA_LABELS" -gt 0 ]; then
    check_success "Aria-labels implementados ($ARIA_LABELS encontrados)"
else
    echo -e "${RED}❌ Nenhum aria-label encontrado${NC}"
fi

echo ""
echo -e "${YELLOW}⚡ 11. Verificando Server Components...${NC}"

# Verificar se página team usa Server Components
if grep -q "await getTeamMembers()" app/\(dashboard\)/settings/team/page.tsx; then
    check_success "Server Components implementados"
else
    echo -e "${RED}❌ Server Components não implementados${NC}"
fi

echo ""
echo -e "${YELLOW}📦 12. Analisando bundle size...${NC}"

# Extrair tamanho do bundle do build output
BUNDLE_SIZE=$(npm run build 2>&1 | grep -o "Total.*[0-9]\+ kB" | tail -1)
if [ ! -z "$BUNDLE_SIZE" ]; then
    echo -e "${GREEN}✅ Bundle size: $BUNDLE_SIZE${NC}"
else
    echo -e "${YELLOW}⚠️ Não foi possível determinar bundle size${NC}"
fi

echo ""
echo "🎉 Testes automatizados concluídos!"
echo ""
echo "📋 Para testes manuais completos, consulte TESTING_GUIDE.md"
echo ""
echo "🚀 Para iniciar desenvolvimento: npm run dev"
echo "🧪 Para testes E2E: npm run test:e2e"
echo "📊 Para coverage: npm run test:coverage"
