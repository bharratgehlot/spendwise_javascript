
// ---BLOCK 1 ---- Function to generate a random number ------- //

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}




// ---BLOCK 2 --- Function to update the "Today's Read" link ------- //

// Call the function to update the link when the page is loaded
document.addEventListener("DOMContentLoaded", updateTodaysReadLink);

function updateTodaysReadLink() {

  // Check last redirection
  var lastRedirectionDate = localStorage.getItem("lastRedirectionDate");
  var storedArticleURL = localStorage.getItem("storedArticleURl");
  // Get the current date
  var currentDate = new Date().toDateString();
/*
  //  Only Updates if 24 hours passed before clicking
  if (!lastRedirectionDate || new Date(lastRedirectionDate).toDateString() !== currentDate.toDateString()) {
    var numArticles = 10;

    // Generate a random article number
    var randomArticleNumber = getRandomInt(1, numArticles);
    console.log("Random Article Number: ",randomArticleNumber);

    // Construct the URL for the random article
    var randomArticleURL = "articles/article" + randomArticleNumber + ".html";
    console.log(randomArticleURL);

    // Set the href attribute of the link to the random article URL
    document.getElementById("todaysReadLink").setAttribute("href", randomArticleURL);

    // Store the current date as the last redirection date in local storage
    localStorage.setItem("lastRedirectionDate", currentDate.toDateString());

*/

if (storedArticleURL && lastRedirectionDate === currentDate) {
  // If already updated today, reuse the same link
  console.log("Reusing stored URL:", storedArticleURL);
  document.getElementById("todaysReadLink").setAttribute("href", storedArticleURL);
} else {
  var numArticles = 10;
  var randomArticleNumber = getRandomInt(1, numArticles);
  console.log("Random Article Number:", randomArticleNumber);

  var randomArticleURL = "articles/article" + randomArticleNumber + ".html";
  console.log("Generated new URL:", randomArticleURL);

  document.getElementById("todaysReadLink").setAttribute("href", randomArticleURL);

  // Store the new link and date
  localStorage.setItem("lastRedirectionDate", currentDate);
  localStorage.setItem("storedArticleURL", randomArticleURL);

  }
}



// ---BLOCK 3 ---- Background Image Changing & Arrays of the photo URLs -------

const photos = [
  'backgrounds/photo1.jpg',
  'backgrounds/photo2.jpg',
  'backgrounds/photo3.jpg',
  'backgrounds/photo4.jpg',
  'backgrounds/photo5.jpg',
  'backgrounds/photo6.jpg',
  'backgrounds/photo7.jpg',
  'backgrounds/photo8.jpg',
  'backgrounds/photo9.jpg',
  'backgrounds/photo10.jpg',
  'backgrounds/photo11.jpg',
  'backgrounds/photo12.jpg',
  'backgrounds/photo13.jpg',
  'backgrounds/photo14.jpg',
  'backgrounds/photo15.jpg',
  'backgrounds/photo16.jpg',
  'backgrounds/photo17.jpg',
  'backgrounds/photo18.jpg',
  'backgrounds/photo19.jpg',
  'backgrounds/photo20.jpg',
  'backgrounds/photo21.jpg',
  'backgrounds/photo22.jpg',
  'backgrounds/photo23.jpg',
  'backgrounds/photo24.jpg',
  'backgrounds/photo25.jpg',
];


let isBackgroundLocked = localStorage.getItem('isBackgroundLocked') === 'true'; // Check if background is locked from localStorage
let currentBackgroundUrl = localStorage.getItem('currentBackgroundUrl');

function setBackgroundPhoto() {
  if (!isBackgroundLocked) {
    const today = new Date();
    const dayOfYear = today.getFullYear() * 1000 + today.getMonth() * 31 + today.getDate(); // Unique number for each day
    const randomIndex = dayOfYear % photos.length; // Use dayOfYear to ensure consistent random photo each day
    const photoUrl = photos[randomIndex];
    const container = document.getElementById('container');
    container.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${photoUrl}')`;
    container.style.backgroundSize = 'cover'; // Ensure the background photo covers the container
    container.style.backgroundPosition = 'center'; // Center the background photo
    currentBackgroundUrl = photoUrl;
    localStorage.setItem('currentBackgroundUrl', currentBackgroundUrl);
  } else if (currentBackgroundUrl) {
    const container = document.getElementById('container');
    container.style.backgroundImage = `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('${currentBackgroundUrl}')`;
    container.style.backgroundSize = 'cover'; // Ensure the background photo covers the container
    container.style.backgroundPosition = 'center'; // Center the background photo
  }
}

setBackgroundPhoto();

setInterval(() => {
  if (!isBackgroundLocked) {
    setBackgroundPhoto();
  }
}, 24 * 60 * 60 * 1000); // Set background photo every 24 hours if not locked

const toggleButton = document.getElementById('toggleButton');
updateButtonState(); // Update button state on page load

toggleButton.addEventListener('click', function() {
  isBackgroundLocked = !isBackgroundLocked;
  localStorage.setItem('isBackgroundLocked', isBackgroundLocked); // Save lock/unlock state to localStorage
  updateButtonState(); // Update button state after click
});

function updateButtonState() {
  if (isBackgroundLocked) {
    toggleButton.textContent = "Unlock-Image";
    toggleButton.classList.remove('unlocked');
    toggleButton.classList.add('locked');
  } else {
    toggleButton.textContent = "Lock-Image";
    toggleButton.classList.remove('locked');
    toggleButton.classList.add('unlocked');
  }
}



// ---BLOCK 4 ---- Code for handling expenses, calculation -------

let availableBalance = localStorage.getItem('availableBalance');
let totalMoneySpent = parseInt(localStorage.getItem('totalMoneySpent')) || 0;  //Money Spent Box


if (availableBalance === null) {
  let initialBalance = prompt("Please enter your monthly budget");
  if (initialBalance === null || isNaN(initialBalance)) {
    availableBalance = 0;
  } else {
    availableBalance = parseInt(initialBalance);
  }
  localStorage.setItem('availableBalance', availableBalance);
  localStorage.setItem('initialBalance', availableBalance);
} else {
  availableBalance = parseInt(availableBalance);
}

document.getElementById('availableBalance').textContent = availableBalance;
document.getElementById('totalSpentAmount').textContent = totalMoneySpent; // Update total money spent box

document.getElementById('expenseForm').addEventListener('submit', function (e) {
  e.preventDefault();
  let userName = document.getElementById('userName').value;
  let money = parseInt(document.getElementById('money').value);
  let description = document.getElementById('description').value;
  let date = document.getElementById('date').value;
  let location = document.getElementById('location').value;
  let category = document.getElementById('category').value;

  if (money > availableBalance) {
    alert("You don't have enough money to spend this amount.");
    return;
  }

  if (!category) {
    alert("Please select a category.");
    return;
  }

  if (money <= 0) {
    alert("Please enter a valid amount.");
    return;
  }


  let expense = {
    userName,
    money,
    description,
    date,
    location,
    category,
  };

  let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
  expenses.push(expense);
  localStorage.setItem('expenses', JSON.stringify(expenses));

  // Deduct spend amount from available balance
  availableBalance -= money;
  document.getElementById('availableBalance').textContent = availableBalance;
  localStorage.setItem('availableBalance', availableBalance);


  // Update total money spent
  totalMoneySpent += money;
  document.getElementById('totalSpentAmount').textContent = totalMoneySpent; // Update total money spent box


  // Display success message
  document.getElementById('successMessage').style.display = 'block';
  setTimeout(() => {
    document.getElementById('successMessage').style.display = 'none'; // Hide success message after 3 seconds
    window.location.reload(); // Reload the page to reflect changes
  }, 2000);

  // Clear form fields after submission
  this.reset();
});

// Store the updated total money spent in localStorage when the page unloads
window.addEventListener('beforeunload', function () {
  localStorage.setItem('totalMoneySpent', totalMoneySpent);
});

// Add event listener to clear total money spent when local storage is cleared
window.addEventListener('storage', function (e) {
  if (e.key === null) {
    totalMoneySpent = 0;
    document.getElementById('totalSpentAmount').textContent = totalMoneySpent; // Update total money spent box
  }
});

// settings