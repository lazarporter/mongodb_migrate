const async = require('async')
const mongodb = require('mongodb')
const path = require('path')
const fs = require('fs')

//read both files into variables in the memory.  That's where the merge takes place later.
const addressData = require(path.join(__dirname, 'files', 'm3-customer-address-data.json'))
const customerData = require(path.join(__dirname, 'files', 'm3-customer-data.json'))
var limit = parseInt(process.argv[2])
if (!limit) limit = 1000

const dbUrl = 'mongodb://localhost:27017'
const errorhandler = (error, fnName) => {
    console.log(`Error at ${fnName}: ${error}`)
    return process.exit(1)  //return so the rest of the function doesn't execute
}

//connect to the DB and then process the files
mongodb.MongoClient.connect(dbUrl, { useNewUrlParser: true }, (error, client) => {
    if (error) errorhandler(error, "MongoClient.Connect")
    var collection = client.db('edx-course-db').collection('bitCoin_accounts')
    console.log(`connected to ${dbUrl}`)

    var stack = [] // array to hold the functions


    //iterate through the whole customer file, which is in memory an array
    customerData.forEach((currentCustomer, index) => {

        //merge the each customer object with the address object in the matching position (index)
        currentCustomer = Object.assign(currentCustomer, addressData[index])

        //test the index to see if it is a multiple of the limit.
        //if so, insert from where we left off at the last insert (or the beginning, if first)
        if (index % limit == 0) {

            var end = index + limit
            if (end > customerData.length) end = customerData.length
            //create a function to insert the range of documents, and push it to the stack array
            stack.push((callback) => {
                console.log("Inserting " + limit + " records: " + parseInt(index+1) + " - " + end)
                collection.insertMany(customerData.slice(index, end), (error, results) => {
                    callback(error)
                })

            })
            //update the start and end for next time

        }

    });

    async.parallel(stack, (error, result) => {
        if (error) errorhandler(error, 'async')
        client.close()
    })
})