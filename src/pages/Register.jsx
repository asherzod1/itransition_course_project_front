import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {Button, Checkbox, Form, Input, message} from 'antd';
import {Link} from "react-router-dom";
import axios from "axios";
import {BASE_URL} from "../api/host.js";

function Register() {
    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        axios.post(`${BASE_URL}/register/`, values).then(res=>{
            console.log(res)
            message.success("Register successfully")
        })
            .catch(()=>{
                message.error("Register failed")
            })
    };
    return (
        <div className="flex h-[100vh] w-[100%] justify-center items-center theme-login">
            <div className={"w-[90%] md:w-[400px]"}>
                <h2 className="text-center">Register</h2>
                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your Name!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Name" />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        rules={[
                            {
                                required: true,
                                type: "email",
                                message: 'Please input your Email!',
                            },
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="email" />
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
                        <Button type="primary" htmlType="submit" className="login-form-button w-[100%]">
                            Register
                        </Button>
                        Or <Link to="/login">Login now!</Link>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default Register;
