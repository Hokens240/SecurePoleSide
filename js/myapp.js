// --- DATABASE INITIALIZATION ---
function initializeMockUsers() {
    const initialUsers = [
        { 
            email: "almightyrick8@gmail.com", 
            firstName: "Rick", 
            lastName: "Aguiar", 
            country: "United States of America", 
            pass: null,
            status: "active", 
            accountBalance: "49,100", 
            totalProfit: "49,100", 
            profitBalance: "49,100", 
            initialInvestment: "00.00", 
            returnOnInvestment: "49,100"
        },
        { 
            email: "larrylovato59@gmail.com", 
            firstName: "Larry", 
            lastName: "Lovato", 
            country: "United States of America", 
            pass: null,
            status: "frozen", 
            accountBalance: "1,839,000", 
            totalProfit: "1,839,000", 
            profitBalance: "1,839,000", 
            initialInvestment: "10,100.00", 
            returnOnInvestment: "1,839,000"
        },
        {
            email: "nebgenjeff@gmail.com", 
            firstName: "Jeff", 
            lastName: "Nebgen", 
            country: "United States of America", 
            pass: null,
            status: "active", 
            accountBalance: "4700", 
            totalProfit: "4700", 
            profitBalance: "4700", 
            initialInvestment: "00.00", 
            returnOnInvestment: "4700"
        },
        { 
            email: "mychaloh@gmail.com", 
            firstName: "Herron", 
            lastName: "Chaloh", 
            country: "United States of America", 
            pass: null,
            status: "active", 
            accountBalance: "22,000", 
            totalProfit: "22,000", 
            profitBalance: "22,000", 
            initialInvestment: "00.00", 
            returnOnInvestment: "22,000"
        },
        { 
            email: "bigemma2026@gmail.com", 
            firstName: "Big", 
            lastName: "Emma", 
            country: "United States of America", 
            pass: null,
            status: "frozen", 
            accountBalance: "1000", 
            totalProfit: "1000", 
            profitBalance: "1000", 
            initialInvestment: "00.00", 
            returnOnInvestment: "1000"
        },
    ];

    // 1. Load existing data, or start with an empty array
    const existingUsersJSON = localStorage.getItem('mockUsers');
    const existingUsers = existingUsersJSON ? JSON.parse(existingUsersJSON) : [];

    // 2. Create a Map for easy merging/lookup
    const userMap = new Map();

    // Preserve all existing users (registered users).
    existingUsers.forEach(user => {
        userMap.set(user.email.toLowerCase(), user); 
    });
    
    // 3. Overwrite mock users with clean, fresh data.
    initialUsers.forEach(mockUser => {
        userMap.set(mockUser.email.toLowerCase(), mockUser); 
    });

    // 4. Save the merged list back to storage.
    const mergedUsers = Array.from(userMap.values());
    localStorage.setItem('mockUsers', JSON.stringify(mergedUsers));

    console.log("Mock data synchronized: Larry and Rick reset, registered users preserved.");
}

initializeMockUsers();


// --- REGISTRATION FUNCTION ---
function registerMock() {
    const newEmail = document.getElementById('regEmail').value.trim();
    const newPass = document.getElementById('regPassword').value.trim();
    const newFirstName = document.getElementById('regFirstName').value.trim();
    const newLastName = document.getElementById('regLastName').value.trim();
    const newCountry = document.getElementById('regCountry').value;

    if (!newEmail || !newPass || !newFirstName || !newLastName || !newCountry) {
        alert("Please fill in all registration fields.");
        return;
    }

    const normalizedEmail = newEmail.toLowerCase(); 
    const storedUsersJSON = localStorage.getItem('mockUsers');
    const users = JSON.parse(storedUsersJSON);

    const emailExists = users.some(user => user.email === normalizedEmail);
    if (emailExists) {
        alert("This email is already registered.");
        return;
    }

    const newUser = { 
        email: normalizedEmail, 
        firstName: newFirstName, 
        lastName: newLastName, 
        country: newCountry, 
        pass: newPass, 
        status: "active", // Default status for new users
        accountBalance: "0.00",
        totalProfit: "0.00",
        profitBalance: "0.00",
        returnOnInvestment: "0.00",
        initialInvestment: "0.00"
    };
    users.push(newUser);
    localStorage.setItem('mockUsers', JSON.stringify(users));

    alert(`Registration successful! Welcome, ${newFirstName}. You can now log in.`);
    window.location.href = '../login.html'; 
}


// --- LOGIN FUNCTION ---
function loginMock() {
    const loginEmail = document.getElementById('emailInput').value.trim();
    const loginPass = document.getElementById('passwordInput').value.trim();
    const normalizedLoginEmail = loginEmail.toLowerCase(); 

    const storedUsersJSON = localStorage.getItem('mockUsers');
    const users = JSON.parse(storedUsersJSON);
    const foundUser = users.find(user => user.email === normalizedLoginEmail);

    if (foundUser) {
        if (foundUser.pass !== null) {
            if (foundUser.pass === loginPass) {
                sessionStorage.setItem('currentUserEmail', foundUser.email);
                window.location.href = '../dashboard/index.html';
                return;
            } else {
                alert("Incorrect password.");
                return;
            }
        } else {
            sessionStorage.setItem('currentUserEmail', foundUser.email);
            window.location.href = '../dashboard/index.html';
            return;
        }
    } 
    alert("Email not found. Please check your spelling or register.");
}


// --- DASHBOARD AND LOGOUT ---

function loadDashboard() {
    const userEmail = sessionStorage.getItem('currentUserEmail');

    if (!userEmail) {
        window.location.href = '../login.html';
        return;
    }

    const storedUsersJSON = localStorage.getItem('mockUsers');
    const users = JSON.parse(storedUsersJSON);
    const normalizedSessionEmail = userEmail.toLowerCase();
    const currentUser = users.find(user => user.email === normalizedSessionEmail);
    
    if (currentUser) {
        // --- FROZEN ALERT LOGIC ---
        // Simple check: if user is Rick (frozen), show alert once when dashboard loads
        if (currentUser.status === "frozen") {
            alert("Attention: Your account is currently frozen. Please contact support.");
        }

        // --- PERSONAL DETAILS ---
        const firstName = currentUser.firstName ?? '';
        const lastName = currentUser.lastName ?? '';
        const greetingElements = document.getElementsByClassName('user-greeting-name');
        for (let i = 0; i < greetingElements.length; i++) {
            greetingElements[i].textContent = firstName + " " + lastName;
        }
        
        document.getElementById('userEmail').textContent = currentUser.email;

        // --- FINANCIAL DATA UPDATE ---
        const metricElements = document.querySelectorAll('.financial-metric');
        metricElements.forEach(element => {
            const metricKey = element.getAttribute('data-metric');
            if (metricKey && currentUser[metricKey] !== undefined) {
                element.textContent = currentUser[metricKey];
                console.log(`[Metric Update] Key: ${metricKey}, Value: ${currentUser[metricKey]}`);
            } else {
                element.textContent = "N/A";
            }
        });
        
    } else {
        logoutMock();
    }
}

function logoutMock() {
    sessionStorage.removeItem('currentUserEmail'); 
    alert("You have been logged out.");
    window.location.href = '../index.html';
}

// Global Exports
window.loginMock = loginMock;
window.registerMock = registerMock;
window.logoutMock = logoutMock;

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.user-greeting-name')) {
        loadDashboard();
    }
});

function copyText() {
    const input = document.getElementById("myInput");
    if (input && navigator.clipboard) {
        navigator.clipboard.writeText(input.value).then(() => {
            alert("Copied to clipboard!");
        });
    }
}
