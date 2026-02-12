# Guia de Testes - OmniFlow CRM Enterprise

## 🚀 Como Testar Todas as Implementações

### 1. Testes de Build e Desenvolvimento

```bash
# Verificar se tudo compila corretamente
npm run build

# Iniciar servidor de desenvolvimento
npm run dev
```

### 2. 🔒 Fase 2: CSP Hardening

**Como testar:**
1. Abra o DevTools (F12)
2. Vá para aba "Network" → "Headers"
3. Verifique se `Content-Security-Policy` está presente
4. Deve conter:
   - `script-src 'self' 'unsafe-inline'` (sem `unsafe-eval`)
   - `img-src 'self' data: blob: https:`
   - `connect-src 'self' https://*.supabase.co`

**Teste funcional:**
- Faça upload de imagem (Supabase Storage)
- Verifique se carrega sem erros de CSP

### 3. 🛡️ Fase 3: ErrorBoundary + Logging

**Como testar:**
```javascript
// No console do navegador, force um erro:
throw new Error("Teste ErrorBoundary");
```

**Verifique:**
- UI de fallback aparece (não tela branca)
- Erro aparece no console com contexto
- Em produção, erro aparece no Sentry

### 4. ⚡ Fase 4: Server Components

**Como testar:**
1. Acesse `/settings/team`
2. Abra DevTools → Network
3. Deve ver:
   - Dados carregados no servidor (sem request client-side inicial)
   - Menos JavaScript transferido
4. Compare com outras páginas (ex: `/customers`)

**Performance:**
- Use Lighthouse para medir First Contentful Paint
- `/settings/team` deve ser mais rápido

### 5. 🧪 Fase 5: Testes Automatizados

**Testes Unitários:**
```bash
npm run test
npm run test:coverage
```

**Testes E2E:**
```bash
# Instalar browsers (primeira vez)
npx playwright install

# Rodar testes
npm run test:e2e

# Interface visual
npm run test:e2e:ui
```

### 6. 🔍 Fase 6: Sentry

**Como testar:**
1. Configure as variáveis de ambiente:
   ```bash
   SENTRY_DSN=seu-dsn
   SENTRY_AUTH_TOKEN=seu-token
   ```

2. Force um erro:
   ```javascript
   // No console
   throw new Error("Teste Sentry");
   ```

3. Verifique no painel Sentry

### 7. ♿ Fase 7: Acessibilidade

**Teste com Teclado:**
- Tab através da interface
- Verifique focus indicators visíveis
- Teste menus, diálogos, formulários

**Teste Screen Reader:**
- Instale extensão "Accessibility Insights"
- Execute auditoria completa
- Verifique aria-labels implementados

**Verificar:**
- Botões de ícone têm aria-label
- Diálogos têm focus management
- Contraste de cores adequado

### 8. 📱 Fase 8: PWA

**Como testar:**
1. Abra o app em Chrome/Firefox
2. Procure ícone de instalação (📱)
3. Instale como PWA
4. Verifique:
   - Ícone correto
   - Tela inicial personalizada
   - Funciona offline parcialmente

**Lighthouse:**
- Execute Lighthouse
- Verifique categoria "Progressive Web App"

### 9. 📈 Fase 9: Analytics/Web Vitals

**Como testar:**
1. Habilite Web Vitals:
   ```bash
   NEXT_PUBLIC_ENABLE_WEB_VITALS=true npm run dev
   ```

2. Monitore console:
   ```javascript
   // Deve ver: [Web Vitals] {name: "CLS", value: 0.1, ...}
   ```

3. Verifique endpoints:
   - `/api/analytics/vitals`
   - `/api/analytics/events`

**Performance:**
- Use Lighthouse para Core Web Vitals
- Métricas devem ser boas (>90)

---

## 🔧 Testes de Integração

### Teste Completo de Fluxo:
1. Login → Dashboard → Settings → Team
2. Criar cliente → Editar → Excluir
3. Testar responsividade (mobile/desktop)
4. Testar tema claro/escuro
5. Verificar todos os menus e navegação

### Teste de Erros:
1. Desconecte internet
2. Tente ações que requerem API
3. Verifique tratamento de erros

### Teste de Performance:
```bash
# Build de produção
npm run build
npm start

# Testar com Lighthouse
# URL: http://localhost:3000
```

---

## ✅ Checklist de Validação

- [ ] Build sem erros
- [ ] CSP configurado e funcionando
- [ ] ErrorBoundary captura erros
- [ ] Server Components reduzem bundle
- [ ] Testes unitários passam
- [ ] Testes E2E funcionam
- [ ] Sentry recebe erros
- [ ] Acessibilidade OK
- [ ] PWA instalável
- [ ] Web Vitals coletados
- [ ] Performance >90 Lighthouse
- [ ] Funcionalidades intactas

---

## 🚨 Se Algo Der Errado

### Build Errors:
```bash
# Limpar cache
rm -rf .next
npm run build
```

### Testes Falhando:
```bash
# Atualizar dependências
npm install
npm run test
```

### Performance Issues:
- Verifique bundle size em `npm run build`
- Use React DevTools Profiler
- Verifique Network requests

---

## 📊 Métricas Esperadas

**Performance:**
- First Contentful Paint < 1.5s
- Largest Contentful Paint < 2.5s
- Cumulative Layout Shift < 0.1
- Lighthouse score > 90

**Bundle Size:**
- Total JS < 400KB gzipped
- Server Components reduzem client bundle

**Acessibilidade:**
- Lighthouse Accessibility > 95
- Zero erros de WCAG 2.1 AA

---

## 🎯 Sucesso!

Se todos os testes passarem, o OmniFlow CRM está **enterprise-ready** com:
- Segurança reforçada
- Performance otimizada  
- Monitoramento completo
- Acessibilidade inclusiva
- PWA funcional
- Testes automatizados
