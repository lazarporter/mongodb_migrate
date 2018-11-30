const async = require('async')
const mongodb = require('mongodb')
const path = require('path')

const addressData = require(path.join(__dirname, 'files', 'm3-customer-address-data.json'))
const customerData = require(path.join(__dirname, 'files', 'm3-customer-data.json'))

var stack = []
const dbUrl = 'mongodb://localhost:27017'
const errorhandler = error => {
    console.log(`Error connecting to database: ${error}`)
    return process.exit(1)  //return so the rest of the function doesn't execute
}

//connect to the DB and then process the files
mongodb.MongoClient.connect(dbUrl, { useNewUrlParser: true }, (error, client) => {
    if (error) errorhandler(error)
    var collection = client.db('edx-course-db').collection('bitCoin_accounts')
    console.log(`connected to ${dbUrl}`)

    //iterate through the whole customer file, which is an array
    customerData.forEach((currentCustomer, index) => {
        
    });


    async.parallel(stack,(error,result)=>{
        if (error) errorhandler(error)

        db.close()
    })
    process.exit(0)
})