import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { sendOtpEmail } from '../../api/auth'

import AuthHeader from '../../Components/AuthHeader/AuthHeader'
import './ForgotPasswordStyle.css';
import '../../Styles/AuthPageStyle.css';


const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

         setLoading(true);

        try {
            await sendOtpEmail(email);
            toast.success("OTP sent to your email");
            navigate("/verify-otp", { state: { email } });
        } catch (err) {
            toast.error("Failed to send OTP");
        }
        finally {
            setLoading(false); 
        }
    };

    return (
        <div className='auth-container forgot-password-page'>
            <AuthHeader />
            <div className='auth-form-layout'>
                <div className='auth-form-wrapper'>
                    <h2 className='auth-title'>Welcome CANOVA 👋</h2>
                    <p className='auth-subtitle'>
                        Please enter your registered email ID to receive an OTP
                    </p>

                    <form className='auth-form' onSubmit={handleSubmit}>
                        <div className='auth-input-group'>
                            <label htmlFor='email'>E-mail</label>
                            <input type='email'
                                id='email' 
                                name='email'
                                value={email}
                                placeholder='Enter your registered email'
                                onChange={(e) => setEmail(e.target.value)}
                                className='auth-input' />
                        </div>

                        <button type='submit' className='auth-button' disabled={loading}>
                            {loading ? (
                                <span className="spinner"></span> 
                            ) : (
                                "Send Email"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
