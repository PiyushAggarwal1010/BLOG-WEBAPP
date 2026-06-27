const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db')
const morgan = require('morgan');
const auth_router = require('./routes/auth_routes')
const post_router = require('./routes/post_routes')
const comment_router = require('./routes/comment_routes')
const ai_router = require('./routes/ai_routes');
const admin_router=require('./routes/admin_routes');
const cors = require('cors')
const cookieParser = require("cookie-parser");

const app = express();
const server = http.createServer(app);
connectDB();

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
    methods: "GET,POST,DELETE,PUT,PATCH",
    credentials: true
  }
});
app.set('io', io);

io.on('connection', (socket) => {
    socket.on('join_post', (postId) => {
        socket.join(postId);
    });
});

const corsOptions = {
    origin: [process.env.FRONTEND_URL, 'http://localhost:5173'],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json());
app.use(morgan('dev'));
app.use('/api/auth', auth_router);
app.use('/api/posts', post_router);
app.use('/api', comment_router);
app.use('/api/ai', ai_router);
app.use('/api/admin',admin_router);

app.get('/', (req, res) => {
  res.send('Server Running');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});