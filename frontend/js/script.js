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


// Locker checkout process
const lockerContainer = document.querySelector('.locker-container');
const selectedLockersPanel = document.getElementById('selected-lockers');
const checkoutMessage = document.getElementById('checkout-message');
let selectedLockers = []; // Initialize an array to keep track of selected lockers

// Function to update the selected lockers display in the scroll panel
function updateSelectedLockersPanel() {
  selectedLockersPanel.innerHTML = ''; // Clear the panel before updating
  // Loop through the selected lockers and create div elements for each
  selectedLockers.forEach(lockerId => {
    const lockerDiv = document.createElement('div');
    lockerDiv.classList.add('reserved-locker');
    lockerDiv.textContent = 'Selected: ' + lockerId;
    selectedLockersPanel.appendChild(lockerDiv);
  });
}

// Event listener for click events on the locker container
lockerContainer.addEventListener('click', function(event) {
  const target = event.target;
  // Check if the clicked element is a locker
  if(target.classList.contains('locker')) {
    const lockerId = target.dataset.lockerId;
    // Toggle the 'selected' state of the locker
    if(target.classList.contains('selected')) {
      // If already selected, remove from the array and unstyle
      target.classList.remove('selected');
      selectedLockers = selectedLockers.filter(id => id !== lockerId);
    } else {
      // If not selected, add to the array and apply styling
      target.classList.add('selected');
      selectedLockers.push(lockerId);
    }
    // Update the scroll panel to reflect the current selection
    updateSelectedLockersPanel();
  }
});

// Event listener for the checkout button
document.getElementById('checkout-btn').addEventListener('click', function() {
  // Check if any lockers are selected
  if(selectedLockers.length === 0) {
    // Inform the user that they need to select a locker
    checkoutMessage.textContent = "Please select a locker you want to check out of.";
    checkoutMessage.classList.remove('hidden');
  } else {
    // Ask for confirmation to checkout
    const confirmation = confirm("You are about to check out of the selected locker(s): " + selectedLockers.join(', ') + ". Do you want to proceed?");
    
    if (confirmation) {
      // Handle the checkout process
      selectedLockers.forEach(lockerId => {
        // Find and remove the locker from the locker container
        const lockerDiv = lockerContainer.querySelector(`.locker[data-locker-id="${lockerId}"]`);
        lockerDiv.remove();
      });
      
      // Update the user on successful checkout
      checkoutMessage.textContent = "Checked out successfully.";
      
      // Reset the selected lockers array as they have been checked out
      selectedLockers = [];
      
      // Clear the selection panel
      updateSelectedLockersPanel();
      checkoutMessage.classList.remove('hidden');
    }
  }
});