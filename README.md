# Fetch Rewards Take Home Assignment

## This project was created with JavaScript running on Node.js

## Intructions


### Prerequisites
- Installation of the latest version of [Node.js](https://nodejs.org/en/).
- Installation of yarn package manager (npm works as well).
- Familiarization with Postman to test the API (using curl commands is acceptable as well).

### Running the Program
1. Clone the project repository onto your local machine.
2. Navigate to the top-level directory of the project in the terminal.
3. Install the dependencies using the command "yarn".
4. If using npm, delete the yarn.lock file and run "npm install".
5. Run the program using the command "yarn start" or "npm start".

### Routes

There are 4 routes in effect for this project.


#### Endpoint 1

```
http://localhost:5000/transactions
```
- This endpoint is used to generate a list of transactions in the users transaction pool.

```
curl http://localhost:5000/transactions/
```

Expected response:

```
[
  { "payer": "DANNON", "points": 1000, "timestamp": "2020-11-02T14:00:00Z" },
  { "payer": "UNILEVER", "points": 200, "timestamp": "2020-10-31T11:00:00Z" },
  { "payer": "DANNON", "points": -200, "timestamp": "2020-10-31T15:00:00Z" },
  { "payer": "MILLER COORS", "points": 10000, "timestamp": "2020-11-01T14:00:00Z" },
  { "payer": "DANNON", "points": 300, "timestamp": "2020-10-31T10:00:00Z" },
]
```

#### Endpoint 2

```
http://localhost:5000/transaction
```
- This endpoint is used to add a transaction to the users pool of transactions.
- By default, the example transactions have already been added to the pool (To start with an empty transaction pool, navigate over to server/routes/api.js and comment out the transactions found at the top of the page).
- Transactions added without a timestamp will automatically have the current date and time set as the timestamp.
- Custom transactions (with or without a timestamp) can be added as well using Postman OR by editing and executing the curl command listed below (objects can be provided in the body section of the request on Postman and must be sent in JSON format).

```
curl -H "Content-Type: application/json" -d "{\"payer\":\"DANNON\",\"points\":1000,\"timestamp\":\"2020-11-02T14:00:00Z\"}" http://localhost:5000/transaction
```

Expected response:

```
{
    "payer": "DANNON",
    "points": 1000,
    "timestamp": "2020-11-02T14:00:00Z"
}
```


#### Endpoint 3

```
http://localhost:5000/spend
```
- This endpoint is used to spend points that have been accumulated by the user through transactions.
- To test this route in Postman, simply provide an object with a key of "points", and a numerical value attached, and the program will deduct points according to the requirements outlined in the assignment (objects can be provided in the body section of the request on Postman and must be sent in JSON format).
- Upon success, the API will return an object showing the points deducted from each payer.
- The API will return an error if the user has not accumulated enough points between all of their transactions.
- The curl command below can be used to trigger this endpoint fron the terminal with a default value of 5000 points.

```
curl -H "Content-Type: application/json" -d "{\"points\":5000}" http://localhost:5000/spend
```

Expected response:

```
[
    {
        "payer": "DANNON",
        "points": -100
    },
    {
        "payer": "UNILEVER",
        "points": -200
    },
    {
        "payer": "MILLER COORS",
        "points": -4700
    }
]
```

#### Endpoint 4

```
http://localhost:5000/balance
```
- This endpoint is used to retrieve the total balance of the points awarded by each payer.
- Postman can be used to retrieve the balance as well as the curl command listed below.

```
curl http://localhost:5000/balance/
```
Expected response (before spending 5000 points):

```
[
    {
        "payer": "DANNON",
        "points": 1100
    },
    {
        "payer": "UNILEVER",
        "points": 200
    },
    {
        "payer": "MILLER COORS",
        "points": 10000
    }
]
```

Expected response (after spending 5000 points):

```
[
    {
        "payer": "DANNON",
        "points": 1000
    },
    {
        "payer": "UNILEVER",
        "points": 0
    },
    {
        "payer": "MILLER COORS",
        "points": 5300
    }
]
```
### Testing

You can run the tests I have implemented with the command "yarn test" or the command "npm test"
