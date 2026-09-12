import "./NotAuthanticated.css";
import warning from "../assets/NoAuth.png";
function NoAuthanticated() {
    return (<>
    <div className="NoAuth">
        <div>
            <img src={warning} alt="not found" />
            <h2> You are not Authanticated</h2>

        </div>

    </div>
    </>);
}

export default NoAuthanticated;