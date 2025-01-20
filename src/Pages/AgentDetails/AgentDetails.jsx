import React, { useEffect, useState } from 'react';
import Menu from '../../components/Menu/Menu'
import { useLocation, useNavigate } from 'react-router-dom';

import { Button, TextField } from '@mui/material';
import { FiUpload, FiCopy } from "react-icons/fi";

import dashboardCards from "../../data/dashboardCards.js";
import "./AgentDetails.scss"

const AgentDetails = () => {

    const [showPopup, setShowPopup] = useState(false);

    const [agentID, setAgentID] = useState("");
    const [agentDetails, setAgentDetails] = useState({});

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };

    const query = useQuery();
    const navigate = useNavigate();

    useEffect(() => {
        const id = query.get('agentID');
        console.log(`Agent ID: ${id}`);
        setAgentID(id);
        setAgentDetails(
            dashboardCards.find((card) => card.id === id)
        );
        console.log(`Agent Details: ${JSON.stringify(dashboardCards.find((card) => card.id === id))}`);
    }, [])

    return (
        <div className='AgentDetails'>
            <Menu />

            <form className="AgentDetailsContent" onSubmit={() => {}}>
                
                <div className="AgentDetailsSection">
                    <h3>Agent Details</h3>
                    
                    <div className="basicDetails">
                            <table>
                                <tr>
                                    <td className='key'>Agent Name</td>
                                    <td className="value">{agentDetails?.title}</td>
                                </tr>
                                <tr>
                                    <td className='key'>Agent Description</td>
                                    <td className="value">{agentDetails?.description?.slice(0, 60) + "..."}</td>
                                </tr>
                                <tr>
                                    <td className='key'>Contact Address</td>
                                    <td className="value">
                                        0x1234abcd5678efgh9012ijkl3456mnop7890qrst
                                        <FiCopy />
                                    </td>
                                </tr>
                                <tr>
                                    <td className='key'>Last Modified</td>
                                    <td className="value">27 December 2024, 21:34:12</td>
                                </tr>
                        </table>
                    </div>

                    <div className="availableFunctionsDetails">
                        <div className="title">Available Functions</div>
                        <div className="functionsBox">
                            {
                                `getBalance() → Read Function

                                transfer(address to, uint256 value) → Write Function 
                                
                                owner() → Read Function
                                `
                            }
                            
                        </div>
                    </div>
                    
                    <div className="statDetails">
                        <div className="field">
                            <span className="number">3452</span>
                            <span className="text">Interactions</span>
                        </div>
                        <div className="field">
                            <span className="number">90%</span>
                            <span className="text">Response Rate</span>
                        </div>
                        <div className="field">
                            <span className="number">4.8 / 5</span>
                            <span className="text">Customer Feedback Score</span>
                        </div>
                    </div>

                    <div className="buttons">
                        <Button className='filled'>
                            Test in Playground
                        </Button>
                        <Button
                            className='outlined' 
                            onClick={() => {
                                setShowPopup(!showPopup)
                            }}
                        >
                            Get Code
                        </Button>
                    </div>
                    
                </div>

                <div className="agentPurposeSection">
                    <h3>Agent Creation Details</h3>
                    
                    <div className="creationDetails">
                        <table>
                            <tr>
                                <td className='key'>Creator Name</td>
                                <td className="value">Genelia D'Souza</td>
                            </tr>
                            <tr>
                                <td className='key'>Creation Date</td>
                                <td className="value">25 December 2024, 15:04:32</td>
                            </tr>
                            <tr>
                                <td className='key'>Creator Wallet Address</td>
                                <td className="value">
                                    0x1234abcd5678efgh9012ijkl3456mnop7890qrst
                                    <FiCopy />
                                </td>
                            </tr>
                            <tr>
                                <td className='key'>Last Modified</td>
                                <td className="value">27 December 2024, 21:34:12</td>
                            </tr>
                        </table>
                    </div>

                </div>

            </form>
        </div>
    );
}

export default AgentDetails;