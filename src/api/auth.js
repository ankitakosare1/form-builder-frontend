import axiosInstance from "../utils/axiosInstance";

export const signupUser = async (formData) => {
    const response = await axiosInstance.post("/api/user/signup", formData);
    return response.data;
} 

export const loginUser = async (formData) => {
    const response = await axiosInstance.post("/api/user/login", formData);
    return response.data;
}

export const sendOtpEmail = async (email) => {
    const response = await axiosInstance.post("/api/otp/send-otp", {email});
    return response.data;
}

export const verifyOtp = async(email, otp) => {
    const response = await axiosInstance.post("/api/otp/verify-otp", {email, otp});
    return response.data;
}

export const resetPassword = async (email, newPassword) => {
    const response = await axiosInstance.post("/api/otp/reset-password", {email, newPassword});
    return response.data;
}