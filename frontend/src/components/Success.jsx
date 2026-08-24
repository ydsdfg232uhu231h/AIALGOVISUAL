import './Success.css';
import { useState } from 'react';
import Modal from './Modal.jsx';
import Loading from './Loading';
export default function Success({message}){
    const [showsuccess,setshowsuccess] = useState(true);

    function handleshow(){
        setshowsuccess(!showsuccess);
    }
    return (
    <>
    <Modal>
        {showsuccess ? <div id='success'>
            <h1>{message}</h1>
            <button onClick={handleshow}>x</button> 
        </div>: <div>
            <Loading/>
            </div>}
    </Modal>
    
    </>
    );
}
export function PopError({message}){
    const [showerror,setshowerror] = useState(true);

    function handleshow(){
        setshowerror(!showerror);
    }
    return (
    <>
    <Modal>
        {showerror ? <div id='poperror'>
            <h1>{message}</h1>
            <button onClick={handleshow}>x</button> 
        </div>: <div>
            <Loading/>
            </div>}
    </Modal>
    
    </>
    );
}