const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

let transactions = localStorage.getItem('transactions')!== null ? localStorageTransactions : [];

// Add user transaction
function addTransaction(e) {
    e.preventDefault();
    if(text.value.trim().length == 0){
        alert('Please enter transaction text.')
    } else {
        const transaction = {
            id: generateID(),
            text: text.value,
            amount: +amount.value
        };

        transactions.push(transaction);

        addTransactionDOM(transaction);

        updateValues();

        updateLocalStorage();

        text.value = '';
        amount.value= '';
    }

}

// Generate random ID

function generateID() {
    return Math.floor(Math.random() * 100000000)
}

// Function to display transactions in DOM
function addTransactionDOM(transaction) {
    // Get sign
    const sign = transaction.amount < 0 ? '-' : '+';
  
    const item = document.createElement('li');
  
    // Add class based on value
    item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');
  
    item.innerHTML = `
      ${transaction.text} <span>${sign}${Math.abs(
      transaction.amount
    )}</span> <button class="delete-btn" onclick="removeTransaction(${
      transaction.id})">x</button>
    `;
  
    list.appendChild(item);
}

// Update balance, income and expenses
function updateValues() {
    const amounts = transactions.map(transaction => transaction.amount);
    const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);
    // Calculate total income
    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => (acc+= item), 0)
        .toFixed(2);
    console.log(income)
    console.log(total);
    // calculate total expenses
    const expense = (amounts
        .filter(item => item < 0)
        .reduce((acc, item) => (acc += item), 0) * -1)
        .toFixed(2);
    console.log(expense);

    balance.innerText = `$${total}`;
    money_plus.innerText = `$${income}`;
    money_minus.innerText = `$${expense}`
}

function removeTransaction(id) {
    transactions = transactions.filter(transaction => transaction.id !== id);
    updateLocalStorage();

    init();
}

// Update local storage transactions
function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// init app
function init() {
    list.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

init();

form.addEventListener('submit', addTransaction);