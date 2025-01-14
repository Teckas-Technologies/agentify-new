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
        "Card 1",
        "Card 2",
        "Card 3",
        "Card 4",
        "Card 5",
        "Card 1",
        "Card 2",
        "Card 3",
        "Card 4",
        "Card 5",
        "Card 1",
        "Card 2",
        "Card 3",
        "Card 4",
        "Card 5",
        "Card 1",
        "Card 2",
        "Card 3",
        "Card 4",
        "Card 5",
        "Card 1",
        "Card 2",
        "Card 3",
        "Card 4",
        "Card 5",
        "Card 1",
        "Card 2",
        "Card 3",
        "Card 4",
        "Card 5",
        "Card 1",
        "Card 2",
        "Card 3",
        "Card 4",
        "Card 5",
        "Card 1",
        "Card 2",
        "Card 3",
        "Card 4",
        "Card 5",
        "Card 1",
        "Card 2",
        "Card 3",
        "Card 4",
        "Card 5",
        "Card 1",
        "Card 2",
        "Card 3",
        "Card 4",
        "Card 5",
        "Card 1",
        "Card 2",
        "Card 3",
        "Card 4",
        "Card 5",
        "Card 1",
        "Card 2",
        "Card 3",
        "Card 4",
        "Card 5",
        "Card 1",
        "Card 2",
        "Card 3",
        "Card 4",
        "Card 5",
        "Card 1",
        "Card 2",
        "Card 3",
        "Card 4",
        "Card 5",
        "Card 1",
        "Card 2",
        "Card 3",
        "Card 4",
        "Card 5",
        "Card 1",
        "Card 2",
        "Card 3",
        "Card 4",
        "Card 5",
    ])

    const pageInput = useRef();
    const [startIndex, setStartIndex] = useState(0);
    const [stopIndex, setStopIndex] = useState(10);
    const [itemsPerPage, setItemsPerPage] = useState(10);

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
                            <Card
                                title="Decentramind"
                                category="Memes"
                                verified={true}
                                creator="Samuel John"
                                description="Suggests decentralized and intelligent operations. Which is used in Blockchain Transactions"
                                stats={[
                                    { number: 3452, text: "Interactions" },
                                    { number: 24, text: "Available Functions" },
                                ]}
                                buttons={[
                                    { text: "Run agent", onClick: () => console.log("Run agent") }
                                ]}
                            />
                            <Card
                                title="Agent Bit"
                                category="DeFi"
                                verified={true}
                                creator="Satoshi Nakamoto"
                                description="Suggests decentralized and intelligent operations. Which is used in Blockchain Transactions"
                                stats={[
                                    { number: "21 million", text: "Interactions" },
                                    { number: 24, text: "Available Functions" },
                                ]}
                                buttons={[
                                    { text: "Publish Now", onClick: () => console.log("Publish Now"), variant: "outlined" },
                                ]}
                            />
                            <Card/>
                            <Card/>
                            <Card/>
                            <Card/>
                            <Card/>

                    </div>
                </div>

            </div>

          

            <div className="bottomPagination">
                <div className="pagination">
                    {
                        // length is less than 8 pages. only show 8 buttons (or less)
                        (Math.ceil(cards.length / 10) < 8) ? (
                            new Array(Math.ceil(cards.length / 10)).fill(0).map((val, index) => <button key={index} className={(((startIndex / 10)) == index) ? "active" : ""} onClick={() => goToPage(index)}>{index + 1}</button>)
                        ) : (
                            // length is more than 8. show 8 buttons and add ... in the middle and < > buttons
                            <>
                                <button className='leftArrow' disabled={(startIndex === 0)} onClick={() => {
                                    if (startIndex !== 0) {
                                        setStopIndex((stopIndex) => stopIndex - 10);
                                        setStartIndex((startIndex) => startIndex - 10);
                                    }

                                }} ><FaChevronLeft size={"20px"}  /></button>
                                {
                                    new Array(8).fill(0).map((val, index) => <button key={index} className={(((startIndex / 10)) == index) ? "active" : ""} onClick={() => goToPage(index)}>{index + 1}</button>)
                                }
                                
                                
                                <button className='rightArrow' disabled={(stopIndex === (Math.ceil(cards.length / 10) * 10))} onClick={() => {
                                    if (stopIndex !== (Math.ceil(cards.length / 10) * 10)) {
                                        setStopIndex((stopIndex) => stopIndex + 10);
                                        setStartIndex((startIndex) => startIndex + 10);
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