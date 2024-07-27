import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';

const HeaderAdmin = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/');
    };

    return (
        <div className="header">
            <Button onClick={handleLogout}>Logout</Button>
        </div>
    );
};

export default HeaderAdmin;
