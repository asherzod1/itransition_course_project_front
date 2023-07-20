import {Outlet} from "react-router-dom";
import Navbar from "./Navbar.jsx";

function LayOut({language, setLanguage}) {
    return (
        <div className='container-background'>
            <Navbar language={language} setLanguage={setLanguage}/>
            <Outlet />
        </div>
    );
}

export default LayOut;
