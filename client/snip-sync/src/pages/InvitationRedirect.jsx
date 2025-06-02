import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from 'react-hot-toast';

function InvitationRedirect() {
    const navigate = useNavigate();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');
    const hasRunRef = useRef(false);

    useEffect(() => {
         if (hasRunRef.current) return;
            hasRunRef.current = true;
        const processInvitation = async () => {
            try {
                const response = await axios.post(
                    "http://localhost:8000/processinvite",
                    { token },
                    { withCredentials: true }
                );

                if (response.data.redirectTo === 'login') {
                    navigate(`/login?next=/invite?token=${token}`);
                } else if (response.data.redirectTo === 'dashboard') {
                    toast.success("Successfully joined the project!");
                    navigate('/dashboard');
                } else {
                    toast.error(response.data.message);
                }
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    navigate(`/login?next=/invite?token=${token}`);
                } else {
                    console.error(err);
                    toast.error("Error processing invite.");
                }
            }
        };

        processInvitation();
    }, [token, navigate]);

    return (
        <div>
            <Toaster toastOptions={{ style: { background: '#1F2937', color: 'white' } }} />
            <p>Processing Redirect...</p>
        </div>
    )
}

export default InvitationRedirect;
