import {Dropdown, Space, Switch, Input, AutoComplete, Divider} from 'antd';
import {DownOutlined, UserOutlined, MenuOutlined, LoginOutlined, UserAddOutlined, LogoutOutlined } from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {useEffect, useState} from "react";
import {setPrimaryColor} from "../redux/reducers/themeReducer.js";
import {TOKEN_ACCESS} from "../api/host.js";
import {searchApi} from "../api/config/userCrud.js";

const { Search } = Input;





function Navbar({language, setLanguage}) {
    const user = JSON.parse(localStorage.getItem("current_user"))
    const {t, i18n} = useTranslation()
    const languages = ['uz', 'en']
    const changeLanguage = (lang) => {
        setLanguage(lang)
        i18n.changeLanguage(lang)
        // window.location.reload()
        setItems(
            [
                {
                    label: <a href="#" onClick={()=>changeLanguage(languages.filter((item => item !== lang))[0])}>{languages.filter((item => item !== lang))[0]}</a>,
                    key: '0',
                },
            ]
        )
    }
    const userDropdown = [
        {
            label: <Link to={"/login"} >
                <Space size={"small"}>
                    <LoginOutlined />
                    Login
                </Space>
            </Link>,
            key: '10',
        },
        {
            label: <Link to={"/register"} >
                <Space size={"small"}>
                    <UserAddOutlined />
                    Register
                </Space>
                </Link>,
            key: '11',
        },
    ];
    let navigate = useNavigate()
    const logout = ()=>{
        localStorage.removeItem("current_user")
        localStorage.removeItem(TOKEN_ACCESS)
        navigate("/login")
    }
    const userDropDownForUser = [
        {
            label: <Link to={"/profile"} >
                <Space size={"small"}>
                    <UserOutlined />
                    Profile
                </Space>
            </Link>,
            key: '15',
        },
        {
            label: <Link onClick={()=>logout()} to={"/login"} >
                <Space size={"small"}>
                    <LogoutOutlined />
                    Logout
                </Space>
            </Link>,
            key: '16',
        },
        {
            label: <h5>User: {user?.name}</h5>,
            disabled: true,
        },
    ]

    if(user?.is_admin){
        userDropDownForUser.splice(1,0,{
            label: <Link to={"/users"} >
                <Space size={"small"}>
                    <UserOutlined />
                    Admin
                </Space>
            </Link>,
            key: '12',
        })
    }
    const [items, setItems] = useState(
        [
            {
                label: <a href="#" onClick={()=>changeLanguage(languages.filter((item => item !== language))[0])}>{languages.filter((item => item !== language))[0]}</a>,
                key: '0',
            },
        ]
    )
    const currentTheme = localStorage.getItem("theme")
    const theme = useSelector(state => state.theme)
    const dispatch = useDispatch();

    const onThemeChange = (value)=>{
        console.log(value)
        if(value){
            document.body.setAttribute("data-theme", "dark-theme")
            dispatch(setPrimaryColor('#164cff'));
            localStorage.setItem('theme','#164cff')
        }
        else{
            document.body.removeAttribute('data-theme')
            dispatch(setPrimaryColor('#1677ff'));
            localStorage.setItem('theme','#1677ff')
        }
    }

    useEffect(()=>{
        if(currentTheme){
            currentTheme === '#164cff' ? document.body.setAttribute("data-theme", "dark-theme") : document.body.removeAttribute('data-theme')
            dispatch(setPrimaryColor(currentTheme));
        }
        else {
            dispatch(setPrimaryColor('#1677ff'));
            localStorage.setItem('theme','#1677ff')
        }
    },[])

    const renderTitle = (title, count) => (
        <span className="flex justify-between">
    {title} <span>count: {count}</span>
    {/*        <Link*/}
    {/*            style={{*/}
    {/*                float: 'right',*/}
    {/*            }}*/}
    {/*            to="https://www.google.com/search?q=antd"*/}
    {/*            target="_blank"*/}
    {/*            rel="noopener noreferrer"*/}
    {/*        >*/}
    {/*  more*/}
    {/*</Link>*/}
  </span>
    );
    const renderItem = (title, record, modelName) => ({
        value: title,
        label: (
            <Link
                to={modelName === "Collection" ? `collection/${record?.id}` : modelName === "CollectionItem" ? `comment/${record?.id}` : modelName === "Tag" ? `tags/${record?.id}` : '#' }

                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                {title}
                <span>
      </span>
            </Link>
        ),
    });
    const options = [
        {
            label: renderTitle('Libraries'),
            options: [renderItem('AntDesign', 10000), renderItem('AntDesign UI', 10600)],
        },
        {
            label: renderTitle('Solutions'),
            options: [renderItem('AntDesign UI FAQ', 60100), renderItem('AntDesign FAQ', 30010)],
        },
        {
            label: renderTitle('Articles'),
            options: [renderItem('AntDesign design language', 100000)],
        },
    ];
    const [searchOptions, setSearchOptions] = useState([])
    const onSearch = (value) => {
        searchApi(value).then(res=>{
            console.log(res)
            setSearchOptions(res.data.map(item=>{
                if(item.modelName === 'Comment'){
                    return {
                        label: renderTitle(item.modelName, item.results?.length),
                        options: item.results.map(item2=>renderItem(item2[`text`], item2, item.modelName))
                    }
                }
                if(item.modelName === 'Tag'){
                    return {
                        label: renderTitle(item.modelName, item.results?.length),
                        options: item.results.map(item2=>renderItem(item2[`name`], item2, item.modelName))
                    }
                }
                return {
                    label: renderTitle(item.modelName, item.results?.length),
                    options: item.results.map(item2=>renderItem(item2[`name_${language}`], item2, item.modelName))
                }
            }))
        })
        console.log(value)
    };

    return (
        <div>
            <div className="h-[70px] w-[100%]" style={{borderBottom: '1px solid #ddd'}}>
                <div className="h-[100%] containerr flex justify-between items-center">
                    <Link to={'/'} className={"decoration-0"} style={{textDecoration: 'none', color: theme.colorPrimary}}>
                        <h1 className="md:hidden text-[24px] my-0">PCM</h1>
                        <h1 className="hidden md:block md:text-[18px] lg:text-[24px] my-0">{t('logo')}</h1>
                    </Link>
                    <div className="hidden sm:block">
                        <AutoComplete
                            popupClassName="certain-category-search-dropdown"
                            dropdownMatchSelectWidth={500}
                            style={{
                                width: 250,
                            }}
                            options={searchOptions}
                        >
                            <Input.Search onSearch={onSearch} size="large" placeholder={t('search')} enterButton />
                        </AutoComplete>
                    </div>
                    <div>
                        <Space size={"large"}>
                            <Dropdown
                                menu={{
                                    items,
                                }}
                                trigger={['click']}
                            >
                                <a onClick={(e) => e.preventDefault()} style={{cursor: "pointer", fontSize: '20px'}} className="lg:text-[20px]">
                                    <Space>
                                        {language}
                                        <DownOutlined className="text-[10px] md:text-[12px] lg:text-[14px]"/>
                                    </Space>
                                </a>
                            </Dropdown>
                            <Switch
                                checkedChildren={"dark"}
                                unCheckedChildren={"light"}
                                checked={currentTheme === '#164cff' ? true : false}
                                onChange={onThemeChange}
                            />
                            <Dropdown
                                menu={user?.id ?
                                    {
                                        items: userDropDownForUser,
                                    } :
                                    {
                                        items: userDropdown,
                                    }
                                }
                                trigger={['click']}
                                style={{
                                    border: "1px solid #000"
                                }}
                            >
                                <a onClick={(e) => e.preventDefault()}
                                   className="rounded-[20px] py-[8px] px-[16px] cursor-pointer lg:text-[20px]"
                                   style={{border: '1px solid #bbb', boxShadow: '0 0 6px #ccc'}}>
                                    <Space>
                                        <MenuOutlined/>
                                        <UserOutlined/>
                                    </Space>
                                </a>
                            </Dropdown>
                        </Space>

                    </div>
                </div>
            </div>
            <div className="flex sm:hidden px-3 mt-3 justify-center">
                <div className="block w-[350px]">
                    <AutoComplete
                        popupClassName="certain-category-search-dropdown"
                        dropdownMatchSelectWidth={'96%'}
                        style={{
                            width: '100%',
                        }}
                        options={searchOptions}
                    >
                        <Input.Search onSearch={onSearch} size="large" placeholder={t('search')} enterButton />
                    </AutoComplete>
                </div>
            </div>
        </div>
    );
}

export default Navbar;
