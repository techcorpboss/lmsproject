// backend/services/examSchedulerService.js
/**
 * Thuật toán Xếp Lịch Thi Thông Minh & Phân Công Cán Bộ Coi Thi (Constraint Satisfaction Engine)
 * Giải quyết triệt để 3 ràng buộc cứng:
 * 1. Chống trùng phòng thi (No Room Overlap)
 * 2. Chống trùng ca thi của sinh viên cùng khóa (No Student Cohort Clash)
 * 3. Phân công 02 Giám thị độc lập, Giảng viên không được coi thi môn của chính mình (No Self-Proctoring)
 */

class ExamSchedulerService {
  constructor() {
    this.timeSlots = [
      { slot: 1, name: "Ca 1 (Sáng)", start: "07:30", end: "09:00", duration: 90 },
      { slot: 2, name: "Ca 2 (Sáng)", start: "09:30", end: "11:00", duration: 90 },
      { slot: 3, name: "Ca 3 (Chiều)", start: "13:30", end: "15:00", duration: 90 },
      { slot: 4, name: "Ca 4 (Chiều)", start: "15:30", end: "17:00", duration: 90 }
    ];

    this.rooms = [
      { code: "PHÒNG-LAB-101", capacity: 45, type: "Phòng Máy Tính Online" },
      { code: "PHÒNG-LAB-102", capacity: 45, type: "Phòng Máy Tính Online" },
      { code: "PHÒNG-A2-201", capacity: 60, type: "Phòng Thi Chuẩn SEB" },
      { code: "PHÒNG-A2-202", capacity: 60, type: "Phòng Thi Chuẩn SEB" },
      { code: "PHÒNG-THI-ONLINE-01", capacity: 100, type: "Phòng Thi Giám Sát WebRTC" }
    ];

    this.lecturers = [
      { id: 1, name: "TS. Hoàng Đức Em", email: "em.hd@techcorp.edu.vn", teaching_courses: ["IT101", "IT201"] },
      { id: 2, name: "TS. Nguyễn Văn An", email: "an.nv@techcorp.edu.vn", teaching_courses: ["IT301", "IT302"] },
      { id: 3, name: "ThS. Lê Hoàng Yến", email: "yen.lh@techcorp.edu.vn", teaching_courses: ["ENG101", "ENG102"] },
      { id: 4, name: "TS. Vũ Đình Trọng", email: "trong.vd@techcorp.edu.vn", teaching_courses: ["MATH101", "MATH102"] },
      { id: 5, name: "ThS. Trần Thị Thu", email: "thu.tt@techcorp.edu.vn", teaching_courses: ["MLN101", "PL101"] },
      { id: 6, name: "ThS. Nguyễn Văn Quản", email: "quan.nv@techcorp.edu.vn", teaching_courses: ["KT101"] }
    ];
  }

  // Thuật toán tự động sinh lịch thi tối ưu
  generateSchedule({ examDays = 5, startDate = "2026-11-02", targetCourses = [] }) {
    const coursesToSchedule = targetCourses.length > 0 ? targetCourses : [
      { code: "IT101", name: "Nhập môn Lập trình C/C++", cohort: "K66", registered: 42, faculty: "CNTT" },
      { code: "MATH101", name: "Toán Cao Cấp 1 (Giải tích 1)", cohort: "K66", registered: 42, faculty: "Cơ Bản" },
      { code: "ENG101", name: "Tiếng Anh Học Thuật 1", cohort: "K66", registered: 40, faculty: "Ngoại Ngữ" },
      { code: "IT201", name: "Cơ sở Dữ liệu (Database Systems)", cohort: "K65", registered: 38, faculty: "CNTT" },
      { code: "IT301", name: "Cấu trúc Dữ liệu & Giải thuật", cohort: "K65", registered: 39, faculty: "CNTT" },
      { code: "MLN101", name: "Triết học Mác - Lênin", cohort: "K66", registered: 42, faculty: "Lý Luận" }
    ];

    const generatedSchedules = [];
    const roomOccupancy = {}; // { [`${date}_${slot}_${room}`]: true }
    const cohortOccupancy = {}; // { [`${date}_${slot}_${cohort}`]: true }
    const lecturerDuties = {}; // { [`${lecturerName}`]: dutyCount }
    this.lecturers.forEach(l => { lecturerDuties[l.name] = 0; });

    let currentDate = new Date(startDate);

    for (let cIdx = 0; cIdx < coursesToSchedule.length; cIdx++) {
      const course = coursesToSchedule[cIdx];
      let assigned = false;

      // Tìm ngày, ca và phòng phù hợp
      for (let dayOffset = 0; dayOffset < examDays; dayOffset++) {
        const d = new Date(currentDate);
        d.setDate(d.getDate() + dayOffset);
        // Bỏ qua Chủ nhật
        if (d.getDay() === 0) continue;
        const dateStr = d.toISOString().split('T')[0];

        for (let sIdx = 0; sIdx < this.timeSlots.length; sIdx++) {
          const slot = this.timeSlots[sIdx];
          const cohortKey = `${dateStr}_${slot.slot}_${course.cohort}`;

          // RÀNG BUỘC CỨNG 1: Sinh viên cùng khóa không thi 2 môn trong cùng 1 ca
          if (cohortOccupancy[cohortKey]) continue;

          for (let rIdx = 0; rIdx < this.rooms.length; rIdx++) {
            const room = this.rooms[rIdx];
            const roomKey = `${dateStr}_${slot.slot}_${room.code}`;

            // RÀNG BUỘC CỨNG 2: Phòng không bị trùng ca
            if (roomOccupancy[roomKey]) continue;

            // RÀNG BUỘC CỨNG 3: Tìm 2 Cán bộ coi thi độc lập, KHÔNG dạy môn này
            const eligibleLecturers = this.lecturers.filter(l => !l.teaching_courses.includes(course.code));

            // Sắp xếp ưu tiên người có số ca coi thi ít hơn để cân bằng tải
            eligibleLecturers.sort((a, b) => lecturerDuties[a.name] - lecturerDuties[b.name]);

            if (eligibleLecturers.length < 2) continue;

            const proctor1 = eligibleLecturers[0];
            const proctor2 = eligibleLecturers[1];

            // Ghi nhận lịch thành công
            roomOccupancy[roomKey] = true;
            cohortOccupancy[cohortKey] = true;
            lecturerDuties[proctor1.name]++;
            lecturerDuties[proctor2.name]++;

            generatedSchedules.push({
              id: `sched_auto_${cIdx + 1}`,
              exam_code: `THI-2026-${course.code}`,
              exam_name: `Thi Kết Thúc Học Phần: ${course.name}`,
              course_code: course.code,
              course_name: course.name,
              cohort: course.cohort,
              exam_date: dateStr,
              time_slot_name: slot.name,
              start_time: slot.start,
              end_time: slot.end,
              duration_minutes: slot.duration,
              room_code: room.code,
              room_type: room.type,
              registered_count: course.registered,
              proctor_1: proctor1.name,
              proctor_1_email: proctor1.email,
              proctor_2: proctor2.name,
              proctor_2_email: proctor2.email,
              compliance_check: {
                no_room_overlap: true,
                no_student_cohort_clash: true,
                independent_proctors: true
              }
            });

            assigned = true;
            break;
          }
          if (assigned) break;
        }
        if (assigned) break;
      }
    }

    return {
      success: true,
      totalScheduled: generatedSchedules.length,
      totalRequested: coursesToSchedule.length,
      conflictCount: 0,
      invigilatorLoadStats: lecturerDuties,
      schedules: generatedSchedules
    };
  }
}

module.exports = new ExamSchedulerService();
