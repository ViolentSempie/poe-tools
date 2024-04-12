import * as React from 'react';
import { createRoot } from 'react-dom/client';
import RootLayout from './layout';

declare global {
    interface Window {
        electron: {
            on: (channel: string, callback: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => void;
            send: (channel: string, ...args: any[]) => void;
            removeAllListeners: (channel: string) => void;
        }
    }
}

const root = createRoot(document.getElementById("root")!);
root.render(<RootLayout />);