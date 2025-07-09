let clickCounter = 0;

const shareBtn = document.getElementById("shareBtn");
const clickCountText = document.getElementById("clickCount");
const shareStatus = document.getElementById("shareStatus");
const form = document.getElementById("registrationForm");
const thankYouMsg = document.getElementById("thankYouMsg");

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("formSubmitted")) {
    disableForm();
  }
});

shareBtn.addEventListener("click", () => {
  if (clickCounter < 5) {
    const message = encodeURIComponent("Hey Buddy, Join Tech For Girls Community");
    window.open(`https://wa.me/?text=${message}`, "_blank");
    clickCounter++;
    clickCountText.textContent = `Click count: ${clickCounter}/5`;

    if (clickCounter === 5) {
      shareStatus.textContent = "✅ Sharing complete. Please continue.";
    }
  }
});

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (clickCounter < 5) {
    alert("Please share on WhatsApp 5 times before submitting.");
    return;
  }

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const college = document.getElementById("college").value.trim();
  const file = document.getElementById("screenshot").files[0];

  if (!name || !phone || !email || !college || !file) {
    alert("Please fill all fields and upload a file.");
    return;
  }

  // Send to Google Apps Script
  fetch("https://script.google.com/macros/s/AKfycbyhugfgmob6OJ0pVg4hJ4PW2Lomxyln0nJ0Ij1iC8As4FooBB0IKaTxSfw1OW0DG114/exec", {
    method: "POST",
    body: JSON.stringify({
      name,
      phone,
      email,
      college,
      fileName: file.name
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => response.text())
  .then(data => {
    console.log("Server response:", data);
    if (data.includes("Success")) {
      localStorage.setItem("formSubmitted", "true");
      disableForm();
      thankYouMsg.classList.remove("hidden");
    } else {
      alert("Submission failed: " + data);
    }
  })
  .catch((error) => {
    console.error("Error occurred:", error);
    alert("Something went wrong. Please try again later.");
  });
});

// ✅ Moved this outside the event listener
function disableForm() {
  form.querySelectorAll("input, button").forEach((el) => {
    el.disabled = false;
  });
}
