// --- DATABASE INITIALIZATION ---
function initializeMockUsers() {
    // Financial values for all users are stored as pre-formatted strings to guarantee display consistency.
    const initialUsers = [
        { 
            email: "almightyrick8@gmail.com", 
            firstName: "Rick", 
            lastName: "Aguiar", 
            country: "United States of America", 
            pass: null, 
            accountBalance: "1,550.75", 
            totalProfit: "520.10", 
            profitBalance: "120.50", 
            initialInvestment: "1,000.00", 
            returnOnInvestment: "4,892.11"
        },
        { 
            email: "larrylovato59@gmail.com", 
            firstName: "Larry", 
            lastName: "Lovato", 
            country: "United States of America", 
            pass: null, 
            accountBalance: "1,550.75", 
            totalProfit: "520.10", 
            profitBalance: "120.50", 
            initialInvestment: "2,400.00", 
            returnOnInvestment: "5,342.91"
        },
        { 
            email: "mychaloh@gmail.com", 
            firstName: "Herron", 
            lastName: "Chaloh", 
            country: "United States of America", 
            pass: null, 
            accountBalance: "2,890.00", 
            totalProfit: "1,875.99", 
            profitBalance: "350.45", 
            initialInvestment: "1,870.00", 
            returnOnInvestment: "2,312.22" 
        },
    ];

    // Forcibly writes clean initial data to localStorage on every load to prevent data corruption.
    localStorage.removeItem('mockUsers'); 
    localStorage.setItem('mockUsers', JSON.stringify(initialUsers));
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

    // New users initialize all metrics as pre-formatted string "0.00".
    const newUser = { 
        email: normalizedEmail, 
        firstName: newFirstName, 
        lastName: newLastName, 
        country: newCountry, 
        pass: newPass, 
        accountBalance: "0.00",
        totalProfit: "0.00",
        profitBalance: "0.00",
        initialInvestment: "0.00", 
        returnOnInvestment: "0.00"  
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
        const firstName = currentUser.firstName ?? '';
        const lastName = currentUser.lastName ?? '';
        
        // Update all elements with the user-greeting-name class.
        const greetingElements = document.getElementsByClassName('user-greeting-name');
        for (let i = 0; i < greetingElements.length; i++) {
            greetingElements[i].textContent = firstName + " " + lastName;
        }
        
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('userCountry').textContent = currentUser.country;

        const status = currentUser.pass === null ? 'Existing Mock User' : 'Newly Registered User';
        document.getElementById('userStatus').textContent = status;

        // --- FINANCIAL DATA UPDATE ---
        // Direct string access is used for simple, reliable display of pre-formatted metrics.
        document.getElementById('accountBalance').textContent = currentUser.accountBalance ?? "0.00";
        document.getElementById('totalProfit').textContent = currentUser.totalProfit ?? "0.00";
        document.getElementById('profitBalance').textContent = currentUser.profitBalance ?? "0.00";
        document.getElementById('initialInvestment').textContent = currentUser.initialInvestment ?? "0.00";
        document.getElementById('returnOnInvestment').textContent = currentUser.returnOnInvestment ?? "0.00";
        
    } else {
        logoutMock();
    }
}

function logoutMock() {
    sessionStorage.removeItem('currentUserEmail'); 
    alert("You have been logged out.");
    window.location.href = '../index.html';
}


// Ensures loadDashboard runs only after the entire dashboard HTML structure is available.
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.user-greeting-name')) {
        loadDashboard();
    }
});

//Copy Wallet Section
function copyText() {
    const input = document.getElementById("myInput");
    const message = document.getElementById("message");
    
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(input.value)
            .then(() => {
                message.textContent = "Copied to clipboard!";
                setTimeout(() => { message.textContent = ""; }, 3000);
            })
            .catch(err => {
                message.textContent = "Copy failed.";
                console.error('Copy Error:', err);
            });
    } else {
        message.textContent = "Feature unavailable";
    }
}