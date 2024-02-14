import {Document, WithId} from "mongodb";

export interface Poll extends WithId<Document> {
    id: string;
    startDate: number;
    question: string;
    options: PollOption[];
    author: string;
    status: string;
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