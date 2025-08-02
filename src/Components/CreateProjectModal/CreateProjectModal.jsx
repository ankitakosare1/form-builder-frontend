import React, { useState, useEffect } from 'react';
import "./CreateProjectModalStyle.css";
import vectorImage from '../../assets/Vector.png';
import { toast } from 'react-toastify'

import { createProject } from '../../api/project'
import { useNavigate } from 'react-router-dom';

const CreateProjectModal = ({ isOpen, onClose }) => {
    const [projectName, setProjectName] = useState("");
    const [formName, setFormName] = useState("");
    const navigate = useNavigate();


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (e.target.classList.contains("modal-overlay")) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    if (!isOpen) return null;

    const handleCreateProject = async () => {
        if (!projectName.trim() || !formName.trim()) {
            toast.error("Project Name and Form Name are required!");
            return;
        }
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("You are not authenticated. Please log in again.");
                navigate("/");
                return;
            }
            const res = await createProject({ projectName, formName }, token);
            if (res.success) {
                toast.success("Project created successfully!");
                const formId = res?.form?._id;

                if (!formId) {
                    console.error("No form ID returned from backend!");
                    toast.error("Form ID is missing from the response.");
                    return;
                }

                console.log("Create Project Response:", res);


                onClose();
                navigate("/create-form", { state: { formId, formName } });
            }
        } catch (err) {
            console.error("Error creating project:", err);
            toast.error("Failed to create project");
        }
    };


    return (
        <div className='modal-overlay'>
            <div className='modal-container'>
                <button className='modal-close' onClick={onClose} aria-label="Close Modal">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        strokeWidth="1.8"
                        stroke="#333"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>

                <div className='modal-header'>
                    <div className='modal-icon'>
                        <img src={vectorImage} alt='project' />
                    </div>

                </div>

                <div className='modal-body'>
                    <p className='modal-title'>Create Project</p>
                    <p className='modal-subtitle'>
                        Provide your project a name and start with your journey
                    </p>

                    <label className='modal-label' htmlFor='projectName'>Name</label>
                    <input type='text' id='projectName' placeholder='Project Name' className='modal-input' value={projectName} onChange={(e) => setProjectName(e.target.value)} />

                    <label className='modal-label' htmlFor='formName'>Name</label>
                    <input type='text' id='formName' placeholder='Form Name' className='modal-input' value={formName} onChange={(e) => setFormName(e.target.value)} />

                    <button className='modal-create-button' onClick={handleCreateProject}>Create</button>

                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;
