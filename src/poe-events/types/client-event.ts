export enum ClientEventType
{
    Entered,
    Unknown,
}

export interface ClientEvent
{
    id: string;
    timestamp: number;
    severity: string;
    sourceId: string;
    sourceType: string;
    type: ClientEventType;
}