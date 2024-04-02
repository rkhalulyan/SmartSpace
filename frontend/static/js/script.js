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
    const rightPanel = document.querySelector('.right-panel');
    const lockerSelection = document.getElementById('lockerSelection'); // Make sure this is defined

    try {
        const response = await fetch('/populate-lockers');
        const lockers = await response.json();

        let previouslySelectedLocker = null;

        lockers.forEach(locker => {
            const option = document.createElement('option');
            option.value = locker.lockerNumber;
            option.textContent = `Locker ${locker.lockerNumber} - ${locker.type}`;
            lockerSelection.appendChild(option);

            const lockerDiv = document.createElement('div');
            lockerDiv.classList.add('locker');

            const lockerNumberDiv = document.createElement('div');
            lockerNumberDiv.classList.add('locker-number');
            lockerNumberDiv.textContent = `Locker ${locker.lockerNumber}`;
            lockerDiv.appendChild(lockerNumberDiv);

            const sizeLabel = document.createElement('div');
            sizeLabel.classList.add('size-label');
            sizeLabel.textContent = `${locker.type}`;
            lockerDiv.appendChild(sizeLabel);

            const price = locker.type === "small" ? 7 : 10; // Assuming $7 for small, $10 for large
            const priceLabel = document.createElement('div');
            priceLabel.classList.add('price');
            priceLabel.textContent = `$${price}`;
            lockerDiv.appendChild(priceLabel);

            lockerDiv.addEventListener('click', function() {
                // Remove 'locker-selected' class from the previously selected locker
                if (previouslySelectedLocker) {
                    previouslySelectedLocker.classList.remove('locker-selected');
                }
                // Add 'locker-selected' class to the current clicked locker
                this.classList.add('locker-selected');
                previouslySelectedLocker = this; // Update the reference to the current locker

                // Populate the dropdown with the locker number
                lockerSelection.value = locker.lockerNumber;
            });
            rightPanel.appendChild(lockerDiv);
        });
    } catch (error) {
        console.error('Failed to fetch lockers:', error);
    }
});
