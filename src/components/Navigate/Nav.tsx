import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdLogOut } from "react-icons/io";
import './Nav.css'


export const Nav: React.FC = () => {
    const navigate = useNavigate();

    function handleLogOut() {
        sessionStorage.removeItem('accessToken');
        navigate('/');
    }

    return(

        <nav className="nav">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <IoMdLogOut className="logout-icon" onClick={handleLogOut} />
        </nav>

    );
}