import {Navigate, Outlet, useNavigate} from "react-router-dom";
import {TOKEN_ACCESS} from "../api/host.js";
import {useEffect} from "react";
import {getUsersByIdApi} from "../api/config/userCrud.js";

function PrivateRouter() {
    const token = localStorage.getItem(TOKEN_ACCESS)
    const user = localStorage.getItem("current_user") ? JSON.parse(localStorage.getItem("current_user")) : null
    let navigate = useNavigate()
    useEffect(()=>{
        if(user){
            getUsersByIdApi(user?.id).then(res=>{
                if(res.data.user.id !== Number(user?.id)){
                    localStorage.removeItem("current_user")
                    localStorage.removeItem(TOKEN_ACCESS)
                    navigate("/login")
                }
            })
                .catch((err)=>{
                    if (err.response.status === 401){
                        localStorage.removeItem("current_user")
                        localStorage.removeItem(TOKEN_ACCESS)
                        navigate("/login")
                    }
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
