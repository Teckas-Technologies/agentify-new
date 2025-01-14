import { Image } from 'mui-image'
import { Button } from "@mui/material";

import "./Card.scss";

import { FiUser } from "react-icons/fi"
import { FaCircle } from "react-icons/fa6";

import decentramizedLogo from "../../assets/cardLogos/decentramind.svg";

export default function Card(props) {


    return (
        <div className="Card" {...props}>
            <div className="headRow">
                <span className="agentName">
                    <Image src={props.logo || decentramizedLogo} width={20} />
                    {props.title || "Title not given"}
                </span>

                <span className="info">
                    <span className="category">
                        {props.category || "Blank"}
                    </span>
                    
                    {
                        (props.verified) && (
                            <span className={`status`}>
                                <FaCircle size={"8px"} />
                                Verified
                            </span>
                        )
                    }
                </span>
            </div>
            <div className="creator">
                <FiUser />
                {props.creator || "Sabari"}
            </div>

            <div className="description">
                {
                    props.description || "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Numquam, quis?"
                }
            </div>

            <div className="stats">
                {
                    props.stats?.map((stat, index) => {
                        return (
                            <span className="stat" key={index}>
                                <span className="number">{stat.number}</span> {stat.text}
                            </span>
                        )
                    })
                }
            </div>

            <div className="buttons">
                {
                    (props.buttons || []).map((button, index) => {
                        return (
                            <Button className={button.variant || "filled"} onClick={button.onClick} key={index}>
                                {button.text}
                            </Button>
                        )
                    })
                }
                {/* <Button>
                    Run agent
                </Button> */}

            </div>
        </div>
        
    )
}