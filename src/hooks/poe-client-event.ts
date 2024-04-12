import { useEffect, useState } from "react";
// const { ipcRenderer } = window.require("electron");

export function usePoeClientEvents() {
    const [lastEvent, setLastEvent] = useState("");

    // useEffect(() => {
    //     ipcRenderer.on("poe-client-event", (event, data) => {
    //         setLastEvent(data);
    //     });

    //     return () => {
    //         ipcRenderer.removeAllListeners("poe-client-event");
    //     };
    // }, []);

    return lastEvent;
}