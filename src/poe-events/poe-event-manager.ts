import { Tail } from "tail";
import { getGamePath } from "steam-game-path";

// steam id 238960

export class PoeEventManager {
    tail: Tail | null = null;

    constructor() {
        const gamePath = getGamePath(238960);
        const logFilePath = gamePath?.game?.path + "/logs/Client.txt";
        this.tail = new Tail(logFilePath);
        this.tail.on("line", (line: string) => this.on(line));
        this.tail.on("error", (error: Error) => this.error(error));
    }

    destroy() {
        this.tail?.unwatch();
    }

    on(line: string) {
        console.log(line);
    }

    error(error: Error) {
        console.error(error);
    }
}
