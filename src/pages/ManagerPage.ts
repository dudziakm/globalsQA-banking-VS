import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

/**
 * Manager Page class representing the bank manager operations
 */
export class ManagerPage extends BasePage {
  // Locators
  readonly addCustomerBtn: Locator;
  readonly openAccountBtn: Locator;
  readonly customersBtn: Locator;

  // Add Customer Form Locators
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postCodeInput: Locator;
  readonly addCustomerSubmitBtn: Locator;

  // Open Account Form Locators
  readonly customerSelectDropdown: Locator;
  readonly currencySelectDropdown: Locator;
  readonly processBtn: Locator;

  // Customers List Locators
  readonly searchCustomerInput: Locator;
  readonly deleteCustomerBtns: Locator;
  readonly customerRows: Locator;

  constructor(page: Page) {
    super(page);

    // Main navigation
    this.addCustomerBtn = page.locator('button[ng-click="addCust()"]');
    this.openAccountBtn = page.locator('button[ng-click="openAccount()"]');
    this.customersBtn = page.locator('button[ng-click="showCust()"]');

    // Add Customer Form
    this.firstNameInput = page.locator('input[ng-model="fName"]');
    this.lastNameInput = page.locator('input[ng-model="lName"]');
    this.postCodeInput = page.locator('input[ng-model="postCd"]');
    this.addCustomerSubmitBtn = page.locator('button[type="submit"]');

    // Open Account Form
    this.customerSelectDropdown = page.locator("#userSelect");
    this.currencySelectDropdown = page.locator("#currency");
    this.processBtn = page.locator('button[type="submit"]');

    // Customers List
    this.searchCustomerInput = page.locator('input[ng-model="searchCustomer"]');
    this.deleteCustomerBtns = page.locator(
      'button[ng-click="deleteCust(cust)"]'
    );
    this.customerRows = page.locator("tbody tr");
  }

  /**
   * Navigates to Add Customer form
   */
  async navigateToAddCustomer(): Promise<void> {
    await this.click(this.addCustomerBtn);
  }

  /**
   * Navigates to Open Account form
   */
  async navigateToOpenAccount(): Promise<void> {
    await this.click(this.openAccountBtn);
  }

  /**
   * Navigates to Customers list
   */
  async navigateToCustomers(): Promise<void> {
    await this.click(this.customersBtn);
  }

  /**
   * Adds a new customer
   * @param firstName - Customer's first name
   * @param lastName - Customer's last name
   * @param postCode - Customer's post code
   * @returns Alert message
   */
  async addCustomer(
    firstName: string,
    lastName: string,
    postCode: string
  ): Promise<string> {
    await this.navigateToAddCustomer();
    await this.fill(this.firstNameInput, firstName);
    await this.fill(this.lastNameInput, lastName);
    await this.fill(this.postCodeInput, postCode);
    await this.click(this.addCustomerSubmitBtn);

    // Handle the alert and capture the message
    const alertMessage = await this.page.evaluate(() => {
      return (window.alert = (msg) => msg);
    });

    return alertMessage;
  }

  /**
   * Opens a new account for a customer
   * @param customerName - Name of the customer
   * @param currency - Currency for the account
   * @returns Alert message
   */
  async openAccount(customerName: string, currency: string): Promise<string> {
    await this.navigateToOpenAccount();
    await this.selectOption(this.customerSelectDropdown, customerName);
    await this.selectOption(this.currencySelectDropdown, currency);
    await this.click(this.processBtn);

    // Handle the alert and capture the message
    const alertMessage = await this.page.evaluate(() => {
      return (window.alert = (msg) => msg);
    });

    return alertMessage;
  }

  /**
   * Searches for a customer
   * @param searchText - Text to search for
   */
  async searchCustomer(searchText: string): Promise<void> {
    await this.navigateToCustomers();
    await this.fill(this.searchCustomerInput, searchText);
  }

  /**
   * Deletes a customer by index
   * @param index - Index of customer to delete (0-based)
   */
  async deleteCustomer(index: number): Promise<void> {
    const deleteButtons = await this.deleteCustomerBtns.all();
    if (index < deleteButtons.length) {
      await deleteButtons[index].click();
    } else {
      throw new Error(`Customer at index ${index} does not exist`);
    }
  }

  /**
   * Gets the number of customers in the list
   */
  async getCustomerCount(): Promise<number> {
    return await this.customerRows.count();
  }
}
