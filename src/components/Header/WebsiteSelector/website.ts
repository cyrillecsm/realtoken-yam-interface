import { FC } from "react";
import { LogoSvg } from "../../../assets/Logo";

export enum Websites{
    REALT,
    COMMUNITY_DASHBOARD,
    VOTE,
    YAM,
    BRIDGE,

    EXAMPLE
}

export interface Website{
    id: Websites;
    name: string,
    url: string;
    comingSoon: boolean;
    logo: FC<any> |undefined;
}

export const availableWebsites: Map<Websites,Website> = new Map([
    [Websites.EXAMPLE, {
        id: Websites.REALT,
        name: "RealT-commons example",
        comingSoon: false,
        url: "https://localhost:3000",
        logo: LogoSvg
    }],
    [Websites.REALT, {
        id: Websites.REALT,
        name: "RealT website",
        comingSoon: false,
        url: "https://realt.co/",
        logo: LogoSvg
    }],
    [Websites.COMMUNITY_DASHBOARD, {
        id: Websites.COMMUNITY_DASHBOARD,
        name: "Community Dashboard",
        comingSoon: false,
        url: "https://dashboard.realt.community/",
        logo: LogoSvg
    }],
    [Websites.VOTE, {
        id: Websites.VOTE,
        name: "RealT vote dashboard",
        comingSoon: false,
        url: "https://vote.realtoken.network",
        logo: LogoSvg
    }],
    [Websites.YAM, {
        id: Websites.YAM,
        name: "RealT YAM",
        comingSoon: false,
        url: "https://yam.realtoken.network/",
        logo: LogoSvg
    }],
    [Websites.BRIDGE, {
        id: Websites.BRIDGE,
        name: "Bridge",
        comingSoon: true,
        url: "",
        logo: LogoSvg
    }]
]);