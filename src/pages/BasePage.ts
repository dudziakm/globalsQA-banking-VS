import { Page, Locator, expect } from "@playwright/test";

/**
 * BasePage class serves as a foundation for all page objects
 * Contains common methods and properties shared across all pages
 */
export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigates to the given URL path, relative to the baseURL
   * @param path - The URL path to navigate to
   */
  async navigate(path: string = ""): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Waits for an element to be visible
   * @param locator - The element locator
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: timeout });
  }

  /**
   * Checks if an element is visible
   * @param locator - The element locator
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Gets the text content of an element
   * @param locator - The element locator
   */
  async getText(locator: Locator): Promise<string> {
    return await locator.innerText();
  }

  /**
   * Clicks an element
   * @param locator - The element locator
   */
  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  /**
   * Types text into an input field
   * @param locator - The input field locator
   * @param text - The text to type
   */
  async fill(locator: Locator, text: string): Promise<void> {
    await locator.fill(text);
  }

  /**
   * Selects an option from a dropdown by visible text
   * @param locator - The select element locator
   * @param optionText - The option text to select
   */
  async selectOption(locator: Locator, optionText: string): Promise<void> {
    await locator.selectOption({ label: optionText });
  }

  /**
   * Takes a screenshot with a given name
   * @param name - Name for the screenshot
   */
  async takeScreenshot(name: string): Promise<void> {
    await this.page.screenshot({ path: `./screenshots/${name}.png` });
  }
}
