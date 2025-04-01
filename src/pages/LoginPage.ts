import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Login Page class representing the GlobalSQA banking login page
 */
export class LoginPage extends BasePage {
  // Locators
  readonly customerLoginBtn: Locator;
  readonly bankManagerLoginBtn: Locator;
  readonly homeBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.customerLoginBtn = page.locator('button[ng-click="customer()"]');
    this.bankManagerLoginBtn = page.locator('button[ng-click="manager()"]');
    this.homeBtn = page.locator(".home");
  }

  /**
   * Navigates to the login page
   */
  async navigateToLoginPage(): Promise<void> {
    await this.navigate("#/login");
  }

  /**
   * Clicks on the Customer Login button
   */
  async clickCustomerLogin(): Promise<void> {
    await this.click(this.customerLoginBtn);
  }

  /**
   * Clicks on the Bank Manager Login button
   */
  async clickBankManagerLogin(): Promise<void> {
    await this.click(this.bankManagerLoginBtn);
  }

  /**
   * Validates that the login page is loaded
   */
  async isLoginPageLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/.*#\/login/);
    await expect(this.customerLoginBtn).toBeVisible();
    await expect(this.bankManagerLoginBtn).toBeVisible();
  }
}
