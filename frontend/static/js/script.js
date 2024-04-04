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

    currentUser = userID;
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