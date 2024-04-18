import * as React from 'react';
import { createRoot } from 'react-dom/client';
import RootLayout from './layout';
import { Buffer } from "buffer";

declare global {
    interface Window {
        electron: {
            on: (channel: string, callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
            send: (channel: string, ...args: any[]) => void;
            removeAllListeners: (channel: string) => void;
            deflate: (buffer: Buffer) => Buffer;
            inflate: (buffer: Buffer) => Buffer;
        };
    }
}

window.Buffer = Buffer;

const root = createRoot(document.getElementById("root")!);
root.render(<RootLayout />);