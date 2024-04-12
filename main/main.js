const { app, BrowserWindow, globalShortcut } = require("electron");
const serve = require("electron-serve");
const path = require("path");
const { OverlayController, OVERLAY_WINDOW_OPTS } = require("electron-overlay-window");

const appServe = app.isPackaged ? serve({
    directory: path.join(__dirname, "../out")
}) : null;

const toggleMouseKey = "CmdOrCtrl + P";
let window = null;

const createOverlay = () => {
    window = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true
        },
        ...OVERLAY_WINDOW_OPTS,
    });

    // If the app is build, we serve the build version
    if (app.isPackaged) {
        appServe(window).then(() => window.loadURL("app://-"));
    } else {
        // Load Next.JS app in development
        window.loadURL("http://localhost:3000");
        window.webContents.openDevTools({ mode: "detach", activate: false });
        window.webContents.on("did-fail-load", window.webContents.reloadIgnoringCache);
    }

    makeInteractive();

    OverlayController.attachByTitle(
        window,
        "Path of Exile",
        { hasTitleBarOnMac: true }
    );
};

function makeInteractive() {
    let isInteractive = false;

    function toggleOverlayState() {
        isInteractive = !isInteractive;

        if (!isInteractive) {
            OverlayController.focusTarget();
            ScreenshotManager.stop();
        } else {
            OverlayController.activateOverlay();
            ScreenshotManager.start();
        }

        window.webContents.send("focus-change", isInteractive);
    }

    window.on("blur", () => {
        isInteractive = false;
        window.webContents.send("focus-change", false);
    });

    globalShortcut.register(toggleMouseKey, toggleOverlayState);
}

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