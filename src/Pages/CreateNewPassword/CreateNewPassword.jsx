import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { resetPassword } from '../../api/auth';
import { eyeToggleIcon } from '../../utils/eyeToggleIcon';

import AuthHeader from '../../Components/AuthHeader/AuthHeader';
import '../../Styles/AuthPageStyle.css';
import './CreateNewPasswordStyle.css';

const CreateNewPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const email = location.state?.email;

    const [formData, setFormData] = useState({ password: '', confirmPassword: '' });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const validateForm = () => {
        const { password, confirmPassword } = formData;

        if (!password || !confirmPassword) {
            toast.error("Both fields are required");
            return false;
        }

        if (password.length < 8) {
            toast.error("Password must be at 8 characters");
            return false;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            toast.error("Missing email information");
            return;
        }

        if (!validateForm() || loading) return;
         setLoading(true);

        try {
            await resetPassword(email, formData.password);
            toast.success("Password reset successfully");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            toast.error("Failed to reset password");
        }
        finally {
            setLoading(false); 
        }
    };

    return (
        <div className='auth-container create-new-password-page'>
            <AuthHeader />
            <div className='auth-form-layout'>
                <div className='auth-form-wrapper'>
                    <h2 className='auth-title'>Create New Password</h2>
                    <p className='auth-subtitle'>
                        Today is a new day. It's your day. You shape it.
                        <br />
                        Sign in to start managing your projects.
                    </p>

                    <form className='auth-form' onSubmit={handleSubmit}>
                        <div className='auth-input-group password-group'>
                            <label htmlFor='password'>Enter New Password</label>
                            <div className='password-wrapper'>
                                <input type={showPassword ? 'text' : 'password'}
                                    id='password'
                                    name='password'
                                    value={formData.password}
                                    placeholder='at least 8 characters'
                                    onChange={handleChange}
                                    className='auth-input'
                                />
                                <span className='toggle-password' onClick={() => setShowPassword(!showPassword)}>
                                    {eyeToggleIcon(showPassword)}
                                </span>
                            </div>
                        </div>

                        <div className='auth-input-group password-group'>
                            <label htmlFor='confirmPassword'>Confirm Password</label>
                            <div className='password-wrapper'>
                                <input type={showConfirmPassword ? 'text' : 'password'}
                                    id='confirmPassword'
                                    name='confirmPassword'
                                    value={formData.confirmPassword}
                                    placeholder='at least 8 characters'
                                    onChange={handleChange}
                                    className='auth-input'
                                />
                                <span className='toggle-password' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {eyeToggleIcon(showConfirmPassword)}
                                </span>
                            </div>
                        </div>

                        <Link to="/forgot-password" className='forgot-password-link'>
                            Forgot Password?
                        </Link>

                        <button type='submit' className='auth-button'  disabled={loading}>
                            {loading ? <span className="spinner"></span> : "Reset Password"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateNewPassword;
