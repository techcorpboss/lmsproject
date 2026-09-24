// server.js
// Modern Standalone LMS & E-Testing Platform Backend — lms.techcorp.info.vn
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

const { sequelize } = require('./models');
const authRoutes = require('./routes/auth.routes');
const elearningRoutes = require('./routes/elearning.routes');
const examRoutes = require('./routes/exam.routes');
const syncRoutes = require('./routes/sync.routes');
const academicLmsRoutes = require('./routes/academicLms.routes');
const adminRoutes = require('./routes/admin.routes');
const academicEnterpriseRoutes = require('./routes/academicEnterprise.routes');

const app = express();
const server = http.createServer(app);

// Cấu hình Socket.io cho phòng thi trực tuyến & Giám thị AI
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Health Check
app.get('/', (req, res) => {
  res.json({
    status: 'ONLINE',
    service: 'TechCorp LMS & E-Testing Microservice',
    domain: 'lms.techcorp.info.vn',
    version: '2.0.0-PRO',
    standards: ['SCORM-Ready', 'IMS QTI 2.1', 'AI-Proctoring-v2'],
    server_time: new Date()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/elearning', elearningRoutes);
app.use('/api/exam', examRoutes);
app.use('/api/sync', syncRoutes);
app.use('/api/academic/lms', academicLmsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/academic/enterprise', academicEnterpriseRoutes);

// Socket.io Real-time Proctoring Hub (Trung tâm Giám sát thi thời gian thực)
const activeExamRooms = new Map(); // roomId -> Set of student sockets

io.on('connection', (socket) => {
  console.log(`[Socket.io] New client connected: ${socket.id}`);

  // Thí sinh tham gia phòng thi ảo
  socket.on('join_exam_room', ({ examId, studentId, studentName }) => {
    socket.join(`exam_${examId}`);
    socket.examId = examId;
    socket.studentId = studentId;
    socket.studentName = studentName;

    // Báo cho giám thị biết có thí sinh mới vào phòng
    io.to(`proctor_${examId}`).emit('candidate_joined', {
      studentId,
      studentName,
      socketId: socket.id,
      timestamp: new Date()
    });
  });

  // Giám thị kết nối theo dõi phòng thi
  socket.on('join_proctor_room', ({ examId }) => {
    socket.join(`proctor_${examId}`);
    console.log(`[Proctor] Supervisor joined monitor room: proctor_${examId}`);
  });

  // Thí sinh vi phạm (chuyển tab, mất tiêu điểm, nghi vấn 2 người)
  socket.on('report_violation', (incident) => {
    // Phát cảnh báo tức thì đến giám thị
    io.to(`proctor_${socket.examId}`).emit('incident_alert', {
      ...incident,
      socketId: socket.id,
      studentId: socket.studentId,
      studentName: socket.studentName,
      reported_at: new Date()
    });
  });

  // Giám thị gửi tin nhắn cảnh báo hoặc đình chỉ thí sinh
  socket.on('send_proctor_command', ({ targetSocketId, command, message }) => {
    io.to(targetSocketId).emit('proctor_command', { command, message });
  });

  socket.on('disconnect', () => {
    if (socket.examId && socket.studentId) {
      io.to(`proctor_${socket.examId}`).emit('candidate_disconnected', {
        studentId: socket.studentId,
        studentName: socket.studentName,
        disconnected_at: new Date()
      });
    }
  });
});

// Cổng chạy dịch vụ (mặc định 5009 trên máy chủ)
const PORT = process.env.PORT || 5009;

sequelize.authenticate()
  .then(() => {
    console.log('[MySQL] Database connected successfully to lms_db.');
    server.listen(PORT, () => {
      console.log(`[LMS Platform] Server is running on port ${PORT}`);
      console.log(`[Domain] Configured for: https://lms.techcorp.info.vn`);
    });
  })
  .catch(err => {
    console.error('[MySQL Error] Could not connect to database:', err.message);
    // Vẫn khởi chạy HTTP server để phục vụ health check và thông báo trạng thái
    server.listen(PORT, () => {
      console.log(`[LMS Platform] Server running in offline-db mode on port ${PORT}`);
    });
  });