// Locker reservation process
document.getElementById("reserve").addEventListener("click", function() {
    var selectedLocker = document.getElementById("lockerNo").value;

    // Logic to check locker status
    // This should be replaced with actual logic to check the status from the backend
    if (selectedLocker === "occupiedLockerNumber") { // Replace with actual condition to check if the locker is occupied
        alert("This locker is occupied. Please choose another one.");
    } else {
        var confirmReservation = confirm("You are about to reserve locker number "
            + selectedLocker + ". \n\nYou may check out at any time at $3 a day, "
            + "which will be totaled at the time you check out."
            + "\n\nDo you want to proceed?");
        // Price is obviously not final, not sure how often we should charge the user

        if (confirmReservation) {
            // Logic to mark the locker as reserved by the user
            alert("Locker reserved successfully!");
            
            // Update the locker status visually, change the class to 'userLocker' to make it yellow
        }
    }
});