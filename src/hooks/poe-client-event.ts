import { useLevelingStore } from "@/stores/leveling";
import { useEffect, useState } from "react";

export function usePoeClientEvents() {
    const [lastEvent, setLastEvent] = useState("");
    const logFilePath = useLevelingStore.getState().logFilePath;

    useEffect(() => {
        window.electron.send("poe-client-event-start", logFilePath);
        window.electron.on("poe-client-event", (event, data) => {
            console.log(event, data);
            setLastEvent(data);
        });

        return () => {
            window.electron.removeAllListeners("poe-client-event");
        };
    }, []);

    return lastEvent;
}