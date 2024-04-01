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


