export interface UserInfo {
  email: string;
  userId: string;
  userName: string;
  roles: string[];
  tokenExpiration: string;
  token: string;
}

export interface LoginInfo {
  UserName: string;
  Password: string;
}
