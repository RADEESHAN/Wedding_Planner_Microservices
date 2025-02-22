const Budget = require('../models/Budget0054');
const axios = require('axios');
const dotenv = require('dotenv');

// Set a budget
exports.setBudget0054 = async (req, res) => {
    try {
        const { weddingId, totalBudget } = req.body;

        // Verify that the wedding event exists by calling Event Management Service
        const eventResponse = await axios.get(`${process.env.EVENT_SERVICE_URL}/api/events/${weddingId}`);
        
        if (!eventResponse.data) {
            return res.status(404).json({ message: 'Wedding event not found' });
        }

        const budget = new Budget({ weddingId, totalBudget, expenses: [] });
        await budget.save();
        res.status(201).json(budget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Update expenses
exports.updateExpenses0054 = async (req, res) => {
    try {
        const budget = await Budget.findOne({ weddingId: req.params.weddingId });
        if (!budget) return res.status(404).json({ message: 'Budget not found' });

        budget.expenses.push(req.body);
        await budget.save();
        res.json(budget);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get a summary of expenses vs. budget
exports.getExpenseSummary0054 = async (req, res) => {
    try {
        const budget = await Budget.findOne({ weddingId: req.params.weddingId });
        if (!budget) return res.status(404).json({ message: 'Budget not found' });

        const totalExpenses = budget.expenses.reduce((acc, expense) => acc + expense.amount, 0);
        const remainingBudget = budget.totalBudget - totalExpenses;

        res.json({
            totalBudget: budget.totalBudget,
            totalExpenses,
            remainingBudget,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View individual expense details
exports.viewExpenseDetails0054 = async (req, res) => {
    try {
        const budget = await Budget.findOne({ weddingId: req.params.weddingId });
        if (!budget) return res.status(404).json({ message: 'Budget not found' });

        const expense = budget.expenses.id(req.params.expenseId);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });

        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.addExpenseWithVendor0054 = async (req, res) => {
    try {
        const { vendorId, amount, description, category } = req.body;

        // Fetch vendor details
        const vendorResponse = await axios.get(`${process.env.VENDOR_SERVICE_URL}/api/vendors/${vendorId}`);
        if (!vendorResponse.data) {
            return res.status(404).json({ message: 'Vendor not found' });
        }

        // Add expense to budget
        const expense = {
            vendorId,
            vendorName: vendorResponse.data.name,
            amount,
            description,
            category,
        };

        const budget = await Budget.findOne({ weddingId: req.params.weddingId });
        if (!budget) {
            return res.status(404).json({ message: 'Budget not found' });
        }

        budget.expenses.push(expense);
        await budget.save();
        res.status(201).json(budget);
    } catch (error) {
        res.status(500).json({ message: 'Error adding expense', error: error.message });
    }
};