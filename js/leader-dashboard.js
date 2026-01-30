// Leader Dashboard JavaScript

// Check authentication
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser || currentUser.userType !== 'leader') {
        window.location.href = 'login.html';
        return;
    }

    initializeDashboard();
});

function initializeDashboard() {
    // Navigation
    setupNavigation();
    
    // Forms
    setupForms();
    
    // Load data tables
    loadAllTables();
    
    // Setup case auto-escalation
    setupCaseAutoEscalation();
    
    // Load notifications
    loadNotifications();
    
    // Load chat messages
    loadLeaderChatMessages();
    loadLeaderInbox();
    // Home updates (activities, upcoming, trending)
    setupHomeUpdatesTabs();
    setupHomeUpdateForms();
    loadLeaderHomeUpdatesList();
}

// Navigation between sections
function setupNavigation() {
    const menuLinks = document.querySelectorAll('.dashboard-menu a');
    const sections = document.querySelectorAll('.dashboard-section');

    menuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            
            // Update active states
            menuLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            sections.forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
            }
        });
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
}

// Setup all forms
function setupForms() {
    // Umuganda form
    document.getElementById('umugandaForm').addEventListener('submit', handleUmugandaSubmit);
    
    // Inteko form
    document.getElementById('intekoForm').addEventListener('submit', handleIntekoSubmit);
    setupIntekoDynamicFields();
    
    // Register form
    document.getElementById('registerForm').addEventListener('submit', handleRegisterSubmit);
    
    // Insurance form
    document.getElementById('insuranceForm').addEventListener('submit', handleInsuranceSubmit);
    
    // Drugs form
    document.getElementById('drugsForm').addEventListener('submit', handleDrugsSubmit);
    
    // Violence form
    document.getElementById('violenceForm').addEventListener('submit', handleViolenceSubmit);
    
    // Case form
    document.getElementById('caseForm').addEventListener('submit', handleCaseSubmit);
    
    // Chat form
    const leaderChatForm = document.getElementById('leaderChatForm');
    if (leaderChatForm) {
        leaderChatForm.addEventListener('submit', handleLeaderChatSubmit);
    }
    const leaderActivityForm = document.getElementById('leaderActivityForm');
    if (leaderActivityForm) leaderActivityForm.addEventListener('submit', handleLeaderActivitySubmit);
    const leaderUpcomingForm = document.getElementById('leaderUpcomingForm');
    if (leaderUpcomingForm) leaderUpcomingForm.addEventListener('submit', handleLeaderUpcomingSubmit);
    const leaderTrendingForm = document.getElementById('leaderTrendingForm');
    if (leaderTrendingForm) leaderTrendingForm.addEventListener('submit', handleLeaderTrendingSubmit);
}

// Umuganda Attendance
function handleUmugandaSubmit(e) {
    e.preventDefault();
    
    const record = {
        id: Date.now(),
        name: document.getElementById('umugandaName').value,
        age: document.getElementById('umugandaAge').value,
        sex: document.getElementById('umugandaSex').value,
        sector: document.getElementById('umugandaSector').value,
        cell: document.getElementById('umugandaCell').value,
        village: document.getElementById('umugandaVillage').value,
        date: new Date().toISOString()
    };

    const records = JSON.parse(localStorage.getItem('umugandaRecords')) || [];
    records.push(record);
    localStorage.setItem('umugandaRecords', JSON.stringify(records));

    e.target.reset();
    loadUmugandaTable();
    alert('Umuganda attendance recorded successfully!');
}

function loadUmugandaTable() {
    const records = JSON.parse(localStorage.getItem('umugandaRecords')) || [];
    const tbody = document.getElementById('umugandaTableBody');
    
    tbody.innerHTML = records.map(record => `
        <tr>
            <td>${record.name}</td>
            <td>${record.age}</td>
            <td>${record.sex}</td>
            <td>${record.sector}</td>
            <td>${record.cell}</td>
            <td>${record.village}</td>
            <td>${formatDate(record.date)}</td>
        </tr>
    `).join('');
}

// Inteko Minutes
function setupIntekoDynamicFields() {
    // Add attendee
    document.getElementById('addAttendeeBtn').addEventListener('click', () => {
        const container = document.getElementById('attendeesContainer');
        const newItem = document.createElement('div');
        newItem.className = 'attendee-item';
        newItem.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Full Name</label>
                    <input type="text" class="attendee-name" required>
                </div>
                <div class="form-group">
                    <label>Role / Position</label>
                    <input type="text" class="attendee-role">
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-danger remove-attendee">Remove</button>
                </div>
            </div>
        `;
        container.appendChild(newItem);
        
        newItem.querySelector('.remove-attendee').addEventListener('click', () => {
            newItem.remove();
        });
    });

    // Add agenda
    document.getElementById('addAgendaBtn').addEventListener('click', () => {
        const container = document.getElementById('agendaContainer');
        const count = container.children.length + 1;
        const newItem = document.createElement('div');
        newItem.className = 'agenda-item';
        newItem.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Agenda Number</label>
                    <input type="number" class="agenda-number" value="${count}" required>
                </div>
                <div class="form-group">
                    <label>Title</label>
                    <input type="text" class="agenda-title" required>
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-danger remove-agenda">Remove</button>
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea class="agenda-description" rows="2"></textarea>
            </div>
            <div class="form-group">
                <label>Presenter</label>
                <input type="text" class="agenda-presenter">
            </div>
        `;
        container.appendChild(newItem);
        
        newItem.querySelector('.remove-agenda').addEventListener('click', () => {
            newItem.remove();
        });
    });

    // Add decision
    document.getElementById('addDecisionBtn').addEventListener('click', () => {
        const container = document.getElementById('decisionsContainer');
        const newItem = document.createElement('div');
        newItem.className = 'decision-item';
        newItem.innerHTML = `
            <div class="form-row">
                <div class="form-group">
                    <label>Decision ID</label>
                    <input type="text" class="decision-id" required>
                </div>
                <div class="form-group">
                    <label>Decision Type</label>
                    <select class="decision-type" required>
                        <option value="">Select</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Deferred">Deferred</option>
                    </select>
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-danger remove-decision">Remove</button>
                </div>
            </div>
            <div class="form-group">
                <label>Decision Description</label>
                <textarea class="decision-description" rows="3" required></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Voting Method</label>
                    <select class="voting-method">
                        <option value="">Select</option>
                        <option value="Consensus">Consensus</option>
                        <option value="Majority vote">Majority vote</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Votes Yes</label>
                    <input type="number" class="votes-yes" min="0">
                </div>
                <div class="form-group">
                    <label>Votes No</label>
                    <input type="number" class="votes-no" min="0">
                </div>
                <div class="form-group">
                    <label>Abstain</label>
                    <input type="number" class="votes-abstain" min="0">
                </div>
            </div>
            <div class="form-group">
                <label>Effective Date</label>
                <input type="date" class="effective-date">
            </div>
        `;
        container.appendChild(newItem);
        
        newItem.querySelector('.remove-decision').addEventListener('click', () => {
            newItem.remove();
        });
    });

    // Add action
    document.getElementById('addActionBtn').addEventListener('click', () => {
        const container = document.getElementById('actionsContainer');
        const newItem = document.createElement('div');
        newItem.className = 'action-item';
        newItem.innerHTML = `
            <div class="form-group">
                <label>Action Description</label>
                <textarea class="action-description" rows="2" required></textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Responsible Person / Department</label>
                    <input type="text" class="responsible-person" required>
                </div>
                <div class="form-group">
                    <label>Start Date</label>
                    <input type="date" class="start-date">
                </div>
                <div class="form-group">
                    <label>Deadline</label>
                    <input type="date" class="deadline">
                </div>
                <div class="form-group">
                    <label>Status</label>
                    <select class="action-status">
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                </div>
                <div class="form-group">
                    <button type="button" class="btn btn-danger remove-action">Remove</button>
                </div>
            </div>
            <div class="form-group">
                <label>Progress Notes</label>
                <textarea class="progress-notes" rows="2"></textarea>
            </div>
        `;
        container.appendChild(newItem);
        
        newItem.querySelector('.remove-action').addEventListener('click', () => {
            newItem.remove();
        });
    });
}

function handleIntekoSubmit(e) {
    e.preventDefault();
    
    // Collect attendees
    const attendees = [];
    document.querySelectorAll('.attendee-item').forEach(item => {
        attendees.push({
            name: item.querySelector('.attendee-name').value,
            role: item.querySelector('.attendee-role').value
        });
    });

    // Collect agenda items
    const agendaItems = [];
    document.querySelectorAll('.agenda-item').forEach(item => {
        agendaItems.push({
            number: item.querySelector('.agenda-number').value,
            title: item.querySelector('.agenda-title').value,
            description: item.querySelector('.agenda-description').value,
            presenter: item.querySelector('.agenda-presenter').value
        });
    });

    // Collect decisions
    const decisions = [];
    document.querySelectorAll('.decision-item').forEach(item => {
        decisions.push({
            id: item.querySelector('.decision-id').value,
            type: item.querySelector('.decision-type').value,
            description: item.querySelector('.decision-description').value,
            votingMethod: item.querySelector('.voting-method').value,
            votesYes: item.querySelector('.votes-yes').value,
            votesNo: item.querySelector('.votes-no').value,
            votesAbstain: item.querySelector('.votes-abstain').value,
            effectiveDate: item.querySelector('.effective-date').value
        });
    });

    // Collect action items
    const actions = [];
    document.querySelectorAll('.action-item').forEach(item => {
        actions.push({
            description: item.querySelector('.action-description').value,
            responsiblePerson: item.querySelector('.responsible-person').value,
            startDate: item.querySelector('.start-date').value,
            deadline: item.querySelector('.deadline').value,
            status: item.querySelector('.action-status').value,
            progressNotes: item.querySelector('.progress-notes').value
        });
    });

    const record = {
        id: Date.now(),
        meetingTitle: document.getElementById('meetingTitle').value,
        meetingType: document.getElementById('meetingType').value,
        meetingDate: document.getElementById('meetingDate').value,
        startTime: document.getElementById('startTime').value,
        endTime: document.getElementById('endTime').value,
        venue: document.getElementById('venue').value,
        meetingNumber: document.getElementById('meetingNumber').value,
        chairperson: document.getElementById('chairperson').value,
        attendees,
        apologies: document.getElementById('apologies').value,
        quorumStatus: document.getElementById('quorumStatus').value,
        agendaItems,
        discussionSummary: document.getElementById('discussionSummary').value,
        decisions,
        actions,
        reportSummary: document.getElementById('reportSummary').value,
        keyOutcomes: document.getElementById('keyOutcomes').value,
        challenges: document.getElementById('challenges').value,
        recommendations: document.getElementById('recommendations').value,
        attachedFiles: document.getElementById('attachedFiles').value,
        preparedBy: document.getElementById('preparedBy').value,
        reviewedBy: document.getElementById('reviewedBy').value,
        approvedBy: document.getElementById('approvedBy').value,
        approvalDate: document.getElementById('approvalDate').value,
        nextMeetingDate: document.getElementById('nextMeetingDate').value,
        followUpNotes: document.getElementById('followUpNotes').value,
        minutesStatus: document.getElementById('minutesStatus').value,
        archiveRef: document.getElementById('archiveRef').value,
        createdAt: new Date().toISOString()
    };

    const records = JSON.parse(localStorage.getItem('intekoRecords')) || [];
    records.push(record);
    localStorage.setItem('intekoRecords', JSON.stringify(records));

    e.target.reset();
    loadIntekoRecords();
    alert('Inteko minutes saved successfully!');
}

function loadIntekoRecords() {
    const records = JSON.parse(localStorage.getItem('intekoRecords')) || [];
    const container = document.getElementById('intekoRecords');
    
    container.innerHTML = records.map(record => `
        <div class="inteko-record-card" style="background: white; padding: 1.5rem; margin-bottom: 1rem; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h4>${record.meetingTitle}</h4>
            <p><strong>Type:</strong> ${record.meetingType}</p>
            <p><strong>Date:</strong> ${formatDate(record.meetingDate)}</p>
            <p><strong>Chairperson:</strong> ${record.chairperson}</p>
            <p><strong>Status:</strong> ${record.minutesStatus}</p>
            <button class="btn btn-secondary" onclick="viewIntekoDetails(${record.id})">View Details</button>
        </div>
    `).join('');
}

// Register New People
function handleRegisterSubmit(e) {
    e.preventDefault();
    
    const record = {
        id: Date.now(),
        name: document.getElementById('regName').value,
        sex: document.getElementById('regSex').value,
        telephone: document.getElementById('regTelephone').value,
        idNumber: document.getElementById('regID').value,
        sector: document.getElementById('regSector').value,
        cell: document.getElementById('regCell').value,
        village: document.getElementById('regVillage').value,
        arrivalTime: document.getElementById('regArrivalTime').value,
        returnTime: document.getElementById('regReturnTime').value,
        status: document.getElementById('regStatus').value,
        date: new Date().toISOString()
    };

    const records = JSON.parse(localStorage.getItem('registerRecords')) || [];
    records.push(record);
    localStorage.setItem('registerRecords', JSON.stringify(records));

    e.target.reset();
    loadRegisterTable();
    alert('Person registered successfully!');
}

function loadRegisterTable() {
    const records = JSON.parse(localStorage.getItem('registerRecords')) || [];
    const tbody = document.getElementById('registerTableBody');
    
    tbody.innerHTML = records.map(record => `
        <tr>
            <td>${record.name}</td>
            <td>${record.sex}</td>
            <td>${record.telephone}</td>
            <td>${record.idNumber}</td>
            <td>${record.sector}</td>
            <td>${record.cell}</td>
            <td>${record.village}</td>
            <td>${record.status}</td>
        </tr>
    `).join('');
}

// Insurance Payment
function handleInsuranceSubmit(e) {
    e.preventDefault();
    
    const record = {
        id: Date.now(),
        name: document.getElementById('insuranceName').value,
        telephone: document.getElementById('insuranceTelephone').value,
        sector: document.getElementById('insuranceSector').value,
        cell: document.getElementById('insuranceCell').value,
        village: document.getElementById('insuranceVillage').value,
        status: document.getElementById('insuranceStatus').value,
        date: new Date().toISOString()
    };

    const records = JSON.parse(localStorage.getItem('insuranceRecords')) || [];
    records.push(record);
    localStorage.setItem('insuranceRecords', JSON.stringify(records));

    e.target.reset();
    loadInsuranceTable();
    alert('Insurance payment status recorded!');
}

function loadInsuranceTable() {
    const records = JSON.parse(localStorage.getItem('insuranceRecords')) || [];
    const tbody = document.getElementById('insuranceTableBody');
    
    tbody.innerHTML = records.map(record => `
        <tr>
            <td>${record.name}</td>
            <td>${record.telephone || 'N/A'}</td>
            <td>${record.sector}</td>
            <td>${record.cell}</td>
            <td>${record.village}</td>
            <td><span class="status-badge ${record.status === 'Paid' ? 'status-completed' : 'status-pending'}">${record.status}</span></td>
            <td>${formatDate(record.date)}</td>
        </tr>
    `).join('');
}

// Report Drugs
function handleDrugsSubmit(e) {
    e.preventDefault();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const record = {
        id: Date.now(),
        name: document.getElementById('drugsName').value,
        sector: document.getElementById('drugsSector').value,
        cell: document.getElementById('drugsCell').value,
        village: document.getElementById('drugsVillage').value,
        description: (document.getElementById('drugsDescription') && document.getElementById('drugsDescription').value) ? document.getElementById('drugsDescription').value.trim() : '',
        reportedBy: (currentUser && currentUser.name) ? currentUser.name : 'Village Leader',
        reportedByEmail: (currentUser && currentUser.email) ? currentUser.email : '',
        reportedByPhone: (currentUser && currentUser.phone) ? currentUser.phone : '',
        date: new Date().toISOString()
    };

    const records = JSON.parse(localStorage.getItem('drugsRecords')) || [];
    records.push(record);
    localStorage.setItem('drugsRecords', JSON.stringify(records));

    e.target.reset();
    loadDrugsTable();
    alert('Drug report sent successfully! Visible on village, cell and sector pages.');
}

function truncateDesc(text, len) {
    if (!text) return '—';
    return text.length <= len ? escapeHtml(text) : escapeHtml(text.slice(0, len)) + '…';
}

function loadDrugsTable() {
    const records = JSON.parse(localStorage.getItem('drugsRecords')) || [];
    const tbody = document.getElementById('drugsTableBody');
    const reportedByLabel = (r) => r.reportedBy || '—';
    tbody.innerHTML = records.map(record => `
        <tr>
            <td>${escapeHtml(record.name)}</td>
            <td>${escapeHtml(record.sector || '—')}</td>
            <td>${escapeHtml(record.cell || '—')}</td>
            <td>${escapeHtml(record.village || '—')}</td>
            <td>${truncateDesc(record.description, 40)}</td>
            <td>${escapeHtml(reportedByLabel(record))}</td>
            <td>${formatDate(record.date)}</td>
            <td><button class="btn btn-secondary" onclick="viewDrugsDetails(${record.id})">View details</button></td>
        </tr>
    `).join('');
}

// Report Sexual Violence
function handleViolenceSubmit(e) {
    e.preventDefault();
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const record = {
        id: Date.now(),
        victimName: document.getElementById('violenceVictimName').value,
        telephone: document.getElementById('violenceTelephone').value,
        sector: document.getElementById('violenceSector').value,
        cell: document.getElementById('violenceCell').value,
        village: document.getElementById('violenceVillage').value,
        description: document.getElementById('violenceDescription').value,
        reportedBy: (currentUser && currentUser.name) ? currentUser.name : 'Village Leader',
        reportedByEmail: (currentUser && currentUser.email) ? currentUser.email : '',
        reportedByPhone: (currentUser && currentUser.phone) ? currentUser.phone : '',
        date: new Date().toISOString()
    };

    const records = JSON.parse(localStorage.getItem('violenceRecords')) || [];
    records.push(record);
    localStorage.setItem('violenceRecords', JSON.stringify(records));

    e.target.reset();
    loadViolenceTable();
    alert('Sexual violence report sent successfully! Visible on village, cell and sector pages.');
}

function loadViolenceTable() {
    const records = JSON.parse(localStorage.getItem('violenceRecords')) || [];
    const tbody = document.getElementById('violenceTableBody');
    const reportedByLabel = (r) => r.reportedBy || '—';
    tbody.innerHTML = records.map(record => `
        <tr>
            <td>${escapeHtml(record.victimName)}</td>
            <td>${escapeHtml(record.telephone || '—')}</td>
            <td>${escapeHtml(record.sector || '—')}</td>
            <td>${escapeHtml(record.cell || '—')}</td>
            <td>${escapeHtml(record.village || '—')}</td>
            <td>${truncateDesc(record.description, 40)}</td>
            <td>${escapeHtml(reportedByLabel(record))}</td>
            <td>${formatDate(record.date)}</td>
            <td><button class="btn btn-secondary" onclick="viewViolenceDetails(${record.id})">View details</button></td>
        </tr>
    `).join('');
}

// Shift Automate Case
function handleCaseSubmit(e) {
    e.preventDefault();
    
    const resolutionDays = parseInt(document.getElementById('caseResolutionDays').value);
    const caseDate = new Date(document.getElementById('caseDate').value);
    const resolutionDate = new Date(caseDate);
    resolutionDate.setDate(resolutionDate.getDate() + resolutionDays);
    
    const record = {
        id: Date.now(),
        leaderName: document.getElementById('caseLeaderName').value,
        leaderTelephone: document.getElementById('caseLeaderTelephone').value,
        sector: document.getElementById('caseSector').value,
        cell: document.getElementById('caseCell').value,
        village: document.getElementById('caseVillage').value,
        plaintiff: document.getElementById('casePlaintiff').value,
        defendant: document.getElementById('caseDefendant').value,
        description: document.getElementById('caseDescription').value,
        caseDate: caseDate.toISOString(),
        resolutionDays,
        expectedResolutionDate: resolutionDate.toISOString(),
        status: 'Pending',
        level: 'Village',
        date: new Date().toISOString()
    };

    const records = JSON.parse(localStorage.getItem('caseRecords')) || [];
    records.push(record);
    localStorage.setItem('caseRecords', JSON.stringify(records));

    e.target.reset();
    loadCaseTable();
    alert('Case recorded successfully! The countdown timer has started.');
}

function loadCaseTable() {
    const records = JSON.parse(localStorage.getItem('caseRecords')) || [];
    const tbody = document.getElementById('caseTableBody');
    
    tbody.innerHTML = records.map(record => {
        const statusClass = record.status === 'Solved' ? 'status-solved' : 
                           record.status === 'Escalated' ? 'status-escalated' : 'status-pending';
        
        // Calculate countdown
        const countdown = calculateCountdown(record);
        
        return `
            <tr>
                <td>#${record.id}</td>
                <td>${record.plaintiff}</td>
                <td>${record.defendant}</td>
                <td>${record.sector}</td>
                <td>${record.cell}</td>
                <td>${record.village}</td>
                <td><span class="status-badge ${statusClass}">${record.status}</span></td>
                <td>${formatDate(record.caseDate)}</td>
                <td>
                    <div class="countdown-timer" data-case-id="${record.id}" data-resolution-date="${record.expectedResolutionDate}">
                        ${countdown}
                    </div>
                </td>
                <td>
                    ${record.status === 'Pending' ? 
                        `<button class="btn btn-primary" onclick="markCaseSolved(${record.id})">Mark Solved</button>` : 
                        ''}
                </td>
            </tr>
        `;
    }).join('');
    
    // Start countdown updates
    startCountdownUpdates();
}

// Calculate countdown timer
function calculateCountdown(record) {
    if (record.status === 'Solved' || record.status === 'Escalated') {
        return '<span class="countdown-expired">N/A</span>';
    }
    
    if (!record.expectedResolutionDate) {
        return '<span class="countdown-error">No date set</span>';
    }
    
    const now = new Date();
    const resolutionDate = new Date(record.expectedResolutionDate);
    const diff = resolutionDate - now;
    
    if (diff <= 0) {
        return '<span class="countdown-expired">Time Expired</span>';
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    let countdownHtml = '';
    if (days > 0) {
        countdownHtml = `<span class="countdown-days">${days}d</span> `;
    }
    if (hours > 0 || days > 0) {
        countdownHtml += `<span class="countdown-hours">${hours}h</span> `;
    }
    if (minutes > 0 || hours > 0 || days > 0) {
        countdownHtml += `<span class="countdown-minutes">${minutes}m</span> `;
    }
    countdownHtml += `<span class="countdown-seconds">${seconds}s</span>`;
    
    // Add warning class if less than 24 hours remaining
    const warningClass = diff < (24 * 60 * 60 * 1000) ? 'countdown-warning' : '';
    
    return `<div class="countdown-display ${warningClass}">${countdownHtml}</div>`;
}

// Start countdown updates
let countdownInterval = null;
function startCountdownUpdates() {
    // Clear existing interval
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    // Update countdown every second
    countdownInterval = setInterval(() => {
        const timers = document.querySelectorAll('.countdown-timer');
        timers.forEach(timer => {
            const caseId = parseInt(timer.dataset.caseId);
            const resolutionDate = timer.dataset.resolutionDate;
            
            // Get record to check status
            const records = JSON.parse(localStorage.getItem('caseRecords')) || [];
            const record = records.find(r => r.id === caseId);
            
            if (record && (record.status === 'Pending')) {
                const now = new Date();
                const resolutionDateObj = new Date(resolutionDate);
                const diff = resolutionDateObj - now;
                
                if (diff <= 0) {
                    timer.innerHTML = '<span class="countdown-expired">Time Expired</span>';
                } else {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                    
                    let countdownHtml = '';
                    if (days > 0) {
                        countdownHtml = `<span class="countdown-days">${days}d</span> `;
                    }
                    if (hours > 0 || days > 0) {
                        countdownHtml += `<span class="countdown-hours">${hours}h</span> `;
                    }
                    if (minutes > 0 || hours > 0 || days > 0) {
                        countdownHtml += `<span class="countdown-minutes">${minutes}m</span> `;
                    }
                    countdownHtml += `<span class="countdown-seconds">${seconds}s</span>`;
                    
                    const warningClass = diff < (24 * 60 * 60 * 1000) ? 'countdown-warning' : '';
                    timer.innerHTML = `<div class="countdown-display ${warningClass}">${countdownHtml}</div>`;
                }
            } else {
                timer.innerHTML = '<span class="countdown-expired">N/A</span>';
            }
        });
    }, 1000); // Update every second
}

// Mark case as solved
window.markCaseSolved = function(caseId) {
    const records = JSON.parse(localStorage.getItem('caseRecords')) || [];
    const record = records.find(r => r.id === caseId);
    
    if (record) {
        record.status = 'Solved';
        record.solvedDate = new Date().toISOString();
        localStorage.setItem('caseRecords', JSON.stringify(records));
        loadCaseTable();
        alert('Case marked as solved! Countdown stopped.');
    }
};

// Case auto-escalation
function setupCaseAutoEscalation() {
    setInterval(() => {
        const records = JSON.parse(localStorage.getItem('caseRecords')) || [];
        const now = new Date();
        let updated = false;
        
        records.forEach(record => {
            if (record.status === 'Pending' && record.level === 'Village') {
                const expectedDate = new Date(record.expectedResolutionDate);
                if (now > expectedDate) {
                    // Auto-escalate from Village to Cell
                    record.status = 'Escalated';
                    record.escalatedDate = now.toISOString();
                    record.level = 'Cell';
                    // Set new resolution date for cell (default 7 days)
                    const cellResolutionDate = new Date(now);
                    cellResolutionDate.setDate(cellResolutionDate.getDate() + 7);
                    record.cellResolutionDate = cellResolutionDate.toISOString();
                    updated = true;
                    console.log(`Case #${record.id} has been automatically escalated to Cell level!`);
                }
            }
        });
        
        if (updated) {
            localStorage.setItem('caseRecords', JSON.stringify(records));
            loadCaseTable(); // Reload table to update countdown
        }
    }, 60000); // Check every minute
}

// Load notifications
function loadNotifications() {
    // Inteko notifications - people who should attend but didn't
    const intekoRecords = JSON.parse(localStorage.getItem('intekoRecords')) || [];
    const registerRecords = JSON.parse(localStorage.getItem('registerRecords')) || [];
    
    // Simple logic: show registered people who haven't attended recent inteko
    const recentInteko = intekoRecords.slice(-5);
    const intekoAttendees = new Set();
    recentInteko.forEach(record => {
        record.attendees.forEach(att => intekoAttendees.add(att.name));
    });
    
    const missingInteko = registerRecords.filter(reg => 
        reg.status === 'New Member' && !intekoAttendees.has(reg.name)
    );
    
    const intekoNotifications = document.getElementById('intekoNotifications');
    if (intekoNotifications) {
        intekoNotifications.innerHTML = missingInteko.length > 0 ?
            missingInteko.map(person => `
                <div class="notification-item">
                    <strong>${person.name}</strong> - ${person.village}, ${person.cell}
                </div>
            `).join('') : '<p>All members have attended Inteko meetings.</p>';
    }
    
    // Umuganda notifications
    const umugandaRecords = JSON.parse(localStorage.getItem('umugandaRecords')) || [];
    const umugandaAttendees = new Set(umugandaRecords.map(r => r.name));
    
    const missingUmuganda = registerRecords.filter(reg => 
        reg.status === 'New Member' && !umugandaAttendees.has(reg.name)
    );
    
    const umugandaNotifications = document.getElementById('umugandaNotifications');
    if (umugandaNotifications) {
        umugandaNotifications.innerHTML = missingUmuganda.length > 0 ?
            missingUmuganda.map(person => `
                <div class="notification-item">
                    <strong>${person.name}</strong> - ${person.village}, ${person.cell}
                </div>
            `).join('') : '<p>All members have attended Umuganda.</p>';
    }
}

// Load all tables
function loadAllTables() {
    loadUmugandaTable();
    loadIntekoRecords();
    loadRegisterTable();
    loadInsuranceTable();
    loadDrugsTable();
    loadViolenceTable();
    loadCaseTable();
}

// Format date helper
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// View details functions
window.viewIntekoDetails = function(id) {
    const records = JSON.parse(localStorage.getItem('intekoRecords')) || [];
    const record = records.find(r => r.id === id);
    
    if (record) {
        const details = `
Meeting Title: ${record.meetingTitle}
Type: ${record.meetingType}
Date: ${formatDate(record.meetingDate)}
Chairperson: ${record.chairperson}
Attendees: ${record.attendees.length}
Decisions: ${record.decisions.length}
Status: ${record.minutesStatus}
        `;
        alert(details);
    }
};

window.viewDrugsDetails = function(id) {
    const records = JSON.parse(localStorage.getItem('drugsRecords')) || [];
    const record = records.find(r => r.id === id);
    if (record) {
        const details = `Name(s): ${record.name}\nLocation: ${record.village}, ${record.cell}, ${record.sector}\nReported by: ${record.reportedBy || '—'}\nDescription: ${record.description || '—'}\nDate: ${formatDate(record.date)}`;
        alert(details);
    }
};

window.viewViolenceDetails = function(id) {
    const records = JSON.parse(localStorage.getItem('violenceRecords')) || [];
    const record = records.find(r => r.id === id);
    
    if (record) {
        const details = `
Victim: ${record.victimName}
Telephone: ${record.telephone}
Location: ${record.village}, ${record.cell}, ${record.sector}
Reported by: ${record.reportedBy || '—'}
Description: ${record.description || '—'}
Date Reported: ${formatDate(record.date)}
        `;
        alert(details);
    }
};

// ===== Chat Logic for Leader Dashboard =====

let leaderReplyTarget = null;

// Handle sending chat message from village leader
function handleLeaderChatSubmit(e) {
    e.preventDefault();
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const toRole = document.getElementById('leaderChatRecipientRole').value;
    const messageText = document.getElementById('leaderChatMessage').value.trim();
    
    if (toRole === 'citizen' && !leaderReplyTarget) {
        alert('Select a citizen to reply to from the list below.');
        return;
    }

    if (!messageText) {
        alert('Please enter a message.');
        return;
    }
    
    const message = {
        id: Date.now(),
        fromName: currentUser.name,
        fromEmail: currentUser.email,
        fromRole: 'leader',  // village leader
        toRole: toRole,      // 'citizen', 'cell', 'sector'
        toEmail: leaderReplyTarget ? leaderReplyTarget.email : null,
        toName: leaderReplyTarget ? leaderReplyTarget.name : null,
        text: messageText,
        timestamp: new Date().toISOString()
    };
    
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    messages.push(message);
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    
    e.target.reset();
    loadLeaderChatMessages();
}

// Load chat messages relevant for this leader
function loadLeaderChatMessages() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    
    // Show messages where this leader is sender or receiver
    const relevant = messages.filter(m =>
        m.fromEmail === currentUser.email || m.toEmail === currentUser.email
    );
    
    const container = document.getElementById('leaderChatMessages');
    if (!container) return;
    
    if (relevant.length === 0) {
        container.innerHTML = '<p>No messages yet.</p>';
        return;
    }
    
    container.innerHTML = relevant
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .map(m => {
            const isMe = m.fromEmail === currentUser.email;
            const otherName = isMe ? (m.toName || roleLabel(m.toRole)) : (m.fromName || roleLabel(m.fromRole));
            const direction = isMe ? 'You → ' + otherName : otherName + ' → You';
            return `
                <div class="chat-message ${isMe ? 'chat-message-me' : 'chat-message-other'}">
                    <div class="chat-meta">
                        <span class="chat-direction">${direction}</span>
                        <span class="chat-time">${formatDateTime(m.timestamp)}</span>
                    </div>
                    <div class="chat-text">${escapeHtml(m.text)}</div>
                </div>
            `;
        }).join('');
}

// Build inbox of citizens who have sent messages to this leader
function loadLeaderInbox() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const messages = JSON.parse(localStorage.getItem('chatMessages')) || [];
    const users = JSON.parse(localStorage.getItem('users')) || [];

    // Only citizen → this leader
    const incoming = messages.filter(m =>
        m.toEmail === currentUser.email && m.fromRole === 'citizen'
    );

    const byCitizen = {};
    incoming.forEach(m => {
        if (!byCitizen[m.fromEmail] || new Date(m.timestamp) > new Date(byCitizen[m.fromEmail].timestamp)) {
            byCitizen[m.fromEmail] = m;
        }
    });

    const tbody = document.getElementById('leaderInboxBody');
    if (!tbody) return;

    const entries = Object.values(byCitizen);
    if (entries.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4">No messages from citizens yet.</td></tr>';
        return;
    }

    tbody.innerHTML = entries
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .map(m => {
            const user = users.find(u => u.email === m.fromEmail);
            const phone = m.fromPhone || (user ? (user.phone || '') : '');
            const name = m.fromName || (user ? user.name : m.fromEmail);
            const when = formatDateTime(m.timestamp);
            return `
                <tr>
                    <td>${escapeHtml(name)}</td>
                    <td>${escapeHtml(phone || 'N/A')}</td>
                    <td>${escapeHtml(when)}</td>
                    <td><button class="btn btn-secondary" onclick="replyToCitizenFromLeader('${m.fromEmail.replace(/'/g, "\\'")}', '${escapeHtml(name)}')">Reply</button></td>
                </tr>
            `;
        }).join('');
}

// Set reply target for leader
window.replyToCitizenFromLeader = function(email, name) {
    leaderReplyTarget = { email, name };
    const msgInput = document.getElementById('leaderChatMessage');
    const roleSelect = document.getElementById('leaderChatRecipientRole');
    if (roleSelect) {
        roleSelect.value = 'citizen';
    }
    if (msgInput) {
        msgInput.focus();
    }
};

// Shared helpers (if not already defined)
function formatDateTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function roleLabel(role) {
    switch (role) {
        case 'leader': return 'Village Leader';
        case 'cell': return 'Cell Leader';
        case 'sector': return 'Sector Leader';
        case 'citizen': return 'Citizen';
        default: return role;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// --- Home updates (Recent Activity, Upcoming Session, Trending) ---
const HOME_LEVEL = 'village';

function setupHomeUpdatesTabs() {
    const section = document.getElementById('homeupdates');
    if (!section) return;
    const tabBtns = section.querySelectorAll('.tab-btn');
    const forms = section.querySelectorAll('.home-update-form');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            forms.forEach(f => {
                f.classList.remove('active');
                if (f.id === 'tab-' + tab) f.classList.add('active');
            });
        });
    });
}

function setupHomeUpdateForms() {
    // Default date to today for new posts
    const today = new Date().toISOString().slice(0, 10);
    ['leaderActivityDate', 'leaderUpcomingDate', 'leaderTrendingDate'].forEach(id => {
        const el = document.getElementById(id);
        if (el && !el.value) el.value = today;
    });
}

function getCurrentLeaderName() {
    const u = JSON.parse(sessionStorage.getItem('currentUser'));
    return (u && (u.name || u.email)) ? (u.name || u.email) : 'Village Leader';
}

function readImageAsDataUrl(file) {
    return new Promise((resolve, reject) => {
        if (!file || !file.type.startsWith('image/')) {
            resolve(null);
            return;
        }
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            compressImageDataUrl(dataUrl, 800, 0.8).then(resolve).catch(() => resolve(dataUrl));
        };
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

function compressImageDataUrl(dataUrl, maxWidth, quality) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
            let w = img.width, h = img.height;
            if (w > maxWidth) {
                h = (h * maxWidth) / w;
                w = maxWidth;
            }
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            try {
                resolve(canvas.toDataURL('image/jpeg', quality));
            } catch (e) {
                resolve(dataUrl);
            }
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
    });
}

async function handleLeaderActivitySubmit(e) {
    e.preventDefault();
    const description = document.getElementById('leaderActivityDesc').value.trim();
    const place = document.getElementById('leaderActivityPlace').value.trim();
    const date = document.getElementById('leaderActivityDate').value;
    const fileInput = document.getElementById('leaderActivityImage');
    const file = fileInput && fileInput.files && fileInput.files[0];
    let imageData = 'https://via.placeholder.com/400x200?text=Activity';
    if (file) {
        try {
            const dataUrl = await readImageAsDataUrl(file);
            if (dataUrl) imageData = dataUrl;
        } catch (err) {
            console.warn('Image read failed', err);
        }
    }
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    const item = {
        id: Date.now(),
        description,
        place,
        date,
        image: imageData,
        level: HOME_LEVEL,
        uploadedBy: getCurrentLeaderName()
    };
    activities.push(item);
    localStorage.setItem('activities', JSON.stringify(activities));
    e.target.reset();
    document.getElementById('leaderActivityDate').value = new Date().toISOString().slice(0, 10);
    loadLeaderHomeUpdatesList();
    alert('Recent activity posted! It will appear on the home page.');
}

function handleLeaderUpcomingSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('leaderUpcomingTitle').value.trim();
    const description = document.getElementById('leaderUpcomingDesc').value.trim();
    const place = document.getElementById('leaderUpcomingPlace').value.trim();
    const date = document.getElementById('leaderUpcomingDate').value;
    const news = JSON.parse(localStorage.getItem('news')) || [];
    const item = {
        id: Date.now(),
        title,
        description,
        place,
        date,
        level: HOME_LEVEL,
        uploadedBy: getCurrentLeaderName()
    };
    news.push(item);
    localStorage.setItem('news', JSON.stringify(news));
    e.target.reset();
    document.getElementById('leaderUpcomingDate').value = new Date().toISOString().slice(0, 10);
    loadLeaderHomeUpdatesList();
    alert('Upcoming session posted! It will appear on the home page.');
}

function handleLeaderTrendingSubmit(e) {
    e.preventDefault();
    const description = document.getElementById('leaderTrendingDesc').value.trim();
    const place = document.getElementById('leaderTrendingPlace').value.trim();
    const date = document.getElementById('leaderTrendingDate').value;
    const trending = JSON.parse(localStorage.getItem('trending')) || [];
    const item = {
        id: Date.now(),
        description,
        place,
        date,
        level: HOME_LEVEL,
        uploadedBy: getCurrentLeaderName()
    };
    trending.push(item);
    localStorage.setItem('trending', JSON.stringify(trending));
    e.target.reset();
    document.getElementById('leaderTrendingDate').value = new Date().toISOString().slice(0, 10);
    loadLeaderHomeUpdatesList();
    alert('Trending topic posted! It will appear on the home page.');
}

function loadLeaderHomeUpdatesList() {
    const listEl = document.getElementById('leaderHomeUpdatesList');
    if (!listEl) return;
    const activities = JSON.parse(localStorage.getItem('activities')) || [];
    const news = JSON.parse(localStorage.getItem('news')) || [];
    const trending = JSON.parse(localStorage.getItem('trending')) || [];
    const myName = getCurrentLeaderName();
    const myActivities = activities.filter(a => a.level === HOME_LEVEL && a.uploadedBy === myName);
    const myNews = news.filter(n => n.level === HOME_LEVEL && n.uploadedBy === myName);
    const myTrending = trending.filter(t => t.level === HOME_LEVEL && t.uploadedBy === myName);
    const all = [
        ...myActivities.map(a => ({ type: 'Activity', date: a.date, text: a.description })),
        ...myNews.map(n => ({ type: 'Upcoming', date: n.date, text: n.title })),
        ...myTrending.map(t => ({ type: 'Trending', date: t.date, text: t.description }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 15);
    if (all.length === 0) {
        listEl.innerHTML = '<p>No posts yet. Use the forms above to post.</p>';
        return;
    }
    listEl.innerHTML = '<ul class="simple-list">' + all.map(item =>
        `<li><strong>${item.type}</strong> — ${formatDate(item.date)}: ${escapeHtml(item.text.slice(0, 60))}${item.text.length > 60 ? '…' : ''}</li>`
    ).join('') + '</ul>';
}

