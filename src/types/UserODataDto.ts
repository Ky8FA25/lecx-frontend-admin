export interface UserODataDto {
  Id: string;
  Email: string;
  FirstName: string;
  LastName?: string | null;
  ProfileImagePath?: string | null;
  Address?: string | null;
  Dob?: string | null; // ISO string
  Role?: string | null;
}
