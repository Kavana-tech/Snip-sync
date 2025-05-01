import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    try {
      let response = await axios.post("http://localhost:8000/signup", formData, { withCredentials: true });
      console.log(response);
      if (response.status === 200) {
        toast.success(response.data.message);
        setFormData({
          email: "",
          password: "",
        })
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
      else {
        toast.error(response.data.message);
      }
    }
    catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOtp = async () => {
    try {
      const response = await axios.post(`http://localhost:8000/sendotp/${formData.email}`);
      console.log(response);
      if (response.status === 200) {
        toast.success(response.data.message);
        setVerifyOtp(true);
        setOtp(response.data.otp);
      }
      else {
        toast.error(response.data.message);
      }
    }
    catch(error)
    {
      console.log(error);
      toast.error(error.response.data.message);
    }
    
  }

  const handleOtpVerification = () => {
    console.log(enteredOtp);
    console.log(otp);
    if (enteredOtp === otp.toString()) {
      toast.success("OTP verified Successfully!");
      setIsVerified(true);
    }
  }


  return (
    <div>
      <Toaster />
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white font-sans">
        <div className="bg-gray-900 p-8 rounded-lg shadow-md w-80">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 mb-4 border rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="p-2 mb-4 border rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
            <button
              className="bg-blue-600 cursor-pointer text-white py-2 rounded hover:bg-blue-700 transition-all duration-200"
              type='button'
              onClick={handleOtp}
            >
              Verify Your Email
            </button>

            {verifyOtp && <input
              type="text"
              name="otp"
              onChange={(e) => setEnteredOtp(e.target.value)}
              placeholder="Enter OTP"
              className="p-2 mb-4 mt-4 border rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />}

            {verifyOtp && <button
              type='button'
              className="bg-blue-600 cursor-pointer text-white py-2 rounded hover:bg-blue-700 transition-all duration-200"
              onClick={handleOtpVerification}
            >
              Verify OTP
            </button>}


            {isVerified && <button
              type="submit"
              className="bg-blue-600 mt-2 cursor-pointer text-white py-2 rounded hover:bg-blue-700 transition-all duration-200"
            >
              Sign Up
            </button>}
          </form>
          <p className="mt-4 text-center text-sm text-white">
            Already have an account?&nbsp;
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate('/login')}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>

  );
}

export default SignUp;