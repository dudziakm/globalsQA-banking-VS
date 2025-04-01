import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { CustomerPage } from "../pages/CustomerPage";
import { ManagerPage } from "../pages/ManagerPage";
import { TransactionsPage } from "../pages/TransactionsPage";
import { Logger } from "../utils/Logger";

/**
 * Custom test fixture with page objects for banking application
 */
export const test = base.extend({
  /**
   * Setup custom fixture for LoginPage
   */
  loginPage: async ({ page }, use) => {
    Logger.info("Setting up LoginPage fixture");
    const loginPage = new LoginPage(page);
    await loginPage.navigateToLoginPage();
    await use(loginPage);
  },

  /**
   * Setup custom fixture for CustomerPage
   */
  customerPage: async ({ page }, use) => {
    Logger.info("Setting up CustomerPage fixture");
    const customerPage = new CustomerPage(page);
    await use(customerPage);
  },

  /**
   * Setup custom fixture for ManagerPage
   */
  managerPage: async ({ page, loginPage }, use) => {
    Logger.info("Setting up ManagerPage fixture");
    const managerPage = new ManagerPage(page);
    await use(managerPage);
  },

  /**
   * Setup custom fixture for TransactionsPage
   */
  transactionsPage: async ({ page }, use) => {
    Logger.info("Setting up TransactionsPage fixture");
    const transactionsPage = new TransactionsPage(page);
    await use(transactionsPage);
  },

  /**
   * Setup custom fixture for logged in customer
   * This logs in as Hermione Granger by default
   */
  loggedInCustomer: async ({ page, loginPage, customerPage }, use) => {
    Logger.info("Setting up loggedInCustomer fixture");
    await loginPage.navigateToLoginPage();
    await loginPage.clickCustomerLogin();
    await customerPage.selectCustomer("Hermoine Granger");
    await customerPage.login();
    Logger.info("Customer logged in successfully");

    await use(customerPage);

    // Cleanup
    try {
      if (await customerPage.logoutButton.isVisible()) {
        await customerPage.logout();
      }
    } catch (error) {
      Logger.warning("Could not log out at the end of the test");
    }
  },

  /**
   * Setup custom fixture for logged in manager
   */
  loggedInManager: async ({ page, loginPage, managerPage }, use) => {
    Logger.info("Setting up loggedInManager fixture");
    await loginPage.navigateToLoginPage();
    await loginPage.clickBankManagerLogin();

    await use(managerPage);
  },
});

export { expect } from "@playwright/test";
