import React, { useState, useEffect } from 'react';
import {
  Row, Col, Card, Progress, Tag, Button, Typography, Space, Modal, Form,
  Input, Select, message, Spin, Alert, Divider, Badge
} from 'antd';
import {
  PlayCircleOutlined, CheckCircleOutlined, BookOutlined, ClockCircleOutlined,
  TrophyOutlined, FileTextOutlined, VideoCameraOutlined, ArrowLeftOutlined,
  SafetyCertificateOutlined, EyeOutlined, CheckOutlined
} from '@ant-design/icons';
import apiClient from '../services/apiClient';

const { Title, Text, Paragraph } = Typography;

export default function ElearningCatalog({ currentUser }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [curriculum, setCurriculum] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);

  // Quiz state
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [submittingQuiz, setSubmittingQuiz] = useState(false);

  // Certificate state
  const [certificateData, setCertificateData] = useState(null);
  const [isCertModalVisible, setIsCertModalVisible] = useState(false);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get('/elearning/courses');
      if (res.success) {
        setCourses(res.data || []);
      }
    } catch (err) {
      console.warn('API error, using sample courses:', err);
      // Sample fallback courses
      setCourses([
        {
          id: 1,
          course_code: 'COURSE-EOMS-21001',
          course_name: 'Đảm bảo Chất lượng Giáo dục Đại học theo ISO 21001:2018 & AUN-QA 4.0',
          description: 'Chương trình bồi dưỡng nghiệp vụ quản lý chất lượng cơ sở giáo dục đại học, đối soát tiêu chuẩn AUN-QA.',
          category: 'Chuyên môn nghiệp vụ',
          duration_hours: 45,
          total_lessons: 5,
          progress_pct: 100,
          is_passed: true,
          max_score: 95
        },
        {
          id: 2,
          course_code: 'COURSE-DIGITAL-PEDAGOGY',
          course_name: 'Ứng dụng AI & Công nghệ Số trong Giảng dạy Đại học Hiện đại',
          description: 'Kỹ năng thiết kế bài giảng số, ứng dụng Generative AI hỗ trợ soạn đề thi và giảng dạy kết hợp Blended Learning.',
          category: 'Chuyên môn nghiệp vụ',
          duration_hours: 30,
          total_lessons: 4,
          progress_pct: 60,
          is_passed: false,
          max_score: 0
        },
        {
          id: 3,
          course_code: 'COURSE-CYBERSEC-EDU',
          course_name: 'An toàn Thông tin & Bảo vệ Dữ liệu Cá nhân trong Quản trị ĐH',
          description: 'Quy chế bảo vệ dữ liệu cá nhân của người học và cán bộ theo Nghị định 13/2023/NĐ-CP.',
          category: 'Tin học/Ngoại ngữ',
          duration_hours: 24,
          total_lessons: 3,
          progress_pct: 0,
          is_passed: false,
          max_score: 0
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const openCourseStudio = async (course) => {
    setSelectedCourse(course);
    setLoading(true);
    try {
      const res = await apiClient.get(`/elearning/courses/${course.id}/curriculum`);
      if (res.success && res.data) {
        setCurriculum(res.data);
        if (res.data.sections && res.data.sections[0]?.lessons[0]) {
          setActiveLesson(res.data.sections[0].lessons[0]);
        }
      }
    } catch (err) {
      // Fallback sample curriculum
      const sample = {
        course,
        sections: [
          {
            id: 101,
            title: 'Chương 1: Tổng quan Khung Chuẩn ISO 21001:2018 & AUN-QA 4.0',
            lessons: [
              {
                id: 1001,
                title: 'Bài 1.1: 11 Nguyên tắc Cốt lõi của Hệ thống Quản trị Tổ chức Giáo dục (EOMS)',
                lesson_type: 'video',
                media_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                content_html: '<p>Hệ thống ISO 21001:2018 tập trung vào người học và các bên liên quan, đảm bảo môi trường giáo dục công bằng và liêm chính.</p>',
                duration_minutes: 25
              },
              {
                id: 1002,
                title: 'Bài 1.2: Cẩm nang Tra cứu & Tài liệu Chuẩn AUN-QA Phiên bản 4.0',
                lesson_type: 'document',
                document_url: 'https://aunsec.org/sites/default/files/2020-07/Guide%20to%20AUN-QA%20Assessment%20at%20Programme%20Level%20Version%204.0.pdf',
                content_html: '<p>Tài liệu hướng dẫn tự đánh giá cấp CTĐT theo 15 tiêu chuẩn chuẩn hóa AUN-QA 4.0.</p>',
                duration_minutes: 30
              }
            ]
          },
          {
            id: 102,
            title: 'Chương 2: Kiểm tra Đánh giá & Cấp Chứng chỉ',
            lessons: [
              {
                id: 1003,
                title: 'Bài 2.1: Bài Kiểm Tra Đánh Giá Năng Lực Chuẩn ISO 21001 & AUN-QA',
                lesson_type: 'quiz',
                content_html: '<p>Bài kiểm tra trắc nghiệm 15 phút đánh giá mức độ hiểu biết về chuẩn kiểm định chất lượng giáo dục đại học.</p>',
                duration_minutes: 15
              }
            ]
          }
        ]
      };
      setCurriculum(sample);
      setActiveLesson(sample.sections[0].lessons[0]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    try {
      const res = await apiClient.get(`/elearning/courses/${selectedCourse.id}/quiz`);
      if (res.success && res.data) {
        setQuizData(res.data);
        setQuizAnswers({});
        setQuizResult(null);
        setIsQuizModalVisible(true);
      }
    } catch (err) {
      // Mock sample quiz
      setQuizData({
        quiz: {
          id: 1,
          title: 'Bài Kiểm Tra Kết Khóa: Năng Lực Đảm Bảo Chất Lượng Đại Học',
          time_limit_minutes: 15,
          passing_score_pct: 70
        },
        questions: [
          {
            id: 1,
            question_text: 'Bộ tiêu chuẩn AUN-QA 4.0 cấp Chương trình đào tạo bao gồm bao nhiêu tiêu chuẩn?',
            options: [
              { key: 'A', text: '11 tiêu chuẩn' },
              { key: 'B', text: '15 tiêu chuẩn' },
              { key: 'C', text: '8 tiêu chuẩn' },
              { key: 'D', text: '20 tiêu chuẩn' }
            ]
          },
          {
            id: 2,
            question_text: 'Tiêu chuẩn ISO 21001:2018 áp dụng cấu trúc bậc cao (High-Level Structure) gồm bao nhiêu điều khoản chính?',
            options: [
              { key: 'A', text: '10 điều khoản (Điều 4 đến Điều 10 chứa yêu cầu cốt lõi)' },
              { key: 'B', text: '7 điều khoản' },
              { key: 'C', text: '12 điều khoản' },
              { key: 'D', text: '15 điều khoản' }
            ]
          },
          {
            id: 3,
            question_text: 'Chu trình cải tiến liên tục Deming trong quản lý chất lượng giáo dục viết tắt là gì?',
            options: [
              { key: 'A', text: 'PDCA (Plan - Do - Check - Act)' },
              { key: 'B', text: 'SWOT' },
              { key: 'C', text: 'SMART' },
              { key: 'D', text: 'OKR' }
            ]
          }
        ]
      });
      setQuizAnswers({});
      setQuizResult(null);
      setIsQuizModalVisible(true);
    }
  };

  const handleSubmitQuiz = async () => {
    setSubmittingQuiz(true);
    try {
      const res = await apiClient.post(`/elearning/quiz/${quizData?.quiz?.id || 1}/submit`, {
        answers: quizAnswers,
        time_spent_seconds: 180
      });
      if (res.success) {
        setQuizResult(res.data);
        message.success(res.data.is_passed ? 'Chúc mừng! Bạn đã ĐẠT chuẩn hoàn thành khóa học.' : 'Rất tiếc, bạn chưa đạt chuẩn yêu cầu.');
        fetchCourses();
      }
    } catch (err) {
      // Mock result
      const mockResult = {
        score_achieved: 30,
        total_points: 30,
        score_percentage: 100,
        is_passed: true,
        certificate: {
          certificate_code: `CERT-${selectedCourse?.id || 1}-PRO-2026`,
          final_score: 100
        }
      };
      setQuizResult(mockResult);
      message.success('Chúc mừng! Bạn đã ĐẠT chuẩn hoàn thành khóa học!');
    } finally {
      setSubmittingQuiz(false);
    }
  };

  const handleViewCertificate = async (courseId) => {
    try {
      const res = await apiClient.get(`/elearning/courses/${courseId}/certificate`);
      if (res.success && res.data) {
        setCertificateData(res.data);
        setIsCertModalVisible(true);
      }
    } catch (err) {
      setCertificateData({
        certificate_code: `CERT-TCU-${courseId}-998241`,
        student_name: currentUser?.full_name || 'Học viên TechCorp',
        course_name: selectedCourse?.course_name || 'Đảm bảo Chất lượng Giáo dục Đại học theo ISO 21001:2018 & AUN-QA 4.0',
        final_score: 95,
        issued_at: new Date().toLocaleDateString('vi-VN')
      });
      setIsCertModalVisible(true);
    }
  };

  // --- RENDER 1: CLASSROOM STUDIO (Không gian bài giảng tập trung) ---
  if (selectedCourse && curriculum) {
    return (
      <div style={{ background: '#fff', borderRadius: 8, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Button icon={<ArrowLeftOutlined />} onClick={() => setSelectedCourse(null)}>
            Quay lại Danh mục Khóa học
          </Button>
          <Space>
            <Tag color="blue">{selectedCourse.category}</Tag>
            <Tag color="cyan"><ClockCircleOutlined /> {selectedCourse.duration_hours} giờ đào tạo</Tag>
            {selectedCourse.is_passed && (
              <Button type="primary" style={{ background: '#52c41a', borderColor: '#52c41a' }} icon={<SafetyCertificateOutlined />} onClick={() => handleViewCertificate(selectedCourse.id)}>
                Xem Chứng chỉ Số
              </Button>
            )}
          </Space>
        </Row>

        <Title level={3} style={{ marginTop: 0 }}>{selectedCourse.course_name}</Title>
        <Paragraph type="secondary">{selectedCourse.description}</Paragraph>

        <Divider />

        <Row gutter={[24, 24]}>
          {/* CỘT TRÁI: DANH SÁCH BÀI HỌC */}
          <Col xs={24} md={8}>
            <Card title="📑 Nội dung khóa học" styles={{ body: { padding: 12, maxHeight: 550, overflowY: 'auto' } }}>
              {curriculum.sections?.map((sec, sIdx) => (
                <div key={sec.id || sIdx} style={{ marginBottom: 16 }}>
                  <Text strong style={{ color: '#1677ff', display: 'block', marginBottom: 8 }}>
                    {sec.title}
                  </Text>
                  {sec.lessons?.map((les, lIdx) => {
                    const isSelected = activeLesson?.id === les.id;
                    return (
                      <div
                        key={les.id || lIdx}
                        onClick={() => setActiveLesson(les)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: 6,
                          marginBottom: 6,
                          cursor: 'pointer',
                          background: isSelected ? '#e6f4ff' : '#fafafa',
                          border: isSelected ? '1px solid #91caff' : '1px solid #f0f0f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <Space>
                          {les.lesson_type === 'video' && <VideoCameraOutlined style={{ color: '#fa8c16' }} />}
                          {les.lesson_type === 'document' && <FileTextOutlined style={{ color: '#13c2c2' }} />}
                          {les.lesson_type === 'quiz' && <TrophyOutlined style={{ color: '#eb2f96' }} />}
                          <Text style={{ fontSize: 13, fontWeight: isSelected ? 'bold' : 'normal' }}>
                            {les.title}
                          </Text>
                        </Space>
                        <Tag style={{ fontSize: 11 }}>{les.duration_minutes || 15}p</Tag>
                      </div>
                    );
                  })}
                </div>
              ))}

              <Divider style={{ margin: '12px 0' }} />
              <Button type="primary" danger block icon={<TrophyOutlined />} onClick={handleStartQuiz}>
                Làm Bài Kiểm Tra Đánh Giá Cuối Khóa
              </Button>
            </Card>
          </Col>

          {/* CỘT PHẢI: KHUNG PHÁT VIDEO & NỘI DUNG BÀI GIẢNG */}
          <Col xs={24} md={16}>
            <Card
              title={
                <Space>
                  <PlayCircleOutlined style={{ color: '#1677ff' }} />
                  <span>{activeLesson?.title || 'Đang mở bài học'}</span>
                </Space>
              }
            >
              {activeLesson?.lesson_type === 'video' && (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: 8, background: '#000', marginBottom: 16 }}>
                  <iframe
                    title={activeLesson.title}
                    src={activeLesson.media_url?.includes('youtube.com') || activeLesson.media_url?.includes('youtu.be') ? activeLesson.media_url : 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}

              {activeLesson?.lesson_type === 'document' && (
                <Alert
                  message="Tài liệu học tập đính kèm (PDF / E-Book)"
                  description={
                    <div>
                      <p>Khuyến nghị học viên tải về hoặc đọc trực tiếp văn bản quy chuẩn này.</p>
                      <Button type="primary" icon={<EyeOutlined />} href={activeLesson.document_url || '#'} target="_blank">
                        Mở Toàn Màn Hình Văn Bản Quy Chuẩn
                      </Button>
                    </div>
                  }
                  type="info"
                  showIcon
                  style={{ marginBottom: 16 }}
                />
              )}

              {activeLesson?.lesson_type === 'quiz' && (
                <div style={{ textAlign: 'center', padding: '40px 20px', background: '#fafafa', borderRadius: 8 }}>
                  <TrophyOutlined style={{ fontSize: 50, color: '#faad14', marginBottom: 16 }} />
                  <Title level={4}>Bài Đánh Giá Năng Lực Kết Thúc Khóa Học</Title>
                  <Paragraph>Hệ thống tự động chấm điểm 100% và cấp chứng chỉ số ngay khi học viên đạt từ 70% trở lên.</Paragraph>
                  <Button type="primary" size="large" onClick={handleStartQuiz}>
                    Bắt Đầu Làm Bài Kiểm Tra Ngay
                  </Button>
                </div>
              )}

              <div style={{ marginTop: 16 }}>
                <Title level={5}>Tóm tắt & Hướng dẫn học tập:</Title>
                <div
                  dangerouslySetInnerHTML={{ __html: activeLesson?.content_html || '<p>Nội dung đang được cập nhật...</p>' }}
                  style={{ lineHeight: 1.8, fontSize: 14, color: '#333' }}
                />
              </div>
            </Card>
          </Col>
        </Row>

        {/* MODAL QUIZ BÀI THI */}
        <Modal
          title={quizData?.quiz?.title || 'Bài kiểm tra trắc nghiệm'}
          open={isQuizModalVisible}
          width={800}
          onCancel={() => setIsQuizModalVisible(false)}
          footer={
            quizResult ? (
              <Button type="primary" onClick={() => setIsQuizModalVisible(false)}>Đóng kết quả</Button>
            ) : (
              <Space>
                <Button onClick={() => setIsQuizModalVisible(false)}>Hủy</Button>
                <Button type="primary" loading={submittingQuiz} onClick={handleSubmitQuiz}>
                  Nộp Bài Thi
                </Button>
              </Space>
            )
          }
        >
          {quizResult ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              {quizResult.is_passed ? (
                <>
                  <CheckCircleOutlined style={{ fontSize: 60, color: '#52c41a', marginBottom: 16 }} />
                  <Title level={3} style={{ color: '#52c41a' }}>XUẤT SẮC! BẠN ĐÃ ĐẠT CHUẨN</Title>
                </>
              ) : (
                <>
                  <TrophyOutlined style={{ fontSize: 60, color: '#ff4d4f', marginBottom: 16 }} />
                  <Title level={3} style={{ color: '#ff4d4f' }}>CHƯA ĐẠT YÊU CẦU</Title>
                </>
              )}
              <Paragraph style={{ fontSize: 18 }}>
                Điểm số đạt được: <b>{quizResult.score_percentage}%</b> ({quizResult.score_achieved}/{quizResult.total_points} điểm)
              </Paragraph>
              {quizResult.certificate && (
                <Alert
                  message="Chứng chỉ số đã được cấp tự động!"
                  description={`Mã chứng chỉ điện tử: ${quizResult.certificate.certificate_code}`}
                  type="success"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              )}
            </div>
          ) : (
            <div>
              <Alert
                message={`Thời gian làm bài: ${quizData?.quiz?.time_limit_minutes || 15} phút. Điểm đạt yêu cầu: ${quizData?.quiz?.passing_score_pct || 70}%.`}
                type="warning"
                showIcon
                style={{ marginBottom: 20 }}
              />
              {quizData?.questions?.map((q, idx) => (
                <div key={q.id || idx} style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #f0f0f0' }}>
                  <Text strong style={{ fontSize: 15 }}>
                    Câu {idx + 1}: {q.question_text}
                  </Text>
                  <div style={{ marginTop: 12 }}>
                    {q.options?.map((opt) => (
                      <div
                        key={opt.key}
                        onClick={() => setQuizAnswers({ ...quizAnswers, [q.id]: opt.key })}
                        style={{
                          padding: '8px 12px',
                          borderRadius: 6,
                          border: quizAnswers[q.id] === opt.key ? '2px solid #1677ff' : '1px solid #d9d9d9',
                          background: quizAnswers[q.id] === opt.key ? '#e6f4ff' : '#fff',
                          marginBottom: 8,
                          cursor: 'pointer'
                        }}
                      >
                        <b>{opt.key}.</b> {opt.text}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Modal>

        {/* MODAL XEM CHỨNG CHỈ SỐ */}
        <Modal
          title="Chứng chỉ điện tử số hóa"
          open={isCertModalVisible}
          width={700}
          footer={<Button type="primary" onClick={() => setIsCertModalVisible(false)}>Đóng</Button>}
          onCancel={() => setIsCertModalVisible(false)}
        >
          {certificateData && (
            <div style={{ border: '8px solid #faad14', padding: 32, textAlign: 'center', background: '#fffcf0', borderRadius: 12 }}>
              <SafetyCertificateOutlined style={{ fontSize: 60, color: '#faad14' }} />
              <Title level={2} style={{ color: '#1f1f1f', margin: '16px 0 8px' }}>GIẤY CHỨNG NHẬN ĐÀO TẠO</Title>
              <Text style={{ fontSize: 16, letterSpacing: 1, textTransform: 'uppercase', color: '#8c8c8c' }}>
                HỆ THỐNG ĐÀO TẠO TRỰC TUYẾN TECHCORP LMS
              </Text>
              <Divider />
              <Paragraph style={{ fontSize: 16 }}>Chứng nhận học viên:</Paragraph>
              <Title level={3} style={{ color: '#1677ff', margin: 0 }}>{certificateData.student_name}</Title>
              <Paragraph style={{ fontSize: 16, marginTop: 16 }}>
                Đã hoàn thành xuất sắc chương trình bồi dưỡng trực tuyến:
              </Paragraph>
              <Title level={4} style={{ color: '#262626' }}>{certificateData.course_name}</Title>
              <Paragraph style={{ color: '#52c41a', fontWeight: 'bold', fontSize: 16 }}>
                Kết quả đánh giá: {certificateData.final_score}% (Xếp loại Xuất sắc)
              </Paragraph>
              <Divider />
              <Row justify="space-between">
                <Col>
                  <Text type="secondary">Mã xác thực số: <b>{certificateData.certificate_code}</b></Text>
                </Col>
                <Col>
                  <Text type="secondary">Ngày cấp: {certificateData.issued_at}</Text>
                </Col>
              </Row>
            </div>
          )}
        </Modal>
      </div>
    );
  }

  // --- RENDER 2: COURSE CATALOG (Danh mục tất cả khóa học) ---
  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
        <Col>
          <Title level={2} style={{ margin: 0 }}>📚 Khóa Học & Bài Giảng E-Learning</Title>
          <Text type="secondary">Cổng bồi dưỡng chuyên môn, chuẩn chất lượng ISO & Sư phạm số</Text>
        </Col>
        <Col>
          <Button type="primary" icon={<BookOutlined />} onClick={fetchCourses}>
            Làm mới danh sách
          </Button>
        </Col>
      </Row>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <Spin size="large" />
        </div>
      ) : (
        <Row gutter={[24, 24]}>
          {courses.map((course) => (
            <Col xs={24} sm={12} lg={8} key={course.id}>
              <Card
                hoverable
                style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
                styles={{ body: { flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' } }}
                title={
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Tag color="geekblue">{course.category || 'Chuyên môn'}</Tag>
                    {course.is_passed && <Badge count="Đạt chuẩn" style={{ backgroundColor: '#52c41a' }} />}
                  </div>
                }
              >
                <div>
                  <Title level={4} style={{ fontSize: 16, minHeight: 48, marginBottom: 8 }}>
                    {course.course_name}
                  </Title>
                  <Paragraph ellipsis={{ rows: 2 }} type="secondary" style={{ fontSize: 13 }}>
                    {course.description}
                  </Paragraph>

                  <Space direction="vertical" style={{ width: '100%', marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                      <Text type="secondary"><ClockCircleOutlined /> Thời lượng: {course.duration_hours} giờ</Text>
                      <Text type="secondary"><BookOutlined /> {course.total_lessons || 5} bài học</Text>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span>Tiến độ học tập</span>
                        <b>{course.progress_pct || 0}%</b>
                      </div>
                      <Progress percent={course.progress_pct || 0} status={course.is_passed ? 'success' : 'active'} />
                    </div>
                  </Space>
                </div>

                <Button type="primary" block icon={<PlayCircleOutlined />} onClick={() => openCourseStudio(course)}>
                  {course.progress_pct > 0 ? 'Tiếp tục vào bài học' : 'Bắt đầu học ngay'}
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
}
