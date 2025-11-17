// ===============================
// Role
// ===============================
export enum Role {
  Admin = 1,
  Student = 2,
  Instructor = 3,
}

// ===============================
// Course Level
// ===============================
export enum CourseLevel {
  Beginner = 0,
  Intermediate = 1,
  Advanced = 2,
}

// ===============================
// Payment Status
// ===============================
export enum PaymentStatus {
  Pending = 0,
  Completed = 1,
  Failed = 2,
  Refunded = 3,
}

// ===============================
// Course Status
// ===============================
export enum CourseStatus {
  Draft = 0,
  Published = 1,
  Archived = 2,
  Active = 3,
  Inactive = 4,
}

// ===============================
// Test Status
// ===============================
export enum TestStatus {
  Active = 0,
  Inactive = 1,
  Completed = 2,
}

// ===============================
// Certificate Status
// ===============================
export enum CertificateStatus {
  Pending = 0,
  Completed = 1,
}

// ===============================
// File Type
// ===============================
export enum FileType {
  Image = 0,
  Video = 1,
  Document = 2,
  Other = 3,
}

// ===============================
// Notification Type
// ===============================
export enum NotificationType {
  Info = 0,
  Warning = 1,
  Alert = 2,
}

// ===============================
// Report Status
// ===============================
export enum ReportStatus {
  Pending = 0,
  Reviewed = 1,
  Resolved = 2,
}

// ===============================
// Refund Status
// ===============================
export enum RefundStatus {
  Pending = 0,
  Approved = 1,
  Rejected = 2,
}

// ===============================
// Instructor Confirmation Status
// ===============================
export enum InstructorConfirmationStatus {
  Pending = 0,
  Confirmed = 1,
  Rejected = 2,
}

// ===============================
// Gender
// ===============================
export enum Gender {
  Male = 0,
  Female = 1,
  Other = 2,
}
