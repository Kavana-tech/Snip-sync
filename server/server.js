const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const {Server} = require('socket.io');

const http = require('http');
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'DELETE'],
    },
})
app.set('io', io);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('join-folder', (folderId) => {
    socket.join(folderId);
    console.log(`Socket ${socket.id} joined folder ${folderId}`);
  });

  socket.on('leave-folder', (folderId) => {
    socket.leave(folderId);
    console.log(`Socket ${socket.id} left folder ${folderId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('MongoDB connection error:', err));

const signup = require('./routes/signup');
const logout = require('./routes/logout');
const login = require('./routes/login');
const sendEmail = require('./routes/sendEmail');
const addProjects = require('./routes/projects');
const fetchProjects = require("./routes/fetchProjects");
const editProject = require("./routes/editProject");
const deleteProject = require('./routes/deleteProject');
// const inviteTeam = require('./routes/inviteTeam');
const generateInviteLink = require('./routes/generateInviteLink');
const processInvitation = require('./routes/processInvitation');
const fetchUser = require('./routes/fetchUser');
const getProject = require('./routes/getProject');
const createFolder = require('./routes/createFolder');
const getFolder = require("./routes/getFolder");
const deleteFolder = require('./routes/deleteFolder');
const getFiles = require('./routes/getFiles');
const addFile = require('./routes/addFiles');
const addSnippet = require('./routes/addSnippets');
const getSnippets = require('./routes/snippets');
const deleteSnippet = require('./routes/deleteSnippet');
const deleteFile = require('./routes/deleteFile');

app.use('/', signup);
app.use('/', logout);
app.use('/', login);
app.use('/sendotp', sendEmail);
app.use('/', addProjects);
app.use('/', fetchProjects);
app.use('/', editProject);
app.use('/', deleteProject);
// app.use('/', inviteTeam);
app.use('/', generateInviteLink);
app.use('/', processInvitation);
app.use('/', fetchUser);
app.use('/', getProject);
app.use('/', createFolder);
app.use('/', getFolder);
app.use('/', deleteFolder);
app.use('/', getFiles);
app.use('/', addFile);
app.use('/', addSnippet);
app.use('/', getSnippets);
app.use('/', deleteSnippet);
app.use('/', deleteFile);


app.get('/', (req, res) => {
    res.send("home page");
});

server.listen(8000, () => {
    console.log("Server running on port 8000");
});
