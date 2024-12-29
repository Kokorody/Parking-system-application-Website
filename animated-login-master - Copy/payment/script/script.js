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
  }, 1500);
});

function showExtraFields(method) {
  var extraFieldsContainer = document.getElementById('extraFields');
  extraFieldsContainer.innerHTML = ''; // Clear previous fields
  
  if (method === 'bca' || method === 'bni' || method === 'bri' || method === 'mandiri') {
    var cardNumberInput = createTextInput('cardNumber', 'Enter card number', true);
    var expiryDateInput = createTextInput('expiryDate', 'MM/YY', true);
    
    extraFieldsContainer.appendChild(createInputGroup('Card Number', cardNumberInput));
    extraFieldsContainer.appendChild(createInputGroup('Expiry Date', expiryDateInput));
  } else if (method === 'gopay' || method === 'dana') {
    var phoneNumberInput = createTextInput('phoneNumber', 'Enter phone number', true);
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
    }
  });
  
  return isValid;
}

function resetForm() {
  document.getElementById('extraFields').innerHTML = '';
  document.getElementById('message').textContent = '';
}
