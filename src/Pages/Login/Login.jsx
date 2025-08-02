import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { loginUser } from '../../api/auth'

import AuthHeader from '../../Components/AuthHeader/AuthHeader'
import { eyeToggleIcon } from '../../utils/eyeToggleIcon'
import './LoginStyle.css';
import '../../Styles/AuthPageStyle.css';
 

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);
     const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const validateForm = () => {
        const { email, password } = formData;

        if (!email || !password) {
            toast.error('All fields are required');
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

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm() || loading) return;
        setLoading(true);

        try {
            const res = await loginUser(formData);
            if (res.token) {
                localStorage.setItem("token", res.token); // Save JWT for authenticated requests
                setTimeout(() => navigate('/home'), 1500);
            } else {
                toast.error('Login failed: No token received');
            }
            toast.success('Login successful');
            setTimeout(() => navigate('/home'), 1500);
        } catch (err) {
            console.error("Login error:", err.response?.data || err.message);
            toast.error('Invalid credentials');
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
                            <label htmlFor='email'>Email</label>
                            <input type='email' id='email' name='email' value={formData.value} placeholder='Example@gmail.com' onChange={handleChange} className='auth-input' />
                        </div>

                        <div className='auth-input-group password-group'>
                            <label htmlFor='password'>Password</label>
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

                        <Link to="/forgot-password" className='forgot-password-link'>
                            Forgot Password?
                        </Link>

                        <button type='submit' className='auth-button'  disabled={loading}>

                            {loading ? <span className="spinner"></span> : "Sign in"}

                        </button>
                    </form>

                    <p className='auth-footer-text'>
                        Don't you have an account?{' '}
                        <Link to="/signup" className='auth-link'>
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
