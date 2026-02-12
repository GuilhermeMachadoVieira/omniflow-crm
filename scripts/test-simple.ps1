# Teste Simplificado do OmniFlow CRM

Write-Host "Iniciando testes completos..." -ForegroundColor Yellow
Write-Host ""

# Teste 1: Build
Write-Host "1. Testando build..." -ForegroundColor Yellow
npm run build *> $null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Build OK" -ForegroundColor Green
} else {
    Write-Host "Build FALHOU" -ForegroundColor Red
    exit 1
}

# Teste 2: Testes unitários
Write-Host ""
Write-Host "2. Rodando testes unitarios..." -ForegroundColor Yellow
npm run test *> $null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Testes unitarios OK" -ForegroundColor Green
} else {
    Write-Host "Testes unitarios FALHARAM" -ForegroundColor Red
}

# Teste 3: Lint
Write-Host ""
Write-Host "3. Verificando lint..." -ForegroundColor Yellow
npm run lint *> $null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Lint OK" -ForegroundColor Green
} else {
    Write-Host "Lint FALHOU" -ForegroundColor Red
}

# Teste 4: Verificar arquivos importantes
Write-Host ""
Write-Host "4. Verificando arquivos de configuracao..." -ForegroundColor Yellow

$files = @(
    "next.config.ts",
    "public/manifest.json", 
    "playwright.config.ts",
    "jest.config.js",
    ".env.example"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "$file existe" -ForegroundColor Green
    } else {
        Write-Host "$file NAO existe" -ForegroundColor Red
    }
}

# Teste 5: Verificar Server Components
Write-Host ""
Write-Host "5. Verificando Server Components..." -ForegroundColor Yellow
$hasServerComponents = Select-String -Path "app\(dashboard)\settings\team\page.tsx" -Pattern "await getTeamMembers" -Quiet
if ($hasServerComponents) {
    Write-Host "Server Components implementados" -ForegroundColor Green
} else {
    Write-Host "Server Components NAO implementados" -ForegroundColor Red
}

# Teste 6: Verificar aria-labels
Write-Host ""
Write-Host "6. Verificando acessibilidade..." -ForegroundColor Yellow
$ariaLabels = (Get-ChildItem -Path "components" -Filter "*.tsx" -Recurse | Select-String -Pattern "aria-label" | Measure-Object).Count
if ($ariaLabels -gt 0) {
    Write-Host "Aria-labels encontrados: $ariaLabels" -ForegroundColor Green
} else {
    Write-Host "Nenhum aria-label encontrado" -ForegroundColor Red
}

Write-Host ""
Write-Host "Testes concluidos!" -ForegroundColor Green
Write-Host ""
Write-Host "Para testes detalhados, consulte TESTING_GUIDE.md" -ForegroundColor Cyan
