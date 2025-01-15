import React, { useRef, useState } from 'react';
import Menu from '../../components/Menu/Menu'

import { Button, TextField } from '@mui/material';
import { FiUpload } from "react-icons/fi";

import "./CreateAgent.scss"

const CreateAgent = () => {

    return (
        <div className='CreateAgent'>
            <Menu />

            <form className="createAgentContent" onSubmit={() => {}}>
                
                <div className="createAgentSection">
                    <h1>Create New Agent</h1>
                    <h3>Upload your ABIs and create agents with help of AI</h3>
                    
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
                        <h1>Enter Contract Details</h1>

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
                            placeholder='Ex. Customer Support Chatbot'
                        />
                    </div>
                    
                </div>

                <div className="agentPurposeSection">
                    <h1>Agent Purpose</h1>
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

                    <div className="buttons">
                        <Button className='discard' variant='outlined'>
                            Discard
                        </Button>
                        <Button className='create' variant='filled'>
                            Create Agent
                        </Button>
                    </div>

                </div>

            </form>
        </div>
    );
}

export default CreateAgent;