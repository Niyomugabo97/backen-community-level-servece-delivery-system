const mongoose = require("mongoose");

/////////////////////////////
// 1. MEMBER MODEL
/////////////////////////////
const memberSchema = new mongoose.Schema({
  name: String,
  age: Number,
  sex: { type: String, enum: ["Male", "Female"] },
  telephone: { type: String, unique: true },
  sector: String,
  cell: String,
  village: String,
  nin: String,
  insuranceNumber: String,
  insuranceStatus: { type: String, enum: ["Active", "Inactive"] },
  insuranceExpiryDate: Date,
  role: { type: String, enum: ["member", "leader"], default: "member" }
}, { timestamps: true });

const Member = mongoose.model("Member", memberSchema);


/////////////////////////////
// 2. ATTENDANCE MODEL
/////////////////////////////
const attendanceSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
  name: String,
  age: Number,
  sex: String,
  sector: String,
  cell: String,
  village: String,
  date: Date,
  checkInMethod: { type: String, default: "manual" },
  citizenId: String,
  status: { type: String, enum: ["present", "absent"] },
  attendanceDate: String
});

const Attendance = mongoose.model("Attendance", attendanceSchema);


/////////////////////////////
// 3. ATTENDANCE TRACKING
/////////////////////////////
const trackingSchema = new mongoose.Schema({
  memberTelephone: String,
  memberName: String,
  totalSessions: Number,
  attendedSessions: Number,
  lastAttendanceDate: String,
  monthlyAttendance: {
    type: Map,
    of: {
      attended: Number,
      total: Number,
      percentage: Number
    }
  }
});

const AttendanceTracking = mongoose.model("AttendanceTracking", trackingSchema);


/////////////////////////////
// 4. INTEKO MEETINGS
/////////////////////////////
const intekoSchema = new mongoose.Schema({
  meetingTitle: String,
  meetingType: String,
  meetingDate: String,
  startTime: String,
  endTime: String,
  location: String,
  attendees: Number,
  agenda: String,
  decisions: String,
  actionItems: String,
  reportSummary: String,
  keyOutcomes: String,
  challenges: String,
  recommendations: String,
  attachedFiles: [String],
  leaderName: String
}, { timestamps: true });

const Inteko = mongoose.model("Inteko", intekoSchema);


/////////////////////////////
// 5. SYSTEM LOCATIONS
/////////////////////////////
const locationSchema = new mongoose.Schema({
  sectors: [String],
  cells: [String],
  villages: [String]
});

const Location = mongoose.model("Location", locationSchema);


/////////////////////////////
// 6. HOME UPDATES (WITH IMAGE)
/////////////////////////////
const homeUpdateSchema = new mongoose.Schema({
  type: { type: String, enum: ["activity", "upcoming", "trending"] },
  title: String,
  description: String,
  place: String,
  date: String,
  time: String,
  postedBy: String,

  imageUrl: String,   // ✅ Cloudinary URL
  publicId: String    // ✅ for delete/update

}, { timestamps: true });

const HomeUpdate = mongoose.model("HomeUpdate", homeUpdateSchema);


/////////////////////////////
// 7. MEMBER PERFORMANCE
/////////////////////////////
const performanceSchema = new mongoose.Schema({
  year: String,
  memberTelephone: String,
  name: String,
  totalSessions: Number,
  attendedSessions: Number,
  averageAttendance: Number,
  bestMonth: String,
  worstMonth: String
});

const Performance = mongoose.model("Performance", performanceSchema);


/////////////////////////////
// 8. LEADER LOCATION
/////////////////////////////
const leaderLocationSchema = new mongoose.Schema({
  sector: String,
  cell: String,
  village: String
});

const LeaderLocation = mongoose.model("LeaderLocation", leaderLocationSchema);


/////////////////////////////
// EXPORT ALL MODELS
/////////////////////////////
module.exports = {
  Member,
  Attendance,
  AttendanceTracking,
  Inteko,
  Location,
  HomeUpdate,
  Performance,
  LeaderLocation
};