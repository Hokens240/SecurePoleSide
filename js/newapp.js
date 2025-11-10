// --- DATABASE INITIALIZATION ---
function initializeMockUsers() {
    // 1. Define your initial, "pre-existing" user database. 
    // pass: null = password ignored during login.
    const initialUsers = [
        { 
            email: "alice@example.com", firstName: "Alice", lastName: "Smith", country: "USA", pass: null, 
            accountBalance: 1550.75, totalProfit: 520.10, profitBalance: 120.50 
        },
        { 
            email: "bob@example.com", firstName: "Bob", lastName: "Johnson", country: "Canada", pass: null, 
            accountBalance: 2890.00, totalProfit: 1875.99, profitBalance: 350.45 
        },
    ];

    // 2. Load the initial users only if localStorage is empty (first time or after cache clear).
    if (!localStorage.getItem('mockUsers')) {
        localStorage.setItem('mockUsers', JSON.stringify(initialUsers));
        console.log("Initial mock database loaded.");
    }
}

// Run initialization immediately
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

    const storedUsersJSON = localStorage.getItem('mockUsers');
    const users = JSON.parse(storedUsersJSON);

    // Check for duplicate email
    const emailExists = users.some(user => user.email === newEmail);
    if (emailExists) {
        alert("This email is already registered.");
        return;
    }

    // 4. Create the new user object (with default financial data)
    const newUser = { 
        email: newEmail, 
        firstName: newFirstName, 
        lastName: newLastName, 
        country: newCountry, 
        pass: newPass, // Stored password
        accountBalance: 0.00,
        totalProfit: 0.00,
        profitBalance: 0.00
    };
    users.push(newUser);

    console.log(`[DEV LOG] New user registered:`, newUser);

    // 5. Save the updated database back to localStorage
    localStorage.setItem('mockUsers', JSON.stringify(users));

    alert(`Registration successful! Welcome, ${newFirstName}. You can now log in.`);
    window.location.href = 'index.html'; 
}


// --- LOGIN FUNCTION ---
function loginMock() {
    const loginEmail = document.getElementById('emailInput').value.trim();
    const loginPass = document.getElementById('passwordInput').value.trim();

    const storedUsersJSON = localStorage.getItem('mockUsers');
    const users = JSON.parse(storedUsersJSON);

    const foundUser = users.find(user => user.email === loginEmail);

    if (foundUser) {
        
        // SCENARIO 1: User has a password (Newly Registered User)
        if (foundUser.pass !== null) {
            if (foundUser.pass === loginPass) {
                // Success: Check passed
                sessionStorage.setItem('currentUserEmail', foundUser.email);
                window.location.href = 'dashboard.html';
                return;
            } else {
                alert("Incorrect password.");
                return;
            }
        } 
        
        // SCENARIO 2: User does NOT have a password (Existing Mock User)
        else {
            // Success: Ignore the password input and grant access based on email match
            sessionStorage.setItem('currentUserEmail', foundUser.email);
            window.location.href = 'dashboard.html';
            return;
        }
    } 
    
    // Email not found
    alert("Email not found. Please check your spelling or register.");
}


// --- DASHBOARD AND LOGOUT ---

function loadDashboard() {
    const userEmail = sessionStorage.getItem('currentUserEmail');

    if (!userEmail) {
        window.location.href = 'index.html';
        return;
    }

    const storedUsersJSON = localStorage.getItem('mockUsers');
    const users = JSON.parse(storedUsersJSON);
    const currentUser = users.find(user => user.email === userEmail);
    
    if (currentUser) {
        // Function to format currency
        const formatCurrency = (value) => value.toLocaleString('en-US', { minimumFractionDigits: 2 });

        // Update Personal Details
        document.getElementById('dashboardName').textContent = currentUser.firstName + " " + currentUser.lastName;
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('userCountry').textContent = currentUser.country;

        const status = currentUser.pass === null ? 'Existing Mock User' : 'Newly Registered User';
        document.getElementById('userStatus').textContent = status;

        // Update Financial Data
        // Use optional chaining (?) in case a new user somehow doesn't have these properties (for stability)
        document.getElementById('accBalance').textContent = formatCurrency(currentUser.accountBalance ?? 0.00);
        document.getElementById('totalProfit').textContent = formatCurrency(currentUser.totalProfit ?? 0.00);
        document.getElementById('profitBalance').textContent = formatCurrency(currentUser.profitBalance ?? 0.00);
        
    } else {
        // If user data is missing (e.g., localStorage corrupted), force logout
        logoutMock();
    }
}

function logoutMock() {
    sessionStorage.removeItem('currentUserEmail'); 
    alert("You have been logged out.");
    window.location.href = 'index.html';
}