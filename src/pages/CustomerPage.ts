import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Customer Page class representing the customer selection and account operations
 */
export class CustomerPage extends BasePage {
  // Locators
  readonly customerDropdown: Locator;
  readonly loginButton: Locator;
  readonly welcomeText: Locator;
  readonly accountDropdown: Locator;
  readonly depositButton: Locator;
  readonly withdrawlButton: Locator;
  readonly transactionsButton: Locator;
  readonly logoutButton: Locator;
  readonly amountInput: Locator;
  readonly submitTransactionBtn: Locator;
  readonly transactionMessage: Locator;
  readonly balance: Locator;

  constructor(page: Page) {
    super(page);
    this.customerDropdown = page.locator("#userSelect");
    this.loginButton = page.locator('button[type="submit"]');
    this.welcomeText = page.locator("span.fontBig");
    this.accountDropdown = page.locator("#accountSelect");
    this.depositButton = page.locator('button[ng-click="deposit()"]');
    this.withdrawlButton = page.locator('button[ng-click="withdrawl()"]');
    this.transactionsButton = page.locator('button[ng-click="transactions()"]');
    this.logoutButton = page.locator('button[ng-click="byebye()"]');
    this.amountInput = page.locator('input[ng-model="amount"]');
    this.submitTransactionBtn = page.locator('button[type="submit"]');
    this.transactionMessage = page.locator('[ng-show="message"]');
    this.balance = page.locator(".center strong:nth-child(2)");
  }

  /**
   * Selects a customer from the dropdown
   * @param customerName - The name of the customer to select
   */
  async selectCustomer(customerName: string): Promise<void> {
    await this.selectOption(this.customerDropdown, customerName);
  }

  /**
   * Clicks the login button
   */
  async login(): Promise<void> {
    await this.click(this.loginButton);
  }

  /**
   * Gets the welcome message with the customer name
   */
  async getWelcomeMessage(): Promise<string> {
    return await this.getText(this.welcomeText);
  }

  /**
   * Selects an account from the dropdown
   * @param accountNumber - The account number to select
   */
  async selectAccount(accountNumber: string): Promise<void> {
    await this.selectOption(this.accountDropdown, accountNumber);
  }

  /**
   * Gets the current balance
   */
  async getBalance(): Promise<number> {
    const balanceText = await this.getText(this.balance);
    return parseInt(balanceText, 10);
  }

  /**
   * Makes a deposit
   * @param amount - The amount to deposit
   */
  async makeDeposit(amount: string): Promise<void> {
    await this.click(this.depositButton);
    await this.fill(this.amountInput, amount);
    await this.click(this.submitTransactionBtn);
  }

  /**
   * Makes a withdrawal
   * @param amount - The amount to withdraw
   */
  async makeWithdrawal(amount: string): Promise<void> {
    await this.click(this.withdrawlButton);
    await this.fill(this.amountInput, amount);
    await this.click(this.submitTransactionBtn);
  }

  /**
   * Gets the transaction message (success/failure)
   * @param timeoutMs - Optional timeout in milliseconds (default: 5000)
   */
  async getTransactionMessage(timeoutMs: number = 5000): Promise<string> {
    try {
      // Use a shorter timeout to avoid long waits if message doesn't appear
      await this.waitForElement(this.transactionMessage, timeoutMs);
      return await this.getText(this.transactionMessage);
    } catch (error) {
      // If the message doesn't appear, check if element exists but is hidden
      if ((await this.transactionMessage.count()) > 0) {
        // If element exists but might be hidden, try to get text anyway
        return await this.page.evaluate((selector) => {
          const el = document.querySelector(selector);
          return el ? el.textContent || "" : "";
        }, '[ng-show="message"]');
      }
      // If element doesn't exist at all, provide a default message
      return "Transaction message not displayed";
    }
  }

  /**
   * Clicks the transactions button
   */
  async viewTransactions(): Promise<void> {
    await this.click(this.transactionsButton);
  }

  /**
   * Logs out from customer account
   */
  async logout(): Promise<void> {
    await this.click(this.logoutButton);
  }
}
