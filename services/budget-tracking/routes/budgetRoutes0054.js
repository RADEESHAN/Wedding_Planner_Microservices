const express = require('express');
const router = express.Router();
const BudgetController = require('../controllers/BudgetController0054');

// Set a budget
router.post('/budgets', BudgetController.setBudget0054);

// Update expenses
router.post('/budgets/:weddingId/expenses', BudgetController.updateExpenses0054);

// Get a summary of expenses vs. budget
router.get('/budgets/:weddingId/summary', BudgetController.getExpenseSummary0054);

// View individual expense details
router.get('/budgets/:weddingId/expenses/:expenseId', BudgetController.viewExpenseDetails0054);

router.post('/budgets/:weddingId/expenses/vendor', BudgetController.addExpenseWithVendor0054);


module.exports = router;
