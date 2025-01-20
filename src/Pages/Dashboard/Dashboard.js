import React, { useRef, useState, useEffect } from 'react';
import Menu from '../../components/Menu/Menu'
import { Checkbox, Button, FormGroup, FormControlLabel } from '@mui/material';

import ControlPointRoundedIcon from '@mui/icons-material/ControlPointRounded';
import { CiFilter } from "react-icons/ci";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";


import Card from "../../components/Card/Card.tsx";
import dashboardCards from "../../data/dashboardCards.js";

import "./Dashboard.scss"

const Dashboard = () => {

    const [filters, setFilters] = useState([
        "Memes",
        "DeFi",
        "Investing",
        "DAO",
        "Ecosystem",
        "Computational",
        "Other",
    ]);
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [showFilters, setShowFilters] = useState(false);

    const [cards, setCards] = useState([]);
    const [filteredCards, setFilteredCards] = useState(cards);

    useEffect(() => {
        // we will be doing an API call here to get the cards.
        setCards(dashboardCards);
        setFilteredCards(dashboardCards);
    }, []);

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

    const search = (searchText) => {
        let filteredCards = cards.filter((card) => card.title.toLowerCase().includes(searchText.toLowerCase()));
        setFilteredCards(filteredCards);
    }

    const filter = () => {
        setFilteredCards(filteredCards);
    }

    // useEffect(() => {
    //     filter();
    // }, [selectedFilters])

    return (
        <div className='Dashboard'>
            <Menu />

            <div className='DashboardContent'>
                <div className='header'>
                    <h1>Agent Dashboard</h1>
                    <Button className='pc-menu-connect-btn' variant="filled" endIcon={<ControlPointRoundedIcon />}>
                        Create new Agent
                    </Button>
                </div>

                <div className="inputContainer">
                    <input type="text" placeholder='Search any agent or keyword' onChange={(e) => search(e.target.value)} />
                    <Button 
                        variant='filled' 
                        startIcon={ <CiFilter/> }
                        onClick={() => setShowFilters(!showFilters)}
                    >
                        <span className="text">Filter by</span>
                    </Button>
                </div>
                <FormGroup className={`inputFilters ${(showFilters) ? 'show' : ''}`}>
                    {
                        filters.map((filter, index) => (
                            <FormControlLabel 
                                onChange={() => {
                                    console.log("changed checkbox")
                                    if (selectedFilters.includes(filter)) {
                                        console.log(`Show ${filter}`)
                                        setSelectedFilters(selectedFilters.filter((item) => item !== filter));
                                    } else {
                                        console.log(`Hide ${filter}`)
                                        setSelectedFilters([...selectedFilters, filter]);
                                    }
                                }}
                                className='filter' 
                                control={
                                    <Checkbox 
                                        onChange={() => {
                                            console.log("changed checkbox")
                                            if (selectedFilters.includes(filter)) {
                                                console.log(`Show ${filter}`)
                                                setSelectedFilters(selectedFilters.filter((item) => item !== filter));
                                            } else {
                                                console.log(`Hide ${filter}`)
                                                setSelectedFilters([...selectedFilters, filter]);
                                            }
                                        }}
                                        sx={{
                                        color: 'white',
                                        '&.Mui-checked': {
                                          color: '#ABBDFE',
                                        },
                                      }} 
                                      inputProps={{
                                        'aria-label': 'primary checkbox',
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
                            filteredCards.slice(startIndex, stopIndex).map((card, index) => {
                                return (
                                    <Card
                                        key={index}
                                        {...card}
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

export default Dashboard;