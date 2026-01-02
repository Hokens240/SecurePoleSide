// --- DATABASE INITIALIZATION ---
function initializeMockUsers() {
    const initialUsers = [
       { 
            email: "almightyrick8@gmail.com", 
            firstName: "Rick", 
            lastName: "Aguiar", 
            country: "United States of America", 
            pass: null, 
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
            accountBalance: "700", 
            totalProfit: "700", 
            profitBalance: "700", 
            initialInvestment: "00.00", 
            returnOnInvestment: "700"
        },
        { 
            email: "mychaloh@gmail.com", 
            firstName: "Herron", 
            lastName: "Chaloh", 
            country: "United States of America", 
            pass: null, 
            accountBalance: "22,000", 
            totalProfit: "22,000", 
            profitBalance: "22,000", 
            initialInvestment: "00.00", 
            returnOnInvestment: "22,000"
        },
    ];

    // 1. Load existing data, or start with an empty array if storage is truly empty.
    const existingUsersJSON = localStorage.getItem('mockUsers');
    const existingUsers = existingUsersJSON ? JSON.parse(existingUsersJSON) : [];

    // 2. Create a Map for easy merging/lookup, preserving existing users first.
    // Map: { "email": userObject, ... }
    const userMap = new Map();

    // Preserve all existing users (registered users).
    existingUsers.forEach(user => {
        // Use normalized email as the key
        userMap.set(user.email.toLowerCase(), user); 
    });
    
    // 3. Overwrite mock users with clean, fresh data.
    // This ensures Larry, Ricky and Herron always have the correct metrics, even if they existed previously.
    initialUsers.forEach(mockUser => {
        // Use normalized email as the key
        userMap.set(mockUser.email.toLowerCase(), mockUser); 
    });

    // 4. Save the merged list back to storage.
    const mergedUsers = Array.from(userMap.values());
    localStorage.setItem('mockUsers', JSON.stringify(mergedUsers));

    console.log("Mock data synchronized: Larry, Rick and Herron reset to latest definitions, registered users preserved.");
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
        accountBalance: "0.00",
        totalProfit: "0.00",
        profitBalance: "0.00",
        returnOnInvestment: "0.00",
        initialInvestment: "0.00"
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
        const firstName = currentUser.firstName ?? '';
        const lastName = currentUser.lastName ?? '';
        
        const greetingElements = document.getElementsByClassName('user-greeting-name');
        for (let i = 0; i < greetingElements.length; i++) {
            greetingElements[i].textContent = firstName + " " + lastName;
        }
        
        document.getElementById('userEmail').textContent = currentUser.email;
        //document.getElementById('userCountry').textContent = currentUser.country;

        const status = currentUser.pass === null ? 'Existing Mock User' : 'Newly Registered User';
        //document.getElementById('userStatus').textContent = status;

        // --- FINANCIAL DATA UPDATE (using Data Attributes) ---
        // Queries all metric elements and updates their text content based on their data-metric attribute.
        const metricElements = document.querySelectorAll('.financial-metric');
        
        metricElements.forEach(element => {
            const metricKey = element.getAttribute('data-metric');
            if (metricKey && currentUser[metricKey] !== undefined) {
                // Assigns the pre-formatted string directly.
                element.textContent = currentUser[metricKey];
                
                // CONSOLE LOG ADDED HERE FOR DEBUGGING
                console.log(`[Metric Update] Key: ${metricKey}, Value: ${currentUser[metricKey]}`);

            } else {
                element.textContent = "N/A";
                console.log(`[Metric Update] Key: ${metricKey}, Value: N/A (Key not found in user object)`);
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


// Ensures dashboard elements are loaded after the DOM is ready.
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.user-greeting-name')) {
        loadDashboard();
    }
});

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
