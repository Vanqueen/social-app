import type { CommentType } from "./comment.types";
// import type { UserInfo } from "./user.type";

export interface PostType {
    _id: string;
    creator: string;
    body: string;
    image: string;
    likes: string[];
    comments: CommentType[];
    createdAt: Date;
}
