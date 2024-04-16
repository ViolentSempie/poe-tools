import { getGamePath } from "steam-game-path";
import { Language, LogOptions, PathOfExileLog } from "poe-log-events";
import { AreaEnteredEvent } from "poe-log-events/dist/events/AreaEnteredEvent";

// steam id 238960

export class PoeEventManager {
    private _poeLog: PathOfExileLog;
    private _mainWindow: Electron.CrossProcessExports.BrowserWindow;

    constructor(mainWindow: Electron.CrossProcessExports.BrowserWindow) {
        const gamePath = getGamePath(238960);
        const logFilePath = gamePath?.game?.path + "/logs/Client.txt";

        const logOptions: LogOptions = {
            logFilePath,
            ignoreDebug: true,
            language: Language.English,
        };

        this._poeLog = new PathOfExileLog(logOptions);
        this._mainWindow = mainWindow;

        this._poeLog.on("areaEntered", this.onAreaChanged.bind(this));
        this._poeLog.on("error", this.error.bind(this));
    }

    onAreaChanged(event: AreaEnteredEvent) {
        this._mainWindow.webContents.send("poe-client-area-entered", event);
    }

    error(error: unknown) {
        console.error(error);
    }
}
