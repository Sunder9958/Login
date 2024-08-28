const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/User');
const Comment = require('./models/Comment');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/comment-reply-app', { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return res.status(401).send('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id }, 'your_jwt_secret');
  res.json({ token });
});

app.post('/api/comments', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'your_jwt_secret');
  const comment = new Comment({ text: req.body.text, user: decoded.id });
  await comment.save();
  res.status(201).json(comment);
});

app.post('/api/comments/:id/replies', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, 'your_jwt_secret');
  const comment = await Comment.findById(req.params.id);
  comment.replies.push({ text: req.body.text, user: decoded.id });
  await comment.save();
  res.status(201).json(comment);
});

app.get('/api/comments', async (req, res) => {
  const comments = await Comment.find().populate('replies.user').populate('user');
  res.json(comments);
});

app.listen(5000, () => console.log('Server running on port 5000'));
