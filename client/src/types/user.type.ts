export interface CreateUser {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UserInfo {
  _id: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePhoto: string;
  bio: string;
  followers: string[];
  following: string[];
  bookmarks: string[];
  posts: string[];
  comments: string[];
  likes: string[];
}

export interface UserState {
    currentUser: CurrentUser;
    socket: null;
    onlineUsers: string[];
}

export interface CurrentUser {
    id: string;
    userInfo: UserInfo;
    profilePhoto: string;
    accessToken: string;
    bookmarks: string[];
}
