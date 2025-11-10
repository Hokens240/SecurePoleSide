// --- DATABASE INITIALIZATION ---
function initializeMockUsers() {
    // 1. Define your initial, "pre-existing" user database.
    // Pass: null means password is NOT required for login (password input is ignored).
    const initialUsers = [
        { email: "almightyrick8@gmail.com", firstName: "Rick", lastName: "Aguiar", country: "United States of America", pass: null },
        { email: "mychaloh@gmail.com", firstName: "Herron", lastName: "Chaloh", country: "United States of America", pass: null },
        { email: "larrylovato59@gmail.com", firstName: "Larry", lastName: "Lovato", country: "United States of America", pass: null },
    ];


    // 2. Load the initial users only if the storage is empty (first-time use or after cache clear).
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

    // Retrieve the existing database
    const storedUsersJSON = localStorage.getItem('mockUsers');
    const users = JSON.parse(storedUsersJSON);

    // Check for duplicate email
    const emailExists = users.some(user => user.email === newEmail);
    if (emailExists) {
        alert("This email is already registered.");
        return;
    }

    // Create the new user object
    const newUser = { 
        email: newEmail, 
        firstName: newFirstName, 
        lastName: newLastName, 
        country: newCountry, 
        pass: newPass // Store the password for new users
    };
    users.push(newUser);

    // [DEV LOG] Output the new user to the console for manual hardcoding reference
    console.log(`[DEV LOG] New user registered and saved locally:`, newUser);

    // Save the updated database
    localStorage.setItem('mockUsers', JSON.stringify(users));

    alert(`Registration successful! Welcome, ${newFirstName}. You can now log in.`);
    window.location.href = 'index.html'; // Redirect to login page
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
                // Success
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


// --- DASHBOARD LOGIC ---
function loadDashboard() {
    const userEmail = sessionStorage.getItem('currentUserEmail');

    // If no email is in session storage, redirect to login
    if (!userEmail) {
        window.location.href = 'index.html';
        return;
    }

    const storedUsersJSON = localStorage.getItem('mockUsers');
    const users = JSON.parse(storedUsersJSON);
    
    // Find the full user data object
    const currentUser = users.find(user => user.email === userEmail);
    
    if (currentUser) {
        // Update the dashboard elements
        document.getElementById('dashboardName').textContent = currentUser.firstName + " " + currentUser.lastName;
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('userCountry').textContent = currentUser.country;

        // Display status based on whether they had a password initially (mocking an account type)
        const status = currentUser.pass === null ? 'Pre-existing Mock User' : 'Newly Registered User';
        document.getElementById('userStatus').textContent = status;
        
    } else {
        // Should not happen if logic is correct, but safe check
        window.location.href = 'index.html';
    }
}


// --- LOGOUT FUNCTION ---
function logoutMock() {
    // Clear the current session data
    sessionStorage.removeItem('currentUserEmail'); 
    alert("You have been logged out.");
    window.location.href = 'index.html';
}
