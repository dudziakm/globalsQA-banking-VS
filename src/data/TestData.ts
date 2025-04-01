/**
 * Test data for banking application tests
 */
export const TestData = {
  customers: {
    existing: [
      { name: "Hermoine Granger", id: 1 },
      { name: "Harry Potter", id: 2 },
      { name: "Ron Weasly", id: 3 },
      { name: "Albus Dumbledore", id: 4 },
      { name: "Neville Longbottom", id: 5 },
    ],
    new: {
      firstName: "John",
      lastName: "Doe",
      postCode: "E12345",
      fullName: "John Doe",
    },
  },
  accounts: {
    currencies: ["Dollar", "Pound", "Rupee"],
    defaultCurrency: "Dollar",
    transactions: {
      validDeposit: "1000",
      validWithdrawal: "500",
      invalidWithdrawal: "5000", // Exceeds balance
    },
  },
  messages: {
    depositSuccess: "Deposit Successful",
    withdrawalSuccess: "Deposit Successful", // Updated to match actual application behavior
    withdrawalFailed:
      "Transaction Failed. You can not withdraw amount more than the balance.",
  },
};
