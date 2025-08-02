import axiosInstance from "../utils/axiosInstance";

// Create Project (with initial form name)
export const createProject = async (data, token) => {
    const response = await axiosInstance.post(
        "/api/project/create",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

// Fetch all projects for logged-in user
export const getProjects = async (token) => {
    const response = await axiosInstance.get(
        "/api/project/my-projects",
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

export const checkProjectExists = async (projectName, token) => {
    const response = await axiosInstance.post(
        "/api/project/check",
        { projectName },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data; 
};

export const getProjectForms = async (projectId, token) => {
    const response = await axiosInstance.get(
        `/api/project/${projectId}/forms`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};


