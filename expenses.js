
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
  wasteCell.innerHTML = `<span class="waste-icon" onclick="handleWasteClick(event, ${index})">🗑️</span>`;
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
  let input = prompt("How much ?");
  // Check for Null values (user cancelled) or empty strings
  if (input === null || input.trim() === "") {
    return;
  }
  let balanceToAdd = parseFloat(input);

  // Validate: must be a positive number and not zero

  if (isNaN(balanceToAdd) || balanceToAdd <= 0 || balanceToAdd > 10000 || !/^\d+(\.\d+)?$/.test(input.trim())) {
    alert("Please enter a positive number between 1 and 10,000");
    return;
  }

  availableBalance = parseFloat(availableBalance) + balanceToAdd;
  document.getElementById('availableBalance').textContent = availableBalance;
  localStorage.setItem('availableBalance', availableBalance)
  location.reload();

}





















// BLOCK 7 ------ Function for handling downloading PDF ------- //  





function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  const wastedStatus = JSON.parse(localStorage.getItem('wastedStatus')) || {};
  const availableBalance = localStorage.getItem('availableBalance');
  const totalMoneySpent = localStorage.getItem('totalMoneySpent');



  doc.setFontSize(18);
  doc.text('Past Expenses', 20, 20);

  doc.setFontSize(12);
  doc.text(`Available Balance: ${availableBalance} INR`, 20, 30);

  doc.setFontSize(12);
  doc.text(`Money Spent: ${totalMoneySpent} INR`, 140, 30);



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

  /* 
    doc.autoTable({
      head: [tableHeader],
      body: tableRows,
      startY: 50,
      styles: {
        fontSize: 10,
        cellPadding: 2,
        fillColor: [240,240,240]
      },
      didDrawCell: (data) => {
        if (wastedStatus[data.row.rowIndex - 1]) {
          doc.setFillColor(255, 204, 204); // Light red color for wasted expenses
          doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'FD');
          doc.setFillColor(0, 0, 0); // Reset fill color to black
        }
      },
    });
  */

  doc.autoTable({
    head: [tableHeader],
    body: tableRows,
    startY: 50,
    styles: {
      fontSize: 10,
      cellPadding: 2,
      fillColor: [255, 255, 255], // White background
      textColor: [0, 0, 0], // Black text
      lineColor: [138, 96, 19], // Border color
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [223, 209, 20], // #dfd114 in RGB
      textColor: [0, 0, 0], // Black text
    },
    tableLineColor: [138, 96, 19], // Table border color
    tableLineWidth: 0.4,

    /* 
        didDrawCell: (data) => {
          if (data.section === 'body' && wastedStatus[data.row.index]) {
            doc.setFillColor(255, 204, 204); // #ffcccc for wasted rows
            doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'FD');
            doc.setTextColor(160, 0, 0); // #a00000 text color for wasted rows
            doc.text(data.cell.text, data.cell.x + 2, data.cell.y + data.cell.height / 2 + 2);
          }
        },
    
        willDrawCell: (data) => {
          if (data.section === 'body' && wastedStatus[data.row.index]) {
            data.cell.styles.fillColor = [255, 204, 204];
            data.cell.styles.textColor = [160, 0, 0];
          }
        },
    
    */

    didDrawCell: (data) => {
      if (data.section === 'body' && wastedStatus?.[data.row.index]) {
        // Draw background
        doc.setFillColor(255, 204, 204); // Light red
        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'FD');

        // Draw text
        doc.setTextColor(160, 0, 0); // Dark red
        data.cell.text = ''; // Prevent default rendering

        const text = String(data.cell.raw ?? '');
        const textDims = doc.getTextDimensions(text);
        const textHeight = textDims.h;

        // Center text vertically
        const textX = data.cell.x + 2;
        const textY = data.cell.y + (data.cell.height + textHeight) / 2 - 1; // the -1 fine-tunes alignment

        doc.text(text, textX, textY);
      }
    }

  });

  doc.save(`${getMonthName(new Date().getMonth()).toLocaleLowerCase()}-expense.pdf`);
}






// ---BLOCK 8 ---- Refer Button Functinality - Share on Whatsapp ------- //  


function shareWhatsApp() {
  let message = "💰 *SpendWise* - Your Smart Expense Tracker! 🚀\n\n" +
    "Easily manage your expenses, track debt, and generate reports in one place. " +
    "Start saving smarter today!\n\n" +
    "👉 Check it out here: https://www.spendwise.online";

  let encodedMessage = encodeURIComponent(message);
  window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
} 