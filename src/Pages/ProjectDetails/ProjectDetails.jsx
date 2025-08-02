import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import HomeSidebar from "../../Components/HomeSidebar/HomeSidebar";
import { getProjectForms } from "../../api/project";
import createFormIcon from "../../assets/FormIcon.png";
import "./ProjectDetailsStyle.css";

const ProjectDetails = () => {
    const { projectId } = useParams();
    const [projectName, setProjectName] = useState("");
    const [forms, setForms] = useState([]);

    useEffect(() => {
        const fetchForms = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await getProjectForms(projectId, token);
                if (res.success) {
                    setProjectName(res.projectName);
                    setForms(res.forms);
                }
            } catch (err) {
                toast.error("Failed to fetch project forms");
            }
        };
        fetchForms();
    }, [projectId]);

    return (
        <div className="home-container">
            <HomeSidebar />
            <div className="main-content-wrapper">
                <main className="main-content">
                    <p className="main-title">{projectName}</p>
                    <div className="works-grid">
                        {forms.length > 0 ? (
                            forms.map((form) => (
                                <div className="work-card" key={form._id}>
                                    <p className="card-title">
                                        {form.name} {form.status === "draft" && <span className="draft-label">(Draft)</span>}
                                    </p>
                                    <div className="icon-bg">
                                        <img src={createFormIcon} alt="Form Icon" className="card-icon" />
                                    </div>
                                    <div className="card-footer">
                                        <span className="view-link"></span>
                                        <span className="dots-icon">⋮</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p style={{ color: "#9CA3AF" }}>No forms in this project</p>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProjectDetails;
