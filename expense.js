
// ---BLOCK 1 ---- Retrieve available balance & saved wasted status ------- //


let availableBalance = localStorage.getItem('availableBalance');
if (availableBalance !== null) {
  document.getElementById('availableBalance').textContent = availableBalance;
} else {
  document.getElementById('availableBalance').textContent = 0;
}

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
let wastedStatus = JSON.parse(localStorage.getItem('wastedStatus')) || {};

function saveWastedStatus() {
  localStorage.setItem('wastedStatus', JSON.stringify(wastedStatus));
}

function saveExpenses() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
}


// ---BLOCK 2 ---- wasted/not wasted function ------- //  


function markAsWasted(row, expenseIndex) {
  row.classList.add('wasted-row');
  wastedStatus[expenseIndex] = true
  saveWastedStatus();
}

function markAsNotWasted(row, expenseIndex) {
  row.classList.remove('wasted-row');
  delete wastedStatus[expenseIndex];
  saveWastedStatus();
}

function handleWasteClick(event, expenseIndex) {
  const row = event.target.closest('tr'); // Find the closest row element
  if (row.classList.contains('wasted-row')) {
    markAsNotWasted(row, expenseIndex); // Mark the row as not wasted
  } else {
    markAsWasted(row, expenseIndex); // Mark the row as wasted
  }
}



// ---BLOCK 3 ---- Populate the table with expenses ------- //

let tableBody = document.getElementById('expenseTableBody');
expenses.forEach((expense, index) => {
  let row = tableBody.insertRow();
  let date = new Date(expense.date);
  let formattedDate = date.getDate() + " " + getMonthName(date.getMonth());
  row.innerHTML = `
        <td>${index + 1}</td>
        <td>${expense.money}</td>
        <td>${expense.description}</td>
        <td>${formattedDate}</td>
        <td>${expense.location}</td>
        <td>${expense.category}</td>
      `;
  let wasteCell = row.insertCell();
  wasteCell.innerHTML = `<span class="waste-icon" onclick="handleWasteClick(event, ${index})">Wasted?</span>`;
  if (wastedStatus[index]) {
    markAsWasted(row, index);
  }
});

// <img width="24" height="24" src="https://img.icons8.com/material-outlined/24/waste.png" alt="waste"/>

// ---BLOCK 4 ---- function to get month number ------- //


function getMonthName(monthNumber) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[monthNumber];
}



// ---BLOCK 5 ---- Clear Localstorage Function ------- //    

function confirmClearStorage() {
  if (expenses.length === 0) {
    document.getElementById('noDataMessage').style.display = 'block'; // Display no data message
  }
  else if (confirm("Are you sure ?")) {
    clearLocalStorage();
  }
}

function clearLocalStorage() {
  localStorage.clear();
  document.getElementById('successMessage').style.display = 'block'; // Display success message
  setTimeout(() => {
    document.getElementById('successMessage').style.display = 'none'; // Hide success message after 3 seconds
    location.reload(); // Reload the page to reflect changes
  }, 3000);
}


// ---BLOCK 6 ---- Add and update balance function ------- //    


function addBalance() {
  let balanceToAdd = parseFloat(prompt("How much ?"));
  if (!isNaN(balanceToAdd)) {
    availableBalance = parseFloat(availableBalance) + balanceToAdd;
    document.getElementById('availableBalance').textContent = availableBalance;
    localStorage.setItem('availableBalance', availableBalance)
    location.reload();

  }
}


// ---BLOCK 7 ---- function for handling downloading pdf ------- //  


function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const wastedStatus = JSON.parse(localStorage.getItem('wastedStatus')) || {};
  const availableBalance = localStorage.getItem('availableBalance');

  doc.setFontSize(18);
  doc.text('Past Expenses', 20, 20);

  doc.setFontSize(12);
  doc.text(`Available Balance: ${availableBalance} INR`, 20, 30);

  const tableHeader = ['#', 'Money (INR)', 'Description', 'Date', 'Location', 'Category', 'Outcome'];
  const tableRows = expenses.map((expense, index) => {
    const date = new Date(expense.date);
    const formattedDate = `${date.getDate()} ${getMonthName(date.getMonth())}`;
    const outcome = wastedStatus[index] ? 'Wasted' : '';
    return [
      index + 1,
      expense.money,
      expense.description,
      formattedDate,
      expense.location,
      expense.category,
      outcome,
    ];
  });

  doc.autoTable({
    head: [tableHeader],
    body: tableRows,
    startY: 35,
    styles: {
      fontSize: 10,
      cellPadding: 2,
    },
    didDrawCell: (data) => {
      if (wastedStatus[data.row.rowIndex - 1]) {
        doc.setFillColor(255, 204, 204); // Light red color for wasted expenses
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'FD');
        doc.setFillColor(0, 0, 0); // Reset fill color to black
      }
    },
  });

  doc.save('may-expenses.pdf');
}


// ---BLOCK 8 ---- function to get month name ------- //  

function getMonthName(monthNumber) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[monthNumber];
}


// ---BLOCK 9 ---- Refer Button Functinality - Share on Whatsapp ------- //  


function shareWhatsApp() {
  let message = "💰 *SpendWise* - Your Smart Expense Tracker! 🚀\n\n" + 
                "Easily manage your expenses, track debt, and generate reports in one place. " + 
                "Start saving smarter today!\n\n" + 
                "👉 Check it out here: https://www.spendwise.online";
  
  let encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
} 