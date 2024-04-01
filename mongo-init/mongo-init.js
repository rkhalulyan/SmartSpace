// Select the SmartSpace database
db = db.getSiblingDB('SmartSpace');

// Drop the collections if they already exist (for a clean start)
db.Users.drop();
db.Lockers.drop();

// Create the Users collection and insert some sample documents
db.Users.insertMany([
    { Username: "John101", Pin: 12345 },
    { Username: "Jane101", Pin: 6789 }
]);

// Fetch the user IDs
var johnId = db.Users.findOne({ Username: "John101" })._id;
var janeId = db.Users.findOne({ Username: "Jane101" })._id;

// Create the Lockers collection and insert sample documents, referencing User IDs
db.Lockers.insertMany([
    { LockerNumber: 1, CustomerId: johnId },
    { LockerNumber: 2, CustomerId: janeId }
]);

// Fetch and display all documents from Users collection
print("Users Collection:");
printjson(db.Users.find().toArray());

// Fetch and display all documents from Lockers collection, showing customer details
print("Lockers Collection:");
db.Lockers.find().forEach(function(locker) {
    var customerInfo = db.Users.findOne({ _id: locker.CustomerId });
    printjson({
        LockerNumber: locker.LockerNumber,
        Customer: customerInfo.Username  // Only displaying Username
    });
});

// Output a confirmation
print("Database initialized successfully.");
