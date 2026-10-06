const { test, expect } = require('@playwright/test');

test.describe('Simulador de factoring (simular.html)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/simular.html');
  });

  test('arranca en $0 con 30 días activo por defecto', async ({ page }) => {
    await expect(page.locator('#resValor')).toHaveText('$0');
    await expect(page.locator('#resDescuentoLabel')).toHaveText('Descuento (30 días)');
    await expect(page.locator('.simulador-dias button[data-dias="30"]')).toHaveClass(/active/);
  });

  // El valor y los días se habilitan recién con un correo válido.
  async function ingresarCorreo(page) {
    await page.locator('#simuladorCorreo').fill('prueba@empresa.cl');
  }

  test('sin tasa propuesta ni comisión: solo valor de la factura y días', async ({ page }) => {
    await expect(page.locator('#simuladorTasa')).toHaveCount(0);
    await expect(page.locator('#resComision')).toHaveCount(0);
    await expect(page.locator('.simulador-resultado')).not.toContainText('Comisión');
  });

  test('formatea el monto ingresado con separador de miles y recalcula', async ({ page }) => {
    await ingresarCorreo(page);
    await page.locator('#simuladorValor').fill('10000000');
    await page.locator('#simuladorValor').dispatchEvent('input');

    await expect(page.locator('#simuladorValor')).toHaveValue('$10.000.000');
    await expect(page.locator('#resValor')).toHaveText('$10.000.000');

    // Con 2.5% mensual (tasa fija) a 30 días: descuento = 250.000
    await expect(page.locator('#resDescuento')).toHaveText('-$250.000');
    await expect(page.locator('#resNeto')).toHaveText('$9.750.000');
  });

  test('cambiar a 60 días actualiza el descuento y el label', async ({ page }) => {
    await ingresarCorreo(page);
    await page.locator('#simuladorValor').fill('10000000');
    await page.locator('#simuladorValor').dispatchEvent('input');
    await page.locator('.simulador-dias button[data-dias="60"]').click();

    await expect(page.locator('#resDescuentoLabel')).toHaveText('Descuento (60 días)');
    // 60 días duplica el prorrateo del descuento: 500.000
    await expect(page.locator('#resDescuento')).toHaveText('-$500.000');
    await expect(page.locator('#resNeto')).toHaveText('$9.500.000');
  });

  test('el botón Solicitar Adelanto arma un link de WhatsApp genérico, sin los montos simulados', async ({ page }) => {
    await ingresarCorreo(page);
    await page.locator('#simuladorValor').fill('5000000');
    await page.locator('#simuladorValor').dispatchEvent('input');

    const href = await page.locator('#simuladorCta').getAttribute('href');
    expect(href).toContain('https://wa.me/56997974079?text=');
    const mensaje = decodeURIComponent(href.split('?text=')[1]);
    expect(mensaje).toBe('Hola Financia Capital, usé el simulador y me gustaría que evalúen mi empresa para adelantar mis facturas. Mi correo es prueba@empresa.cl.');
    expect(mensaje).not.toContain('$');
  });
});
