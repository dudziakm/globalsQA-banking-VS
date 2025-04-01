import { Page } from "@playwright/test";
import { Logger } from "./Logger";

/**
 * Test Helper utility with common functions for tests
 */
export class TestHelper {
  /**
   * Waits for a specified amount of time
   * Note: Explicit waits should be avoided when possible, use element waiting instead
   *
   * @param ms - Time to wait in milliseconds
   */
  static async wait(ms: number): Promise<void> {
    Logger.warning(
      `Using explicit wait for ${ms}ms - consider using element waiting instead`
    );
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * Generates a random string of specified length
   *
   * @param length - Length of the random string
   * @returns Random string
   */
  static generateRandomString(length: number = 8): string {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  /**
   * Generates a random number between min and max values
   *
   * @param min - Minimum value (inclusive)
   * @param max - Maximum value (inclusive)
   * @returns Random number
   */
  static generateRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /**
   * Takes a screenshot and saves it with a unique name
   *
   * @param page - Playwright page
   * @param testName - Name of the test
   */
  static async takeScreenshot(page: Page, testName: string): Promise<void> {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      await page.screenshot({
        path: `./screenshots/${testName}_${timestamp}.png`,
        fullPage: true,
      });
      Logger.info(`Screenshot saved for ${testName}`);
    } catch (error) {
      Logger.error("Failed to take screenshot", error as Error);
    }
  }

  /**
   * Handles alerts by accepting them and returning the message
   *
   * @param page - Playwright page
   * @returns Alert message
   */
  static async handleAlert(page: Page): Promise<string> {
    try {
      // Set up the dialog handler before the action that triggers the alert
      return await page.evaluate(() => {
        return new Promise<string>((resolve) => {
          window.alert = (message: string) => {
            resolve(message);
            return true;
          };
        });
      });
    } catch (error) {
      Logger.error("Failed to handle alert", error as Error);
      return "";
    }
  }
}
