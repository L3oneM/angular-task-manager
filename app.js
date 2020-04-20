const express = require('express');
const app = express();
const path = require('path');

const { mongoose } = require('./db/mongoose');

const bodyParser = require('body-parser');

const corsMiddleware = require('./middlewares/cors');

const listRouter = require('./routers/lists');
const taskRouter = require('./routers/tasks');
const userRouter = require('./routers/users');

app.use(corsMiddleware);

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use(listRouter);
app.use(taskRouter);
app.use(userRouter);

const PORT = 3001;

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
