import {Col, Row, Space, Table, Tag, Avatar, Card, message, Button} from 'antd';
import {
    CommentOutlined,
    DeleteOutlined, DislikeOutlined, EditFilled,
    EditOutlined,
    EllipsisOutlined,
    EyeOutlined, LikeOutlined,
    SettingOutlined
} from '@ant-design/icons';
import {useEffect, useState} from "react";
import {getCollectionWithOutTokenApi} from "../api/config/CollectionCrud.js";
import {useNavigate} from "react-router-dom";
import {
    deleteLikeApi,
    editLikeApi,
    getCollectionItemApi,
    getTagsApi,
    postLikeApi
} from "../api/config/CollectionItemCrud.js";
import {getRandomColor} from "../helpers/functions.js";
import {useTranslation} from "react-i18next";
import {getUsersByIdApi} from "../api/config/userCrud.js";
import {TOKEN_ACCESS} from "../api/host.js";

const { Meta } = Card;




function Home({language}) {
    const {t} = useTranslation()
    const user = JSON.parse(localStorage.getItem("current_user"))
    console.log(user)
    const [tableLoading, setTableLoading] = useState(true)
    const getCollectionItems = () =>{
        setTableLoading(true)
        if(user?.id){
            getCollectionItemApi(user?.id).then(res=>{
                console.log(res.data)
                setCollectionItems(res.data)
                setTableLoading(false)
            })
                .catch(()=>{
                    message.error("Get collection items failed")
                    setTableLoading(false)
                })
        }
        else {
            getCollectionItemApi().then(res=>{
                console.log(res.data)
                setCollectionItems(res.data)
                setTableLoading(false)
            })
                .catch(()=>{
                    message.error("Get collection items failed")
                    setTableLoading(false)
                })
        }
    }
    const [collections, setCollections] = useState([])
    const [collectionItems, setCollectionItems] = useState([])
    const [tags, setTags] = useState([])

    useEffect(()=>{
        getCollectionWithOutTokenApi().then(res=>{
            console.log(res.data)
            setCollections(res.data)
        })
            .catch(()=>{
                message.error("Get collections failed")
            })
        getCollectionItems()
        getTagsApi().then(res=>{
            console.log(res.data)
            setTags(res.data)
        })
            .catch(()=>{
                message.error("Get tags failed")
            })
    },[language])

    useEffect(()=>{
        if(user){
            getUsersByIdApi(user?.id).then(res=>{
                console.log(res)
            })
                .catch(()=>{
                    localStorage.removeItem("current_user")
                    localStorage.removeItem(TOKEN_ACCESS)
                    window.location.href = "/login"
                })
        }
    },[])

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
    let navigate = useNavigate()
    const viewCollection = (id) => {
        navigate("/collection/"+id)
    }

    const [likeLoading, setLikeLoading] = useState(false)
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

    const goTags =(id) =>{
        navigate("/tags/"+id)
    }

    return (
        <div className={"containerr mt-[30px]"}>
            <h2 className="my-3">{t('collectionItems')}:</h2>
            <div className="" style={{border: '1px solid #ccc', borderRadius: "8px", boxShadow: "0 0 10px #ccc"}}>
                <Table
                    loading={tableLoading}
                    scroll={{x: 700}}
                    style={{ borderRadius:'8px'}}
                    rowKey={record => record.id}
                    columns={columns}
                    dataSource={collectionItems} />
            </div>
            <h2 className="my-5">{t('collections')}:</h2>
            <Row wrap={true} gutter={[16, 16]}>
                {
                    [...collections]?.map((collection) => {
                        return (
                            <Col key={collection.id} xs={{span:24}} sm={{span:12}} md={{span:8}} xl={{span:6}}>
                                <Card
                                    shadow={true}
                                    style={{
                                        width: '100%',
                                        border: '1px solid #ccc',
                                        boxShadow: "0 0 10px #ccc"
                                    }}
                                    cover={
                                        // <CollectionImage photo={collection.photo} />
                                        <img
                                            alt="example"
                                            src={collection.photo}
                                            className="object-cover h-[230px] w-[100%]"
                                        />
                                    }
                                    actions={[
                                        <div onClick={() => viewCollection(collection.id)} className="flex items-center justify-center font-bold">
                                            View
                                            <EyeOutlined  style={{fontSize: '20px', marginLeft:'10px'}} key="view"/>
                                        </div>,
                                    ]}
                                >
                                    <Meta
                                        title={collection.name}
                                        description={
                                            <div>
                                                <div dangerouslySetInnerHTML={{
                                                    __html: collection.description
                                                }}>
                                                </div>
                                                <div>Topic: {collection.topic.name}</div>
                                            </div>
                                        }
                                    />
                                </Card>
                            </Col>
                        )
                    })
                }
            </Row>
            <div className="mt-4 pb-[50px]">
                <h3>{t('tags')}:</h3>
                <div>
                    {
                        tags?.map((tag, index) => {
                            return (
                                <Tag onClick={()=>goTags(tag.id)} style={{cursor:"pointer"}} key={tag.id} color={getRandomColor()}>
                                    #{tag.name}
                                </Tag>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default Home;
