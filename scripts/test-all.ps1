# Teste Completo do OmniFlow CRM - PowerShell

Write-Host "🚀 Iniciando testes completos do OmniFlow CRM..." -ForegroundColor Yellow
Write-Host ""

# Função para verificar sucesso
function Test-Success {
    param(
        [string]$Message,
        [bool]$Success
    )
    
    if ($Success) {
        Write-Host "✅ $Message" -ForegroundColor Green
    } else {
        Write-Host "❌ $Message" -ForegroundColor Red
    }
}

Write-Host "📦 1. Verificando dependências..." -ForegroundColor Yellow
npm install *> $null
Test-Success "Dependências instaladas" ($LASTEXITCODE -eq 0)

Write-Host ""
Write-Host "🔨 2. Testando build..." -ForegroundColor Yellow
npm run build *> $null
Test-Success "Build sem erros" ($LASTEXITCODE -eq 0)

Write-Host ""
Write-Host "🧪 3. Rodando testes unitários..." -ForegroundColor Yellow
npm run test *> $null
Test-Success "Testes unitários passando" ($LASTEXITCODE -eq 0)

Write-Host ""
Write-Host "🔍 4. Verificando lint..." -ForegroundColor Yellow
npm run lint *> $null
Test-Success "Lint sem erros" ($LASTEXITCODE -eq 0)

Write-Host ""
Write-Host "📊 5. Verificando tipos TypeScript..." -ForegroundColor Yellow
npx tsc --noEmit *> $null
Test-Success "TypeScript sem erros" ($LASTEXITCODE -eq 0)

Write-Host ""
Write-Host "🔐 6. Verificando configurações de segurança..." -ForegroundColor Yellow

# Verificar CSP
$hasCSP = Select-String -Path "next.config.ts" -Pattern "Content-Security-Policy" -Quiet
Test-Success "CSP configurado" $hasCSP

# Verificar Sentry
$hasSentry = Test-Path ".env.example" -and (Select-String -Path ".env.example" -Pattern "SENTRY_DSN" -Quiet)
Test-Success "Sentry configurado" $hasSentry

Write-Host ""
Write-Host "📱 7. Verificando PWA..." -ForegroundColor Yellow

# Verificar manifest
$hasManifest = Test-Path "public/manifest.json"
Test-Success "Manifest PWA existe" $hasManifest

# Verificar ícones
$hasIcons = Test-Path "public/icons"
Test-Success "Ícones PWA existem" $hasIcons

Write-Host ""
Write-Host "🌐 8. Verificando Web Vitals..." -ForegroundColor Yellow

# Verificar web-vitals
$webVitalsInstalled = npm list web-vitals *> $null; $LASTEXITCODE -eq 0
Test-Success "Web Vitals configurado" $webVitalsInstalled

Write-Host ""
Write-Host "📁 9. Verificando estrutura de testes..." -ForegroundColor Yellow

# Verificar Playwright
$hasPlaywright = Test-Path "playwright.config.ts"
Test-Success "Playwright configurado" $hasPlaywright

# Verificar Jest
$hasJest = Test-Path "jest.config.js"
Test-Success "Jest configurado" $hasJest

Write-Host ""
Write-Host "10. Verificando acessibilidade..." -ForegroundColor Yellow

# Contar aria-labels
$ariaLabels = (Select-String -Path "components\*.tsx" -Pattern "aria-label" | Measure-Object).Count
Test-Success "Aria-labels implementados ($ariaLabels encontrados)" ($ariaLabels -gt 0)

Write-Host ""
Write-Host "11. Verificando Server Components..." -ForegroundColor Yellow

# Verificar Server Components
$hasServerComponents = Select-String -Path "app\(dashboard)\settings\team\page.tsx" -Pattern "await getTeamMembers" -Quiet
Test-Success "Server Components implementados" $hasServerComponents

Write-Host ""
Write-Host "12. Analisando bundle size..." -ForegroundColor Yellow

# Tentar extrair bundle size
$buildOutput = npm run build 2>&1
$bundleInfo = $buildOutput | Select-String -Pattern "Total.*\d+ kB"
if ($bundleInfo) {
    Write-Host "Bundle size: $($bundleInfo.Line)" -ForegroundColor Green
} else {
    Write-Host "Nao foi possivel determinar bundle size" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Testes automatizados concluidos!" -ForegroundColor Green
Write-Host ""
Write-Host "Para testes manuais completos, consulte TESTING_GUIDE.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Para iniciar desenvolvimento: npm run dev" -ForegroundColor Cyan
Write-Host "Para testes E2E: npm run test:e2e" -ForegroundColor Cyan
Write-Host "Para coverage: npm run test:coverage" -ForegroundColor Cyan

# Pausa para leitura
Write-Host ""
Write-Host "Pressione Enter para continuar..." -ForegroundColor Gray
Read-Host
