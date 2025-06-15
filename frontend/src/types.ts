export interface PostInterface {
    id: number;
    user_id: number;
    username: string;
    avatar: string;
    image: string;
    content: string;
    type: string;
    users: {
        user_id: number
        username: string
    };
    created_at: string;
    likers: string;
    comment_count: number;
    like_count: number;
    comments: object;
}

export interface CommentInterface {
    id: number;
    avatar: string;
    username: string;
    replies: {
        avatar: string;
        content: string;
        length: number;
    }
    replyTo?: string;
    content: string;
}

export interface ArticleInterface {
    id: number;
    title: string;
    image: string;
    description: string;
    content: string;
}

export interface Report {
    [x: string]: string;
    title: string;
    submittedAt: string;
    description: string;
    image: string;
    status: "pending" | "proses" | "success" | "failed"
};

export interface ReportedPost {
    reportedBy: string;
    date: string;
    content: string;
    reason: string;
    image?: string;
}
