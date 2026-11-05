
/* =========================================
   1. EVENT DATA
========================================= */

// Sample events displayed on CampusVibe

const events = [
    {
        id: 1,
        name: "TechNova 2026",
        category: "Technology",
        date: "2026-11-20",
        time: "10:00 AM",
        venue: "Main Auditorium",
        description: "Experience innovation, coding competitions, robotics and exciting technology challenges.",
        image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800"
    },

    {
        id: 2,
        name: "Rhythm Fest",
        category: "Music",
        date: "2026-11-22",
        time: "5:00 PM",
        venue: "Open Air Theatre",
        description: "An unforgettable evening filled with live performances, music and amazing energy.",
        image: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800"
    },

    {
        id: 3,
        name: "Campus Football Cup",
        category: "Sports",
        date: "2026-11-25",
        time: "9:00 AM",
        venue: "College Sports Ground",
        description: "Bring your team spirit and compete in an exciting inter-college football tournament.",
        image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800"
    },

    {
        id: 4,
        name: "Cultural Carnival",
        category: "Cultural",
        date: "2026-11-28",
        time: "4:00 PM",
        venue: "College Central Lawn",
        description: "Celebrate creativity, traditions, dance, fashion and the diversity of campus life.",
        image: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800"
    },

    {
        id: 5,
        name: "Design Thinking Workshop",
        category: "Workshop",
        date: "2026-12-02",
        time: "11:00 AM",
        venue: "Innovation Lab",
        description: "Learn creative problem-solving techniques and turn your ideas into practical solutions.",
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800"
    },

    {
        id: 6,
        name: "Hackathon 24",
        category: "Technology",
        date: "2026-12-05",
        time: "9:00 AM",
        venue: "Computer Science Block",
        description: "Team up with creative minds and build innovative solutions in an exciting hackathon.",
        image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800"
    }
];


// =========================================
// 2. SELECT HTML ELEMENTS
// =========================================

const eventsGrid = document.getElementById("eventsGrid");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const noEvents = document.getElementById("noEvents");
const eventCount = document.getElementById("eventCount");

const eventModal = document.getElementById("eventModal");
const registerModal = document.getElementById("registerModal");

const eventDetails = document.getElementById("eventDetails");
const registrationForm = document.getElementById("registrationForm");


// =========================================
// 3. DISPLAY EVENT CARDS
// =========================================

function displayEvents(eventList) {

    eventsGrid.innerHTML = "";

    eventCount.textContent = `${eventList.length} Events Found`;

    if (eventList.length === 0) {
        noEvents.hidden = false;
        return;
    }

    noEvents.hidden = true;

    eventList.forEach(event => {

        const formattedDate = new Date(
            event.date + "T00:00:00"
        ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

        const eventCard = document.createElement("article");

        eventCard.className = "event-card";

        eventCard.innerHTML = `
            <div class="event-image">
                <img src="${event.image}" alt="${event.name}">
                <span class="category-tag">${event.category}</span>
            </div>

            <div class="event-info">

                <span class="event-date">📅 ${formattedDate}</span>

                <h3>${event.name}</h3>

                <p class="event-description">
                    ${event.description}
                </p>

                <p class="event-location">
                    📍 ${event.venue}
                </p>

                <div class="event-footer">
                    <span>🕒 ${event.time}</span>

                    <button
                        class="details-btn"
                        data-event-id="${event.id}">
                        View Details →
                    </button>
                </div>

            </div>
        `;

        eventsGrid.appendChild(eventCard);

    });

}


// Display all events when the page loads

displayEvents(events);


// =========================================
// 4. SEARCH AND CATEGORY FILTER
// =========================================

function filterEvents() {

    const searchText = searchInput.value.toLowerCase();

    const selectedCategory = categoryFilter.value;

    const filteredEvents = events.filter(event => {

        const matchesSearch =
            event.name.toLowerCase().includes(searchText) ||
            event.description.toLowerCase().includes(searchText) ||
            event.venue.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            event.category === selectedCategory;

        return matchesSearch && matchesCategory;

    });

    displayEvents(filteredEvents);

}


searchInput.addEventListener("input", filterEvents);

categoryFilter.addEventListener("change", filterEvents);


// =========================================
// 5. EVENT DETAILS MODAL
// =========================================

function showEventDetails(eventId) {

    const event = events.find(item => item.id === eventId);

    if (!event) return;

    const formattedDate = new Date(
        event.date + "T00:00:00"
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    eventDetails.innerHTML = `
        <img
            src="${event.image}"
            alt="${event.name}"
            class="modal-event-image">

        <span class="eyebrow">${event.category}</span>

        <h2>${event.name}</h2>

        <p>${event.description}</p>

        <p>📅 ${formattedDate}</p>

        <p>🕒 ${event.time}</p>

        <p>📍 ${event.venue}</p>

        <div class="countdown" id="countdown">
            Loading countdown...
        </div>

        <button
            class="primary-btn"
            id="modalRegisterBtn">
            Register for Event ↗
        </button>
    `;

    eventModal.classList.add("active");
    eventModal.setAttribute("aria-hidden", "false");

    startCountdown(event.date);

    document.getElementById("modalRegisterBtn")
        .addEventListener("click", () => {

            closeEventModal();

            openRegistration(event.id);

        });

}


// Handle event card clicks

eventsGrid.addEventListener("click", function (event) {

    const button = event.target.closest(".details-btn");

    if (!button) return;

    const eventId = Number(button.dataset.eventId);

    showEventDetails(eventId);

});


// Close event details modal

function closeEventModal() {

    eventModal.classList.remove("active");
    eventModal.setAttribute("aria-hidden", "true");

}

document.getElementById("closeEventModal")
    .addEventListener("click", closeEventModal);


// =========================================
// 6. EVENT COUNTDOWN
// =========================================

let countdownInterval;

function startCountdown(eventDate) {

    clearInterval(countdownInterval);

    const countdownElement = document.getElementById("countdown");

    const targetDate = new Date(
        eventDate + "T23:59:59"
    ).getTime();

    function updateCountdown() {

        const now = new Date().getTime();

        const difference = targetDate - now;

        if (difference <= 0) {

            countdownElement.textContent =
                "Event date has arrived!";

            clearInterval(countdownInterval);

            return;
        }

        const days = Math.floor(
            difference / (1000 * 60 * 60 * 24)
        );

        const hours = Math.floor(
            (difference / (1000 * 60 * 60)) % 24
        );

        const minutes = Math.floor(
            (difference / (1000 * 60)) % 60
        );

        countdownElement.textContent =
            `${days} Days ${hours} Hours ${minutes} Minutes Left`;

    }

    updateCountdown();

    countdownInterval = setInterval(updateCountdown, 60000);

}


// =========================================
// 7. REGISTRATION MODAL
// =========================================

const selectedEvent = document.getElementById("selectedEvent");

const registrationFormContainer =
    document.getElementById("registrationFormContainer");

const successMessage = document.getElementById("successMessage");


// Fill event dropdown automatically

function populateEventDropdown() {

    selectedEvent.innerHTML =
        '<option value="">Select an event</option>';

    events.forEach(event => {

        const option = document.createElement("option");

        option.value = event.id;
        option.textContent = event.name;

        selectedEvent.appendChild(option);

    });

}

populateEventDropdown();


function openRegistration(eventId = null) {

    registrationForm.reset();

    document.getElementById("formError").textContent = "";

    registrationFormContainer.hidden = false;
    successMessage.hidden = true;

    if (eventId !== null) {
        selectedEvent.value = eventId;
    }

    registerModal.classList.add("active");

    registerModal.setAttribute("aria-hidden", "false");

}


// Close registration modal

function closeRegistrationModal() {

    registerModal.classList.remove("active");

    registerModal.setAttribute("aria-hidden", "true");

}

document.getElementById("closeRegisterModal")
    .addEventListener("click", closeRegistrationModal);


// =========================================
// 8. FORM VALIDATION AND REGISTRATION
// =========================================

registrationForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();

    const email = document.getElementById("studentEmail").value.trim();

    const phone = document.getElementById("studentPhone").value.trim();

    const eventId = Number(selectedEvent.value);

    const errorMessage = document.getElementById("formError");

    errorMessage.textContent = "";


    // Check name

    if (name.length < 3) {

        errorMessage.textContent =
            "Please enter a name with at least 3 characters.";

        return;

    }


    // Check email

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {

        errorMessage.textContent =
            "Please enter a valid email address.";

        return;

    }


    // Check phone number

    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(phone)) {

        errorMessage.textContent =
            "Please enter a valid 10-digit phone number.";

        return;

    }


    // Check event selection

    const chosenEvent = events.find(item => item.id === eventId);

    if (!chosenEvent) {

        errorMessage.textContent =
            "Please select an event.";

        return;

    }


    // Create registration object

    const registration = {

        name: name,
        email: email,
        phone: phone,
        event: chosenEvent.name,
        eventId: chosenEvent.id,
        registeredAt: new Date().toISOString()

    };


    // Save registration in browser Local Storage

    const registrations = JSON.parse(
        localStorage.getItem("campusRegistrations")
    ) || [];

    registrations.push(registration);

    localStorage.setItem(
        "campusRegistrations",
        JSON.stringify(registrations)
    );


    // Show success message

    registrationFormContainer.hidden = true;

    successMessage.hidden = false;

});


// =========================================
// 9. FINISH REGISTRATION
// =========================================

document.getElementById("finishRegistration")
    .addEventListener("click", closeRegistrationModal);


// =========================================
// 10. DARK AND LIGHT MODE
// =========================================

const themeToggle = document.getElementById("themeToggle");


// Load saved theme

const savedTheme = localStorage.getItem("campusTheme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeToggle.textContent = "☀";

}


themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    const isDark =
        document.body.classList.contains("dark-mode");

    themeToggle.textContent = isDark ? "☀" : "☾";

    localStorage.setItem(
        "campusTheme",
        isDark ? "dark" : "light"
    );

});


// =========================================
// 11. MOBILE NAVIGATION
// =========================================

const menuBtn = document.getElementById("menuBtn");

const navLinks = document.getElementById("navLinks");


menuBtn.addEventListener("click", function () {

    navLinks.classList.toggle("show");

});


document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", function () {

        navLinks.classList.remove("show");

    });

});


// =========================================
// 12. CLOSE MODALS WHEN CLICKING OUTSIDE
// =========================================

eventModal.addEventListener("click", function (event) {

    if (event.target === eventModal) {

        closeEventModal();

    }

});


registerModal.addEventListener("click", function (event) {

    if (event.target === registerModal) {

        closeRegistrationModal();

    }

});


// =========================================
// 13. CLOSE MODALS USING ESCAPE KEY
// =========================================

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        closeEventModal();

        closeRegistrationModal();

    }

});


// =========================================
// 14. CONSOLE MESSAGE
// =========================================

console.log("CampusVibe website loaded successfully!");

