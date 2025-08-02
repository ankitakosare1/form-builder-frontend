import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Pie, Bar } from "react-chartjs-2";
import "chart.js/auto";
import HomeSidebar from "../../Components/HomeSidebar/HomeSidebar";
import { getFormAnalytics } from "../../api/analytics";
import "./HomeFormAnalysisPageStyle.css";

const HomeFormAnalysisPage = () => {
    const { formId } = useParams();
    const navigate = useNavigate();
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await getFormAnalytics(formId, token);
                if (res.success) setAnalyticsData(res);
                else toast.error("Failed to fetch analytics");
            } catch {
                toast.error("Error fetching analytics");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [formId]);

    const generatePieData = (options) => ({
        labels: Object.keys(options),
        datasets: [{ data: Object.values(options), backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"] }],
    });

    const generateBarData = (options) => ({
        labels: Object.keys(options),
        datasets: [{ label: "Responses", data: Object.values(options), backgroundColor: ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"] }],
    });

    if (loading) return <div className="loading">Loading analytics...</div>;

    return (
        <div className="analysis-container">
            <div className="sidebar">
                <HomeSidebar />
            </div>
            <div className="analysis-main-wrapper">
                <div className="analysis-main">
                    <div className="analysis-header">
                        <h2 className="project-title">{analyticsData?.formName || "Form Analytics"}</h2>
                        <span className="close-btn" onClick={() => navigate("/home")}>&times;</span>
                    </div>

                    {analyticsData?.analytics?.length > 0 ? (
                        analyticsData.analytics.map((q, idx) => (
                            <div key={idx} className="question-card">
                                <h4 className="question-title">{q.question}</h4>
                                <div className="charts-row">
                                    <div className="chart-box">
                                        <Pie data={generatePieData(q.options)} />
                                    </div>
                                    <div className="chart-box">
                                        <Bar data={generateBarData(q.options)} />
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">No responses available for analytics.</p>
                    )}

                    <button className="download-btn">Download</button>
                </div>
            </div>
        </div>
    );
};

export default HomeFormAnalysisPage;
