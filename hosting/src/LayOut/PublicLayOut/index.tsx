import { Outlet } from 'react-router-dom'
import { Navbar } from '../../component';

const PublicLayout = () => {
    return ( 
            <div>
                <Navbar />
                <Outlet />
            </div>
        )
}

export default PublicLayout