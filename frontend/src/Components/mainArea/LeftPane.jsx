import React from 'react'
import './LeftPane.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom'
import { useAuth } from '../../store/auth';
import { useNavigate } from 'react-router-dom';

const leftPane = (props) => {
    const navigate = useNavigate();
    const { LogoutUser, user } = useAuth()
    const logout = () => {
        LogoutUser()

        navigate("/Login")
    }

    return (
        <>
            <div className="timer-area-text">{user.name}</div>
            <div class="d-inline-flex gap-1 left-toggle">
                <button type="button" class="btn btn-outline-dark border-0 btn-lg text-left">
                    <Link to='/profile' style={{ textDecoration: 'none', color: 'inherit' }}>Profile</Link>
                </button>
                <button type="button" class="btn btn-outline-dark border-0 btn-lg text-left">
                    <Link to='/chat' style={{ textDecoration: 'none', color: 'inherit' }}>Chat</Link>
                </button>
                <button type="button" class="btn btn-outline-dark border-0 btn-lg text-left">
                    <Link to='/friends' style={{ textDecoration: 'none', color: 'inherit' }}>Friends</Link>
                </button>
                <button type="button" class="btn btn-outline-dark border-0 btn-lg text-left">
                    <Link to='/group' style={{ textDecoration: 'none', color: 'inherit' }}>Group</Link>
                </button>
                <button type="button" class="btn btn-outline-dark border-0 btn-lg text-left" onClick={() => props.setpopupshow(prev => !prev)}>
                    Post
                </button>
                <button type="button" class="btn btn-outline-dark border-0 btn-lg text-left">
                    <Link to='/contactus' style={{ textDecoration: 'none', color: 'inherit' }}>ContactUs</Link>
                </button>
                <button type="button" class="btn btn-outline-dark border-0 btn-lg text-left" onClick={logout}>
                    LogOut
                </button>
            </div>
        </>
    )
}

export default leftPane;