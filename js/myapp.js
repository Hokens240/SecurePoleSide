// --- DATABASE INITIALIZATION ---
function initializeMockUsers() {
    const initialUsers = [
        // 1. Define your initial, "pre-existing" user database.
    // Pass: null means password is NOT required for login (password input is ignored).
        // NOTE: Even though these are hardcoded, it's best practice to store them in lowercase.
        { 
            email: "almightyrick8@gmail.com", firstName: "Rick", lastName: "Aguiar", country: "United States of America", pass: null, 
            accountBalance: 1550.75, totalProfit: 520.10, profitBalance: 120.50, returnOnInvestment: 200.20, initialInvestment: 240.98 
        },
        { 
            email: "larrylovato59@gmail.com", firstName: "Larry", lastName: "Lovato", country: "United States of America", pass: null, 
            accountBalance: 1550.75, totalProfit: 520.10, profitBalance: 120.50, returnOnInvestment: 220.70, initialInvestment: 192.38 
        },
        { 
            email: "mychaloh@gmail.com", firstName: "Herron", lastName: "Chaloh", country: "United States of America", pass: null, 
            accountBalance: 2890.00, totalProfit: 1875.99, profitBalance: 350.45, returnOnInvestment: 310.10, initialInvestment: 289.72 
        },
    ];

    if (!localStorage.getItem('mockUsers')) {
        localStorage.setItem('mockUsers', JSON.stringify(initialUsers));
        console.log("Initial mock database loaded.");
    }
}

// Ensure the initial users are always in storage when the script loads.
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

    // --- FIX: Normalize email to lowercase for consistent storage ---
    const normalizedEmail = newEmail.toLowerCase(); 

    const storedUsersJSON = localStorage.getItem('mockUsers');
    const users = JSON.parse(storedUsersJSON);

    // Check for duplicate email using the normalized version
    const emailExists = users.some(user => user.email === normalizedEmail);
    if (emailExists) {
        alert("This email is already registered.");
        return;
    }

    const newUser = { 
        email: normalizedEmail, // Store the normalized email
        firstName: newFirstName, 
        lastName: newLastName, 
        country: newCountry, 
        pass: newPass,
        accountBalance: 0.00,
        totalProfit: 0.00,
        profitBalance: 0.00,
        returnOnInvestment: 0.00,
        initialInvestment: 0.00
    };
    users.push(newUser);

    console.log(`[DEV LOG] New user registered:`, newUser);

    localStorage.setItem('mockUsers', JSON.stringify(users));

    alert(`Registration successful! Welcome, ${newFirstName}. You can now log in.`);
    window.location.href = '../login.html'; 
}


// --- LOGIN FUNCTION ---
function loginMock() {
    const loginEmail = document.getElementById('emailInput').value.trim();
    const loginPass = document.getElementById('passwordInput').value.trim();

    // --- FIX: Normalize input email to lowercase for case-insensitive lookup ---
    const normalizedLoginEmail = loginEmail.toLowerCase(); 

    const storedUsersJSON = localStorage.getItem('mockUsers');
    const users = JSON.parse(storedUsersJSON);

    // Search the database using the normalized email
    const foundUser = users.find(user => user.email === normalizedLoginEmail);

    if (foundUser) {
        
        // SCENARIO 1: User has a password (Newly Registered User)
        if (foundUser.pass !== null) {
            if (foundUser.pass === loginPass) {
                sessionStorage.setItem('currentUserEmail', foundUser.email);
                window.location.href = '../dashboard/index.html';
                return;
            } else {
                alert("Incorrect password.");
                return;
            }
        } 
        
        // SCENARIO 2: User does NOT have a password (Existing Mock User)
        else {
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
    
    // The lookup is now robust because the stored 'user.email' is guaranteed to be lowercase.
    const normalizedSessionEmail = userEmail.toLowerCase();
    const currentUser = users.find(user => user.email === normalizedSessionEmail);
    
    if (currentUser) {
        const formatCurrency = (value) => value.toLocaleString('en-US', { minimumFractionDigits: 2 });

        document.getElementById('dashboardName').textContent = currentUser.firstName + " " + currentUser.lastName;
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('userCountry').textContent = currentUser.country;

        const status = currentUser.pass === null ? 'Existing Mock User' : 'Newly Registered User';
        document.getElementById('userStatus').textContent = status;

        document.getElementById('accBalance').textContent = formatCurrency(currentUser.accountBalance ?? 0.00);
        document.getElementById('totalProfit').textContent = formatCurrency(currentUser.totalProfit ?? 0.00);
        document.getElementById('profitBalance').textContent = formatCurrency(currentUser.profitBalance ?? 0.00);
        
    } else {
        logoutMock();
    }
}

function logoutMock() {
    sessionStorage.removeItem('currentUserEmail'); 
    alert("You have been logged out.");
    window.location.href = '../index.html';
}

// --- AUTO-LOAD FIX FOR DASHBOARD ---
// This ensures loadDashboard() runs immediately upon dashboard.html loading.
if (document.getElementById('dashboardName')) {
    loadDashboard();
}