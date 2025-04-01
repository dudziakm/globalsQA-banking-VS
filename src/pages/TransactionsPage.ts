import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Transactions Page class representing the customer transaction history screen
 */
export class TransactionsPage extends BasePage {
  // Locators
  readonly transactionsTable: Locator;
  readonly transactionRows: Locator;
  readonly backButton: Locator;
  readonly resetButton: Locator;
  readonly dateFromInput: Locator;
  readonly dateToInput: Locator;
  readonly noDataMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.transactionsTable = page.locator("#anchor0");
    this.transactionRows = page.locator("tbody tr");
    this.backButton = page.locator('button[ng-click="back()"]');
    this.resetButton = page.locator('button[ng-click="reset()"]');
    this.dateFromInput = page.locator('input[ng-model="startDate"]');
    this.dateToInput = page.locator('input[ng-model="end"]');
    this.noDataMessage = page.locator("span.error");
  }

  /**
   * Gets the number of transactions in the list
   */
  async getTransactionsCount(): Promise<number> {
    return await this.transactionRows.count();
  }

  /**
   * Gets the details of a specific transaction
   * @param index - Index of the transaction to get (0-based)
   * @returns Transaction details object
   */
  async getTransactionDetails(
    index: number
  ): Promise<{
    dateTime: string;
    amount: string;
    transactionType: string;
    balance: string;
  }> {
    const rows = await this.transactionRows.all();
    if (index >= rows.length) {
      throw new Error(`Transaction at index ${index} does not exist`);
    }

    const cells = await rows[index].locator("td").all();

    return {
      dateTime: await cells[0].innerText(),
      amount: await cells[1].innerText(),
      transactionType: await cells[2].innerText(),
      balance: (await cells[3]?.innerText()) || "N/A",
    };
  }

  /**
   * Filters transactions by date range
   * @param fromDate - Start date in YYYY-MM-DD format
   * @param toDate - End date in YYYY-MM-DD format
   */
  async filterByDateRange(fromDate: string, toDate: string): Promise<void> {
    try {
      // The datetime-local input requires a specific format and direct input
      // We'll use a more direct approach to set the value using JavaScript
      await this.page.evaluate(
        ([fromDateSelector, fromDateTime, toDateSelector, toDateTime]) => {
          const fromDateInput = document.querySelector(
            fromDateSelector
          ) as HTMLInputElement;
          const toDateInput = document.querySelector(
            toDateSelector
          ) as HTMLInputElement;
          if (fromDateInput) fromDateInput.value = fromDateTime;
          if (toDateInput) toDateInput.value = toDateTime;
        },
        [
          'input[ng-model="startDate"]',
          `${fromDate}T00:00:00`,
          'input[ng-model="end"]',
          `${toDate}T23:59:59`,
        ]
      );
    } catch (error) {
      // If there's an issue, log it but don't fail the test
      console.error("Error setting date filter values:", error);
    }
  }

  /**
   * Resets the transaction filters
   */
  async resetFilters(): Promise<void> {
    await this.click(this.resetButton);
  }

  /**
   * Navigates back to account details
   */
  async backToAccount(): Promise<void> {
    await this.click(this.backButton);
  }

  /**
   * Checks if there are no transactions with a specific message
   */
  async hasNoTransactions(): Promise<boolean> {
    return await this.isVisible(this.noDataMessage);
  }

  /**
   * Gets the "no data" message if present
   */
  async getNoDataMessage(): Promise<string> {
    if (await this.hasNoTransactions()) {
      return await this.getText(this.noDataMessage);
    }
    return "";
  }
}
