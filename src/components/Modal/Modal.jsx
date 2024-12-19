import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { createPortal } from "react-dom";

export function Modal({ onClose, children }) {

    return createPortal(
        <div className="modal">
            <div className="modal-background" onClick={() => onClose(false)}></div>
            <div className="modal-content">
                <div className="modal-header"><FontAwesomeIcon icon={faXmark} onClick={() => onClose(false)} /></div>
                {children}
            </div>
        </div>,
        document.getElementById("root")
    )
}