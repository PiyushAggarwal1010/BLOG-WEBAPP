const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require("cookie-parser");
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/error_middleware');

const comment_router = require('./routes/comment_routes');
const admin_router = require('./routes/admin_routes');
const auth_router = require('./routes/auth_routes');
const post_router = require('./routes/post_routes');
const ai_router = require('./routes/ai_routes');

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

app.use(helmet());
app.use(cors(corsOptions));
app.use(cookieParser())
app.use(express.json());
app.use(morgan('dev'));

app.set("trust proxy", 1); 

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 150,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' }
});

app.get('/', (req, res) => {
  res.send('Server Running');
});

app.use('/api/auth', authLimiter, auth_router);

app.use(limiter);

app.use('/api/posts', post_router);
app.use('/api', comment_router);
app.use('/api/ai', ai_router);
app.use('/api/admin', admin_router);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});