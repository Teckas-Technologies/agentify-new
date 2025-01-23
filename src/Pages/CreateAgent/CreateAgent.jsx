import React, { useEffect, useRef, useState } from 'react';
import Menu from '../../components/Menu/Menu'
import FullscreenOverlay from '../../components/FullscreenOverlay/FullscreenOverlay';
import PopupModal from '../../components/PopupModal/PopupModal';

import { Button, TextField } from '@mui/material';
import { FiUpload } from "react-icons/fi";

import "./CreateAgent.scss"

const CreateAgent = () => {

    const [showPopup, setShowPopup] = useState(false);
    const [isDropdownVisible, setDropdownVisible] = useState(false);
    const [tags] = useState(["DeFi", "AI", "DAO", "Memes", "Investing", "Computational", "Ecosystem"]);
    const [selectedTags, setSelectedTags] = useState([]);
    const dropdownRef = useRef(null);

    const handleFocus = () => {
        setDropdownVisible(true);
    };

    const handleBlur = (e) => {
        // Ensure the click inside dropdown doesn't close it
        if (!dropdownRef.current?.contains(e.relatedTarget)) {
            setDropdownVisible(false);
        }
    };

    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setDropdownVisible(false);
        }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleTagClick = (tag) => {
        // Add tag if not already selected
        if (!selectedTags.includes(tag)) {
            setSelectedTags((prev) => [...prev, tag]);
        }
        setDropdownVisible(false);
    };

    const handleRemoveTag = (tag) => {
        setSelectedTags((prev) => prev.filter((t) => t !== tag));
      };

    return (
        <div className='CreateAgent'>
            <Menu />
            
            <FullscreenOverlay show={showPopup} close={() => setShowPopup(false)}>
                <PopupModal
                    title={"Agentify"}
                    message={"Your Agent (Customer Support Chatbot) has been created successfully"}
                    buttons={[
                        { text: "Home", variant: "outlined", onClick: () => console.log("Going to home") },
                        { text: "Test Agent", variant: "filled", onClick: () => console.log("Testing Agent") },
                    ]}
                />
            </FullscreenOverlay>

            <form className="createAgentContent" onSubmit={() => {}}>
                
                <div className="createAgentSection">
                    <h2>Create New Agent</h2>
                    <h4>Upload your ABIs and create agents with help of AI</h4>
                    
                    <div className="abi">
                        <TextField
                            className="abiInput"
                            placeholder='Enter your ABI here'
                            multiline
                            rows={6}
                            variant="filled"
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
                        />
                        <span className="info">
                            Ensure the address corresponds to the uploaded ABI file.
                        </span>

                        <label htmlFor="agentName">Agent Name</label>
                        <input
                            id='agentName'
                            placeholder='Ex. Customer Support Chatbot'
                        />
                    </div>
                    
                </div>

                <div className="agentPurposeSection">
                    <h2>Agent Purpose</h2>
                    <TextField
                        id="agentPurpose"
                        placeholder="Write your description"
                        multiline
                        rows={6}
                        variant="filled"
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
                        slotProps={{
                            input: {
                                disableUnderline: true,
                            },
                        }}
                    />

                    <div className="createAgentSection" style={{padding: 0}}>
                        <div className="contract" style={{marginTop: 0, position: "relative"}}>
                            <label htmlFor="tags" style={{marginTop: "20px"}}>Tags</label>
                            <input
                                id='tags'
                                onClick={handleFocus}
                                placeholder='Ex. DeFi, Memes, DAO, etc..'
                            />

                            {isDropdownVisible && (
                                <div
                                    className="dropdown"
                                    ref={dropdownRef}
                                    style={{
                                    position: "absolute",
                                    bottom: "98%",
                                    left: 0,
                                    width: "100%",
                                    background: "#111521",
                                    border: "1px solid #ccc",
                                    boxShadow: "rgba(255, 255, 255, 0.21) 1.95px 1.95px 2.6px",
                                    borderRadius: "13px",
                                    marginTop: "4px",
                                    zIndex: 10,
                                    }}
                                >
                                    {tags.map((tag) => (
                                    <div
                                        key={tag}
                                        onClick={() => handleTagClick(tag)}
                                        tabIndex={0}
                                        style={{
                                        padding: "8px",
                                        cursor: "pointer",
                                        borderBottom: "1px solid #eee",
                                        }}
                                        onKeyDown={(e) => e.key === "Enter" && handleTagClick(tag)}
                                    >
                                        {tag}
                                    </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div
                            className="selected-tags"
                            style={{
                                marginTop: "10px",
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "8px",
                            }}
                            >
                            {selectedTags.map((tag) => (
                                <span
                                key={tag}
                                className="tag-view"
                                >
                                {tag}
                                <button
                                    onClick={() => handleRemoveTag(tag)}
                                    style={{
                                    marginLeft: "8px",
                                    fontSize: 15,
                                    background: "transparent",
                                    border: "none",
                                    cursor: "pointer",
                                    color: "#00796b",
                                    fontWeight: "bold",
                                    }}
                                >
                                    &times;
                                </button>
                                </span>
                            ))}
                            </div>
                    </div>

                    <div className="buttons">
                        <Button className='discard' variant='outlined'>
                            Discard
                        </Button>
                        <Button
                            className='create' 
                            variant='filled'
                            onClick={() => {
                                setShowPopup(!showPopup)
                            }}
                        >
                            Create Agent
                        </Button>
                    </div>

                </div>

            </form>
        </div>
    );
}

export default CreateAgent;