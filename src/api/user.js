import axiosInstance from "../utils/axiosInstance";

// Get user profile
export const getProfile = async (token) => {
    const response = await axiosInstance.get(
        "/api/user/profile",
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

// Update user profile
export const updateProfile = async (data, token) => {
    const response = await axiosInstance.put(
        "/api/user/profile",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};
