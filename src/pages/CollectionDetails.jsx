import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getCollectionByIdApi} from "../api/config/CollectionCrud.js";
import { CommentOutlined, LikeOutlined, DislikeOutlined, DeleteOutlined, EditFilled  } from '@ant-design/icons';
import {
    Button,
    Checkbox,
    Collapse,
    DatePicker, Empty,
    Form,
    Input,
    InputNumber, message,
    Modal,
    Select,
    Space, Spin,
    Table,
    Tag,
    Upload
} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import CKEditorComponent from "../components/CKEditorComponent.jsx";
import TextArea from "antd/es/input/TextArea.js";
import {
    deleteCollectionItemApi, deleteLikeApi, editCollectionItemApi, editLikeApi,
    getCollectionItemByCollectionIdApi, getTagsApi,
    postCollectionItemApi, postLikeApi
} from "../api/config/CollectionItemCrud.js";
import dayjs from "dayjs";
import 'dayjs/locale/en';
import weekday from 'dayjs/plugin/weekday';
import localeData from "dayjs/plugin/localeData"
import en_US from "antd/lib/locale/en_US";
import {useTranslation} from "react-i18next";
import {getUsersByIdApi} from "../api/config/userCrud.js";
import {TOKEN_ACCESS} from "../api/host.js";
dayjs.extend(weekday);
dayjs.extend(localeData)



function CollectionDetails({language}) {
    const {t} = useTranslation()
    const user = JSON.parse(localStorage.getItem("current_user"))
    const navigate = useNavigate()
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
                            <div>{parseInt(Number(record.comments)/2)}</div>
                        </Space>
                        <Space align={"center"} size={"small"} direction={"vertical"}>
                            <Button disabled={user?.id ? false : true} type={record.like?.userValue === true ? "primary" : "default"}  onClick={()=>setLike(record.id, true, record.like?.userValue, record.like.userLikeId)}>
                                <LikeOutlined />
                            </Button>
                            <div>{record.like?.likes}</div>
                        </Space>
                        <Space align={"center"} size={"small"} direction={"vertical"}>
                            <Button disabled={user?.id ? false : true} type={record.like?.userValue === false ? "primary" : "default"} onClick={()=>setLike(record.id, false, record.like?.userValue, record.like.userLikeId)}>
                                <DislikeOutlined />
                            </Button>
                            <div>{record.like?.dislikes}</div>
                        </Space>
                    </Space>
                </>
            )
        },
    ];
    const {id} = useParams();
    const [collection, setCollection] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form] = Form.useForm();
    const postCollectionItem = (values) => {
        setPostCollectionLoading(true)
        console.log(values)
        const data = {...values}
        delete data.name_uz
        delete data.name_en
        delete data.tags
        let extraF = []
        Object.entries(data).forEach(([key, value]) => {
            if(value !== null && value !== undefined && value !== ''){
                let type = extraFields.find(item => item.value === key)?.type
                extraF.push({
                    name: key,
                    value,
                    type
                })
            }
        })
        console.log(extraF)
        let postData = {
            name_uz: values.name_uz,
            name_en: values.name_en,
            extraFields: extraF,
            collectionId: collection?.id,
            tags: values.tags
        }
        if(editId){
            editCollectionItemApi(editId, postData).then(res =>{
                message.success("Edited")
                getCollectionItems()
                resetForm()
                addCollectionModalClose()
                setPostCollectionLoading(false)
                setEditId(null)
            })
                .catch(()=>{
                    message.error("Error")
                    setPostCollectionLoading(false)
                })
        }
        else {
            postCollectionItemApi(postData).then(res =>{
                message.success("Created")
                getCollectionItems()
                resetForm()
                addCollectionModalClose()
                setPostCollectionLoading(false)
            })
                .catch(()=>{
                    message.error("Error")
                    setPostCollectionLoading(false)
                })
        }

    }
    const addCollectionModalOpen = () => {
        getTags()
        setIsModalOpen(true)
    }

    const addCollectionModalClose = () => {
        setIsModalOpen(false)
        setEditId(null)
        form.resetFields()
    }

    const handleChange = (value) => {
        console.log(`selected ${value}`);
    };
    const options = [];
    for (let i = 10; i < 36; i++) {
        options.push({
            value: i.toString(36) + i,
            label: i.toString(36) + i,
        });
    }

    const [dataForTable, setDataForTable] = useState([])
    const [pageLoading, setPageLoading] = useState(true)
    const [tableLoading, setTableLoading] = useState(true)
    const [tableColumns, setTableColumns] = useState([])
    const [postCollectionLoading, setPostCollectionLoading] = useState(false);
    const [extraFields, setExtraFields] = useState([])


    const deleteCollectionItem = (id) => {
        deleteCollectionItemApi(id).then(res => {
            message.success("Deleted")
            getCollectionItems()
        })
            .catch(err => {
                message.error("Error")
            })
    }

    const [editId, setEditId] = useState(null)
    const resetForm = () => {
        form.resetFields()
        setEditId(null)
    }
    const getCollectionItems =() =>{
        getCollectionItemByCollectionIdApi(id, user?.id).then(res => {
            console.log(res)
            let dataa = res.data.map(item => {
                let obj = {}
                item.extraFields.forEach(item => {
                    obj[item.name] = item.value.split("T")[0]
                })
                return {
                    ...item,
                    ...obj
                }
            })
            console.log(dataa)
            setDataForTable(dataa)
            setTableLoading(false)
        })
    }

    let action = {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="small">
                <Button disabled={user?.id ? false : true} onClick={()=>editCollectionItem(record)} style={{color:"#00A000"}}>
                    <EditFilled />
                </Button>
                <Button disabled={user?.id ? false : true} onClick={()=>deleteCollectionItem(record.id)} type={"primary"} danger={true}>
                    <DeleteOutlined />
                </Button>
            </Space>
        ),
    }
    useEffect(() => {
        getCollectionByIdApi(id).then( res => {
            console.log(res)
            setCollection(res.data)
            setPageLoading(false)
            const parsedExtraFields = res.data?.extraFields;
            setExtraFields(parsedExtraFields)
            let newColumns = parsedExtraFields.map(item => {
                if(item.type === "checkbox"){
                    return {
                        title: item.value,
                        dataIndex: item.value,
                        key: item.value,
                        render: (_, record) => (
                            <>
                                <Checkbox disabled={true} checked={record[item.value]} />
                            </>
                        )
                    }
                }
                return {
                    title: item.value,
                    dataIndex: item.value,
                    key: item.value,
                }
            })
            console.log([...columns, ...newColumns, action])
            setTableColumns([...columns, ...newColumns, action])
        })
        getCollectionItems()
    }, [language])

    useEffect(()=>{
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
    function isValidDateFormat(dateString) {
        const date = new Date(dateString);
        return !isNaN(date) && date.toString() !== 'Invalid Date';
    }
    const editCollectionItem = (item) => {
        getTags()
        console.log(item)
        let newItem = {...item}
        setEditId(item.id)
        Object.entries(newItem).forEach(([key, value]) => {
            if(!Number.isInteger(value) && typeof value !== "number" && typeof value !== "boolean" && value !== null && value !== undefined && value !== ''){
                if(isValidDateFormat(value)){
                    newItem[key] = dayjs(value)
                }
            }
            if(/^-?\d+$/.test(value)){
                newItem[key] = parseInt(value)
            }
        })
        form.setFieldsValue(newItem)
        setIsModalOpen(true)
    }
    const [tags, setTags] = useState([]);
    const getTags = () =>{
        getTagsApi().then(res => {
            console.log(res)
            let data = res.data.map(item => {
                return {
                    key: item.id,
                    value: item.name,
                    label: item.name
                }
            })
            console.log(data)
            setTags(data)
        })
            .catch(()=>{
                message.error("Error")
            })
    }

    const [likeLoading, setLikeLoading] = useState(false)
    console.log(dataForTable)
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

    return (
        <div className="containerr pb-5">
            {
                pageLoading ?
                    <div className="flex justify-center items-center h-[60vh]">
                        <Spin size="large"/>
                    </div>
                    :
                    <>
                        <div className="flex mt-[30px]">
                            <div className="w-[150px] md:w-[300px] md:h-[200px]">
                                <img className="w-full h-full rounded-[12px]" src={collection?.photo} alt="img"/>
                            </div>
                            <div className="flex-1 ml-[20px] py-[20px]">
                                <h3>
                                    {t('collectionName')}: <span className="font-bold">{collection?.name}</span>
                                </h3>
                                <h3>
                                    {t('description')}: <div className="mt-2 inline-block" dangerouslySetInnerHTML={{__html: collection?.description}}>
                                </div>
                                </h3>
                                <h3>
                                    {t('topic')}: {collection?.topic?.name}
                                </h3>
                                <h3>
                                    {t('createdAt')}: {collection?.createdAt?.split("T")[0]}
                                </h3>
                                <h3>
                                    {t('updatedAt')}: {collection?.updatedAt?.split("T")[0]}
                                </h3>
                            </div>
                        </div>
                        <div className="my-5">
                            <div className="flex justify-between">
                                <h2>{t('collectionItems')}:</h2>
                                <div>
                                    <Button disabled={user?.id ? false : true} type={"primary"} onClick={() => addCollectionModalOpen()}>
                                        <PlusOutlined/>
                                        {t('add')}
                                    </Button>
                                </div>
                            </div>
                            <div style={{border: '1px solid #ccc', borderRadius: "8px", boxShadow: "0 0 10px #ccc"}}>
                                {
                                    dataForTable?.length > 0 && tableColumns.length > 2 ?
                                        <Table
                                            scroll={{x: 700}}
                                            loading={tableLoading}
                                            rowKey={record => record.id}
                                            columns={tableColumns}
                                            dataSource={dataForTable}
                                        />
                                        :
                                        <div className="py-5">
                                            <Empty description={"No Collection Items"}/>
                                        </div>
                                }
                            </div>
                        </div>
                    </>
            }


            <Modal
                title={<h3>{t('collectionItem')}</h3>}
                open={isModalOpen}
                footer={null}
                onCancel={() => {
                    addCollectionModalClose()
                }}
            >
                <Form
                    name={"collectionItem"}
                    onFinish={postCollectionItem}
                    layout={"vertical"}
                    form={form}
                >
                    <Form.Item
                        name="name_en"
                        label="Name EN"
                        rules={[
                            {
                                required: true,
                                message: 'Name EN ' + t('required') + ' !',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="name_uz"
                        label="Name UZ"
                        rules={[
                            {
                                required: true,
                                message: 'Name UZ ' + t('required') + ' !',
                            },
                        ]}
                    >
                        <Input/>
                    </Form.Item>
                    <Form.Item
                        name="tags"
                        label="Tags"
                        rules={[
                            {
                                required: true,
                                message: 'Tags ' + t('required') + ' !',
                            },
                        ]}
                    >
                        <Select
                            mode="tags"
                            style={{
                                width: '100%',
                            }}
                            onChange={handleChange}
                            tokenSeparators={[',']}
                            options={tags}
                        />
                    </Form.Item>
                    {
                        extraFields?.map((item, index) => {
                            return (
                                item.type === "string" ?
                                    <Form.Item
                                        key={index}
                                        name={item.value}
                                        label={item.value}

                                    >
                                        <Input/>
                                    </Form.Item>
                                    : item.type === "text" ?
                                        <Form.Item
                                            key={index}
                                            name={item.value}
                                            label={item.value}

                                        >
                                            <TextArea/>
                                        </Form.Item>
                                        : item.type === "date" ?
                                            <Form.Item
                                                key={index}
                                                name={item.value}
                                                label={item.value}

                                            >
                                                <DatePicker
                                                    format={"YYYY-MM-DD"}
                                                />
                                            </Form.Item>
                                            : item.type === "integer" ?
                                                <Form.Item
                                                    key={index}
                                                    name={item.value}
                                                    label={item.value}

                                                >
                                                    <InputNumber/>
                                                </Form.Item>

                                                : item.type === "checkbox" ?
                                                    <Form.Item
                                                        key={index}
                                                        name={item.value}
                                                        label={item.value}
                                                        valuePropName="checked"
                                                    >
                                                        <Checkbox/>
                                                    </Form.Item>
                                                    : ''
                            )
                        })
                    }
                    <div className="flex justify-end">
                        <Button
                            type={"primary"}
                            htmlType={"submit"}
                            loading={postCollectionLoading}
                        >
                            {
                                editId ?
                                    t('edit')
                                    :
                                    t('create')
                            }
                        </Button>
                    </div>
                </Form>
            </Modal>
        </div>
    );
}

export default CollectionDetails;
