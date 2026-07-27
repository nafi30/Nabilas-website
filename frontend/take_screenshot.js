const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  
  const page = await context.newPage();
  
  // Block video requests to prevent media errors causing browser shell to fail screenshots
  await page.route('**/*', route => {
    const resourceType = route.request().resourceType();
    const url = route.request().url();
    if (resourceType === 'media' || url.endsWith('.mp4') || url.endsWith('.webm')) {
      route.abort();
    } else {
      route.continue();
    }
  });

  const url = process.argv[2] || 'http://localhost:5173/';
  const outputPath = process.argv[3] || 'screenshot.png';

  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    
    // Wait for animations and layout to settle
    await page.waitForTimeout(3000);
    
    // Remove any video tags from DOM as extra precaution
    await page.evaluate(() => {
      const videos = document.querySelectorAll('video');
      videos.forEach(v => v.remove());
    });

    console.log(`Saving screenshot to ${outputPath}...`);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log('Screenshot taken successfully!');
  } catch (err) {
    console.error('Error taking screenshot:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
})();
