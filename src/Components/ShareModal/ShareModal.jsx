import React from "react";
import { toast } from "react-toastify";
import "./ShareModalStyle.css";

const ShareModal = ({ isOpen, onClose, shareLink }) => {
    if (!isOpen) return null;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink);
        toast.success("Link copied to clipboard!");
    };

    return (
        <div className="share-modal-overlay" onClick={onClose}>
            <div className="share-modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="share-close-btn" onClick={onClose}>✖</button>

                {/* Modal Content */}
                <div className="share-header">
                    <p className="share-title">Share</p>
                </div>

                <div className="share-body">
                    <label className="share-label">Share</label>
                    <div className="share-link-box">
                        <input type="text" readOnly value={shareLink} />
                        <button className="copy-btn" onClick={handleCopy}>Copy the Link</button>
                    </div>
                    <button className="share-btn" onClick={handleCopy}>Share</button>
                </div>
            </div>
        </div>
    );
};

export default ShareModal;
