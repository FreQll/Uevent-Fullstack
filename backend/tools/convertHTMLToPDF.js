import puppeteer from "puppeteer";

export const convertHTMLToPDF = async (html, pdfFilePath) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html);

  await page.pdf({ path: pdfFilePath, format: "A4", printBackground: true });
  await browser.close();
};
