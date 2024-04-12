import dynamic from "next/dynamic";

export default dynamic(() => import("@/layout"), {
    ssr: false,
});
