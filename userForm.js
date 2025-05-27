const firebaseConfig = {
  apiKey: "AIzaSyAVaFTgmJ2_itWLAnBNn31v78QZjiO7BZU",
  authDomain: "user-information-tm-bot.firebaseapp.com",
  projectId: "user-information-tm-bot",
  storageBucket: "user-information-tm-bot.appspot.com",
  messagingSenderId: "602716147426",
  appId: "1:602716147426:web:4c0545869e59ecc9f9d8bb",
  measurementId: "G-7R0LNRW5ZM"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const loginForm = document.getElementById('loginForm');
const adminSection = document.getElementById('adminSection');
const requestsTableBody = document.getElementById('requestsTableBody');

const adminUser = "nahid";
const adminPass = "mdnahid44551@";

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username === adminUser && password === adminPass) {
    loginForm.style.display = "none";
    adminSection.style.display = "block";
    loadRequests();
  } else {
    alert("Invalid username or password!");
  }
});

async function loadRequests() {
  requestsTableBody.innerHTML = "Loading...";
  try {
    const snapshot = await db.collection('supportRequests').orderBy('timestamp', 'desc').get();
    if (snapshot.empty) {
      requestsTableBody.innerHTML = "<tr><td colspan='7'>No requests found</td></tr>";
      return;
    }

    requestsTableBody.innerHTML = "";

    snapshot.forEach(doc => {
      const data = doc.data();
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td>${doc.id}</td>
        <td>${data.problemType || ''}</td>
        <td>${data.userContact || ''}</td>
        <td>${data.bkashNumber || ''}</td>
        <td>${data.screenshotUrl ? `<a href="${data.screenshotUrl}" target="_blank">View</a>` : 'No image'}</td>
        <td>${data.status || 'Submitted'}</td>
        <td>
          <button onclick="updateStatus('${doc.id}', 'Approved')">Approve</button>
          <button onclick="updateStatus('${doc.id}', 'Rejected')">Reject</button>
        </td>
      `;

      requestsTableBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Error loading requests: ", error);
    requestsTableBody.innerHTML = "<tr><td colspan='7'>Error loading requests</td></tr>";
  }
}

// স্ট্যাটাস আপডেট করার ফাংশন
async function updateStatus(requestId, newStatus) {
  try {
    await db.collection('supportRequests').doc(requestId).update({
      status: newStatus
    });
    alert(`Request ${requestId} status updated to ${newStatus}`);
    loadRequests(); // রিলোড করো যাতে আপডেট দেখায়
  } catch (error) {
    alert('Failed to update status: ' + error.message);
  }
  }
