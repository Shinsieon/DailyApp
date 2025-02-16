export interface UserResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    nickname: string;
  };
}
