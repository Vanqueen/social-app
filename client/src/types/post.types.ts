import type { CommentType } from "./comment.types";
import type { UserInfo } from "./user.type";

export interface PostType {
    _id: string;
    creator: UserInfo;
    body: string;
    image: string;
    likes: string[];
    comments: CommentType[];
    createdAt: Date;
}
