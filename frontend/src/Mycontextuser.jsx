import { createContext, useContext} from "react";

export const Myusercontxt = createContext();
export const useMycontextuser = () => {
    const context = useContext(Myusercontxt);
    if (!context) {
        throw new Error("useMycontextuser is only use within a MyuserProvider");;
    }
    return context;
};



