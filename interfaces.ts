export interface Supportgroup {
    id: number,
    name: string,
    description: string,
    numberOfMembers: number,
    profileImage: string,
    dateStarted: string,
    members: string[],
    leader: Leader,
    isRemote: boolean,
    status: string
}

export interface Leader {
    id: number,
    name: string,
    mail: string,
    phone: string
}

export interface User {
    name: string,
    passwd: string
}

export interface FlashMessage {
    type: "error" | "success" | "info"
    message: string;
}