import "./NotAuthanticated.css";
import warning from "../assets/warning.png";
function NotAuthanticated() {
    return (<>
    <div className="NoAuth">
        <div>
            <img src={warning} alt="not found" />
            <h2> You are not Authanticated</h2>

        </div>

    </div>
    </>);
}

export default NotAuthanticated;