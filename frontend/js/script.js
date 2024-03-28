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

// User clicking on locker or checkbox
lockerContainer.addEventListener('click', function(event) {
  let target = event.target;
  if (target.classList.contains('locker-checkbox')) {
    // If the click is on the checkbox, find the parent locker element
    target = target.closest('.locker');
  }
  
  const lockerId = target.dataset.lockerId;
  if (lockerId) {
    const locker = target;
    const checkbox = locker.querySelector('.locker-checkbox');
    
    // Toggle 'selected' class and checkbox checked status
    if (locker.classList.contains('selected')) {
      locker.classList.remove('selected');
      checkbox.checked = false;
      selectedLockers = selectedLockers.filter(id => id !== lockerId);
    } else {
      locker.classList.add('selected');
      checkbox.checked = true;
      if (!selectedLockers.includes(lockerId)) {
        selectedLockers.push(lockerId);
      }
    }
    updateSelectedLockersPanel();
  }
});

document.getElementById('checkout-btn').addEventListener('click', function() {
  if(selectedLockers.length === 0) {
    checkoutMessage.textContent = "Please select a locker you want to check out of";
    checkoutMessage.classList.remove('hidden');
  } else {
    const confirmation = confirm("You are about to check out of the selected locker(s): "
      + selectedLockers.join(', ') + ". Do you want to proceed?");
    
    if (confirmation) {
      // Logic to handle the actual checkout process would go here
      selectedLockers.forEach(lockerId => {
        // Remove the locker from the display
        const lockerDiv = lockerContainer.querySelector(`.locker[data-locker-id="${lockerId}"]`);
        lockerDiv.remove();
      });
      checkoutMessage.textContent = "Checked out successfully.";
      selectedLockers = [];
      updateSelectedLockersPanel();
      checkoutMessage.classList.remove('hidden');
    }
  }
});