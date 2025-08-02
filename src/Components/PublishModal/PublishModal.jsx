import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { publishForm } from '../../api/form';
import { toast } from 'react-toastify';

import "./PublishModalStyle.css";
import vectorImage from '../../assets/Vector.png';
import ShareModal from '../ShareModal/ShareModal';

import { checkProjectExists } from '../../api/project';
import { setFormId } from '../../redux/Slices/formSlice';

const PublishModal = ({ isOpen, onClose }) => {
    const location = useLocation();
    const dispatch = useDispatch();


    const reduxFormId = useSelector(state => state.form.formId);
    const { formId: locationFormId } = location.state || {};
    const formId = locationFormId || reduxFormId || localStorage.getItem("standaloneFormId");

    const { pages, pageConditions, selectedPageId } = useSelector((state) => state.form);

    //If location.state has formId, update Redux
    useEffect(() => {
        if (locationFormId) {
            dispatch(setFormId(locationFormId));
        }
    }, [locationFormId, dispatch]);

    console.log("DEBUG: Redux formId ->", formId);

    const [projectName, setProjectName] = useState("Project");
    const [emails, setEmails] = useState([]);
    const [newEmail, setNewEmail] = useState("");
    const [isMailSectionOpen, setMailSectionOpen] = useState(false);
    const [isEditingProject, setIsEditingProject] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareLink, setShareLink] = useState("");
    const [loading, setLoading] = useState(false);
    const [noProject, setNoProject] = useState(false);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (e.target.classList.contains("modal-overlay")) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    // Reset all fields when modal closes
    useEffect(() => {
        if (!isOpen) {
            setProjectName("Project");
            setEmails([]);
            setNewEmail("");
            setMailSectionOpen(false);
            setIsEditingProject(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleAddEmail = () => {
        if (!newEmail.trim()) return;
        if (emails.length >= 2) {
            toast.error("You can add a maximum of 2 emails!");
            return;
        }
        if (!/\S+@\S+\.\S+/.test(newEmail)) {
            toast.error("Invalid email format!");
            return;
        }
        setEmails([...emails, newEmail.trim()]);
        setNewEmail("");
    };

    const handleEditEmail = (index, value) => {
        const updatedEmails = [...emails];
        updatedEmails[index] = value;
        setEmails(updatedEmails);
    };

    const handleRemoveEmail = (index) => {
        const updatedEmails = [...emails];
        updatedEmails.splice(index, 1);
        setEmails(updatedEmails);
    };

    const handlePublish = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You must be logged in to publish this!");
                return;
            }


            let projectId = null;


            if (!noProject) {
                // Verify if project exists
                const projectCheck = await checkProjectExists(projectName, token);
                if (!projectCheck.exists) {
                    toast.error("This project doesn't exist");
                    setLoading(false);
                    return;
                }
                projectId = projectCheck.projectId;
            }



            const questions = pages.flatMap((page) =>
                (page.questions || []).map((q) => ({
                    questionText: q.questionText,
                    type: q.type,
                    options: q.options || [],
                    answer: q.answerText || q.dateValue || q.rating?.selected || q.linearScale?.selected || q.files || "",
                }))
            );

            const currentConditions = pageConditions[selectedPageId] || {};

            const { truePage, falsePage } = currentConditions || {};
            console.log("Publishing payload:", { truePage, falsePage });


            // Publish form
            const res = await publishForm(
                formId,
                projectId,
                {
                    name: projectName,
                    pages,
                    questions,
                    truePage,
                    falsePage,
                    pageConditions,
                    responders: emails.map(email => ({ email })) || [],
                    status: "published",
                },
                token);
            if (res.success) {
                toast.success("Form published successfully!");
                setShareLink(res.shareUrl);
                setShowShareModal(true);
                localStorage.removeItem("standaloneFormId");
            }
        } catch (err) {
            console.error("Publish failed:", err);
            toast.error("Failed to publish form");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="modal-overlay">
                <div className="modal-container">
                    {/* Close Button */}
                    <button className="modal-close" onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" strokeWidth="1.8" stroke="#333" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    {/* Header */}
                    <div className="modal-header">
                        <div className="modal-icon">
                            <img src={vectorImage} alt="publish" />
                        </div>
                        <p className="modal-title">Publish</p>
                    </div>

                    {/* Body */}
                    <div className="modal-body">
                        {/* Save to Project */}
                        <label className="modal-label">Save to</label>
                        <div className="modal-row">
                            {!noProject && isEditingProject ? (
                                <>
                                    <input
                                        type="text"
                                        className="modal-input"
                                        placeholder="Enter project name"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        autoFocus
                                    />
                                    <button className="modal-link" onClick={() => setIsEditingProject(false)}>
                                        Save
                                    </button>
                                </>
                            ) : !noProject ? (
                                <>
                                    <span className="modal-text">{projectName}</span>
                                    <button className="modal-link" onClick={() => setIsEditingProject(true)}>Change</button>
                                </>
                            ) : (
                                <span className="modal-text">Not saving to any project</span>
                            )}
                        </div>

                        {/* New Checkbox */}
                        <div className="modal-row checkbox-row">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={noProject}
                                    onChange={() => setNoProject(!noProject)}
                                />
                                Don't save to any project
                            </label>
                        </div>



                        {/* Responders */}
                        <label className="modal-label">Responders</label>
                        <div className="modal-row">
                            <span className="modal-text">Anyone with the Link</span>
                            <button className="modal-link" onClick={() => setMailSectionOpen(true)}>Manage</button>
                        </div>

                        {/* Share Section */}
                        {isMailSectionOpen && (
                            <>
                                <label className="modal-label">Share</label>
                                {emails.map((email, idx) => (
                                    <div className="modal-row email-row" key={idx}>
                                        <input
                                            className="modal-input email-edit"
                                            value={email}
                                            onChange={(e) => handleEditEmail(idx, e.target.value)}
                                        />
                                        <button className="modal-link" onClick={() => handleRemoveEmail(idx)}>Remove</button>
                                    </div>
                                ))}
                                {emails.length < 2 && (
                                    <div className="modal-row email-row">
                                        <input
                                            className="modal-input email-edit"
                                            placeholder="Enter mail"
                                            value={newEmail}
                                            onChange={(e) => setNewEmail(e.target.value)}
                                        />
                                        <button className="modal-link" onClick={handleAddEmail} >+ Add</button>
                                    </div>
                                )}

                            </>
                        )}

                        {/* Publish Button */}
                        <button className="modal-create-button" onClick={handlePublish} disabled={loading}>
                            {loading ? <span className="spinner"></span> : "Publish"}
                        </button>
                    </div>
                </div>
            </div>
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                shareLink={shareLink}
            />
        </>

    );
};

export default PublishModal;
