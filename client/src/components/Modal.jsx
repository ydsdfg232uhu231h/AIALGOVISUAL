import ReactDOM from 'react-dom'
import "./Modal.css"
function Modal({children}) {
    return (
    <>
        {ReactDOM.createPortal(
        <aside>
            {children}
        </aside>,
        document.getElementById("modal")
        )}
    </>
  )
}

export default Modal;
