import { useEffect, useState } from "react";

function useLocalstorage(key, initialvalue){
    const [usestorage,setstorage] = useState(()=>{
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : initialvalue;
        } catch (error) {
            console.log("Error reading localStorage key:", key, error);
            return initialvalue;
        }

    });
    useEffect(()=> {
        try {
            localStorage.setItem(key, JSON.stringify(usestorage));
        } catch (error) {
            console.log("Error setting localStorage key:", key, error);
        }

    },[key, usestorage]);
    return [usestorage, setstorage]
}

export default useLocalstorage;