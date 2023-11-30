import { Button } from "@mui/material";
import React, { useContext } from "react";
import { AppContext } from "../../provider/AppProvider";
import  useFetchApi  from '../../utils/FetchApi'

const Navbar: React.FC= ()=> {
    const navbarStyle = {
        fontSize: 20,
        height: 60,
      };
    
    const { handleLogout } = useFetchApi()
    
    const { user } = useContext(AppContext);
    console.log('user',user)


    return (
        <nav className="navbar bg-dark border-bottom border-body" data-bs-theme="dark" style={navbarStyle}>
            <div className="navbar" style={{width: '100%'}}>
                <div className="container-fluid" style={{display: 'flex', justifyContent: 'space-between', width: '100%'}}>
                    <span className="navbar-text text">
                        RPB Milestone 4
                    </span>
                    <div style={{display: 'flex', gap: 20 }}>
                        <span className="navbar-text text">Hello! &nbsp;{user?.username}&nbsp;({user?.role})</span>
                        <Button
                        style={{height: 40}}
                        variant="contained"
                        color= 'error'
                        onClick={()=> handleLogout()}
                        >Log out</Button>
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar