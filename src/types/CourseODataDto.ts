export interface CourseODataDto {
  CourseId: number;
  Title: string;
  CourseCode: string;
  Description: string;
  CoverImagePath: string;
  InstructorId: string;
  InstructorName: string;
  NumberOfStudents: number;
  Price: number;
  CategoryId: number;
  CategoryName: string;
  Level: number;       // Enum: CourseLevel
  Status: number;      // Enum: CourseStatus
  IsBaned: boolean;
  CreateDate: string;  // DateTime -> string
  LastUpdate: string;
  EndDate?: string | null;
  Rating: number;
  NumberOfRate: number;
}
