import React, { useRef, useState } from 'react';
import Menu from '../../components/Menu/Menu'
import { Checkbox, Button, FormGroup, FormControlLabel } from '@mui/material';

import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
import { CiFilter } from "react-icons/ci";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";


import Card from "../../components/Card/Card";

import "./Marketplace.scss"

const Marketplace = () => {

    const [filters, setFilters] = useState([
        "Memes",
        "DeFi",
        "Investing",
        "DAO",
        "Ecosystem",
        "Computational",
        "Other",
    ]);
    const [showFilters, setShowFilters] = useState(false);

    const [cards] = useState([
        {
            title: "Decentramized",
            category: "Memes",
            verified: true,
            creator: "Samuel John",
            description: "Suggests decentralized and intelligent operations. Which is used in Blockchain Transactions",
            status: [
                { number: 3452, text: "Interactions" },
                { number: 24, text: "Available Functions" }
            ],
            buttons: [
                { text: "Run Agent", onClick: () => console.log("Publish Now"), variant: "filled" }
            ]
        },
        {
            title: "Agent Bit",
            category: "DeFi",
            verified: true,
            creator: "Satoshi Nakamoto",
            description: "Suggests decentralized and intelligent operations. Which is used in Blockchain Transactions",
            status: [
                { number: "21 million", text: "Interactions" },
                { number: 24, text: "Available Functions" }
            ],
            buttons: [
                { text: "Publish Now", onClick: () => console.log("Publish Now"), variant: "outlined" }
            ]
        },
        {
            title: "Decentramized",
            category: "Memes",
            verified: true,
            creator: "Samuel John",
            description: "Suggests decentralized and intelligent operations. Which is used in Blockchain Transactions",
            status: [
                { number: 3452, text: "Interactions" },
                { number: 24, text: "Available Functions" }
            ],
            buttons: [
                { text: "Run Agent", onClick: () => console.log("Publish Now"), variant: "filled" }
            ]
        },
        {
            title: "Decentramized",
            category: "Memes",
            verified: true,
            creator: "Samuel John",
            description: "Suggests decentralized and intelligent operations. Which is used in Blockchain Transactions",
            status: [
                { number: 3452, text: "Interactions" },
                { number: 24, text: "Available Functions" }
            ],
            buttons: [
                { text: "Run Agent", onClick: () => console.log("Publish Now"), variant: "filled" }
            ]
        },
        {
            title: "Decentramized",
            category: "Memes",
            verified: true,
            creator: "Samuel John",
            description: "Suggests decentralized and intelligent operations. Which is used in Blockchain Transactions",
            status: [
                { number: 3452, text: "Interactions" },
                { number: 24, text: "Available Functions" }
            ],
            buttons: [
                { text: "Run Agent", onClick: () => console.log("Publish Now"), variant: "filled" }
            ]
        },
        {
            title: "Decentramized",
            category: "Memes",
            verified: true,
            creator: "Samuel John",
            description: "Suggests decentralized and intelligent operations. Which is used in Blockchain Transactions",
            status: [
                { number: 3452, text: "Interactions" },
                { number: 24, text: "Available Functions" }
            ],
            buttons: [
                { text: "Run Agent", onClick: () => console.log("Publish Now"), variant: "filled" }
            ]
        },
        {
            title: "Decentramized",
            category: "Memes",
            verified: true,
            creator: "Samuel John",
            description: "Suggests decentralized and intelligent operations. Which is used in Blockchain Transactions",
            status: [
                { number: 3452, text: "Interactions" },
                { number: 24, text: "Available Functions" }
            ],
            buttons: [
                { text: "Run Agent", onClick: () => console.log("Publish Now"), variant: "filled" }
            ]
        },
        {
            title: "Decentramized",
            category: "Memes",
            verified: true,
            creator: "Samuel John",
            description: "Suggests decentralized and intelligent operations. Which is used in Blockchain Transactions",
            status: [
                { number: 3452, text: "Interactions" },
                { number: 24, text: "Available Functions" }
            ],
            buttons: [
                { text: "Run Agent", onClick: () => console.log("Publish Now"), variant: "filled" }
            ]
        },
        {
            title: "Agent Bit",
            category: "DeFi",
            verified: true,
            creator: "Satoshi Nakamoto",
            description: "Suggests decentralized and intelligent operations. Which is used in Blockchain Transactions",
            status: [
                { number: "21 million", text: "Interactions" },
                { number: 24, text: "Available Functions" }
            ],
            buttons: [
                { text: "Publish Now", onClick: () => console.log("Publish Now"), variant: "outlined" }
            ]
        },
        {
            title: "Decentramized",
            category: "Memes",
            verified: true,
            creator: "Samuel John",
            description: "Suggests decentralized and intelligent operations. Which is used in Blockchain Transactions",
            status: [
                { number: 3452, text: "Interactions" },
                { number: 24, text: "Available Functions" }
            ],
            buttons: [
                { text: "Run Agent", onClick: () => console.log("Publish Now"), variant: "filled" }
            ]
        },
        {
            title: "Agent Bit",
            category: "DeFi",
            verified: true,
            creator: "Satoshi Nakamoto",
            description: "Suggests decentralized and intelligent operations. Which is used in Blockchain Transactions",
            status: [
                { number: "21 million", text: "Interactions" },
                { number: 24, text: "Available Functions" }
            ],
            buttons: [
                { text: "Publish Now", onClick: () => console.log("Publish Now"), variant: "outlined" }
            ]
        },
        {
            title: "Decentramized",
            category: "Memes",
            verified: true,
            creator: "Samuel John",
            description: "Suggests decentralized and intelligent operations. Which is used in Blockchain Transactions",
            status: [
                { number: 3452, text: "Interactions" },
                { number: 24, text: "Available Functions" }
            ],
            buttons: [
                { text: "Run Agent", onClick: () => console.log("Publish Now"), variant: "filled" }
            ]
        },
        {
            title: "Agent Bit",
            category: "DeFi",
            verified: true,
            creator: "Satoshi Nakamoto",
            description: "Suggests decentralized and intelligent operations. Which is used in Blockchain Transactions",
            status: [
                { number: "21 million", text: "Interactions" },
                { number: 24, text: "Available Functions" }
            ],
            buttons: [
                { text: "Publish Now", onClick: () => console.log("Publish Now"), variant: "outlined" }
            ]
        },
    ])

    const pageInput = useRef();
    const [itemsPerPage, setItemsPerPage] = useState(6);
    const [startIndex, setStartIndex] = useState(0);
    const [stopIndex, setStopIndex] = useState(itemsPerPage);

    const goToPage = (index) => {
        index++

        if (index == 1) {
            setStartIndex(0)
            setStopIndex(itemsPerPage)
        }
        else {
            setStartIndex( (index - 1)*itemsPerPage )  
            setStopIndex(index * itemsPerPage);
        }
    };

    const handlePageInputChange = () => {
        if ( pageInput.current.value > 0 && pageInput.current.value <= Math.ceil(filters.length / itemsPerPage)  ) {
            setStartIndex( (pageInput.current.value - 1)*itemsPerPage );
            setStopIndex( (pageInput.current.value)*itemsPerPage );
        }
    };

    return (
        <div className='Marketplace'>
            <Menu />

            <div className='marketplaceContent'>
                <div className='header'>
                    <h1>Agent Marketplace</h1>
                    <Button className='pc-menu-connect-btn' variant="outlined" endIcon={<ControlPointRoundedIcon />}>
                        Create new Agent
                    </Button>
                </div>

                <div className="inputContainer">
                    <input type="text" placeholder='Search any agent or keyword' />
                    <Button 
                        variant='outlined' 
                        startIcon={ <CiFilter/> }
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        Filter by
                    </Button>
                </div>
                <FormGroup className={`inputFilters ${(showFilters) ? 'show' : ''}`}>
                    {
                        filters.map((filter, index) => (
                            <FormControlLabel 
                                className='filter' 
                                control={
                                    <Checkbox 
                                        sx={{
                                        color: 'white',
                                        '&.Mui-checked': {
                                          color: '#ABBDFE',
                                        },
                                      }} 
                                    />
                                } 
                                label={filter} />
                        ))
                    }
                </FormGroup>

                <div className="agentsGridContainer">
                    <div className="agentsGrid">
                        {
                            cards.slice(startIndex, stopIndex).map((card, index) => {
                                return (
                                    <Card
                                        key={index}
                                        title={card.title}
                                        category={card.category}
                                        verified={card.verified}
                                        creator={card.creator}
                                        description={card.description}
                                        stats={card.status}
                                        buttons={card.buttons}
                                    />
                                )
                            })
                        }
                    </div>
                </div>

            </div>

          

            <div className="bottomPagination">
                <div className="pagination">
                    {
                        // length is less than 8 pages. only show 8 buttons (or less)
                        (Math.ceil(cards.length / itemsPerPage) < 8) ? (
                            new Array(Math.ceil(cards.length / itemsPerPage)).fill(0).map((val, index) => <button key={index} className={(((startIndex / itemsPerPage)) == index) ? "active" : ""} onClick={() => goToPage(index)}>{index + 1}</button>)
                        ) : (
                            // length is more than 8. show 8 buttons and add ... in the middle and < > buttons
                            <>
                                <button className='leftArrow' disabled={(startIndex === 0)} onClick={() => {
                                    if (startIndex !== 0) {
                                        setStopIndex((stopIndex) => stopIndex - itemsPerPage);
                                        setStartIndex((startIndex) => startIndex - itemsPerPage);
                                    }

                                }} ><FaChevronLeft size={"20px"}  /></button>
                                {
                                    new Array(8).fill(0).map((val, index) => <button key={index} className={(((startIndex / itemsPerPage)) == index) ? "active" : ""} onClick={() => goToPage(index)}>{index + 1}</button>)
                                }
                                
                                
                                <button className='rightArrow' disabled={(stopIndex === (Math.ceil(cards.length / itemsPerPage) * itemsPerPage))} onClick={() => {
                                    if (stopIndex !== (Math.ceil(cards.length / itemsPerPage) * itemsPerPage)) {
                                        setStopIndex((stopIndex) => stopIndex + itemsPerPage);
                                        setStartIndex((startIndex) => startIndex + itemsPerPage);
                                    }

                                }}  ><FaChevronRight  size={"20px"} /> </button>
                            </>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default Marketplace;