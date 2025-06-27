export interface CredentialsDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  message: string;
}