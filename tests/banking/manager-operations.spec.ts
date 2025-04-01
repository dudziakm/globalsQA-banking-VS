import { expect } from "@playwright/test";
import { test } from "../../src/fixtures/bankingFixtures";
import { TestData } from "../../src/data/TestData";
import { Logger } from "../../src/utils/Logger";
import { TestHelper } from "../../src/utils/TestHelper";

test.describe("Bank Manager Operations", () => {
  test("should allow manager to add a new customer", async ({
    loginPage,
    managerPage,
    page,
  }) => {
    Logger.step("Navigating to login page");
    await loginPage.navigateToLoginPage();

    Logger.step("Logging in as Bank Manager");
    await loginPage.clickBankManagerLogin();

    // Generate a unique customer name to avoid potential conflicts if test runs multiple times
    const uniqueId = TestHelper.generateRandomString(5);
    const firstName = `${TestData.customers.new.firstName}${uniqueId}`;
    const lastName = TestData.customers.new.lastName;
    const postCode = TestData.customers.new.postCode;

    Logger.step(`Adding a new customer: ${firstName} ${lastName}`);

    // Set up dialog handler to capture alert message
    page.on("dialog", async (dialog) => {
      const message = dialog.message();
      Logger.info(`Dialog message: ${message}`);
      // Verify the alert message contains customer details
      expect(message).toContain("Customer added successfully");
      await dialog.accept();
    });

    await managerPage.navigateToAddCustomer();
    await managerPage.firstNameInput.fill(firstName);
    await managerPage.lastNameInput.fill(lastName);
    await managerPage.postCodeInput.fill(postCode);
    await managerPage.addCustomerSubmitBtn.click();

    // Verify customer was added by searching for them
    Logger.step("Verifying customer was added successfully");
    await managerPage.navigateToCustomers();
    await managerPage.searchCustomer(firstName);

    // Check if at least one row is visible (should be our newly added customer)
    expect(await managerPage.customerRows.count()).toBeGreaterThan(0);
  });

  test("should allow manager to open a new account for a customer", async ({
    loginPage,
    managerPage,
    page,
  }) => {
    Logger.step("Navigating to login page");
    await loginPage.navigateToLoginPage();

    Logger.step("Logging in as Bank Manager");
    await loginPage.clickBankManagerLogin();

    Logger.step("Opening a new account");

    // Set up dialog handler to capture alert message
    page.on("dialog", async (dialog) => {
      const message = dialog.message();
      Logger.info(`Dialog message: ${message}`);
      // Verify the alert message contains account details
      expect(message).toContain("Account created successfully");
      await dialog.accept();
    });

    await managerPage.navigateToOpenAccount();

    // Use an existing customer
    const customerName = TestData.customers.existing[1].name; // Harry Potter
    const currency = TestData.accounts.currencies[0]; // Dollar

    await managerPage.customerSelectDropdown.selectOption({
      label: customerName,
    });
    await managerPage.currencySelectDropdown.selectOption({ label: currency });
    await managerPage.processBtn.click();

    // Success verification is handled in the dialog event
  });

  test("should allow manager to delete a customer", async ({
    loginPage,
    managerPage,
    page,
  }) => {
    Logger.step("Navigating to login page");
    await loginPage.navigateToLoginPage();

    Logger.step("Logging in as Bank Manager");
    await loginPage.clickBankManagerLogin();

    // First add a new customer that we can safely delete
    const uniqueId = TestHelper.generateRandomString(5);
    const firstName = `ToDelete${uniqueId}`;
    const lastName = "Customer";
    const postCode = "Z9999";

    Logger.step(`Adding a temporary customer: ${firstName} ${lastName}`);

    // Handle the add customer alert
    page.on("dialog", async (dialog) => {
      await dialog.accept();
    });

    await managerPage.navigateToAddCustomer();
    await managerPage.firstNameInput.fill(firstName);
    await managerPage.lastNameInput.fill(lastName);
    await managerPage.postCodeInput.fill(postCode);
    await managerPage.addCustomerSubmitBtn.click();

    Logger.step(`Finding and deleting customer: ${firstName} ${lastName}`);
    await managerPage.navigateToCustomers();
    await managerPage.searchCustomer(firstName);

    // Store the initial customer count
    const initialCount = await managerPage.customerRows.count();
    expect(initialCount).toBeGreaterThan(0);

    // Delete the first customer in the filtered list (should be our newly added customer)
    await managerPage.deleteCustomer(0);

    // Verify the customer was deleted
    await managerPage.searchCustomer(firstName);
    const finalCount = await managerPage.customerRows.count();
    expect(finalCount).toBeLessThan(initialCount);
  });
});
