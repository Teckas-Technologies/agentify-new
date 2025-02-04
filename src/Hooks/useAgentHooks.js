import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react"

const useAgentHooks =()=>{
    const { getAccessTokenSilently } = useAuth0();
    const [loading,setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [agents, setAgents] = useState([]);
    const createAgent = async(data)=>{
        try {
            setLoading(true);
            setError(null);
            const token = await getAccessTokenSilently();
            const response = await fetch("http://localhost:3001/api/agents",{
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization":`Bearer ${token}`
                },

                body:JSON.stringify(data)
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const result = await response.json();
            return result;
        } catch (err) {
            console.error("Error occurred:", err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
            console.log("Loading state set to false");
        }
    }
    const updateAgent = async(agentId,data)=>{
        try {
            setLoading(true);
            setError(null);
            const token = await getAccessTokenSilently();
            const response = await fetch(`http://localhost:3001/api/agents/${agentId}`,{
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization":`Bearer ${token}`
                },

                body:JSON.stringify(data)
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const result = await response.json();
            return result;
        } catch (err) {
            console.error("Error occurred:", err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
            console.log("Loading state set to false");
        }
    }

    const fetchAgentById = async(agentId)=>{
        try {
            setLoading(true);
            setError(null);
            const token = await getAccessTokenSilently();
            const response = await fetch(`http://localhost:3001/api/agents/${agentId}`,{
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization":`Bearer ${token}`
                },
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const result = await response.json();
            return result;
        } catch (err) {
            console.error("Error occurred:", err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
            console.log("Loading state set to false");
        }
    }


    const updateAgentStatus = async(agentId)=>{
        try {
            setLoading(true);
            setError(null);
            const token = await getAccessTokenSilently();
            const response = await fetch(`http://localhost:3001/api/agents/${agentId}/status`,{
                method: "PATCH",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization":`Bearer ${token}`
                },
                body:JSON.stringify({isPublished:true})
            })
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            const result = await response.json();
            return result;
        } catch (err) {
            console.error("Error occurred:", err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
            console.log("Loading state set to false");
        }
    }

    const fetchAgents = async ({
        search = "",
        tags = [],
        startDate = "",
        endDate = "",
        page = 1,
        limit = 10,
        creatorId
      }) => {
        try {
          setLoading(true);
          setError(null);
    
          const token = await getAccessTokenSilently(); 
    
          const queryParams = {
            page,
            limit,
            search,
            tags: JSON.stringify(tags),
            startDate,
            endDate,
            creatorId
          };
    
          const filteredParams = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => value !== "" && value != null)
          );
    
          const query = new URLSearchParams(filteredParams).toString();
    
          const response = await fetch(`http://localhost:3001/api/agents?${query}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
    
          if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
          }
    
          const result = await response.json();
          setAgents(result || []);
          return result; 
        } catch (err) {
          console.error("Error occurred:", err);
          setError(err.message || "Something went wrong");
          return [];
        } finally {
          setLoading(false);
        }
      };

    return {loading,error,agents,createAgent,updateAgent,fetchAgentById,fetchAgents,updateAgentStatus}
}
export default useAgentHooks;