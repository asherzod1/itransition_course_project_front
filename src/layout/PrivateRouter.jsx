import {Navigate, Outlet} from "react-router-dom";
import {TOKEN_ACCESS} from "../api/host.js";
import {useEffect} from "react";
import {getUsersByIdApi} from "../api/config/userCrud.js";

function PrivateRouter() {
    const token = localStorage.getItem(TOKEN_ACCESS)
    const user = localStorage.getItem("current_user") ? JSON.parse(localStorage.getItem("current_user")) : null

    useEffect(()=>{
        if(user){
            getUsersByIdApi(user?.id).then(res=>{
                localStorage.setItem("current_user", JSON.stringify(res.data))
            })
                .catch(()=>{
                    localStorage.removeItem("current_user")
                    localStorage.removeItem(TOKEN_ACCESS)
                    window.location.href = "/login"
                })
        }
    },[])

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
