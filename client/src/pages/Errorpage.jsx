import "./Errorpage.css";

function Errorpage({message}) {
    
  return (
    <div>
        <h1 id="error">&#x26A0;{message|| "An error has occured!"}</h1>
    </div>
  )
}

export default Errorpage;