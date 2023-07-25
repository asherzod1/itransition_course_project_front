import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import PrivateRouter from "./layout/PrivateRouter.jsx";
import Home from "./pages/Home.jsx";
import {ConfigProvider, theme} from 'antd';
import {useSelector} from 'react-redux';
import LayOut from "./layout/LayOut.jsx";
import 'antd/dist/reset.css';
import ProfilePage from "./pages/profilePage.jsx";
import CollectionDetails from "./pages/CollectionDetails.jsx";
import Comments from "./pages/Comments.jsx";
import './i18n.js'
import {useState} from "react";
import UsersPage from "./pages/UsersPage.jsx";
import ByTags from "./pages/ByTags.jsx";

function App() {
    const themee = useSelector(state => state.theme);
    let currentLang = localStorage.getItem('i18nextLng')?.split("-")[0]
    // if (!currentLang || currentLang !== 'en' || currentLang !== 'uz'){
    //     localStorage.setItem('i18nextLng', 'en')
    //     currentLang = 'en'
    // }
    const [language, setLanguage] = useState(currentLang)
    const { defaultAlgorithm, darkAlgorithm } = theme;
    return (
        <>
            <ConfigProvider
                theme={{
                    algorithm: themee.colorPrimary === "#1677ff" ? defaultAlgorithm : darkAlgorithm,
                        token: {
                                    colorPrimary: themee.colorPrimary,
                                },
                }}

            >
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<Login/>}></Route>
                        <Route path="/register" element={<Register/>}></Route>

                        <Route element={<LayOut language={language} setLanguage={setLanguage}/>}>
                            <Route path={"/"} element={<Home language={language}/>}/>
                            <Route path={"/collection/:id"} element={<CollectionDetails language={language} />}/>
                            <Route path={"/comment/:id"} element={<Comments language={language} />} />
                            <Route path={"/tags/:id"} element={<ByTags language={language} />} />

                            <Route element={<PrivateRouter/>}>
                                <Route path={"/profile"} element={<ProfilePage language={language}/>} />
                                <Route path={"/users"} element={<UsersPage language={language}/>} />
                            </Route>
                        </Route>

                    </Routes>
                </BrowserRouter>
            </ConfigProvider>
        </>
    )
}

export default App
