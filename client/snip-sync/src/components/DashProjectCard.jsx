import React from "react";
import { useNavigate } from "react-router-dom";
function DashProjectCard({project}){
    const navigate = useNavigate();
    const handleOpen = () => {
        navigate('/projectdetails')
    }
    return(
        <div>
            <div className=" min-w-[300px] w-full max-w-[400px] cursor-pointer ml-12 mr-12 mt-6 p-6  flex flex-col justify-center rounded-md items-center bg-gray-800" onClick={handleOpen}>
                <h1 className="text-2xl font-medium">{project.title}</h1>
                <p className="mt-4">{project.description}</p>
            </div>
        </div>
    )
}

export default DashProjectCard;