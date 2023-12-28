
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

mongoose.connect('mongodb://localhost:27017/progressDB', { useNewUrlParser: true, useUnifiedTopology: true });


const Progress = mongoose.model('Progress', {
  studentId: String,
  progress: Number,
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); 


app.get('/progress/:studentId', async (req, res) => {
  const studentId = req.params.studentId;

  try {
    const progress = await Progress.findOne({ studentId });
    res.json(progress);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/progress', async (req, res) => {
  const { studentId, progress } = req.body;

  try {
    await Progress.updateOne({ studentId }, { progress }, { upsert: true });
    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ot.html'));
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
