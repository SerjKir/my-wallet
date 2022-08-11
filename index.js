const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json({extended: true}));
app.use('/', require('./routes/routes'));

app.use(express.static(path.join(__dirname, 'frontend')));
app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.get('/', function (req, res) {
  console.log('get')
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
});

async function start() {
  try {
    await mongoose.connect(process.env.MONGODB_URI).then(() => {
      console.log('DB ok')
    });

    app.listen(PORT, () => {
      console.log('Server started on port ' + PORT);
    })
  } catch (err) {console.log(err)}
}

start().then();