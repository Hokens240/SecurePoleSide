// --- GLOBAL HELPER FUNCTION ---
// Formats a number into a currency string (e.g., 1550.75 -> "1,550.75")
const formatCurrency = (value) => value.toLocaleString('en-US', { minimumFractionDigits: 2 });

// --- DATABASE INITIALIZATION ---
function initializeMockUsers() {
    const initialUsers = [
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
        } 
        
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
    
    const normalizedSessionEmail = userEmail.toLowerCase();
    const currentUser = users.find(user => user.email === normalizedSessionEmail);
    
    if (currentUser) {
        
        // --- PERSONAL DETAILS ---
        document.getElementById('dashboardName').textContent = currentUser.firstName + " " + currentUser.lastName;
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('userCountry').textContent = currentUser.country;

        const status = currentUser.pass === null ? 'Existing Mock User' : 'Newly Registered User';
        document.getElementById('userStatus').textContent = status;

        // --- FINANCIAL DATA UPDATE ---
        // IMPORTANT FIX: Use parseFloat() to ensure the values are treated as numbers 
        // before the formatCurrency function (which uses toLocaleString) is called.
        document.getElementById('accBalance').textContent = formatCurrency(parseFloat(currentUser.accountBalance) ?? 0.00);
        document.getElementById('totalProfit').textContent = formatCurrency(parseFloat(currentUser.totalProfit) ?? 0.00);
        document.getElementById('profitBalance').textContent = formatCurrency(parseFloat(currentUser.profitBalance) ?? 0.00);
        document.getElementById('returnOnInvestment').textContent = formatCurrency(parseFloat(currentUser.returnOnInvestment) ?? 0.00);
        document.getElementById('initialInvestment').textContent = formatCurrency(parseFloat(currentUser.initialInvestment) ?? 0.00);
        
        // Debugging log to confirm data type conversion
        console.log("Dashboard Data Formatted:", {
            balance: document.getElementById('accBalance').textContent,
            type: typeof parseFloat(currentUser.accountBalance)
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


// --- ROBUST AUTO-LOAD FIX FOR DASHBOARD (Wait for DOM) ---
// This ensures loadDashboard runs only after the entire HTML structure is ready.
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('dashboardName')) {
        loadDashboard();
    }
});