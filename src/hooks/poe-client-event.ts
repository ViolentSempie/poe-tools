import { useLevelingStore } from "@/stores/leveling";
import { useEffect, useState } from "react";

export function usePoeClientEvents() {
    const [lastEvent, setLastEvent] = useState("");
    const logFilePath = useLevelingStore.getState().logFilePath;

    useEffect(() => {
        window.electron.send("poe-client-event-start", logFilePath);
        // electron.ipcRenderer.send("poe-client-event-start", { logFilePath });
        // ipcRenderer.send("poe-client-event-start", { logFilePath });
        // ipcRenderer.on("poe-client-event", (event, data) => {
        //     setLastEvent(data);
        // });

        return () => {
            // ipcRenderer.removeAllListeners("poe-client-event");
        };
    }, []);

    return lastEvent;
}