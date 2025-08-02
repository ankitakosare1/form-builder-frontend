import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { verifyOtp } from '../../api/auth'

import AuthHeader from '../../Components/AuthHeader/AuthHeader'
import '../../Styles/AuthPageStyle.css';
import './VerifyOtp.css'

const VerifyOtp = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (otp.length !== 6) {
            toast.error("OTP must be 6 digits");
            return;
        }

        if (loading) return;

        try {
            setLoading(true);
            const response = await verifyOtp(email, otp);
            toast.success("OTP verified successfully");
            navigate('/reset-password', { state: { email } });
        } catch (err) {
            toast.error("Invalid or expired OTP");
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div className='auth-container verify-otp-page'>
            <AuthHeader />
            <div className='auth-form-layout'>
                <div className='auth-form-wrapper'>
                    <h2 className='auth-title'>Enter Your OTP</h2>
                    <p className='auth-subtitle'>
                        We've sent a 6-digit OTP to your registered mail.
                        <br />
                        Please enter it below to sign in
                    </p>

                    <form className='auth-form' onSubmit={handleSubmit}>
                        <div className='auth-input-group'>
                            <label htmlFor='otp'>OTP</label>
                            <input type='text'
                                id='otp'
                                name='otp'
                                value={otp}
                                placeholder='xxxx05'
                                maxLength="6"
                                onChange={(e) => setOtp(e.target.value)}
                                className='auth-input' />
                        </div>

                        <button type="submit" className='auth-button' disabled={loading}>
                            {loading ? <span className="spinner"></span> : "Confirm"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;
