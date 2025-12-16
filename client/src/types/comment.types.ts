// import type { CurrentUser } from "./user.type";

export interface CommentType {
    _id: string;
    creator: {
        creatorId: string;
        creatorName: string;
        creatorPhoto: string;
    };
    postId: string;
    comment: string;
    createdAt: string;
}
