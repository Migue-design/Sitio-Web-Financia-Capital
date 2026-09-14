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

test.describe('Navegación', () => {
  for (const page of PAGES) {
    test(`los links internos del header de ${page} no rompen (no 404)`, async ({
      page: browserPage,
      request
    }) => {
      await browserPage.goto(`/${page}`);
      const hrefs = await browserPage
        .locator('header .navbar-nav .nav-link, header a.navbar-brand')
        .evaluateAll((links) => links.map((a) => a.getAttribute('href')));

      const internos = hrefs.filter(
        (href) => href && href.endsWith('.html') && !href.startsWith('http')
      );
      expect(internos.length).toBeGreaterThan(0);

      for (const href of internos) {
        const res = await request.get(`/${href}`);
        expect(res.ok(), `${href} (referenciado desde ${page}) respondió ${res.status()}`).toBeTruthy();
      }
    });
  }

  test('el menú mobile (offcanvas) abre y cierra en viewport chico', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Solo aplica a viewport mobile');
    await page.goto('/index.html');

    const toggler = page.locator('.navbar-toggler');
    await expect(toggler).toBeVisible();
    await toggler.click();

    const offcanvas = page.locator('#navbarSupportedContent');
    await expect(offcanvas).toBeVisible();

    await page.locator('.offcanvas-header .btn-close').click();
    await expect(offcanvas).not.toBeVisible();
  });
});
