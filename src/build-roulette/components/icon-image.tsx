import { CSSProperties } from "react";
import { ImageCoordinate } from "../generator/passive-tree/passive-tree";

export function IconImage({ coord }: {coord: ImageCoordinate}) {
    const style: CSSProperties = {
        width: `${coord.w}px`,
        height: `${coord.h}px`,
        objectFit: "none",
        objectPosition: `-${coord.x}px -${coord.y}px`,
    };

    return <img src={coord.url} style={style}/>;
}