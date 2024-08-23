function showPrompt(message, placeholder, callback) {
    // Create the prompt container
    var promptContainer = document.createElement('div');
    promptContainer.className = 'prompt-container';

    // Create the prompt box
    var promptBox = document.createElement('div');
    promptBox.className = 'prompt-box';

    // Create the message element
    var messageElement = document.createElement('p');
    messageElement.textContent = message;

    // Create the input field
    var inputField = document.createElement('input');
    inputField.type = 'password';
    inputField.placeholder = placeholder;
    inputField.className = 'prompt-input';

    // Create the submit button
    var submitButton = document.createElement('button');
    submitButton.textContent = 'OK';
    submitButton.addEventListener('click', function() {
        var userInput = inputField.value.trim();
        callback(userInput);
        document.body.removeChild(promptContainer);
    });

    // Append elements to promptBox
    promptBox.appendChild(messageElement);
    promptBox.appendChild(inputField);
    promptBox.appendChild(submitButton);

    // Append promptBox to promptContainer
    promptContainer.appendChild(promptBox);

    // Append promptContainer to body
    document.body.appendChild(promptContainer);
}

function showMessageBox(message, callback) {
    // Create the message box container
    var messageBoxContainer = document.createElement('div');
    messageBoxContainer.className = 'message-box-container';

    // Create the message box
    var messageBox = document.createElement('div');
    messageBox.className = 'message-box';

    // Create the message element
    var messageElement = document.createElement('p');
    messageElement.textContent = message;

    // Create the OK button
    var okButton = document.createElement('button');
    okButton.textContent = 'OK';
    okButton.addEventListener('click', function() {
        document.body.removeChild(messageBoxContainer);
        if (callback) {
            callback();
        }
    });

    // Append elements to messageBox
    messageBox.appendChild(messageElement);
    messageBox.appendChild(okButton);

    // Append messageBox to messageBoxContainer
    messageBoxContainer.appendChild(messageBox);

    // Append messageBoxContainer to body
    document.body.appendChild(messageBoxContainer);
}
