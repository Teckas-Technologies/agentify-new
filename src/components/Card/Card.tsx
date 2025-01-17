import React from "react";
import { Image } from 'mui-image'
import { Button } from "@mui/material";

import "./Card.scss";

import { FiUser, FiEdit } from "react-icons/fi"
import { FaCircle } from "react-icons/fa6";

import VerifiedBadge from '../VerifiedBadge/VerifiedBadge.tsx';
import { CardProps, MarketplaceCardBadge, DashboardCardBadge } from "../../types/types.ts";

import decentramizedLogo from "../../assets/cardLogos/decentramind.svg";

export default function Card(props: CardProps) {

    const isMarketplaceCard = (props: CardProps): props is MarketplaceCardBadge => {
        return (props as MarketplaceCardBadge).category !== undefined;
    };

    const isDashboardCard = (props: CardProps): props is DashboardCardBadge => {
        return (props as DashboardCardBadge).published !== undefined;
    };

    return (
        <div className="Card" {...props}>
            <div className="headRow">
                <span className="agentName">
                    <Image src={props.logo || decentramizedLogo} width={20} />
                    {props.title || "Title not given"}
                </span>

                <span className="info">
                    {isMarketplaceCard(props) && (
                        <span className="category">
                            {props.category || "Blank"}
                        </span>
                    )}
                    
                    {
                        (isMarketplaceCard(props) && props.verified) && (
                            <VerifiedBadge color={"green"} />
                        )
                    }
                    {
                        (isDashboardCard(props) && props.published !== undefined) && (
                            <VerifiedBadge text={(props.published) ? "Published" : "Private"} color={ (props.published) ? "green" : "red" } />
                        )
                    }
                </span>
            </div>
            {
                (props.creator) && (
                    <div className="creator">
                        <FiUser />
                        {props.creator || "Sabari"}
                    </div>
                )
            }
            
            <div className="descriptionAndEditContainer">
                <span className="description">
                    {
                        props.description || "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, quis?"
                    }
                </span>
                {
                    (isDashboardCard(props) && props.showEditButton) && (
                        <span className="editButtonContainer">
                            <button>
                                <FiEdit size={"15px"} />
                            </button>
                        </span>
                    )
                }
            </div>
            
            {
                (isMarketplaceCard(props) && props.stats) && ( 
                    <div className="stats">
                        {
                            props.stats?.map((stat, index: number) => {
                                return (
                                    <span className="stat" key={index}>
                                        <span className="number">{stat.number}</span> {stat.text}
                                    </span>
                                )
                            })
                        }
                    </div>
                )
            }

            {
                ( props.buttons) && (
                    <div className="buttons">
                        {
                            (props.buttons || []).map((button, index: number) => {
                                return (
                                    <Button className={button.variant || "filled"} onClick={button.onClick} key={index}>
                                        {button.text}
                                    </Button>
                                )
                            })
                        }
                    </div>
                )
            }
           
        </div>
        
    )
}