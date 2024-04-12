export enum ClientEventType
{
    Entered,
    Unknown,
}

export type ClientEvent = {
    id: string;
    timestamp: number;
    severity: string;
    sourceId: string;
    sourceType: string;
    type: ClientEventType;
};
