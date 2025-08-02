import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HomeSidebar from "../../Components/HomeSidebar/HomeSidebar";
import { getProjects } from "../../api/project";
import projectsIcon from "../../assets/ProjectsIcon.png";
import "./AnalysisProjectsStyle.css";

const AnalysisProjects = () => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await getProjects(token);
                if (res.success) {
                    setProjects(res.projects);
                } else {
                    toast.error("Failed to fetch projects");
                }
            } catch (err) {
                console.error(err);
                toast.error("Error fetching projects");
            }
        };
        fetchProjects();
    }, []);

    return (
        <div className="analysis-projects-container">
            {/* Sidebar */}
            <div className="sidebar">
                <HomeSidebar customClass="analysis-sidebar-style"/>
            </div>

            <div className="analysis-projects-main-wrapper">
                <div className="analysis-projects-main">
                    <h2>Projects</h2>
                    <div className="projects-grid">
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <div
                                    className="project-card"
                                    key={project._id}
                                    onClick={() => navigate(`/analysis/${project._id}`)}
                                >
                                    <p className="project-title">{project.name}</p>
                                    <div className="project-icon-bg">
                                        <img src={projectsIcon} alt="Project Icon" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-projects">No Projects Found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisProjects;
