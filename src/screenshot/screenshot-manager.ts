import { spawn } from "child_process";
import { Rectangle } from "electron";
import cv, { Mat, Rect } from "opencv-ts";
import { env } from "process";
import Jimp from "jimp";

const { OverlayController } = require("electron-overlay-window");
const screenshot = require("screenshot-desktop");

interface ScreenshotParams {
    format: "png" | "jpg";
    linuxLibrary: "scrot" | "imagemagick";
}

const ACTIVE_TIME = 50;
const PASSIVE_TIME = 500;

export enum ScreenshotMode{
    Passive,
    Active,
}

export interface Screenshot {
    buffer: Buffer;
    bounds: Rectangle;
}

export class ScreenshotManager
{
    private _timeout: NodeJS.Timeout | null;
    private _mode: ScreenshotMode;
    private _stopped: boolean;
    private _takingScreenshot: boolean;
    private _inPassiveTree: boolean;

    get timeBetweenShots() {
        return this._mode === ScreenshotMode.Passive ? PASSIVE_TIME : ACTIVE_TIME;
    }

    public constructor()
    {
        this._timeout = null;
        this._mode = ScreenshotMode.Passive;
        this._stopped = true;
        this._takingScreenshot = false;
        this._inPassiveTree = false;
    }

    public setMode(mode: ScreenshotMode)
    {
        this._mode = mode;

        if (!this._timeout || this._stopped) {
            return;
        }

        this.start();
    }

    public start()
    {
        if (this._takingScreenshot) {
            return;
        }

        if (this._timeout) {
            this.stop();
        }

        this._timeout = setTimeout(() => this.requestScreenshot(), this.timeBetweenShots);
        this._stopped = false;
    }

    public stop()
    {
        if (!this._timeout) {
            return;
        }

        clearTimeout(this._timeout);
        this._timeout = null;
        this._stopped = true;
    }

    async requestScreenshot()
    {
        this._takingScreenshot = true;
        this._timeout = null;

        // const isWayland = process.platform === "linux" && env.XDG_SESSION_TYPE === "wayland";

        /*
        OverlayController.screenshot() is only implemented for Windows. So we need to have some other code
        for X11, Wayland and Mac.
        */

        const img = await (screenshot as (params: Partial<ScreenshotParams>) => Buffer)({});

        const screenshotData = {
            buffer: img,
            bounds: OverlayController.targetBounds,
        };

        const mat = cv.matFromImageData((await Jimp.read(img)).bitmap as unknown as ImageData);
        const gray = new cv.Mat(mat);
        cv.cvtColor(mat, gray, cv.COLOR_BGR2GRAY);

        const grayBlurred = new cv.Mat(gray);
        cv.blur(gray, grayBlurred, new cv.Size(3, 3), new cv.Point(-1, -1), cv.BORDER_DEFAULT); 

        const blackPixels = (grayBlurred.size().width * grayBlurred.size().height) - cv.countNonZero(grayBlurred);

        if (blackPixels > 1550) {
            // probably not quite safe to conclude we are in the passive tree, but for now this is fine
            this._inPassiveTree = true;

            console.log("entering passive tree");
        } else if (this._inPassiveTree) {
            // same as the other case
            this._inPassiveTree = false;

            console.log("exiting passive tree");
        }

        console.log(blackPixels);

        // const circles = new cv.Mat();

        // cv.HoughCircles(grayBlurred, circles,
        //     cv.HOUGH_GRADIENT, 1, 45, 75, 40);//, 1, 40);

        // console.log(mat.rows, mat.cols);

        // // const mat = new cv.Mat(screenshot.bounds.height, screenshot.bounds.width, cv.CV_32F);
        // // mat.data = screenshot.buffer;

        this._takingScreenshot = false;

        if (this._stopped) {
            return;
        }

        this.start();
    }

    // async waylandScreenshot(bounds: Rectangle)
    // {
    //     switch (env.DESKTOP_SESSION) {
    //         case "plasma":
    //             const kdeBuffer = await new Promise((resolve, reject) => {
    //                 const process = spawn("spectacle", ["-b", "-c", "-n", "-e", "-S"]);

    //                 process.on("close", (code) => {
    //                     console.log(code, clipboardy.readSync());
    //                 });
    //             });
    //             break;
    //     }
    // }
}