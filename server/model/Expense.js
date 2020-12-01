const mongoose = require('mongoose')
const Schema = mongoose.Schema

mongoose.connect("mongodb://localhost/expensesDB")

const expenseSchema = new Schema({
    name: String,
    amount: Number,
    date: Date,
    group: String
})

const Expense = mongoose.model("expense", expenseSchema)

module.exports = Expense