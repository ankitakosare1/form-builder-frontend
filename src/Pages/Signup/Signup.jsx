import React, { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { signupUser } from '../../api/auth';

import AuthHeader from '../../Components/AuthHeader/AuthHeader';
import { eyeToggleIcon } from '../../utils/eyeToggleIcon';
import "../../Styles/AuthPageStyle.css";
import "./SignupStyle.css";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateForm = () => {
        const { name, email, password, confirmPassword } = formData;

        if (!name || !email || !password || !confirmPassword) {
            toast.error("All fields are required");
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        if (password.length < 8) {
            toast.error("Password must be at least 8 characters long");
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

        if (!validateForm() || loading) return;
        setLoading(true);

        try {
            await signupUser(formData);
            toast.success("Signup successful");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            toast.error("Signup failed");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className='auth-container'>
            <AuthHeader />
            <div className='auth-form-layout'>
                <div className='auth-form-wrapper'>
                    <h2 className='auth-title'>Welcome CANOVA 👋</h2>
                    <p className='auth-subtitle'>
                        Today is a new day. It's your day. You shape it.
                        <br />
                        Sign in to start managing your projects.
                    </p>

                    <form className='auth-form' onSubmit={handleSubmit}>
                        <div className='auth-input-group'>
                            <label htmlFor='name'>Name</label>
                            <input type='text' id='name' name='name' value={formData.name} placeholder='Name' onChange={handleChange} className='auth-input' />
                        </div>

                        <div className='auth-input-group'>
                            <label htmlFor='email'>Email</label>
                            <input type='email' id='email' name='email' value={formData.email} placeholder='Example@email.com' onChange={handleChange} className='auth-input' />
                        </div>

                        <div className='auth-input-group password-group'>
                            <label htmlFor='password'>Create Password</label>
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

                        <button type='submit' className='auth-button' disabled={loading}>
                            {loading ? <span className="spinner"></span> : "Sign up"}
                        </button>
                    </form>

                    <p className='auth-footer-text'>
                        Do you have an account?{' '}
                        <Link to="/" className='auth-link'>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>


        </div>
    );
};

export default Signup
