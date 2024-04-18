import { contextBridge, ipcRenderer } from "electron";
import zlib from 'node:zlib';

contextBridge.exposeInMainWorld("electron", {
    on: (channel: string, callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => {
        ipcRenderer.on(channel, callback);
    },
    send: (channel: string, ...args: any[]) => {
        ipcRenderer.send(channel, args);
    },
    removeAllListeners: (channel: string) => {
        ipcRenderer.removeAllListeners(channel);
    },
    deflate: (buffer: Buffer) => {
        return zlib.deflateSync(buffer);
    },
    inflate: (buffer: Buffer) => {
        return zlib.inflateSync(buffer);
    }
});