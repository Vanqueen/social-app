export interface CreateUser {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserState {
    currentUser: CurrentUser;
    socket: null;
    onlineUsers: string[];
}

export interface CurrentUser {
    id: string;
    profilePhoto: string;
    accessToken: string;
}
