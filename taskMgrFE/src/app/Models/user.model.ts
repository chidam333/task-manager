export interface UserProfile {
  id: number;
  email: string;
  name: string;
  role: string;
}

export interface UserDto {
  name:string;
  email: string;
  password: string;
  role: string;
}