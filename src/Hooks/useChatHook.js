import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react"
import { constant } from "../config/constant";

const useChatHooks =()=>{
    const { getAccessTokenSilently } = useAuth0();
    const [loading,setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);
    const [chat, setChat] = useState([]);
    const fetchChat = async(data)=>{
        try {
            setLoading(true);
            setError(null);
            // const payload = {
            //     ...data,
            //     prompt: JSON.stringify(data.prompt), 
            //   };
            const token = await getAccessTokenSilently();
            const response = await fetch(`${constant.PYTHON_SERVER_URL}/api/chat`,{
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                //   "Authorization":`Bearer ${token}`
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

    return {loading,error,chat,fetchChat}
}
export default useChatHooks;