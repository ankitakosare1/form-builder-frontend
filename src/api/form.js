import axiosInstance from "../utils/axiosInstance";

// Save Draft
export const saveDraft = async (formId, formData, token) => {
    const response = await axiosInstance.put(
        `/api/form/save-draft/${formId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

// Publish form
export const publishForm = async (formId, projectId, formData, token) => {
    const response = await axiosInstance.put(
        `/api/form/publish/${formId}`,
        { ...formData, projectId },
        {
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    return response.data;
};

// Get Public Form (Shared Link)
export const getSharedForm = async (shareLink) => {
    const response = await axiosInstance.get(`/api/form/shared/${shareLink}`);
    return response.data;
};

// Submit Form Response
export const submitResponse = async (responseData) => {
    const response = await axiosInstance.post("/api/response/submit", responseData);
    return response.data;
};

// Create Empty Form (direct form creation)
export const createForm = async (data, token) => {
    const response = await axiosInstance.post(
        "/api/form/create",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};

// get from by id
// export const getFormById = async (formId, token) => {
//     const res = await fetch(`/api/form/${formId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//     });
//     return res.json();
// };

export const getFormById = async (formId, token) => {
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/form/${formId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
        const text = await res.text();
        console.error("Error response:", text);
        throw new Error(`Failed to fetch form: ${res.status}`);
    }

    return await res.json();
};

// Rename Form
export const renameForm = async (formId, name, token) => {
    const response = await axiosInstance.put(
        `/api/form/rename/${formId}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};