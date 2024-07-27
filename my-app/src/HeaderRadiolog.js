import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';

const HeaderAdmin = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };
    const handleRadiologiiAsteptare=()=>{
        navigate('/radiolog');
    };

    const handleRadiologii=()=>{
        navigate('/radiologiiRadiolog'
        )
    }

    return (
        <div className="header">
            <Button onClick={handleRadiologiiAsteptare}>Radiologii asteptare</Button>
            <Button onClick={handleRadiologii}>Radiologii</Button>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
};

export default HeaderAdmin;
