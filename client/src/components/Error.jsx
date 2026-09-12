import './Error.css';


export default function Errors(error){
    
    return (<div className='errorarea'>
        {error.status &&<h2>{error.status}</h2>}
        {error.error && <h1>{error.error}</h1>}
        <p>{error.message}</p>
    </div>)
}

