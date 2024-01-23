// Load XML data from external file
let xmlData;
let xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        xmlData = this.responseText;
        initializeApp();
    }
};
xhttp.open("GET", "items.xml", true);
xhttp.send();

function initializeApp() {
    // Parse XML string to XML document
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xmlData, 'application/xml');

    // Populate item list
    let itemListTable = document.getElementById('itemList');
    
    let items = xmlDoc.querySelectorAll('item');
    items.forEach(item => {
        let itemName = item.querySelector('foodName').textContent;
        let itemPrice = parseFloat(item.querySelector('price').textContent);

        let row = itemListTable.insertRow();
        row.innerHTML = `
            <td><input type="checkbox" value="${itemPrice}" data-itemname="${itemName}"></td>
            <td>${itemName}</td>
            <td>$${itemPrice.toFixed(2)}</td>
            <td><input type="number" min="1" data-itemname="${itemName}" class="quantity-input"></td>
        `;
    });
}

function createCheckbox() {
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    return checkbox;
}

function addItem() {
    let selectedItems = document.querySelectorAll('#itemList input[type="checkbox"]:checked');
    
    selectedItems.forEach(item => {
        let foodName = item.getAttribute('data-itemname');
        let price = parseFloat(item.value);

        // Find the corresponding quantity input
        let quantityInput = document.querySelector(`.quantity-input[data-itemname="${foodName}"]`);
        let quantity = parseInt(quantityInput.value);

        if (quantity > 0) {
            let total = price * quantity;

            let itemsTable = document.getElementById('billItems');

            // Add row to the table
            let row = itemsTable.insertRow();
            row.innerHTML = `
                <td>${foodName}</td>
                <td>${price.toFixed(2)}</td>
                <td>${quantity}</td>
                <td>${total.toFixed(2)}</td>
            `;
        }
    });

    // Clear checkboxes and quantity inputs
    selectedItems.forEach(item => {
        item.checked = false;
        let foodName = item.getAttribute('data-itemname');
        let quantityInput = document.querySelector(`.quantity-input[data-itemname="${foodName}"]`);
        quantityInput.value = "";
    });

    // Update total amount
    updateTotal();
}

function updateTotal() {
    // Clear existing checkboxes
    let checkboxes = document.querySelectorAll('.checkbox-column');
    checkboxes.forEach(checkbox => {
        checkbox.parentNode.removeChild(checkbox);
    });

    // Add checkboxes to each row
    let rows = document.querySelectorAll('#billItems tr');
    rows.forEach(row => {
        let checkboxCell = row.insertCell(0);
        checkboxCell.className = 'checkbox-column';
        checkboxCell.appendChild(createCheckbox());
    });

    // Update total amount
    calculateTotal();
}

function calculateTotal() {
    let items = document.querySelectorAll('#billItems tr');
    let total = 0;

    items.forEach(item => {
        total += parseFloat(item.cells[4].textContent);
    });

    // Update total amount
    document.getElementById('total').textContent = total.toFixed(2);
}

function clearBillItems() {
    // Clear all rows in the bill table
    document.getElementById('billItems').innerHTML = '';

    // Update total amount
    updateTotal();
}

function removeItem(button) {
    let row = button.closest('tr');
    row.parentNode.removeChild(row);

    // Update total amount
    updateTotal();
}

function removeSelectedItems() {
    let selectedItems = document.querySelectorAll('#billItems input[type="checkbox"]:checked');
    
    selectedItems.forEach(item => {
        let row = item.closest('tr');
        removeItem(row);
    });

    // Update total amount
    updateTotal();
}

function generateBill() {
    // Open a new window for the bill
    let billWindow = window.open('', '_blank');

    // Create the bill content with proper formatting
    let billContent = `
        <html>
        <head>
            <title>Hotel Bill</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                }
                th, td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                #totalAmount {
                    margin-top: 20px;
                    font-weight: bold;
                }
            </style>
        </head>
        <body>
            <h1>Hotel Bill</h1>
            <table>
                <thead>
                    <tr>
                        <th>Food Name</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>`;

    let items = document.querySelectorAll('#billItems tr');
    items.forEach(item => {
        billContent += `
            <tr>
                <td>${item.cells[1].textContent}</td>
                <td>${item.cells[2].textContent}</td>
                <td>${item.cells[3].textContent}</td>
                <td>${item.cells[4].textContent}</td>
            </tr>`;
    });

    billContent += `
                </tbody>
            </table>
            <div id="totalAmount">Total Amount: $<span>${document.getElementById('total').textContent}</span></div>
        </body>
        </html>`;

    // Write the bill content to the new window
    billWindow.document.write(billContent);

    // Close the bill window
    billWindow.document.close();
}
// ... (Previous code remains unchanged)

function createRemoveButton() {
    let button = document.createElement('button');
    button.innerHTML = '❌'; // Unicode for a cross sign
    button.setAttribute('class', 'remove-button');
    button.addEventListener('click', function() {
        removeItem(this);
    });
    return button;
}

// ... (Previous code remains unchanged)

function updateTotal() {
    // Clear existing remove buttons
    let removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach(button => {
        button.parentNode.removeChild(button);
    });

    // Add remove buttons to each row
    let rows = document.querySelectorAll('#billItems tr');
    rows.forEach(row => {
        let removeButtonCell = row.insertCell(0);
        removeButtonCell.className = 'remove-button';
        removeButtonCell.appendChild(createRemoveButton());
    });

    // Update total amount
    calculateTotal();
}


function calculateTotal() {
    let items = document.querySelectorAll('#billItems tr');
    let total = 0;

    items.forEach(item => {
        total += parseFloat(item.cells[4].textContent);
    });

    // Update total amount
    document.getElementById('total').textContent = total.toFixed(2);
}
