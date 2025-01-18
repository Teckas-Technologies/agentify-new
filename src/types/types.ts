export type BadgePropsType = {
    text?: string,
    color: "green" | "red",
}


export type MarketplaceCardBadge = {
    logo?: string,
    title: string,
    category: string,
    verified: boolean,
    creator: string,
    description: string,
    stats: any,
    buttons: any
}

export type DashboardCardBadge = {
    id: string,
    logo?: string,
    title: string,
    published: boolean,
    creator: string,
    showEditButton: boolean,
    description: string,
    buttons: any,
}

export type CardProps = MarketplaceCardBadge | DashboardCardBadge;