// Select the SmartSpace database
db = db.getSiblingDB('SmartSpace');

// Drop the collections if they already exist (for a clean start)
db.Users.drop();
db.Lockers.drop();

// Create the Users collection and insert some sample documents
db.Users.insertMany([
    { Name: "John Doe", PhoneNumber: "123-456-7890", Pin: 12345 },
    { Name: "Jane Smith", PhoneNumber: "987-654-3210", Pin: 56789 }
]);

// Fetch the user IDs
var johnDoeId = db.Users.findOne({ Name: "John Doe" })._id;
var janeSmithId = db.Users.findOne({ Name: "Jane Smith" })._id;

// Create the Lockers collection and insert sample documents, referencing User IDs
db.Lockers.insertMany([
    { LockerNumber: 1, CustomerId: johnDoeId, ObjectStored: "Backpack", StartDate: new Date("2024-01-01"), EndDate: new Date("2024-01-31") },
    { LockerNumber: 2, CustomerId: janeSmithId, ObjectStored: "Laptop", StartDate: new Date("2024-02-01"), EndDate: new Date("2024-02-28") }
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
        Customer: customerInfo.Name,
        ObjectStored: locker.ObjectStored,
        StartDate: locker.StartDate,
        EndDate: locker.EndDate
    });
});

// Output a confirmation
print("Database initialized successfully.");