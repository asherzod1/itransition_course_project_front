import {ArrowLeftOutlined, LockOutlined, UserOutlined} from '@ant-design/icons';
import {Button, Checkbox, Form, Input, message, Spin} from 'antd';
import {Link, useNavigate} from "react-router-dom";
import axios from "axios";
import {BASE_URL, TOKEN_ACCESS} from "../api/host.js";
import {useEffect, useState} from "react";
import {getUsersByIdApi} from "../api/config/userCrud.js";
function Login() {
    let navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    useEffect(()=>{
        const user = JSON.parse(localStorage.getItem("current_user"))
        if(user){
            getUsersByIdApi(user?.id).then(res=>{
                if(res.data.user.id !== Number(user?.id)){
                    localStorage.removeItem("current_user")
                    localStorage.removeItem(TOKEN_ACCESS)
                }
                navigate("/")
            })
                .catch(()=>{
                    localStorage.removeItem("current_user")
                    localStorage.removeItem(TOKEN_ACCESS)
                })
        }
        else {
            setLoading(false)
        }
    },[])
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        axios.post(`${BASE_URL}/login/`, values).then(res=>{
            console.log(res)
            message.success("Login successfully")
            localStorage.setItem(TOKEN_ACCESS, res.data.token)
            localStorage.setItem("current_user", JSON.stringify(res.data.user))
            navigate("/")
        })
            .catch((err)=>{
                console.log(err)
                message.error(err.response.data.error)
            })
    };

    const backToHome = () => {
        navigate("/")
    }

    return (
        <div className="flex h-[100vh] w-[100%] justify-center items-center theme-login">
            {
                loading ?
                    <Spin size="large" />
                    :
                    <div className={"w-[90%] md:w-[400px]"}>
                        <div className="mb-3">
                            <Button onClick={()=>backToHome()}>
                                <ArrowLeftOutlined className="mr-1"/>
                                Home
                            </Button>
                            <h2 className="text-center">

                                Login
                            </h2>
                        </div>
                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{
                                remember: true,
                            }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Username!',
                                    },
                                ]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your Password!',
                                    },
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>

                                <a className="login-form-forgot" style={{float:"right"}} href="">
                                    Forgot password
                                </a>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button w-[100%]">
                                    Log in
                                </Button>
                                Or <Link to="/register">register now!</Link>
                            </Form.Item>
                        </Form>
                    </div>
            }

        </div>
    );
}

export default Login;
