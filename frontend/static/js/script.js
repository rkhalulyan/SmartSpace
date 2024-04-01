// Function to move focus or shift it back based on input type or field content length
function moveFocus(currentElement, event) {
    if (event.inputType === 'deleteContentBackward' && currentElement.previousElementSibling && currentElement.previousElementSibling.classList.contains('pin-input')) {
        currentElement.previousElementSibling.focus();
    } else if (currentElement.value.length === 1 && currentElement.nextElementSibling && currentElement.nextElementSibling.classList.contains('pin-input')) {
        currentElement.nextElementSibling.focus();
    }
}

// Function to add event listeners once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Event listener for the check-in button
    var checkInButton = document.getElementById('check-in-button');
    if (checkInButton) {
        checkInButton.addEventListener('click', function() {
            window.location.href = '/check-in';
        });
    }

    // Event listener for the check-out button
    var checkOutButton = document.getElementById('check-out-button'); // Changed variable name here
    if (checkOutButton) {
        checkOutButton.addEventListener('click', function() {
            window.location.href = '/check-out';
        });
    }

    // Attach input event listeners to PIN input fields
    var pinInputs = document.querySelectorAll('.pin-input');
    pinInputs.forEach(function(input) {
        input.addEventListener('input', function(event) {
            moveFocus(this, event);
        });

        input.addEventListener('keydown', function(event) {
            if (event.key === "Backspace" && this.value.length === 0) {
                moveFocus(this, event);
            }
        });
    });
});