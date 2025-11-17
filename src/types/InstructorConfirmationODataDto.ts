export interface InstructorConfirmationODataDto {
  ConfirmationId: number;
  UserId: string;
  FileName: string;
  Certificatelink: string;
  UserName: string;
  SendDate: string; // ISO string
  Description: string;
}