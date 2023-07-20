import {Navigate, Outlet} from "react-router-dom";
import {TOKEN_ACCESS} from "../api/host.js";

function PrivateRouter() {
    const token = localStorage.getItem(TOKEN_ACCESS)
    const user = localStorage.getItem("current_user") ? JSON.parse(localStorage.getItem("current_user")) : null
    return (
        <div>
            {token ?
                <Outlet context={user}/> :
                <Navigate to="/login" />
            }
        </div>
    );
}

export default PrivateRouter;
