export interface UserModel {
  firstName?: string;
  lastName?: string;
  rollNumber?: string;
  year?: number;
  department?: string;
  mobile?: string;
  email: string;
  role: string;
  imageSrc?: string;
  password?: string;
  participatedEvents?: string[];
  eventForm?: any[];
  participation?: any[];
  postedEvents?: string[];
  disabled?: boolean;
  activate?: boolean;
}
