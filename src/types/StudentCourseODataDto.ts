export interface StudentCourseODataDto {
  studentCourseId: number;
  studentId: string;
  courseId: number;
  progress: number;
  certificateStatus: number; // Enum CertificateStatus
  enrollmentDate: string;
  completionDate?: string | null;
  studentName: string;
  courseName: string;
}
