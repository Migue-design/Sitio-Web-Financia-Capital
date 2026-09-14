const { test, expect } = require('@playwright/test');

const PAGES = [
  'index.html',
  'factoring.html',
  'quienes-somos.html',
  'novedades.html',
  'novedad-detalle.html',
  'simular.html',
  'centro-ayuda.html'
];

for (const page of PAGES) {
  test.describe(`${page}`, () => {
    test('carga sin errores de consola y con SEO básico', async ({ page: browserPage }) => {
      const consoleErrors = [];
      const pageErrors = [];
      browserPage.on('console', (msg) => {
        if (msg.type() === 'error') consoleErrors.push(msg.text());
      });
      browserPage.on('pageerror', (err) => pageErrors.push(String(err)));

      const response = await browserPage.goto(`/${page}`);
      expect(response.ok(), `${page} debería responder 200`).toBeTruthy();

      await expect(browserPage).toHaveTitle(/.+/);
      const description = await browserPage
        .locator('meta[name="description"]')
        .getAttribute('content');
      expect(description, `${page} debería tener meta description`).toBeTruthy();

      expect(consoleErrors, `Errores de consola en ${page}:\n${consoleErrors.join('\n')}`).toEqual([]);
      expect(pageErrors, `Errores de JS en ${page}:\n${pageErrors.join('\n')}`).toEqual([]);
    });

    test('el logo del header lleva a index.html', async ({ page: browserPage }) => {
      await browserPage.goto(`/${page}`);
      const brand = browserPage.locator('a.navbar-brand');
      await expect(brand).toHaveAttribute('href', 'index.html');
    });

    test('el footer es igual al de quienes-somos.html', async ({ page: browserPage, request }) => {
      const referencia = await request.get('/quienes-somos.html');
      const referenciaHtml = await referencia.text();
      const referenciaFooter = referenciaHtml.match(/<footer>[\s\S]*<\/footer>/)[0];

      await browserPage.goto(`/${page}`);
      const footerHtml = await browserPage.locator('footer').innerHTML();
      const referenciaBody = referenciaFooter.replace(/^<footer>|<\/footer>$/g, '').trim();

      expect(footerHtml.replace(/\s+/g, ' ').trim()).toBe(
        referenciaBody.replace(/\s+/g, ' ').trim()
      );
    });
  });
}
