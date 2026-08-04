import './Success.css';
import { useEffect, useState } from 'react';
import Modal from './Modal';
export default function Success({message}){
    const [showsuccess,setshowsuccess] = useState(false);
    
    useEffect(()=>{
        function Mysuccess(){
            setshowsuccess(true);

        }
        Mysuccess();
      
    },[showsuccess]);
    function handleshow(){
        setshowsuccess(false);
    }
    return (
    <>
    <Modal>
        {showsuccess && <div id='success'>
            <h1>{message}</h1>
            <button onClick={handleshow}>x</button> 
        </div>}
    </Modal>
    
    </>
    );
}