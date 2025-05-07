import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function Login() {
  const navigate = useNavigate();
  const [errors,setErrors] = useState({});
  const [formData, setFormData] = useState({ email: '', password: '' });

  const validate = () => {
    let validationErrors = {};
    if(!formData.email)
    {
      validationErrors.email = "Please enter email";
    }
    if(!formData.password)
    {
      validationErrors.password = "Please enter Password"
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!validate())
    {
      toast.error("Please check the details");
      return;
    }
    console.log(formData);
    try{
      let response = await axios.post("http://localhost:8000/login", formData, { withCredentials: true });
      console.log(response);
      if (response.data.isLogin) {
        toast.success(response.data.message);
        setTimeout(()=>{
          navigate('/dashboard');
        }, 2000)
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
    
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Toaster toastOptions={{style: {background: '#1F2937', color: 'white'}}}/>
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-white font-sans">
        <div className="bg-gray-800 p-8 rounded-lg shadow-md w-80">
          <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
          <form onSubmit={handleSubmit} className="flex flex-col">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="p-2 mb-4 border rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              
            />
            {errors.email && <p className="text-red-500 text-sm mb-2">{errors.email}</p>}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="p-2 mb-4 border rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              
            />
            {errors.password && <p className="text-red-500 text-sm mb-2">{errors.password}</p>}
            <button
              type="submit"
              className="bg-blue-600 cursor-pointer text-white py-2 rounded hover:bg-blue-700 transition-all duration-200"
            >
              Login
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-white">
            Don't have an account?{' '}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate('/signup')}
            >
              Sign Up
            </span>
          </p>
        </div>
      </div>
    </div>

  );
}

export default Login;