// server.js

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

// MongoDB 연결 설정
mongoose.connect('mongodb://localhost:27017/progressDB', { useNewUrlParser: true, useUnifiedTopology: true });

// MongoDB 모델 정의
const Progress = mongoose.model('Progress', {
  studentId: String,
  progress: Number,
});

// 미들웨어 설정
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // 정적 파일 제공

// 진행도 조회 API
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

// 진행도 업데이트 API
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

// 루트 경로에 대한 응답 추가 (index.html 제공)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'clothes.html'));
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
