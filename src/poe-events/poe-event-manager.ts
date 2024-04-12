import { Tail } from "tail";
import { getGamePath } from "steam-game-path";
import { parseEnteredEvent, parseGeneratingEvent } from "./types/entered-client-event";
import { ClientEvent, ClientEventType } from "./types/client-event";
import { ipcMain } from "electron";

// steam id 238960

const ClientEventTypes: ((baseData: ClientEvent, extra: string[]) => ClientEvent | null)[] = [
    parseGeneratingEvent,
    parseEnteredEvent,
];

export class PoeEventManager {
    private _tail: Tail | null = null;
    private _mainWindow: Electron.CrossProcessExports.BrowserWindow;

    constructor(mainWindow: Electron.CrossProcessExports.BrowserWindow) {
        const gamePath = getGamePath(238960);
        const logFilePath = gamePath?.game?.path + "/logs/Client.txt";

        this._tail = new Tail(logFilePath);
        this._tail.on("line", (line: string) => this.on(line));
        this._tail.on("error", (error: Error) => this.error(error));
        this._mainWindow = mainWindow;
    }

    destroy() {
        this._tail?.unwatch();
    }

    on(line: string) {
        // 2024/04/12 22:09:07 7530873 cff94598 [INFO Client 288] : You have entered Luxurious Hideout.
        // eslint-disable-next-line prefer-const
        let [date, time, messageId, /* we dont need this field */, messageSeverity, messageSource, sourceId, separator, ...rest] = line.split(" ");

        if (separator.trim() !== ":") {
            rest = [separator, ...rest];
            separator = ":";
        }

        messageSeverity = messageSeverity.substring(1);
        sourceId = sourceId.substring(0, sourceId.length - 1);

        const baseEvent: ClientEvent = {
            id: messageId,
            timestamp: (new Date(date + " " + time)).getTime(),
            severity: messageSeverity,
            sourceId: sourceId,
            sourceType: messageSource,
            type: ClientEventType.Unknown,
        }

        for (const eventType of ClientEventTypes) {
            const fullEvent = eventType(baseEvent, rest);

            if (fullEvent === null) {
                continue;
            }

            console.log("[debug] firing off event", fullEvent);
            this._mainWindow.webContents.send("poe-client-event", fullEvent);
        }
    }

    error(error: Error) {
        console.error(error);
    }
}
