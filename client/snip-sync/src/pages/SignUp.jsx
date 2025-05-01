import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/signup", formData, { withCredentials: true });
      if (response.status === 200) {
        toast.success(response.data.message);
        setFormData({ username: '', email: '', password: '' });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed.");
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
    } else {
      toast.error("Incorrect OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <Toaster />
      <div className="bg-gray-800 p-10 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Create your account</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-400 mt-1">At least 6 characters</p>
          </div>

          <div className="flex justify-between mt-4">
            <button
              className="bg-blue-600 cursor-pointer text-white py-2 rounded hover:bg-blue-700 transition-all duration-200"
              type='button'
              onClick={handleOtp}
              className="text-sm text-blue-400 hover:underline"
            >
              Send OTP to Email
            </button>
          </div>

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
            </button>
          )}
        </form>
        <p className="text-sm text-center mt-6">
          Already have an account?{' '}
          <span
            className="text-blue-400 hover:underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Login here
          </span>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
