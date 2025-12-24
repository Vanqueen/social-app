import type { CommentType } from "./comment.types";
import type { CurrentUser } from "./user.type";
// import type { UserInfo } from "./user.type";

export interface PostType {
    _id: string;
    creator: CurrentUser;
    body: string;
    image: string;
    likes: string[];
    comments: CommentType[];
    createdAt: Date;
}
