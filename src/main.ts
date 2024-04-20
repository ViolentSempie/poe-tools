import { PoeEventManager } from "./poe-events/poe-event-manager";

/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserWindow, globalShortcut } = require("electron");
const path = require("path");
const { OverlayController, OVERLAY_WINDOW_OPTS } = require("electron-overlay-window");

const toggleMouseKey = "Alt + F";

const createOverlay = () => {
    const browserWindow = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            webSecurity: false,
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true
        },
        ...OVERLAY_WINDOW_OPTS,
    });
    browserWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    browserWindow.setAlwaysOnTop(true, 'screen-saver', 1);

    function makeInteractive() {
        let isInteractive = false;

        function toggleOverlayState() {
            isInteractive = !isInteractive;

            if (!isInteractive) {
                OverlayController.focusTarget();
            } else {
                OverlayController.activateOverlay();
            }

            browserWindow.webContents.send("focus-change", isInteractive);
        }

        browserWindow.on("blur", () => {
            isInteractive = false;
            browserWindow.webContents.send("focus-change", false);
        });

        globalShortcut.register(toggleMouseKey, toggleOverlayState);
    }

    // If the app is build, we serve the build version
    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        browserWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);

        // Open the DevTools.
        browserWindow.webContents.openDevTools({ mode: "detach", activate: false });
    } else {
        browserWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
    }

    makeInteractive();

    OverlayController.attachByTitle(
        browserWindow,
        "Path of Exile",
        { hasTitleBarOnMac: true }
    );

    new PoeEventManager(browserWindow);
};


app.on("ready", () => {
    setTimeout(
        createOverlay,
        process.platform === "linux" ? 1000 : 0 // https://github.com/electron/electron/issues/16809
    );
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});