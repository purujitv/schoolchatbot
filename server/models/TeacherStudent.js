const mongoose = require('mongoose');

const teacherStudentSchema = new mongoose.Schema({
    Teacher_ID: Number,
    Teacher_Name: String,
    Subject: String,
    Class_Assigned: String,
    Student_ID: Number,
    Student_Name: String,
}, { collection: 'teachers' }); // Make sure this matches your actual collection name

const TeacherStudent = mongoose.model('TeacherStudent', teacherStudentSchema);
module.exports = TeacherStudent;
