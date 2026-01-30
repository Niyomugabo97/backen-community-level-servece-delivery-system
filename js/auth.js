// Authentication JavaScript

// Tab switching
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const signupUserType = document.getElementById('signupUserType');
    const leaderFields = document.getElementById('leaderFields');

    // Tab switching
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            if (tab === 'login') {
                loginForm.classList.add('active');
                signupForm.classList.remove('active');
            } else {
                signupForm.classList.add('active');
                loginForm.classList.remove('active');
            }
        });
    });

    // Show/hide leader fields
    const cellFields = document.getElementById('cellFields');
    const sectorFields = document.getElementById('sectorFields');
    
    if (signupUserType) {
        signupUserType.addEventListener('change', (e) => {
            const value = e.target.value;
            
            // Hide all fields first and remove required attributes
            if (leaderFields) {
                leaderFields.style.display = 'none';
                leaderFields.querySelectorAll('input').forEach(input => input.removeAttribute('required'));
            }
            if (cellFields) {
                cellFields.style.display = 'none';
                cellFields.querySelectorAll('input').forEach(input => input.removeAttribute('required'));
            }
            if (sectorFields) {
                sectorFields.style.display = 'none';
                sectorFields.querySelectorAll('input').forEach(input => input.removeAttribute('required'));
            }
            
            // Show and add required attributes based on selection
            if (value === 'leader' && leaderFields) {
                leaderFields.style.display = 'block';
                leaderFields.querySelectorAll('input').forEach(input => input.setAttribute('required', 'required'));
            } else if (value === 'cell' && cellFields) {
                cellFields.style.display = 'block';
                cellFields.querySelectorAll('input').forEach(input => input.setAttribute('required', 'required'));
            } else if (value === 'sector' && sectorFields) {
                sectorFields.style.display = 'block';
                sectorFields.querySelectorAll('input').forEach(input => input.setAttribute('required', 'required'));
            }
        });
    }

    // Login form
    const loginFormElement = document.getElementById('loginFormElement');
    if (loginFormElement) {
        loginFormElement.addEventListener('submit', handleLogin);
    }

    // Signup form
    const signupFormElement = document.getElementById('signupFormElement');
    if (signupFormElement) {
        signupFormElement.addEventListener('submit', handleSignup);
    }
});

// Handle login
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const userType = document.getElementById('userType').value;

    if (!userType) {
        alert('Please select account type');
        return;
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Find user
    const user = users.find(u => 
        (u.email === email || u.username === email) && 
        u.password === password && 
        u.userType === userType
    );

    if (user) {
        // Store current user session
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        
        // Redirect based on user type
        if (userType === 'leader') {
            window.location.href = 'leader-dashboard.html';
        } else if (userType === 'cell') {
            window.location.href = 'cell-dashboard.html';
        } else if (userType === 'sector') {
            window.location.href = 'sector-dashboard.html';
        } else if (userType === 'school') {
            window.location.href = 'school-dashboard.html';
        } else {
            window.location.href = 'citizen-dashboard.html';
        }
    } else {
        alert('Invalid credentials. Please try again or sign up.');
    }
}

// Handle signup
function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phone = document.getElementById('signupPhone').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const userType = document.getElementById('signupUserType').value;

    // Validation
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }

    if (!userType) {
        alert('Please select account type');
        return;
    }
    
    // Additional validation for leader-specific fields
    if (userType === 'leader') {
        const sector = document.getElementById('signupSector').value;
        const cell = document.getElementById('signupCell').value;
        const village = document.getElementById('signupVillage').value;
        if (!sector || !cell || !village) {
            alert('Please fill in all required fields (Sector, Cell, Village)');
            return;
        }
    } else if (userType === 'cell') {
        const sector = document.getElementById('signupCellSector').value;
        const cell = document.getElementById('signupCellCell').value;
        if (!sector || !cell) {
            alert('Please fill in all required fields (Sector, Cell)');
            return;
        }
    } else if (userType === 'sector') {
        const sector = document.getElementById('signupSectorSector').value;
        if (!sector) {
            alert('Please fill in the Sector field');
            return;
        }
    }

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if user already exists
    if (users.find(u => u.email === email)) {
        alert('User with this email already exists');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        password, // In production, this should be hashed
        userType,
        createdAt: new Date().toISOString()
    };

    // Add leader-specific fields if leader
    if (userType === 'leader') {
        newUser.sector = document.getElementById('signupSector').value;
        newUser.cell = document.getElementById('signupCell').value;
        newUser.village = document.getElementById('signupVillage').value;
    } else if (userType === 'cell') {
        newUser.sector = document.getElementById('signupCellSector').value;
        newUser.cell = document.getElementById('signupCellCell').value;
    } else if (userType === 'sector') {
        newUser.sector = document.getElementById('signupSectorSector').value;
    }

    // Save user
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Account created successfully! Please login.');
    
    // Switch to login tab
    document.querySelector('.tab-btn[data-tab="login"]').click();
    
    // Clear form
    e.target.reset();
}


