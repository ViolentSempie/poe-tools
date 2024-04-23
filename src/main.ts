import { PoeEventManager } from "./poe-events/poe-event-manager";
import { updateElectronApp } from 'update-electron-app';
import { app, BrowserWindow, globalShortcut, ipcMain } from "electron";
import path from "path";
import { OverlayController, OVERLAY_WINDOW_OPTS } from "electron-overlay-window";

updateElectronApp();

const toggleMouseKey = "Alt + F";

const createWindow = (overlay = true) => {
    const browserWindow = new BrowserWindow({
        width: 800,
        height: 600,
        ...(overlay ? {} : { backgroundColor: "black" }),
        webPreferences: {
            backgroundThrottling: false,
            webSecurity: false,
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true
        },
        ...(overlay ? OVERLAY_WINDOW_OPTS : {}),
    });

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

    new PoeEventManager(browserWindow);

    if (!overlay) {
        return browserWindow;
    }

    // todo: figure out how to change from overlay to window

    makeInteractive();

    OverlayController.attachByTitle(
        browserWindow,
        "Path of Exile",
        { hasTitleBarOnMac: true }
    );

    return browserWindow;
};


app.on("ready", async () => {
    await new Promise((resolve) => setTimeout(resolve, process.platform === "linux" ? 1000 : 0));

    let isOverlay = true;
    let browserWindow = createWindow(isOverlay);

    // ipcMain.on("poe-switch-overlay-status", (event, [overlay]: [boolean]) => {
    //     console.log(event, overlay);
    //     if (overlay === isOverlay) {
    //         return;
    //     }

    //     isOverlay = !isOverlay;

    //     browserWindow.close();
    //     browserWindow = createWindow(isOverlay);
    // });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});