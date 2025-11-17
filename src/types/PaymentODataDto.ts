export interface PaymentODataDto {
  PaymentId: number;
  CourseId: number;
  StudentId: string;
  Amount: number;
  PaymentDate: string;
  Status: number; // PaymentStatus enum
  OrderCode: number;
  GatewayTransactionId?: string | null;
  CheckoutUrl?: string | null;
  Description?: string | null;
  StudentName: string;
  CourseName: string;
}
