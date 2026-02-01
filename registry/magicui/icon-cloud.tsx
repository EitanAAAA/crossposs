
import React, { useEffect, useMemo, useState } from "react";
import { Cloud, fetchSimpleIcons, renderSimpleIcon, ICloud, SimpleIcon } from "react-icon-cloud";

export const cloudProps: Omit<ICloud, "children"> = {
    containerProps: {
        style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "100%",
            position: "relative",
        },
    },
    options: {
        reverse: true,
        depth: 1,
        wheelZoom: false,
        imageScale: 3.5,
        activeCursor: "default",
        tooltip: "native",
        initial: [0.1, -0.1],
        clickToFront: 500,
        tooltipDelay: 0,
        outlineColour: "#0000",
        maxSpeed: 0.04,
        minSpeed: 0.02,
        // dragControl: false,
    },
};

export const renderCustomIcon = (icon: SimpleIcon, theme: string) => {
    const bgHex = theme === "light" ? "#f3f2ef" : "#080510";
    const fallbackHex = theme === "light" ? "#6e6e73" : "#ffffff";
    const minContrastRatio = theme === "dark" ? 2 : 1.2;

    return renderSimpleIcon({
        icon,
        bgHex,
        fallbackHex,
        minContrastRatio,
        size: 42,
        aProps: {
            href: undefined,
            target: undefined,
            rel: undefined,
            onClick: (e: any) => e.preventDefault(),
        },
    });
};

export type DynamicCloudProps = {
    iconSlugs?: string[];
    images?: string[]; // Added to support user's image URL usage
};

type IconData = SimpleIcon;

export function IconCloud({ iconSlugs, images }: DynamicCloudProps) {
    const [data, setData] = useState<any | null>(null);
    const theme = "light"; // Default to light or detect

    useEffect(() => {
        if (iconSlugs) {
            fetchSimpleIcons({ slugs: iconSlugs }).then(setData);
        }
    }, [iconSlugs]);

    const renderedIcons = useMemo(() => {
        if (images) {
            return images.map((url, i) => (
                <a key={i} href="#" onClick={(e) => e.preventDefault()}>
                    <img src={url} alt="icon" width="42" height="42" />
                </a>
            ));
        }

        if (!data) return null;

        return Object.values(data).map((icon) => {
            if (!icon) return null;
            return renderCustomIcon(icon, theme || "light");
        }).filter(Boolean);
    }, [data, theme, images]);

    return (
        // @ts-ignore
        <Cloud {...cloudProps}>
            <>{renderedIcons}</>
        </Cloud>
    );
}
