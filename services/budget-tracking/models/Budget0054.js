const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema({
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true }, // e.g., catering, photography
}, { _id: false });

const BudgetSchema = new mongoose.Schema({
    weddingId: { type: String, required: true }, // Reference to wedding event
    totalBudget: { type: Number, required: true },
    expenses: [ExpenseSchema],
}, { timestamps: true });

module.exports = mongoose.model(`Budget${process.env.INDEX_NUMBER}`, BudgetSchema);
