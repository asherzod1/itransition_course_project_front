import {Button, message, Switch, Table} from "antd";
import {useEffect, useState} from "react";
import {deleteUserApi, getUsersApi, updateUserRoleApi, updateUserStatusApi} from "../api/config/userCrud.js";
import {DeleteOutlined} from "@ant-design/icons";


function UsersPage({language}) {
    const user = JSON.parse(localStorage.getItem("current_user"))

    const columns = [
        {
            title: 'ID',
            key: 'id',
            dataIndex: 'id',
            render: (text, record) => <span style={record.id === user?.id ? {color:"#00A000"}:{}}>{text}</span>,
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <h3 style={record.id === user?.id ? {color:"#00A000"}:{}}>{text}</h3>,
        },
        {
            title: 'Email',
            key: 'email',
            dataIndex: 'email',
            render: (text, record) => <span style={record.id === user?.id ? {color:"#00A000"}:{}}>{text}</span>,
        },
        {
            title: 'Role',
            key: 'role',
            dataIndex: 'is_admin',
            render: (text, record) => <Switch
                loading={record.loadingRole}
                checkedChildren={"Admin"}
                unCheckedChildren={"User"}
                checked={text}
                onChange={(e)=>changeRole(e, record.id)}
            />,
        },
        {
            title: 'Status',
            key: 'status',
            dataIndex: 'status',
            render: (text, record) => <Switch
                loading={record.loadingStatus}
                checkedChildren={"active"}
                unCheckedChildren={"deactive"}
                checked={text === "active"}
                onChange={(e)=>changeStatus(e, record.id)}
            />,
        },
        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <Button onClick={()=>deleteUser(record.id)} type={"primary"} danger={true}>
                    <DeleteOutlined />
                </Button>
            ),
        }
    ]

    if(!user?.is_admin){
        window.location.href = "/"
    }
    const [users, setUsers] = useState([])
    useEffect(()=>{

        getUsersApi().then(res=>{
            console.log(res.data)
            let userss = res.data?.map(item=>({
                ...item,
                loadingRole: false,
                loadingStatus: false,
            }))
            setUsers(userss)
        })
    },[])

    const deleteUser = (id) =>{
        console.log(id)
        deleteUserApi(id).then(res=>{
            console.log(res.data)
            let newUsers = users.filter(item=>item.id !== id)
            setUsers(newUsers)
            message.success("Delete user successfully")
        })
            .catch(()=>{
                message.error("Delete user failed")
            })

    }
    const changeRole = (value, id) =>{
        let user = users.find(item=>item.id === id)
        user.loadingRole = true
        setUsers([...users])
        updateUserRoleApi({userId:id, role: value}).then(res =>{
            console.log(res.data)
            let userr = users.find(item=>item.id === id)
            userr.is_admin = value
            userr.loadingRole = false
            setUsers([...users])
            if(id === user?.id){
                localStorage.setItem("current_user", JSON.stringify(userr))
            }
        })
            .catch(()=>{
                let userr = users.find(item=>item.id === id)
                userr.loadingRole = false
                setUsers([...users])
            })
        console.log(id)
    }

    const changeStatus = (value, id) =>{
        let user = users.find(item=>item.id === id)
        user.loadingStatus = true
        setUsers([...users])
        updateUserStatusApi({userId:id, status: value}).then(res =>{
            console.log(res.data)
            let userr = users.find(item=>item.id === id)
            userr.status = value ? "active" : "deactive"
            userr.loadingStatus = false
            setUsers([...users])
        })
            .catch(()=>{
                let userr = users.find(item=>item.id === id)
                userr.loadingStatus = false
                setUsers([...users])
            })
        console.log(id)
    }

    return (
        <div className="containerr">
            <h2 className="my-3 font-bold">Users:</h2>
            <Table
                rowKey={record => record.id}
                columns={columns}
                dataSource={users}
            />
        </div>
    );
}

export default UsersPage;
