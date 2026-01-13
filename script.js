// Data for the Events List Page
// Data for the Events List Page
const eventsData = [
    { name: "Annual Fest - Ullash", detail: "The college's largest cultural fest.", image: "fest.jpg" },
    { name: "Freshers'", detail: "A warm welcome for the incoming batch of students.", image: "freshers.jpeg" },
    { name: "College Sports", detail: "Compete in cricket, Volleyball, Kho-Kho and more.", image: "sports.jpg" },
    { name: "Holi Celebration", detail: "A colorful event to celebrate the festival of colors.", image: "holi.jpg" },
    { name: "Teachers' Day", detail: "A special day to honor our respected faculty members.", image: "teachers-day.jpg" }
];


// --- Utility Functions ---

/** Shows the requested page and hides all others. */
function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(section => {
        section.style.display = 'none';
    });
    document.getElementById(pageId).style.display = 'block';

    // Special function call for the Admin page (to load data on display)
    if (pageId === 'admin-login') {
        document.getElementById('admin-data-preview').style.display = 'none';
        document.getElementById('admin-form').style.display = 'block';
        document.getElementById('admin-message').textContent = '';
    }

    // Special function call for Events List page (to load dynamic content)
    if (pageId === 'events') {
        populateEventsList();
    }
}

/** Populates the Events List section dynamically. */
function populateEventsList() {
    const container = document.getElementById('events-list-container');
    container.innerHTML = ''; // Clear previous content

    eventsData.forEach(event => {
        const item = document.createElement('div');
        item.classList.add('event-item');
        // Create image element (use event.image if provided, otherwise a placeholder)
        const img = document.createElement('img');
        img.classList.add('event-img');
        img.alt = event.name;
        img.src = event.image || 'assets/event-placeholder.png';

        // Create info container
        const info = document.createElement('div');
        info.classList.add('event-info');
        info.innerHTML = `
            <h4>${event.name}</h4>
            <p>${event.detail}</p>
        `;

        // Create register button with safe event binding
        const btn = document.createElement('button');
        btn.textContent = 'Register';
        btn.addEventListener('click', () => openRegistrationForm(event.name));

        // Append elements to the item
        item.appendChild(img);
        item.appendChild(info);
        item.appendChild(btn);
        container.appendChild(item);
    });
}

/** Opens the registration form pre-filled with the selected event. */
function openRegistrationForm(eventName) {
    document.getElementById('reg-event').value = eventName;
    document.getElementById('reg-message').style.display = 'none';
    showPage('registration');
}

/** Saves the form data to a temporary store (simulating session state using localStorage). */
function saveRegistration(formData) {
    // Get existing data from localStorage (our temporary "session" storage)
    const existingData = JSON.parse(localStorage.getItem('eventRegistrations')) || [];

    // Add new entry
    existingData.push(formData);

    // Save back to localStorage
    localStorage.setItem('eventRegistrations', JSON.stringify(existingData));
}

/** Populates the admin table with saved data. */
function populateAdminTable() {
    const data = JSON.parse(localStorage.getItem('eventRegistrations')) || [];
    const table = document.getElementById('admin-data-table');

    // Clear previous content and set header
    table.innerHTML = `
        <tr>
            <th>Event</th>
            <th>Name</th>
            <th>Dept.</th>
            <th>Year</th>
        </tr>
    `;

    if (data.length === 0) {
        table.innerHTML += `<tr><td colspan="4" style="text-align: center;">No registrations found yet.</td></tr>`;
        return;
    }

    // Add rows for each registration
    data.forEach(entry => {
        table.innerHTML += `
            <tr>
                <td>${entry.event}</td>
                <td>${entry.name}</td>
                <td>${entry.department}</td>
                <td>${entry.year}</td>
            </tr>
        `;
    });
}

/** Clears all temporary registration entries. */
function clearRegistrations() {
    if (confirm("Are you sure you want to clear ALL temporary registration entries?")) {
        localStorage.removeItem('eventRegistrations');
        populateAdminTable();
        alert("Registrations cleared!");
    }
}

// --- Event Listeners ---

// 1. Registration Form Submission
document.getElementById('registration-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
        event: document.getElementById('reg-event').value,
        name: document.getElementById('reg-name').value,
        department: document.getElementById('reg-dept').value,
        year: document.getElementById('reg-year').value
    };

    saveRegistration(formData);

    // Display success message and clear form fields (except event)
    document.getElementById('reg-message').textContent = `Success! ${formData.name}, you are registered for ${formData.event}.`;
    document.getElementById('reg-message').style.display = 'block';
    this.reset();
    document.getElementById('reg-event').value = formData.event; // Keep event selection

    setTimeout(() => {
        document.getElementById('reg-message').style.display = 'none';
        showPage('events'); // Redirect after a short pause
    }, 3000);
});

// 2. Admin Login Form Submission
document.getElementById('admin-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const user = document.getElementById('admin-user').value;
    const pass = document.getElementById('admin-pass').value;

    // Simple frontend check: Username 'admin', Password 'pass'
    if (user === 'admin' && pass === 'pass') {
        document.getElementById('admin-form').style.display = 'none';
        document.getElementById('admin-data-preview').style.display = 'block';
        populateAdminTable();
        document.getElementById('admin-message').textContent = '';
    } else {
        document.getElementById('admin-message').textContent = 'Invalid Username or Password. Try "admin" and "pass".';
    }
});

// --- Initial Load ---
document.addEventListener('DOMContentLoaded', () => {
    showPage('home'); // Display the home page on load
});
