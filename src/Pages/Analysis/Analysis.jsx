import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { toast } from "react-toastify";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import HomeSidebar from "../../Components/HomeSidebar/HomeSidebar";
import createFormIcon from "../../assets/FormIcon.png";
import { getProjects, getProjectForms } from "../../api/project";
import "./AnalysisStyle.css";

const AnalysisPage = () => {
    const { projectId } = useParams();
    const navigate = useNavigate(); 
    const [project, setProject] = useState(null);
    const [forms, setForms] = useState([]);
    const [totalViews, setTotalViews] = useState(0);
    const [averageViews, setAverageViews] = useState(0);

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const token = localStorage.getItem("token");
                const projectsRes = await getProjects(token);
                if (projectsRes.success) {
                    const selectedProject = projectsRes.projects.find(p => p._id === projectId);
                    setProject(selectedProject);
                }

                const formsRes = await getProjectForms(projectId, token);
                if (formsRes.success) {
                    setForms(formsRes.forms);
                    const total = formsRes.forms.reduce((acc, f) => acc + (f.views || 0), 0);
                    setTotalViews(total);
                    setAverageViews(formsRes.forms.length > 0 ? Math.round(total / formsRes.forms.length) : 0);
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to load project analysis");
            }
        };
        fetchProjectData();
    }, [projectId]);

    const chartData = {
        labels: forms.map(f => new Date(f.createdAt).toLocaleDateString()),
        datasets: [
            {
                label: "Form Views",
                data: forms.map(f => f.views || 0),
                borderColor: "#4F46E5",
                backgroundColor: "rgba(79, 70, 229, 0.2)",
                tension: 0.4,
            },
        ],
    };

    return (
        <div className="analysis-container">
            {/* Sidebar */}
            <div className="sidebar">
                <HomeSidebar customClass="analysis-sidebar-style"/>
            </div>

            {/* Scrollable Right Section */}
            <div className="analysis-main-wrapper">
                <div className="analysis-main">
                    {/* Header with Close Button */}
                    <div className="analysis-header">
                        <h2 className="project-title">{project?.name || "Project Name"}</h2>
                        <span className="close-btn" onClick={() => navigate("/analysis")}>&times;</span>
                    </div>

                    {/* Stats and Chart */}
                    <div className="analysis-top">
                        <div className="analysis-stats">
                            <div className="views-box">
                                <p className="views-title">Views</p>
                                <h3>{totalViews}</h3>
                            </div>
                            <div className="views-box">
                                <p className="views-title">Average Views</p>
                                <h3>{averageViews}</h3>
                            </div>
                        </div>
                        <div className="chart-box">
                            <h4>Average Response Chart</h4>
                            <Line data={chartData} />
                        </div>
                    </div>

                    {/* Forms List */}
                    <div className="forms-grid">
                        {forms.length > 0 ? (
                            forms.map((form) => (
                                <div className="form-card" key={form._id}>
                                    <p className="form-title">{form.name}</p>
                                    <div className="form-icon-bg">
                                        <img src={createFormIcon} alt="Form Icon" />
                                    </div>
                                    <div className="form-footer">
                                        <span className="view-link">View Analysis</span>
                                        <span className="dots-icon">⋮</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="no-forms">No Forms Found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalysisPage;

