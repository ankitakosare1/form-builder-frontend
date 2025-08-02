import axiosInstance from "../utils/axiosInstance";

// Fetch Recent Works (Draft forms first, then published forms & projects)
export const getRecentWorks = async (token) => {
    const response = await axiosInstance.get(
        "/api/works/recent",
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

// Fetch Shared Works (Forms/Projects where user's email is in responders)
export const getSharedWorks = async (token) => {
    const response = await axiosInstance.get(
        "/api/works/shared",
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};
