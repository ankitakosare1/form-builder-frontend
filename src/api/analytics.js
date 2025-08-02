import axiosInstance from "../utils/axiosInstance";

// Fetch analytics for a specific form
export const getFormAnalytics = async (formId, token) => {
    const response = await axiosInstance.get(
        `/api/analytics/form/${formId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};
