import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Menu from '../../components/Menu/Menu'
import FullscreenOverlay from '../../components/FullscreenOverlay/FullscreenOverlay';
import PopupModal from '../../components/PopupModal/PopupModal';

import { Button, TextField } from '@mui/material';
import { FiUpload } from "react-icons/fi";

import dashboardCards from "../../data/dashboardCards.js";
import "./EditAgent.scss"
import useAgentHooks from '../../Hooks/useAgentHooks.js';

const EditAgent = () => {

    const [showPopup, setShowPopup] = useState(false);
    const [agentID, setAgentID] = useState("");
    const [agentDetails, setAgentDetails] = useState({});
    const [formData, setFormData] = useState({
        abi: "",
        smartContractAddress: "",
        agentName: "",
        agentPurpose: "",
        agentInstructions: "",
        tags: []
    });
    const {fetchAgentById,updateAgent,loading,error} = useAgentHooks();

    const useQuery = () => {
        return new URLSearchParams(useLocation().search);
    };

    const query = useQuery();
    const navigate = useNavigate();

    useEffect(() => {
        const id = query.get('agentID');
        console.log(`Agent ID: ${id}`);
        setAgentID(id);
        const fetchAgentDetailsById = async()=>{
            const response = await fetchAgentById(id);
            setAgentDetails(response);
            setFormData({
                abi: response.abi || "",
                smartContractAddress: response.smartContractAddress || "",
                agentName: response.agentName || "",
                agentPurpose: response.agentPurpose || "",
                agentInstructions: response.agentInstructions || "",
                tags: response.tags?.join(", ") || "" 
            });
        }
        fetchAgentDetailsById();
    }, [])

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = async () => {
        try {
            await updateAgent(agentID, { ...formData, tags: formData.tags.split(", ") });
        } catch (error) {
            console.error("Error updating agent:", error);
        }
    };

    return (
        <div className='EditAgent'>
            <Menu />
            
            <FullscreenOverlay show={showPopup} close={() => setShowPopup(false)}>
                <PopupModal
                    title={"Agentify"}
                    message={`Your Agent (${ agentDetails?.agentName }) has been created successfully`}
                    buttons={[
                        { text: "Home", variant: "outlined", onClick: () => navigate("/dashboard") },
                        { text: "Test Agent", variant: "filled", onClick: () => console.log(`Testing Agent ${agentDetails.agentName}...`) },
                    ]}
                />
            </FullscreenOverlay>

            <form className="EditAgentContent"  onSubmit={(e) => {
    e.preventDefault(); 
    handleSave(); 
  }}>
                
                <div className="EditAgentSection">
                    <h2>Edit Agent</h2>
                    <h4>Upload your ABIs and create agents with help of AI</h4>
                    
                    <div className="abi">
                        <TextField
                            className="abiInput"
                            placeholder='Enter your ABI here'
                            multiline
                            rows={6}
                            variant="filled"
                            value={formData.abi}
                            onChange={handleChange}
                            slotProps={{
                                input: {
                                    disableUnderline: true,
                                },
                            }}
                        />
                        <div className="uploadABIBox">
                            <Button 
                                className="uploadABI" 
                                endIcon={<FiUpload size={"14px"} />}
                                component="label"
                            >
                                <span>or Upload ABI</span>
                                <input
                                    type="file"
                                    hidden
                                />
                            </Button>
                            {/* <input type="file" id="file" name="file"></input> */}
                        </div>
                    </div>

                    <div className="contract">
                        <h2>Enter Contract Details</h2>

                        <label htmlFor="contractAddress">Smart Contract Address</label>
                        <input
                            id="contractAddress"
                            placeholder='Ex. 0x1234abcd5678efgh9012ijkl3456mnop7890qrst'
                            value={formData.smartContractAddress} onChange={handleChange}
                        />
                        <span className="info">
                            Ensure the address corresponds to the uploaded ABI file.
                        </span>

                        <label htmlFor="agentName">Agent Name</label>
                        <input
                            id="agentName"  
                            defaultValue={agentDetails?.agentName}
                            placeholder='Ex. Customer Support Chatbot'
                            value={formData.agentName} onChange={handleChange}
                        />
                    </div>
                    
                </div>

                <div className="agentPurposeSection">
                    <h2>Agent Purpose</h2>
                    <TextField
                        id="agentPurpose"
                        placeholder="Write your description"
                        defaultValue={agentDetails?.agentPurpose}
                        multiline
                        rows={6}
                        variant="filled"
                        value={formData.agentPurpose}
                        onChange={handleChange}
                        slotProps={{
                            input: {
                                disableUnderline: true,
                            },
                        }}
                    />

                    <h2 style={{marginTop: "5px"}}>Instructions</h2>
                        <TextField
                            id="agentInstructions"
                            placeholder="Write your instructions for functions which is listed in the ABI..."
                            multiline
                            rows={6}
                            variant="filled"
                            value={formData.agentInstructions}
                            onChange={handleChange}
                            slotProps={{
                                input: {
                                disableUnderline: true,
                            },
                        }}
                    />
                    
                    <div className="EditAgentSection" style={{padding: 0}}>
                        <div className="contract" style={{marginTop: 0}}>
                            <label htmlFor="agentName" style={{marginTop: "20px"}}>Tags</label>
                            <input
                                id='tags'
                                placeholder='Ex. DeFi, Memes, DAO, etc..'
                                value={formData.tags} onChange={handleChange} 
                            />
                        </div>
                    </div>

                    <div className="buttons">
                        <Button className='outlined'>
                            Discard
                        </Button>
                        <Button
                            className='filled' 
                            type='submit'
                            onClick={() => {
                                setShowPopup(!showPopup)
                            }}
                            >
                             {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>

                </div>
            </form>

            <div className="editAgentControls">
                <Button className='outlined'>
                    Test in Playground
                </Button>
                <Button
                    className='filled' 
                    onClick={handleSave}
                >
                    Publish to Marketplace
                </Button>
            </div>
        </div>
    );
}

export default EditAgent;