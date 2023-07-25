import React, {useEffect, useState} from 'react';
import {useNavigate, useParams} from "react-router-dom";
import {deleteLikeApi, editLikeApi, getCollectionItemByTagApi, postLikeApi} from "../api/config/CollectionItemCrud.js";
import {Button, message, Space, Table, Tag} from "antd";
import {CommentOutlined, DislikeOutlined, LikeOutlined} from "@ant-design/icons";
import {useTranslation} from "react-i18next";
import {getUsersByIdApi} from "../api/config/userCrud.js";
import {TOKEN_ACCESS} from "../api/host.js";

function ByTags({language}) {
    const user = JSON.parse(localStorage.getItem("current_user"))
    const navigate = useNavigate()
    const {id} = useParams()
    const {t} = useTranslation()
    const columns = [
        {
            title: t('name'),
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: t('tags'),
            key: 'tags',
            dataIndex: 'tags',
            render: (_, {tags}) => (
                <>
                    {tags.map((tag) => {
                        let color = tag.length > 5 ? 'geekblue' : 'green';
                        if (tag === 'loser') {
                            color = 'volcano';
                        }
                        return (
                            <Tag color={color} key={tag}>
                                {tag.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },
        {
            title: 'Comment / Like / Dislike',
            dataIndex: 'age',
            key: 'age',
            render: (text, record) => (
                <>
                    <Space size="small">
                        <Space align={"center"} size={"small"} direction={"vertical"}>
                            <Button onClick={()=>navigate(`/comment/${record.id}`)}>
                                <CommentOutlined />
                            </Button>
                            <div>{record.comments}</div>
                        </Space>
                        <Space align={"center"} size={"small"} direction={"vertical"}>
                            <Button disabled={!user} type={record.like?.userValue === true ? "primary" : "default"}  onClick={()=>setLike(record.id, true, record.like?.userValue, record.like.userLikeId)}>
                                <LikeOutlined />
                            </Button>
                            <div>{record.like?.likes}</div>
                        </Space>
                        <Space align={"center"} size={"small"} direction={"vertical"}>
                            <Button disabled={!user} type={record.like?.userValue === false ? "primary" : "default"} onClick={()=>setLike(record.id, false, record.like?.userValue, record.like.userLikeId)}>
                                <DislikeOutlined />
                            </Button>
                            <div>{record.like?.dislikes}</div>
                        </Space>
                    </Space>
                </>
            )
        },
    ];
    const [likeLoading, setLikeLoading] = useState(false)
    const [collectionItems, setCollectionItems] = useState([])
    const setLike = (id, value, isUserSelected, editLikeId) => {
        setLikeLoading(true)
        if(String(isUserSelected) === String(value)){
            console.log("same")
            deleteLikeApi(editLikeId).then((res) => {
                message.success("Success")
                setLikeLoading(false)
                getCollectionItems()
            })
                .catch(()=>{
                    message.error("Error")
                    setLikeLoading(false)
                })
        }
        else if(isUserSelected === 'none'){
            postLikeApi({collectionItemId: id, value}).then((res) => {
                message.success("Success")
                setLikeLoading(false)
                getCollectionItems()
            })
                .catch(()=>{
                    message.error("Error")
                    setLikeLoading(false)
                })
        }
        else {
            if(editLikeId){
                editLikeApi(editLikeId, {collectionItemId: id, value}).then((res) => {
                    message.success("Success")
                    setLikeLoading(false)
                    getCollectionItems()
                })
                    .catch(()=>{
                        message.error("Error")
                        setLikeLoading(false)
                    })
            }
        }
    }
    const [loading, setLoading] = useState(true)
    const getCollectionItems = () => {
        getCollectionItemByTagApi(id, user?.id).then(res=>{
            setCollectionItems(res.data)
            setLoading(false)
        })
            .catch(()=>{
                setLoading(false)
                message.error("Error")
            })
    }
    useEffect(()=>{
        getCollectionItems()
        if(user){
            getUsersByIdApi(user?.id).then(res=>{
                if(res.data.user.id !== Number(user?.id)){
                    localStorage.removeItem("current_user")
                    localStorage.removeItem(TOKEN_ACCESS)
                    navigate("/login")
                }
            })
                .catch(()=>{
                    localStorage.removeItem("current_user")
                    localStorage.removeItem(TOKEN_ACCESS)
                    navigate("/login")
                })
        }
    },[])
    return (
        <div className={"containerr mt-[30px]"}>
            <h2 className="my-3">{t('collectionItems')}:</h2>
            <div className="" style={{border: '1px solid #ccc', borderRadius: "8px", boxShadow: "0 0 10px #ccc"}}>
                <Table
                    loading={loading}
                    scroll={{x: 700}}
                    style={{ borderRadius:'8px'}}
                    rowKey={record => record.id}
                    columns={columns}
                    dataSource={collectionItems} />
            </div>
        </div>
    );
}

export default ByTags;
