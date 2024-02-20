import {Document, ObjectId, WithId} from "mongodb";

export type Favorite = {
    userId: string;
    favoritePolls: string[];
}
export interface Poll extends WithId<Document> {
    id: string;
    startDate: number;
    question: string;
    options: PollOption[];
    author: string;
    status: string;
    comments: PollComment[];
    votes: Vote[];
}

export type PollComment = {
    comment: string;
    userId: string;
    pollId: string;
    date: number;
}

export interface PollOption {
    id: string;
    text: string;
    votes: number;
}

export interface Vote extends WithId<Document> {
    id: string;
    pollId: string;
    userId: string;
    optionId: string;
    date: number;
}