export interface Group {
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