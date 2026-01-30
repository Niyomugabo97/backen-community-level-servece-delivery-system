// School Dropout Dashboard JavaScript

// Check authentication
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    if (!currentUser || currentUser.userType !== 'school') {
        window.location.href = 'login.html';
        return;
    }

    initializeSchoolDashboard();
});

function initializeSchoolDashboard() {
    setupSchoolNav();
    setupSchoolForms();
    loadSchoolData();
}

// Navigation
function setupSchoolNav() {
    const menuLinks = document.querySelectorAll('.dashboard-menu a');
    const sections = document.querySelectorAll('.dashboard-section');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;

            menuLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            sessionStorage.removeItem('currentUser');
            window.location.href = 'login.html';
        });
    }
}

// Forms
function setupSchoolForms() {
    const schoolInfoForm = document.getElementById('schoolInfoForm');
    const dropoutForm = document.getElementById('dropoutForm');

    if (schoolInfoForm) {
        schoolInfoForm.addEventListener('submit', handleSchoolInfoSubmit);
    }
    if (dropoutForm) {
        dropoutForm.addEventListener('submit', handleDropoutSubmit);
    }
}

// Load all school data
function loadSchoolData() {
    loadSchoolInfo();
    loadDropoutTable();
}

// Handle school info save
function handleSchoolInfoSubmit(e) {
    e.preventDefault();

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    const school = {
        id: Date.now(),
        schoolName: document.getElementById('schoolName').value,
        schoolLeader: document.getElementById('schoolLeader').value,
        email: document.getElementById('schoolEmail').value,
        phone: document.getElementById('schoolPhone').value,
        totalStudents: parseInt(document.getElementById('totalStudents').value) || 0,
        totalDropouts: parseInt(document.getElementById('totalDropouts').value) || 0,
        ownerEmail: currentUser.email,
        updatedAt: new Date().toISOString()
    };

    const schools = JSON.parse(localStorage.getItem('schools')) || [];

    // One school profile per leader account (by email)
    const index = schools.findIndex(s => s.ownerEmail === currentUser.email);
    if (index >= 0) {
        schools[index] = { ...schools[index], ...school };
    } else {
        schools.push(school);
    }

    localStorage.setItem('schools', JSON.stringify(schools));

    loadSchoolInfo();
    alert('School information saved successfully!');
}

// Load school info + statistics
function loadSchoolInfo() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const schools = JSON.parse(localStorage.getItem('schools')) || [];
    const school = schools.find(s => s.ownerEmail === currentUser.email);

    if (school) {
        document.getElementById('schoolName').value = school.schoolName || '';
        document.getElementById('schoolLeader').value = school.schoolLeader || '';
        document.getElementById('schoolEmail').value = school.email || '';
        document.getElementById('schoolPhone').value = school.phone || '';
        document.getElementById('totalStudents').value = school.totalStudents || 0;
        document.getElementById('totalDropouts').value = school.totalDropouts || 0;

        const totalStudents = school.totalStudents || 0;
        const totalDropouts = school.totalDropouts || 0;
        const rate = totalStudents > 0 ? ((totalDropouts / totalStudents) * 100).toFixed(1) : 0;

        document.getElementById('statTotalStudents').textContent = totalStudents;
        document.getElementById('statTotalDropouts').textContent = totalDropouts;
        document.getElementById('statDropoutRate').textContent = rate + '%';
    } else {
        document.getElementById('statTotalStudents').textContent = 0;
        document.getElementById('statTotalDropouts').textContent = 0;
        document.getElementById('statDropoutRate').textContent = '0%';
    }
}

// Handle dropout record save
function handleDropoutSubmit(e) {
    e.preventDefault();

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));

    const record = {
        id: Date.now(),
        schoolName: document.getElementById('dropoutSchoolName').value,
        schoolLeader: document.getElementById('dropoutSchoolLeader').value,
        leaderPhone: document.getElementById('dropoutLeaderPhone').value,
        leaderEmail: document.getElementById('dropoutLeaderEmail').value,
        studentName: document.getElementById('studentName').value,
        sex: document.getElementById('studentSex').value,
        age: parseInt(document.getElementById('studentAge').value) || null,
        recentLevel: document.getElementById('recentLevel').value,
        fatherName: document.getElementById('fatherName').value,
        fatherPhone: document.getElementById('fatherPhone').value,
        motherName: document.getElementById('motherName').value,
        guardianPhone: document.getElementById('guardianPhone').value,
        ownerEmail: currentUser.email,
        date: new Date().toISOString()
    };

    const records = JSON.parse(localStorage.getItem('dropoutRecords')) || [];
    records.push(record);
    localStorage.setItem('dropoutRecords', JSON.stringify(records));

    e.target.reset();
    loadDropoutTable();
    updateSchoolDropoutFromRecords();
    alert('Dropout record saved successfully!');
}

// Load dropout table for this school
function loadDropoutTable() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const records = JSON.parse(localStorage.getItem('dropoutRecords')) || [];

    const schoolRecords = records.filter(r => r.ownerEmail === currentUser.email);
    const tbody = document.getElementById('dropoutTableBody');

    if (!tbody) return;

    if (schoolRecords.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9">No dropout records yet.</td></tr>';
        return;
    }

    tbody.innerHTML = schoolRecords
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map(r => `
            <tr>
                <td>${r.studentName}</td>
                <td>${r.sex}</td>
                <td>${r.age || ''}</td>
                <td>${r.recentLevel}</td>
                <td>${r.schoolName}</td>
                <td>${r.fatherName || ''}</td>
                <td>${r.motherName || ''}</td>
                <td>${r.guardianPhone || ''}</td>
                <td>${formatDateShort(r.date)}</td>
            </tr>
        `).join('');
}

// After adding records, update the school profile dropout count automatically
function updateSchoolDropoutFromRecords() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const records = JSON.parse(localStorage.getItem('dropoutRecords')) || [];
    const schools = JSON.parse(localStorage.getItem('schools')) || [];

    const count = records.filter(r => r.ownerEmail === currentUser.email).length;
    const index = schools.findIndex(s => s.ownerEmail === currentUser.email);
    if (index >= 0) {
        schools[index].totalDropouts = count;
        localStorage.setItem('schools', JSON.stringify(schools));
        loadSchoolInfo();
    }
}

// Date helpers
function formatDateShort(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}


