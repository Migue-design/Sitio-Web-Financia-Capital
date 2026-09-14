const { test, expect } = require('@playwright/test');

// Regresión del bug: Swiper no cargaba (integrity/crossorigin en un archivo local)
// y las opiniones quedaban listadas en columna en vez de funcionar como carrusel.

test.describe('Carrusel de opiniones (home)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
  });

  test('la librería Swiper se carga y el carrusel se inicializa', async ({ page }) => {
    const swiperDefined = await page.evaluate(() => typeof window.Swiper !== 'undefined');
    expect(swiperDefined, 'window.Swiper no está definido: la librería no cargó').toBeTruthy();

    const container = page.locator('.opiniones-swiper');
    await expect(container).toHaveClass(/swiper-initialized/);

    const hasInstance = await container.evaluate((el) => !!el.swiper);
    expect(hasInstance, 'El elemento .opiniones-swiper no tiene instancia .swiper adjunta').toBeTruthy();
  });

  test('muestra varias tarjetas de opinión dentro del carrusel', async ({ page }) => {
    const slides = page.locator('.opiniones-swiper .swiper-slide');
    expect(await slides.count()).toBeGreaterThanOrEqual(6);
  });

  test('el botón "siguiente" avanza el carrusel', async ({ page }) => {
    const container = page.locator('.opiniones-swiper');
    await container.evaluate((el) => el.swiper.autoplay.stop());

    const before = await container.evaluate((el) => el.swiper.realIndex);
    await page.locator('.opiniones-swiper .swiper-button-next').click();
    await page.waitForTimeout(400); // deja correr la transición

    const after = await container.evaluate((el) => el.swiper.realIndex);
    expect(after, 'El índice activo no cambió al hacer click en "siguiente"').not.toBe(before);
  });

  test('en desktop se ven 3 opiniones por vista', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Solo aplica a viewport desktop');
    const slidesPerView = await page
      .locator('.opiniones-swiper')
      .evaluate((el) => el.swiper.params.slidesPerView);
    expect(slidesPerView).toBe(3);
  });

  test('en mobile se ve 1 opinión por vista', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Solo aplica a viewport mobile');
    const slidesPerView = await page
      .locator('.opiniones-swiper')
      .evaluate((el) => el.swiper.params.slidesPerView);
    expect(slidesPerView).toBe(1);
  });
});

test.describe('Carrusel de destacados (novedades)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/novedades.html');
  });

  test('se inicializa y muestra las 3 slides destacadas', async ({ page }) => {
    const container = page.locator('.destacados-swiper');
    await expect(container).toHaveClass(/swiper-initialized/);

    const slides = page.locator('.destacados-swiper .swiper-slide');
    expect(await slides.count()).toBeGreaterThanOrEqual(3);
  });

  test('los puntos de paginación cambian la slide activa', async ({ page }) => {
    const container = page.locator('.destacados-swiper');
    await container.evaluate((el) => el.swiper.autoplay.stop());

    const before = await container.evaluate((el) => el.swiper.realIndex);
    const bullets = page.locator('.destacados-pagination .swiper-pagination-bullet');
    await expect(bullets).toHaveCount(3);

    await bullets.nth(1).click();
    await page.waitForTimeout(400);
    const after = await container.evaluate((el) => el.swiper.realIndex);
    expect(after).not.toBe(before);
  });

  test('en desktop tiene el mismo ancho que el header (logo a botón Ingresar) y no más de 500px de alto', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Solo aplica a viewport desktop');
    const slideBox = await page.locator('.destacados-swiper').boundingBox();
    const logoBox = await page.locator('header a.navbar-brand').boundingBox();
    const ingresarBox = await page.locator('header a.btn-action').boundingBox();

    expect(slideBox.height).toBeLessThanOrEqual(500);
    expect(Math.abs(slideBox.x - logoBox.x)).toBeLessThanOrEqual(2);
    expect(Math.abs((slideBox.x + slideBox.width) - (ingresarBox.x + ingresarBox.width))).toBeLessThanOrEqual(2);
  });

  test('no queda hero azul arriba: el slide es el primer bloque de <main>', async ({ page }) => {
    const heroAzul = page.locator('main > section.hero-content');
    await expect(heroAzul).toHaveCount(0);

    const primerHijo = page.locator('main > *').first();
    await expect(primerHijo).toHaveClass(/visually-hidden/);
    const segundoHijo = page.locator('main > *').nth(1);
    await expect(segundoHijo).toHaveClass(/destacados-section/);
  });
});
