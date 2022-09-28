const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const auth = require('./middleware/auth.middleware');

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.static(path.join(__dirname, 'frontend', 'build')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});
app.use('/api', require('./routes/publicRoutes'));
app.use('/api', auth, require('./routes/privateRoutes'));

async function start() {

  try {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log('DB ok');
    });
    app.listen(PORT, () => {
      console.log('Server started on port ' + PORT);
    })
  } catch (err) {
    console.log(err);
  }
}

start().then();