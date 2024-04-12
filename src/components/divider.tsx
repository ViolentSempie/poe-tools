import { JSX } from "react";
import { classNames } from "@/utils/classnames";
import { reduce } from "@/utils/reduce";

export enum DividerPosition {
    Left,
    Middle,
    Right,
}

export enum DividerOrientation {
    Horizontal,
    Vertical,
}

interface DividerProperties {
    label?: string | JSX.Element | null;
    className?: string;
    lineClassName?: string;
    position?: DividerPosition;
    orientation?: DividerOrientation;
}

export default function Divider({
    label,
    position = DividerPosition.Middle,
    orientation = DividerOrientation.Horizontal,
    className = "",
    lineClassName = "",
}: DividerProperties) {
    const labelPosition = reduce(position, {
        [DividerPosition.Left]: () => "justify-start ml-10",
        [DividerPosition.Middle]: () => "justify-center",
        [DividerPosition.Right]: () => "justify-end mr-10",
        _: () => "",
    });

    return (
        <div
            className={classNames(
                className,
                "relative",
                orientation === DividerOrientation.Horizontal ? "w-full" : "h-full",
            )}
        >
            <div className={classNames(lineClassName, "absolute inset-0 flex items-center")} aria-hidden="true">
                <div
                    className={classNames(
                        "bg-slate-900 border-slate-900",
                        orientation === DividerOrientation.Horizontal ? "w-full border-t" : "h-full border-l",
                    )}
                />
            </div>
            {label && (
                <div className={`relative flex ${labelPosition}`}>
                    <span className="bg-slate-900 px-3 text-lg font-medium text-gray-100">
                        {label}
                    </span>
                </div>
            )}
        </div>
    );
}