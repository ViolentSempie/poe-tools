import { ClientEvent, ClientEventType } from "./client-event";

export interface EnteredClientEvent extends ClientEvent {
    type: ClientEventType.Entered;
    locationId: string | null;
    locationName: string;
}

let lastGeneratedId: string | null = null;

export function parseGeneratingEvent(baseData: ClientEvent, extra: string[]) {
    if (extra[0] === "Generating") {
        lastGeneratedId = extra[4].slice(1, extra[4].length - 1);
    }

    return null;
}

export function parseEnteredEvent(baseData: ClientEvent, extra: string[]) {
    if (extra[0] !== "You" || extra[2] !== "entered") {
        return null;
    }

    const [, , , ...locationNameParts] = extra;
    const locationName = locationNameParts.join(" ").trim();

    return {
        ...baseData,
        type: ClientEventType.Entered,
        locationId: lastGeneratedId,
        locationName,
    };
}