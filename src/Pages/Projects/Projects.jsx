import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import HomeSidebar from "../../Components/HomeSidebar/HomeSidebar";
import { getProjects } from "../../api/project";
import projectsIcon from "../../assets/ProjectsIcon.png";
import "./ProjectsStyle.css";

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await getProjects(token);
                if (res.success) {
                    setProjects(res.projects);
                    setFilteredProjects(res.projects);
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

    //  Handle search input
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = projects.filter((project) =>
            project.name.toLowerCase().includes(query)
        );
        setFilteredProjects(filtered);
    };

    return (
        <div className="projects-container">
            {/* Sidebar */}
            <div className="sidebar">
                <HomeSidebar customClass="analysis-sidebar-style"/>
            </div>

            {/* Right Section */}
            <div className="projects-main-wrapper">
                <div className="projects-main">
                    <div className="projects-header">
                        <button className="back-btn" onClick={() => navigate("/home")}>←</button>
                        <h2>Projects</h2>
                    </div>

                    {/* Search bar */}
                    <div className="search-bar">
                        <input
                            type="text"
                            placeholder="Hinted search text"
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>

                    {/* Projects Grid */}
                    <div className="projects-grid">
                        {filteredProjects.length > 0 ? (
                            filteredProjects.map((project) => (
                                <div
                                    className="project-card"
                                    key={project._id}
                                    onClick={() => navigate(`/project/${project._id}`, { state: { projectName: project.name } })}
                                >
                                    <p className="project-title">{project.name}</p>
                                    <div className="project-icon-bg">
                                        <img src={projectsIcon} alt="Project Icon" />
                                    </div>
                                    {/* <div className="project-footer">
                                        <span className="view-link">View Analysis</span>
                                        <span className="dots-icon">⋮</span>
                                    </div> */}
                                </div>
                            ))
                        ) : (
                            <p className="no-projects">No Projects Found</p>
                        )}
                    </div>

                    {/* Create New Form Button */}
                    <div className="create-form-container">
                        <button className="create-form-btn" onClick={() => navigate("/create-form")}>
                            Create New Form
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Projects;

