require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TeacherStudent = require('./models/TeacherStudent');
const { getGeminiResponse } = require('./geminiService');

const app = express();

// CORS Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Vite frontend
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://purujitzinreet:humvaFlTXcCRGI1i@cluster0.tqaj1.mongodb.net/chatbot', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Route: Ask Gemini a question based on MongoDB data
app.post('/ask', async (req, res) => {
    const { question } = req.body;

    try {
        const records = await TeacherStudent.find().lean();

        const groupedData = records.reduce((acc, record) => {
            const key = `${record.Teacher_ID}-${record.Teacher_Name}-${record.Subject}-${record.Class_Assigned}`;
            if (!acc[key]) {
                acc[key] = {
                    teacher: record.Teacher_Name,
                    subject: record.Subject,
                    class: record.Class_Assigned,
                    students: []
                };
            }
            acc[key].students.push(record.Student_Name);
            return acc;
        }, {});

        const dataString = Object.values(groupedData).map(group =>
            `Teacher: ${group.teacher}, Subject: ${group.subject}, Class: ${group.class}\n` +
            `Students: ${group.students.join(', ')}\n`
        ).join('\n');

        const prompt = `
            You are a school assistant AI. Use the following data from a MongoDB collection to answer the question.
            
            ${dataString}

            Now, answer this question: ${question}
        `;

        const response = await getGeminiResponse(prompt);
        res.json({ answer: response });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Something went wrong' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
