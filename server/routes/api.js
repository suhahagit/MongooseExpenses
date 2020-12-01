const express = require('express')
const moment = require('moment')
const router = express.Router()

const Expense = require('../model/Expense')

router.get('/expenses', function (req, res) {
    if (req.query.d1) {
        if (req.query.d2) {
            const start = moment(req.query.d1).format()
            const end = moment(req.query.d2).format()
            Expense.find({ "date": { "$gte": start, "$lt": end } }).sort('-date').exec(function (err, expenses) {
                res.send(expenses)
            })
        } else {
            const start = moment(req.query.d1).format()
            Expense.find({ "date": { "$gte": start } }).sort('-date').exec(function (err, expenses) {
                res.send(expenses)
            })
        }
    } else {
        Expense.find({}).sort('-date').exec(function (err, expenses) {
            res.send(expenses)
        })
    }
})

router.post('/expense', function (req, res) {
    const expense = req.body
    let e = new Expense({
        name: expense.name,
        amount: expense.amount,
        group: expense.group,
        date: expense.date ? moment(expense.date).format('LLLL') : moment(Date.now()).format('LLLL')
    })
    const promise = e.save()
    promise.then(console.log(`amount: ${e.amount} spent on: ${e.group}`))
    res.end()
})

router.put('/update', function (req, res) {
    const groups = req.body //{"group1": "fun", "group2": "food"}
    Expense.findOneAndUpdate({ group: groups.group1 }, { $set: { group: groups.group2 } }, { new: true }, (err, expense) => {
        if (err) {
            console.log('error')
        }
        console.log(`changed groups from ${groups.group1} to ${groups.group2}`)
        res.send(`name of expense: ${expense.name} group changes from ${groups.group1} to ${groups.group2}`)
    })
})


router.get('/expenses/:group', function (req, res) {
    if (req.query.total) {
        Expense.aggregate([
            { $match: { group: req.params.group } },
            { $group: { _id: req.params.group, totalAmount: { $sum: '$amount' } } }
        ]).exec(function (err, expenses) {
            console.log(expenses)
            res.send(expenses)
        })
    } else {
        Expense.find({ group: req.params.group }, function (err, expenses) {
            res.send(expenses)
        })
    }
})

module.exports = router