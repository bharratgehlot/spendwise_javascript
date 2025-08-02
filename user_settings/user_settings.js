document.getElementById("otpForm").addEventListener("submit", function (e){
  e.preventDefault();
   
  const userEmail = document.getElementById("email").value;
  const otp = Math.floor(1000 + Math.random() * 9000);
  const currentTime = new Date().toLocaleDateString();
  
  localStorage.setItem("sentOTP", otp);



  // Send Data to Email 

  emailjs.send("service_xersgrl","template_r8dp9ms",{
    email: userEmail,
    passcode: otp,
    date: currentTime
  })
  .then(function(response) {
    alert("OTP sent to "+ userEmail);
    document.getElementById("verifyForm").style.display = "block";
  }, function(error) {
    alert("Failed to send email. Please try again later.");
  });
});

// Handle OTP Verification

document.getElementById("verifyForm").addEventListener("submit", function (e){
  e.preventDefault();

  const enteredOtp = document.getElementById("enteredOtp").value.trim();
  const originalOtp = localStorage.getItem("sentOTP");

  if (enteredOtp === originalOtp) {
    alert("OTP verified successfully!");
    document.getElementById("verifyForm").style.display = "none";
    document.getElementById("otpForm").reset();
  } else {
    alert("Invalid OTP. Please try again.");
  }
});