import { test, expect } from '@playwright/test';

test.describe('Clientes', () => {
  test.beforeEach(async ({ page }) => {
    // Login antes de cada teste
    await page.goto('/login');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('deve acessar página de clientes', async ({ page }) => {
    await page.click('text=Clientes');
    await expect(page).toHaveURL('/customers');
    await expect(page.locator('h1')).toContainText('Clientes');
  });

  test('deve criar novo cliente', async ({ page }) => {
    await page.goto('/customers');
    
    // Clicar no botão de adicionar cliente
    await page.click('button:has-text("Novo Cliente")');
    
    // Preencher formulário
    await page.fill('input[name="name"]', 'Cliente Teste');
    await page.fill('input[name="email"]', 'cliente@teste.com');
    await page.fill('input[name="phone"]', '11999999999');
    
    // Salvar
    await page.click('button:has-text("Salvar")');
    
    // Verificar se foi salvo
    await expect(page.locator('text=Cliente Teste')).toBeVisible();
  });
});
