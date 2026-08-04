import { useState } from "react";
import { Myusercontxt } from "./Mycontextuser";
function MyuserProvider({ children }) {
    const [myuser, setmyuser] = useState({name: "", email: "", id: ""});
    return <Myusercontxt.Provider value={{ myuser, setmyuser }}>
        {children}
    </Myusercontxt.Provider>;
}
export default MyuserProvider;