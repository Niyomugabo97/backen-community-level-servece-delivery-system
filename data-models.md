# Data Models and Database Structure

This document outlines all data models used in the Community-Level Services Delivery and Reporting System.

## Database Storage System

The system uses **localStorage** as the database, storing data as JSON strings. Each data type has a specific localStorage key.

---

## 1. Member Registration Data

### localStorage Key: `registerRecords`

### Data Model
```javascript
{
    id: string,                    // Unique identifier (UUID or timestamp)
    name: string,                  // Full name of member
    age: number,                   // Age in years
    sex: string,                    // Gender: "Male" or "Female"
    telephone: string,               // Phone number (unique identifier)
    sector: string,                  // Sector name
    cell: string,                    // Cell name  
    village: string,                  // Village name
    nin: string,                     // National ID number
    insuranceNumber: string,          // Insurance policy number
    insuranceStatus: string,          // "Active" or "Inactive"
    insuranceExpiryDate: string,      // YYYY-MM-DD format
    role: string,                    // "member" or "leader"
    createdAt: string,               // ISO timestamp
    updatedAt: string                 // ISO timestamp
}
```

### Example
```javascript
{
    id: "2024-03-23_001",
    name: "John Mugisha",
    age: 35,
    sex: "Male",
    telephone: "250788123456",
    sector: "Ruhuha",
    cell: "Cell A",
    village: "Village X",
    nin: "1199080012345678",
    insuranceNumber: "INS-2024-001",
    insuranceStatus: "Active",
    insuranceExpiryDate: "2024-12-31",
    role: "member",
    createdAt: "2024-03-23T10:30:00.000Z",
    updatedAt: "2024-03-23T10:30:00.000Z"
}
```

---

## 2. Attendance Data

### localStorage Key: 
- `umugandaData` (manual attendance)

### Data Model
```javascript
{
    name: string,                   // Member name
    age: number,                    // Age from member record
    sex: string,                    // Gender from member record
    sector: string,                 // Sector from member record
    cell: string,                   // Cell from member record
    village: string,                 // Village from member record
    date: string,                   // ISO datetime string
    checkInMethod: string,           // "manual"
    citizenId: string,               // Member telephone number
    status: string,                 // "present" or "absent"
    attendanceDate: string           // YYYY-MM-DD for easy filtering
}
```

### Example
```javascript
{
    name: "John Mugisha",
    age: 35,
    sex: "Male",
    sector: "Ruhuha",
    cell: "Cell A", 
    village: "Village X",
    date: "2024-03-23T10:00:00.000Z",
    checkInMethod: "manual",
    citizenId: "250788123456",
    status: "present",
    attendanceDate: "2024-03-23"
}
```

---

## 3. Attendance Tracking

### localStorage Key: `attendanceTracking`

### Data Model
```javascript
{
    [memberTelephone]: {
        memberName: string,
        totalSessions: number,
        attendedSessions: number,
        lastAttendanceDate: string,
        monthlyAttendance: {
            [year-month]: {
                attended: number,
                total: number,
                percentage: number
            }
        }
    }
}
```

### Example
```javascript
{
    "250788123456": {
        memberName: "John Mugisha",
        totalSessions: 12,
        attendedSessions: 10,
        lastAttendanceDate: "2024-03-23",
        monthlyAttendance: {
            "2024-03": {
                attended: 4,
                total: 4,
                percentage: 100
            },
            "2024-02": {
                attended: 3,
                total: 4,
                percentage: 75
            }
        }
    }
}
```

---

## 4. Inteko Meeting Records

### localStorage Key: `intekoRecords`

### Data Model
```javascript
{
    id: string,                    // Unique identifier
    meetingTitle: string,            // Meeting title
    meetingType: string,            // "Inteko rusange", "Committee", "Special Meeting", "Other"
    meetingDate: string,            // YYYY-MM-DD format
    startTime: string,               // HH:MM format
    endTime: string,                 // HH:MM format
    location: string,                // Meeting location
    attendees: string,               // Number of attendees
    agenda: string,                  // Meeting agenda
    decisions: string,               // Key decisions made
    actionItems: string,             // Action items
    reportSummary: string,           // Meeting summary
    keyOutcomes: string,            // Key outcomes
    challenges: string,             // Challenges identified
    recommendations: string,          // Recommendations
    attachedFiles: string,           // Comma-separated file names
    leaderName: string,              // Meeting leader
    createdAt: string               // ISO timestamp
}
```

### Example
```javascript
{
    id: "inteko_2024_03_001",
    meetingTitle: "Monthly Community Development Meeting",
    meetingType: "Inteko rusange",
    meetingDate: "2024-03-23",
    startTime: "14:00",
    endTime: "16:30",
    location: "Village Community Center",
    attendees: "45",
    agenda: "Discuss water project progress",
    decisions: "Approved phase 2 implementation",
    actionItems: "Form water committee",
    reportSummary: "Successful meeting with good participation",
    keyOutcomes: "Water project approved",
    challenges: "Limited budget resources",
    recommendations: "Seek additional funding",
    attachedFiles: "minutes.pdf, photos.jpg",
    leaderName: "Community Leader",
    createdAt: "2024-03-23T16:30:00.000Z"
}
```

---

## 5. System Locations

### localStorage Key: `systemLocations`

### Data Model
```javascript
{
    sectors: string[],               // Array of sector names
    cells: string[],                 // Array of cell names
    villages: string[]               // Array of village names
}
```

### Example
```javascript
{
    sectors: ["Ruhuha", "Nyarugenge", "Mayange"],
    cells: ["Cell A", "Cell B", "Cell C", "Cell D"],
    villages: ["Village X", "Village Y", "Village Z", "Village W"]
}
```

---

## 6. Home Updates

### localStorage Key: `homeUpdates`

### Data Model
```javascript
{
    id: string,                    // Unique identifier
    type: string,                   // "activity", "upcoming", or "trending"
    title: string,                  // Update title
    description: string,             // Update description
    place: string,                  // Location/venue
    date: string,                   // YYYY-MM-DD format
    time: string,                   // HH:MM format (for upcoming sessions)
    postedBy: string,               // Leader name
    createdAt: string               // ISO timestamp
}
```

### Examples

#### Recent Activity
```javascript
{
    id: "activity_2024_03_001",
    type: "activity",
    title: "Community Cleanup Day",
    description: "Successful community cleanup with 50 participants",
    place: "Village Square",
    date: "2024-03-23",
    postedBy: "Community Leader",
    createdAt: "2024-03-23T10:00:00.000Z"
}
```

#### Upcoming Session
```javascript
{
    id: "upcoming_2024_03_001",
    type: "upcoming",
    title: "Water Project Meeting",
    description: "Discuss phase 2 implementation of water project",
    place: "Community Center",
    date: "2024-03-30",
    time: "14:00",
    postedBy: "Community Leader",
    createdAt: "2024-03-23T10:00:00.000Z"
}
```

#### Trending Topic
```javascript
{
    id: "trending_2024_03_001",
    type: "trending",
    title: "Water Project Discussion",
    description: "Community discussing water project implementation timeline",
    place: "Village X",
    date: "2024-03-23",
    postedBy: "Community Leader",
    createdAt: "2024-03-23T10:00:00.000Z"
}
```

---

## 7. Member Performance

### localStorage Key: `memberPerformanceByYear`

### Data Model
```javascript
{
    [year]: {
        [memberTelephone]: {
            name: string,
            totalSessions: number,
            attendedSessions: number,
            averageAttendance: number,
            bestMonth: string,
            worstMonth: string
        }
    }
}
```

### Example
```javascript
{
    "2024": {
        "250788123456": {
            name: "John Mugisha",
            totalSessions: 12,
            attendedSessions: 10,
            averageAttendance: 83.3,
            bestMonth: "March",
            worstMonth: "January"
        }
    }
}
```

---

## 8. Leader Location Memory

### localStorage Key: `leaderLastLocation`

### Data Model
```javascript
{
    sector: string,                 // Current sector
    cell: string,                   // Current cell
    village: string                  // Current village
}
```

### Example
```javascript
{
    sector: "Ruhuha",
    cell: "Cell A",
    village: "Village X"
}
