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
  accessToken: string | null;
}

export interface CurrentUser {
  _id: string;
  userInfo: UserInfo;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  profilePhoto: string;
  accessToken: string;
  bookmarks: string[];
  bio: string;
  followers: string[];
  following: string[];
  posts: string[];
  comments: string[];
  likes: string[];
}
