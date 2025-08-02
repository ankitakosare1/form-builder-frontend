import React, {useState} from "react";
import { useSelector } from "react-redux";
import "./FlowChartStyle.css";
import Tag from "../../assets/Tag.png";
import PublishModal from "../PublishModal/PublishModal";

const FlowChart = ({ onClose }) => {
    const [isPublishOpen, setPublishOpen] = useState(false);

    const { selectedPageId, pages, pageConditions } = useSelector(
        (state) => state.form
    );

    // Get initiating page
    const initiatingPage =
        pages.find((p) => Number(p.pageId) === Number(selectedPageId)) || {};

    // Get condition for selected page
    const condition = pageConditions?.[selectedPageId] || {};

    // Normalize and match IDs safely
    const truePage =
        pages.find((p) => Number(p.pageId) === Number(condition?.truePage)) || {};
    const falsePage =
        pages.find((p) => Number(p.pageId) === Number(condition?.falsePage)) || {};

    return (
        <div className="flowchart-overlay">

            {/* Close Button */}
                <button 
                    className="flowchart-close-btn"
                    onClick={onClose}
                    title="Close"
                >
                    &times;
                </button>

            <div className="flowchart-container">

                {/* Top: Initiating Page Name with Down Arrow */}
                <div className="flowchart-top">
                    <div className="flowchart-top-box">
                        {initiatingPage.pageTitle}
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: "6px" }}>
                            <path d="M7 10l5 5 5-5H7z" />
                        </svg>
                    </div>
                </div>

                {/* True / False Labels */}
                <div className="flowchart-labels">
                    <div className="label true">
                        <img src={Tag} alt="Tag" /> True
                    </div>
                    <div className="label false">
                        <img src={Tag} alt="Tag" /> False
                    </div>
                </div>

                {/* Initiating Page Boxes */}
                <div className="flowchart-initiation">
                    <div className="flowchart-box">{initiatingPage.pageTitle}</div>
                    <div className="flowchart-box">{initiatingPage.pageTitle}</div>
                </div>

                {/* Connectors + True/False Linked Pages */}
                <div className="flowchart-connectors">
                    <div className="connector true">
                        <div className="dotted-line" />
                        <div className="flowchart-box">{truePage.pageTitle}</div>
                    </div>
                    <div className="connector false">
                        <div className="dotted-line" />
                        <div className="flowchart-box">{falsePage.pageTitle}</div>
                    </div>
                </div>

            </div>
            <button className="flowchart-next-btn" onClick={() => setPublishOpen(true)}>Next</button>
            <PublishModal isOpen={isPublishOpen} onClose={() => setPublishOpen(false)} />
        </div>
    );
};

export default FlowChart;

