import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import './HomeStyle.css';

import projectsIcon from '../../assets/ProjectsIcon.png';
import createFormIcon from '../../assets/FormIcon.png';

import CreateProjectModal from '../../Components/CreateProjectModal/CreateProjectModal';
import HomeSidebar from '../../Components/HomeSidebar/HomeSidebar';

import { createForm, getFormById, renameForm } from '../../api/form';
import { getRecentWorks, getSharedWorks } from '../../api/work';
import { setFormId, setFormData } from '../../redux/Slices/formSlice';

const Home = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [modalOpen, setModalOpen] = useState(false);
    const [recentWorks, setRecentWorks] = useState([]);
    const [sharedWorks, setSharedWorks] = useState([]);

    // States for Rename Functionality
    const [menuOpen, setMenuOpen] = useState(null);
    const [renameModalOpen, setRenameModalOpen] = useState(false);
    const [renameValue, setRenameValue] = useState("");
    const [selectedFormId, setSelectedFormId] = useState(null);

    useEffect(() => {
        if (location.state?.formId) {
            dispatch(setFormId(location.state.formId));
        }
    }, [location, dispatch]);

    useEffect(() => {
        const fetchWorks = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;

                const recentRes = await getRecentWorks(token);
                if (recentRes.success) setRecentWorks(recentRes.recentWorks);

                const sharedRes = await getSharedWorks(token);
                if (sharedRes.success) setSharedWorks(sharedRes.sharedWorks);
            } catch (err) {
                console.error("Failed to fetch works:", err);
                toast.error("Failed to fetch works");
            }
        };
        fetchWorks();
    }, []);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".dots-menu") && !e.target.closest(".dots-icon")) {
                setMenuOpen(null);
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    const handleCreateForm = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await createForm({ name: "Untitled" }, token);

            if (res.success) {
                const formId = res.form._id;
                dispatch(setFormId(formId));
                localStorage.setItem("standaloneFormId", formId);
                navigate("/create-form", {
                    state: {
                        formId,
                        formName: res.form.name,
                        isDirectForm: true,
                    },
                });
            }
        } catch (err) {
            toast.error("Failed to create form");
        }
    };

    const handleViewAnalysisClick = (e, formId) => {
        e.stopPropagation();
        navigate(`/form-analysis/${formId}`);
    };

    // Rename
    const handleRenameClick = (form) => {
        setSelectedFormId(form._id);
        setRenameValue(form.name);
        setMenuOpen(null);
        setRenameModalOpen(true);
    };

    const handleRenameSubmit = async () => {
        try {
            const token = localStorage.getItem("token");
            const res = await renameForm(selectedFormId, renameValue, token);
            if (res.success) {
                toast.success("Form renamed successfully");
                setRecentWorks((prev) =>
                    prev.map((item) => (item._id === selectedFormId ? { ...item, name: renameValue } : item))
                );
                setRenameModalOpen(false);
            } else {
                toast.error(res.message || "Failed to rename form");
            }
        } catch (err) {
            console.error("Rename error:", err);
            toast.error("Server error while renaming");
        }
    };

    // Edit: Open actual form in FormBuilder
    // const handleEditClick = async (form) => {
    //     try {
    //         const token = localStorage.getItem("token");
    //         const res = await getFormById(form._id, token); // API call to backend
    //         if (res.success) {
    //             dispatch(setFormId(form._id));
    //             dispatch(setFormData(res.form)); // Save form in Redux
    //             localStorage.setItem("standaloneFormId", form._id);

    //             navigate("/create-form", {
    //                 state: {
    //                     formId: form._id,
    //                     formName: res.form.name,
    //                     isDirectForm: true,
    //                 },
    //             });
    //         } else {
    //             toast.error("Failed to open form");
    //         }
    //     } catch (err) {
    //         console.error("Error opening form:", err);
    //         toast.error("Error opening form");
    //     }
    // };

    const renderWorkCard = (item) => {
        const isForm = item.questions !== undefined;

        return (
            <div className='work-card' key={item._id}>
                {isForm ? (
                    <>
                        <p className='card-title'>
                            {item.name} {item.status === 'draft' && <span className='draft-label'>(Draft)</span>}
                        </p>
                        <div className='icon-bg'>
                            <img src={createFormIcon} alt='Form Icon' className='card-icon' />
                        </div>
                        <div className='card-footer'>
                            {item.status === 'published' ? (
                                <span
                                    className='view-link'
                                    onClick={(e) => handleViewAnalysisClick(e, item._id)}
                                >
                                    View Analysis
                                </span>
                            ) : (
                                <span></span>
                            )}
                            <span
                                className='dots-icon'
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(menuOpen === item._id ? null : item._id);
                                }}
                            >
                                ⋮
                            </span>
                            {menuOpen === item._id && (
                                <div className="dots-menu">
                                    <div className="dots-menu-item" onClick={() => handleRenameClick(item)}>Rename</div>
                                    <div className="dots-menu-item">Edit</div> 
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <>
                        <p className='card-title'>{item.name}</p>
                        <div className='icon-bg'>
                            <img src={projectsIcon} alt='Project Icon' className='card-icon' />
                        </div>
                        <div className='card-footer'>
                            <span>View Project</span>
                            <span className='dots-icon'>⋮</span>
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className='home-container'>
            <div className='sidebar'>
                <HomeSidebar />
            </div>

            <div className='main-content-wrapper'>
                {modalOpen && <div className="content-blur" />}

                <main className='main-content'>
                    <p className='main-title'>Welcome to CANOVA</p>

                    <div className='quick-actions'>
                        <div className='action-card' onClick={() => setModalOpen(true)}>
                            <div className='icon-bg'>
                                <img src={projectsIcon} alt='Create Project' />
                            </div>
                            <p className='action-title'>Start From scratch</p>
                            <p className='action-subtitle'>Create your first Project now</p>
                        </div>

                        <div className='action-card' onClick={handleCreateForm}>
                            <div className='icon-bg'>
                                <img src={createFormIcon} alt='Create Form' />
                            </div>
                            <p className='action-title'>Create Form</p>
                            <p className='action-subtitle'>Create your first Form now</p>
                        </div>
                    </div>

                    <section className='works-section'>
                        <p className='section-title'>Recent Works</p>
                        <div className='works-grid'>
                            {recentWorks.length > 0
                                ? recentWorks.map((item) => renderWorkCard(item))
                                : <p style={{ color: '#9CA3AF' }}>No recent works found</p>}
                        </div>
                    </section>

                    <section className='works-section' style={{ marginBottom: "30px" }}>
                        <p className='section-title'>Shared Works</p>
                        <div className='works-grid'>
                            {sharedWorks.length > 0
                                ? sharedWorks.map((item) => renderWorkCard(item))
                                : <p style={{ color: '#9CA3AF' }}>No shared works found</p>}
                        </div>
                    </section>

                    <CreateProjectModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
                </main>
            </div>

            {/* Rename Modal */}
            {renameModalOpen && (
                <div className="rename-modal-overlay">
                    <div className="rename-modal">
                        <h3>Rename Form</h3>
                        <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                        />
                        <div className="rename-modal-buttons">
                            <button className="cancel-btn" onClick={() => setRenameModalOpen(false)}>Cancel</button>
                            <button className="save-btn" onClick={handleRenameSubmit}>Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;


