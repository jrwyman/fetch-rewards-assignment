const express = require('express');

const router = express.Router();

// NON-PERSISTENT DATA STORE //

const transactions = [
  { "payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z" },
  { "payer": "UNILEVER", "points": 200, "timestamp": "2020-10-31T11:00:00Z" },
  { "payer": "DANNON", "points": -200, "timestamp": "2020-10-31T15:00:00Z" },
  { "payer": "MILLER COORS", "points": 10000, "timestamp": "2020-11-01T14:00:00Z" },
  { "payer": "DANNON", "points": 300, "timestamp": "2020-10-31T10:00:00Z" },
];

// Check transactions pool route

router.get('/transactions', (req, res) => {
  res.json(transactions);
});

// Add transaction route

router.post('/transaction', (req, res) => {
  transactions.push(
    {
      payer: req.body.payer,
      points: req.body.points,
      timestamp: req.body.timestamp || Date(),
    },
  );

  res.json(req.body);
});

// Spend points route

function spendPoints(transactionsList, pointsAvailable) {
  const result = transactionsList.reduce((totalSpent, transaction, i) => {
    const { payer, points } = transaction;

    if (pointsAvailable > 0) {
      if (pointsAvailable > points) {
        if (totalSpent[payer]) {
          totalSpent[payer] -= points;
        } else {
          totalSpent[payer] = 0 - points;
        }
        transactions[i].points = 0;
        pointsAvailable -= points;
      } else {
        if (totalSpent[payer]) {
          totalSpent[payer] -= pointsAvailable;
        } else {
          totalSpent[payer] = 0 - pointsAvailable;
        }
        transactions[i].points -= pointsAvailable;
        pointsAvailable = 0;
      }
    }
    return totalSpent;
  }, {});

  return result;
}

function getTotalPoints(transactions) {
  const totalPoints = transactions.reduce((currentTotal, currentValue) => (
    currentTotal + currentValue.points
  ), 0);
  return totalPoints;
}

router.post('/spend', (req, res) => {
  const requestedPoints = req.body.points;

  const maxPoints = getTotalPoints(transactions);

  if (maxPoints < requestedPoints) {
    return res.json('Not enough points!');
  }

  const sortedTransactions = transactions.sort((a, b) => (
    (a.timestamp > b.timestamp) ? 1 : -1
  ));

  const spentPoints = spendPoints(sortedTransactions, requestedPoints);

  const output = Object.keys(spentPoints).map((payer) => ({ payer, points: spentPoints[payer] }));

  return res.json(output);
});

// Show remaining balance (by "payer") route

function getBalance() {
  const balance = transactions.reduce((currentBalance, transaction) => {
    const { payer, points } = transaction;
    if (currentBalance[payer]) {
      currentBalance[payer] += points;
    } else {
      currentBalance[payer] = points;
    }

    return currentBalance;
  }, {});

  return balance;
}

router.get('/balance', (req, res) => {
  const balance = getBalance();

  res.json(balance);
});

module.exports = router;
