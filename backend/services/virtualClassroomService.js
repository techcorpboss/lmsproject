// backend/services/virtualClassroomService.js
// Trung tâm Lớp học Trực tuyến Thời gian thực (Virtual Classroom Hub)
// Tích hợp WebRTC / Jitsi Meet / BigBlueButton cho Giảng dạy Trực tuyến Chuẩn MOET
'use strict';

const crypto = require('crypto');

class VirtualClassroomService {
  constructor() {
    this.defaultDomain = process.env.VIRTUAL_CLASSROOM_DOMAIN || 'meet.jit.si';
    this.roomsStore = new Map(); // roomId -> roomMetadata
    this.attendanceStore = new Map(); // roomId -> Array<{ userId, fullName, role, joinedAt, leftAt, durationMinutes }>
  }

  /**
   * Tạo mã phòng học an toàn và duy nhất dựa trên Course ID và Week / Lesson ID
   */
  generateRoomId(courseId, weekIndex = 1, sectionId = '') {
    const rawString = `TCU-LMS-C${courseId}-W${weekIndex}-S${sectionId || 'GEN'}`;
    const hash = crypto.createHash('md5').update(rawString).digest('hex').substring(0, 10);
    return `TCU_${courseId}_W${weekIndex}_${hash}`;
  }

  /**
   * Tạo hoặc lấy thông tin phòng học trực tuyến cho một buổi học / tuần học
   */
  createOrGetRoom(params) {
    const {
      courseId,
      courseName = 'Học phần LMS',
      weekIndex = 1,
      sectionId = '',
      title = `Lớp học trực tuyến - Tuần ${weekIndex}`,
      instructorId = null,
      instructorName = 'Giảng viên'
    } = params;

    const roomId = this.generateRoomId(courseId, weekIndex, sectionId);

    if (this.roomsStore.has(roomId)) {
      return this.roomsStore.get(roomId);
    }

    const roomData = {
      roomId,
      courseId,
      courseName,
      weekIndex,
      sectionId,
      title,
      instructorId,
      instructorName,
      meetingUrl: `https://${this.defaultDomain}/${roomId}`,
      createdAt: new Date().toISOString(),
      isActive: true,
      features: {
        recording: true,
        screenShare: true,
        chat: true,
        whiteboard: true,
        handRaise: true,
        breakoutRooms: true
      },
      settings: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        requireDisplayName: true,
        moderatorPassword: crypto.randomBytes(4).toString('hex')
      }
    };

    this.roomsStore.set(roomId, roomData);
    if (!this.attendanceStore.has(roomId)) {
      this.attendanceStore.set(roomId, []);
    }

    return roomData;
  }

  /**
   * Tạo cấu hình Client (Iframe config & User Role) khi người dùng truy cập phòng
   */
  getRoomAccessConfig(roomId, user) {
    const room = this.roomsStore.get(roomId);
    if (!room) {
      throw new Error(`Không tìm thấy phòng học trực tuyến với ID: ${roomId}`);
    }

    const isModerator = (user.role === 'INSTRUCTOR' || user.role === 'TEACHER' || user.role === 'ADMIN' || user.id === room.instructorId);

    // Ghi nhận điểm danh tự động khi vào phòng
    this.recordAttendance(roomId, {
      userId: user.id,
      fullName: user.name || user.fullName || (isModerator ? 'Giảng viên' : 'Sinh viên'),
      studentCode: user.code || user.studentCode || '',
      role: isModerator ? 'MODERATOR' : 'ATTENDEE'
    });

    return {
      roomId: room.roomId,
      title: room.title,
      courseName: room.courseName,
      meetingUrl: room.meetingUrl,
      domain: this.defaultDomain,
      userRole: isModerator ? 'MODERATOR' : 'ATTENDEE',
      isModerator,
      userInfo: {
        displayName: user.name || user.fullName || (isModerator ? 'Giảng viên' : 'Sinh viên'),
        email: user.email || ''
      },
      clientOptions: {
        roomName: room.roomId,
        width: '100%',
        height: '100%',
        configOverwrite: {
          startWithAudioMuted: !isModerator,
          startWithVideoMuted: false,
          enableWelcomePage: false,
          prejoinPageEnabled: false,
          disableDeepLinking: true
        },
        interfaceConfigOverwrite: {
          TOOLBAR_BUTTONS: isModerator
            ? [
                'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                'fminterfaceConfigOverwrite', 'hangup', 'profile', 'chat', 'recording',
                'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                'videoquality', 'filmstrip', 'invite', 'feedback', 'stats', 'shortcuts',
                'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone', 'security'
              ]
            : [
                'microphone', 'camera', 'desktop', 'fullscreen', 'hangup', 'chat',
                'raisehand', 'tileview', 'videobackgroundblur', 'settings'
              ]
        }
      }
    };
  }

  /**
   * Ghi nhận lượt tham gia điểm danh vào phòng học
   */
  recordAttendance(roomId, participant) {
    if (!this.attendanceStore.has(roomId)) {
      this.attendanceStore.set(roomId, []);
    }

    const logs = this.attendanceStore.get(roomId);
    const existing = logs.find(l => l.userId === participant.userId);

    const now = new Date();
    if (existing) {
      existing.lastActive = now.toISOString();
      existing.sessionCount = (existing.sessionCount || 1) + 1;
    } else {
      logs.push({
        userId: participant.userId,
        studentCode: participant.studentCode,
        fullName: participant.fullName,
        role: participant.role,
        joinedAt: now.toISOString(),
        lastActive: now.toISOString(),
        sessionCount: 1,
        totalMinutesPresent: 0
      });
    }
  }

  /**
   * Lấy danh sách điểm danh và thống kê thời lượng tham gia lớp học
   */
  getAttendanceReport(roomId) {
    const room = this.roomsStore.get(roomId);
    const participants = this.attendanceStore.get(roomId) || [];

    return {
      roomId,
      roomTitle: room ? room.title : 'Phòng học',
      courseName: room ? room.courseName : '',
      totalParticipants: participants.length,
      moderators: participants.filter(p => p.role === 'MODERATOR'),
      students: participants.filter(p => p.role === 'ATTENDEE'),
      reportGeneratedAt: new Date().toISOString()
    };
  }
}

module.exports = new VirtualClassroomService();
