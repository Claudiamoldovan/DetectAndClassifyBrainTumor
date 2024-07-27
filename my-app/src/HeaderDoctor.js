import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';

const HeaderAdmin = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };
    const handlePacienti=()=>{
        navigate('/doctor');
    };

    const handleRadiologii=()=>{
        navigate('/radiologii'
        )
    }

    return (
        <div className="header">
            <Button onClick={handlePacienti}>Pacienti</Button>
            <Button onClick={handleRadiologii}>Radiologii</Button>
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
};

export default HeaderAdmin;
