const express = require('express');
const connectDB=require('./config/db')
const morgan = require('morgan');
const auth_router=require('./routes/auth_routes')
const post_router=require('./routes/post_routes')
const cors=require('cors')

const app = express();
connectDB();

const corsOptions={
  origin:'http://localhost:5173',
  method:"GET,POST,DELETE,PUT,PATCH",
  credentials: true
}
app.use(cors(corsOptions));

app.use(express.json());
app.use(morgan('dev'));
app.use('/api/auth',auth_router);
app.use('/api/posts',post_router);

app.get('/', (req, res) => {
  res.send('Hello World!');
});


app.listen(3000, () => {
  console.log(`Server is running at http://localhost:3000`);
});