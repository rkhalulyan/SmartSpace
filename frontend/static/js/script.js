// Function to move focus or shift it back based on input type or field content length
function moveFocus(currentElement, event) {
    if (event.inputType === 'deleteContentBackward' && currentElement.previousElementSibling && currentElement.previousElementSibling.classList.contains('pin-input')) {
        // Move focus to the previous element if it exists and is a pin-input, when backspace is pressed
        currentElement.previousElementSibling.focus();
    } else if (currentElement.value.length === 1 && currentElement.nextElementSibling && currentElement.nextElementSibling.classList.contains('pin-input')) {
        // Move focus to the next element if it exists and is a pin-input, when a digit is entered
        currentElement.nextElementSibling.focus();
    }
}

// Function to add event listeners once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Event listener for the check-in button
    var checkInButton = document.getElementById('check-in-button');
    if(checkInButton) {
        checkInButton.addEventListener('click', function() {
            window.location.href = '/check-in';
        });
    }

    // Event listener for the check-out button
    var checkInButton = document.getElementById('check-out-button');
    if(checkInButton) {
        checkInButton.addEventListener('click', function() {
            window.location.href = '/check-out';
        });
    }

    // Attach input event listeners to PIN input fields
    var pinInputs = document.querySelectorAll('.pin-input');
    pinInputs.forEach(function(input) {
        input.addEventListener('input', function(event) {
            moveFocus(this, event); // Call moveFocus when input event occurs
        });

        input.addEventListener('keydown', function(event) {
            if (event.key === "Backspace" && this.value.length === 0) {
                moveFocus(this, event); // Adjust focus based on backspace at the start of input
            }
        });
    });
});

document.addEventListener('DOMContentLoaded', async function() {
    const lockerSelection = document.getElementById('lockerSelection');
    const summaryLockerNumber = document.getElementById('summaryLockerNumber');
    const summaryLockerSize = document.getElementById('summaryLockerSize');
    const summaryTotalCost = document.getElementById('summaryTotalCost');
    const submitButton = document.getElementById('submit');

    // Function to update check-in summary and highlight selected locker
    function updateCheckInSummary(lockerNumber, lockerType, lockerCost) {
        // Update the check-in summary text
        summaryLockerNumber.textContent = `Locker Number: ${lockerNumber}`;
        summaryLockerSize.textContent = `Locker Size: ${lockerType}`;
        summaryTotalCost.textContent = `Total Cost: $${lockerCost}`;

        // Highlight the selected locker
        document.querySelectorAll('.locker').forEach(locker => {
            if(locker.dataset.lockerNumber == lockerNumber) {
                locker.classList.add('locker-selected');
            } else {
                locker.classList.remove('locker-selected');
            }
        });
    }

    const currentUser = userID;
    let price_global;
    // Populate lockers and attach event listeners
    const response = await fetch('/populate-lockers');
    const lockers = await response.json();
    console.log(lockers);
    lockers.forEach(locker => {
        console.log(locker);
        // Create locker div and append to the right panel
        const lockerDiv = document.createElement('div');
        lockerDiv.classList.add('locker');
        lockerDiv.dataset.lockerNumber = locker.lockerNumber; // Custom data attribute to store locker number
   

        let lockerStatus = ""; // Default, no additional label
        let price = locker.type === "small" ? 7 : 10; // Example price determination
        price_global = price;
    
        if (locker.customer) {
            if (locker.customer === currentUser) {
                lockerDiv.classList.add('your-locker'); // Apply a 'your-locker' CSS class for styling
                lockerStatus = "<div class='locker-status'>Your Locker</div>";
            } else {
                lockerDiv.classList.add('rented-locker'); // Apply a 'rented-locker' CSS class
                lockerStatus = "<div class='locker-status'>Rented</div>";
            }
        } else {
            lockerDiv.classList.add('available-locker'); // Apply an 'available-locker' CSS class
        }

        lockerDiv.innerHTML = `
        <div class='locker-number'>Locker ${locker.lockerNumber}</div>
        <div class='size-label'>${locker.type.toUpperCase()}</div>
        <div class='price'>$${price}</div>
        ${lockerStatus}`; // Include the locker status label in the inner HTML
    
        document.querySelector('.right-panel').appendChild(lockerDiv);
        // Create option element and append to the dropdown
        if (!locker.customer) {
            const option = document.createElement('option');
            option.value = locker.lockerNumber;
            option.dataset.type = locker.type; // Store locker type in option for easy access
            option.textContent = `Locker ${locker.lockerNumber} - ${locker.type.toUpperCase()}`;
            lockerSelection.appendChild(option);
             // Click event on locker div
            lockerDiv.addEventListener('click', () => {
                lockerSelection.value = locker.lockerNumber; // Update dropdown
                updateCheckInSummary(locker.lockerNumber, locker.type.toUpperCase(), locker.type === "small" ? 7 : 10);
        });
        }
    });

    // Change event on dropdown selection
    lockerSelection.addEventListener('change', () => {
        const selectedOption = lockerSelection.options[lockerSelection.selectedIndex];
        updateCheckInSummary(selectedOption.value, selectedOption.dataset.type.toUpperCase(), selectedOption.dataset.type === "small" ? 7 : 10);
    });
    
    // Handles submit button logic
    submitButton.addEventListener('click', async function() {
        selectedLocker = lockerSelection.value;
        if (selectedLocker){
            await assignLocker(userID, selectedLocker, price_global)
        } else {
            console.log('Please select a locker!')
        }
    });

});

document.addEventListener('DOMContentLoaded', function() {
    const creditCardButton = document.getElementById('creditCardButton');
    const creditCardForm = document.getElementById('creditCardForm');

    // Toggle credit card form visibility
    creditCardButton.addEventListener('click', function() {
        creditCardForm.style.display = creditCardForm.style.display === "none" ? "block" : "none";
        creditCardButton.textContent = creditCardForm.style.display === "block" ? "Hide Credit Card Form" : "Credit Card Information";
    });
});

async function assignLocker(userID, lockerSelection, price_global) {
    const credentials = {
        user_id: userID,
        lockerNumber: lockerSelection
    };
    try {
        const response = await fetch("/submit-check-in", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Success:', result);
        alert(`Locker assigned successfully!\nTotal Amount Charged: $${price_global} Dollars!`);


        console.log("result" + result);
        console.log("credentials " + credentials);

        window.location.href = '/'; 

        return result;
    } catch (error) {
        console.error('Error during fetch operation:', error);
        alert('Failed to assign locker.');
    }
}


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