import { ObjectId } from "mongodb";

export interface Project {
    _id?: ObjectId;
    title: string;
    startDate: Date;
    endDate: Date;
    imgRefs: {
        url: string;
        caption: string;
    }[];
    links: {
        name: string;
        url: string;
    }[];
    content: string;
}

export interface Image {
    name: string;
    key: string;
}
