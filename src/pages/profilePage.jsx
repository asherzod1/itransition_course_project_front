import {
    Avatar,
    Button,
    Card,
    Col,
    Row,
    Modal,
    Form,
    Input,
    Upload,
    message,
    Collapse,
    Skeleton,
    Spin,
    Empty, Select
} from "antd";
import {
    EditOutlined,
    EllipsisOutlined,
    SettingOutlined,
    PlusOutlined,
    EyeOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import {useEffect, useState} from "react";
import CKEditorComponent from "../components/CKEditorComponent.jsx";
import {
    deleteCollectionApi,
    editCollectionApi,
    getCollectionApi, getTopicsApi,
    postCollectionApi
} from "../api/config/CollectionCrud.js";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {initializeApp} from "firebase/app";
import {useNavigate} from "react-router-dom";
import {useTranslation} from "react-i18next";

const {Meta} = Card;


function ProfilePage({language}) {
    const {t} = useTranslation()

    const firebaseConfig = {
        apiKey: "AIzaSyBAxgWksKw01MYa4JjSTa1pFB34wBuPUMM",
        authDomain: "vivid-zodiac-374113.firebaseapp.com",
        projectId: "vivid-zodiac-374113",
        storageBucket: "vivid-zodiac-374113.appspot.com",
        messagingSenderId: "780263920596",
        appId: "1:780263920596:web:de38f32031391a2cd03c41",
        measurementId: "G-QDQK4JBJ7P"
    };
    const app = initializeApp(firebaseConfig);
    const storage = getStorage(app);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const postCollection = (values) => {
        setPostCollectionLoading(true)
        let extraFieldss = extraFields.filter(item => (item.value !== "" && item.value !== null && item.value !== undefined))
        const data = {
            ...values,
            extraFields: extraFieldss,
            photo: newPhotoUrl
        }
        if(editId){
            editCollectionApi(editId, data).then(res => {
                console.log(res)
                setFileList([])
                setExtraFields([])
                setNewPhotoUrl("")
                deleteImg()
                setEditId(null)
                getCollectionApi().then(res => {
                    console.log(res)
                    setCollections(res.data)
                    setPostCollectionLoading(false)
                    setCollectionLoading(false)
                    setIsModalOpen(false);
                    message.success("Collection created successfully")
                })
            })
                .catch(()=>{
                    message.error("Something went wrong")
                })
        }
        else {
            postCollectionApi(data).then(res => {
                console.log(res)
                setFileList([])
                setExtraFields([])
                setNewPhotoUrl("")
                deleteImg()
                getCollectionApi().then(res => {
                    console.log(res)
                    setCollections(res.data)
                    setPostCollectionLoading(false)
                    setCollectionLoading(false)
                    setIsModalOpen(false);
                    message.success("Collection created successfully")
                })
            })
                .catch(()=>{
                    message.error("Something went wrong")
                })
        }
    }

    const deleteCollection = (id) => {
        console.log(id)
        deleteCollectionApi(id).then(res => {
            console.log(res)
            setCollections(collections.filter(item => item.id !== id))
        })
    }

    const [editId, setEditId] = useState(null)
    const editCollection = (id) => {
        setEditId(id)
        setIsModalOpen(true)
        let collection = collections.find(item => item.id === id)
        form.setFieldsValue(collection)
        collection.extraFields.forEach(item => {
            extraFields.find(item2 => item2.type === item.type).value = item.value
        })
        setExtraFields([...extraFields])
        setFileList([{url: `${collection.photo}`}])
        setNewPhotoUrl(collection.photo)
    }

    const collectionModalClose = () => {
        setIsModalOpen(false)
        setFileList([])
        form.resetFields()
        setEditId(null)
    }

    const [extraFields, setExtraFields] = useState([
        {
            type: "checkbox",
            value: "",
        },
        {
            type: "date",
            value: "",
        },
        {
            type: "string",
            value: "",
        },
        {
            type: "text",
            value: "",
        },
        {
            type: "integer",
            value: null,
        },
    ])

    const onChangeExtraFields = (value, type) => {
        let element = extraFields.find(item => item.type === type)
        element.value = value
        setExtraFields([...extraFields])
    }


    const [fileList, setFileList] = useState([]);
    const handleChange = (info) => {
        setFileList(info.fileList);
        // if (info.fileList.length !== 0) {
        //     let fileListInfo = [...info.fileList];
        //     setFileList(fileListInfo);
        //
        // }
    };

    const handleChangeSelect = (value) => {
        console.log(`selected ${value}`);
    };
    const handleUpload = async (info) => {
        console.log(info)
        const storageRef = ref(storage, 'images/' + info.file.name);
        const uploadTask = uploadBytesResumable(storageRef, info.file);
        uploadTask.on('state_changed',
            (snapshot) => {
                // Track upload progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload progress:', progress);
                // Update UI with progress if needed
                info.onSuccess('ok')

            },
            (error) => {
                // Handle upload error
                console.error('Error uploading file:', error);
                message.error('Upload failed');
                info.onError('error')
            },
            () => {
                // Upload completed successfully
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // Perform any additional logic with the downloadURL if needed
                    console.log('Download URL:', downloadURL);
                    setNewPhotoUrl(downloadURL)
                    message.success('File uploaded successfully');
                });
            }
        );

        // Start the upload
        uploadTask.resume();
    };
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const deleteImg = () => {
        setFileList([])
    }
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    }

    const handleCancelPreviewModal = () => setPreviewOpen(false);

    const uploadButton = (
        <div>
            <PlusOutlined/>
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>)

    const [form] = Form.useForm();
    const [postCollectionLoading, setPostCollectionLoading] = useState(false);
    const [newPhotoUrl, setNewPhotoUrl] = useState('');

    const itemsCollapse = [
        {
            key: '1',
            label: t('addCheckbox'),
            children: <div>
                <Input
                    value={extraFields.find(item=>item.type ==="checkbox")?.value}
                    placeholder={t('enterFieldName')}
                    onChange={(e)=>onChangeExtraFields(e.target.value, "checkbox")}
                />
            </div>,
        },
        {
            key: '2',
            label: t('addDate'),
            children: <div>
                <Input
                    value={extraFields.find(item=>item.type ==="date")?.value}
                    placeholder={t('enterFieldName')}
                    onChange={(e)=>onChangeExtraFields(e.target.value, "date")}
                />
            </div>,
        },
        {
            key: '3',
            label: t('addString'),
            children: <div>
                <Input
                    value={extraFields.find(item=>item.type ==="string")?.value}
                    placeholder={t('enterFieldName')}
                    onChange={(e)=>onChangeExtraFields(e.target.value, "string")}
                />
            </div>,
        },
        {
            key: '4',
            label: t('addText'),
            children: <div>
                <Input
                    value={extraFields.find(item=>item.type ==="text")?.value}
                    placeholder={t('enterFieldName')}
                    onChange={(e)=>onChangeExtraFields(e.target.value, "text")}
                />
            </div>,
        },
        {
            key: '5',
            label: t('addInteger'),
            children: <div>
                <Input
                    value={extraFields.find(item=>item.type ==="integer")?.value}
                    placeholder={t('enterFieldName')}
                    onChange={(e)=>onChangeExtraFields(e.target.value, "integer")}
                />
            </div>,
        },
    ];
    const onChangeCollapse = (key) => {
        console.log(key);
    };

    let navigate = useNavigate()
    const viewCollection = (id) => {
        navigate("/collection/"+id)
    }

    const [collectionLoading, setCollectionLoading] = useState(true);
    const [collections, setCollections] = useState([])
    const [topics, setTopics] = useState([])
    useEffect(() => {
        getCollectionApi().then(res => {
            console.log(res)
            setCollections(res.data)
            setCollectionLoading(false)
        })
        getTopicsApi().then(res => {
            setTopics(res.data.map(item => ({
                label: item.name,
                value: item.id
            })))
        })
    }, [language])

    return (
        <div className="containerr mt-[40px]">
            <div className="mb-[30px] flex justify-between items-center">
                <h2 className="my-5 font-bold">{t('collections')}:</h2>
                <Button type={"primary"} onClick={() => showModal()}>
                    <PlusOutlined/>
                    {t('add')}
                </Button>
            </div>
            <Row wrap={true} gutter={[16, 16]}>
                {
                    collectionLoading ?
                    <div className="w-full h-[60vh] flex justify-center items-center">
                        <Spin size="large" />
                    </div>
                    : collections?.length < 1 ?
                            <div className="w-full h-full flex items-center justify-center">
                                <Empty description={"No Collections"} />
                            </div>
                        :
                    collections?.map(collection => (
                        <Col key={collection.id} xs={{span:24}} sm={{span:12}} md={{span:8}} xl={{span:6}}>
                            <Card
                                shadow={true}
                                style={{
                                    width: '100%',
                                }}
                                cover={
                                    // <CollectionImage photo={collection.photo} />
                                    <img
                                        alt="example"
                                        src={collection.photo}
                                        className="object-cover h-[220px] w-full"
                                    />
                                }
                                actions={[
                                    <EyeOutlined onClick={() => viewCollection(collection.id)} style={{fontSize: '20px'}} key="view"/>,
                                    <EditOutlined onClick={()=>editCollection(collection.id)} style={{fontSize: '20px'}} key="edit"/>,
                                    <DeleteOutlined onClick={()=>deleteCollection(collection.id)} style={{fontSize: '20px', color:"#f5222d"}} key="delete"/>,
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
                                            <div>
                                                Topic: {collection.topic.name}
                                            </div>
                                        </div>

                                    }
                                />
                            </Card>
                        </Col>
                    ))
                }
            </Row>

            <Modal
                title={<h3>{t('collection')}</h3>}
                open={isModalOpen}
                footer={null}
                onCancel={() => {
                    collectionModalClose()
                }}
            >
                <Form
                    name={"collection"}
                    onFinish={postCollection}
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
                        name="description_en"
                        label="Description EN"
                        rules={[
                            {
                                required: true,
                                message: 'Description EN ' + t('required') + ' !',
                            },
                        ]}
                    >
                        <CKEditorComponent />
                    </Form.Item>
                    <Form.Item
                        name="description_uz"
                        label="Description UZ"
                        rules={[
                            {
                                required: true,
                                message: 'Description UZ ' + t('required') + ' !',
                            },
                        ]}
                    >
                        <CKEditorComponent/>
                    </Form.Item>
                    <Form.Item
                        name="idTopic"
                        label="Topic"
                        rules={[
                            {
                                required: true,
                                message: 'Topic ' + t('required') + ' !',
                            },
                        ]}
                    >
                        <Select
                            style={{
                                width: '100%',
                            }}
                            onChange={handleChangeSelect}
                            tokenSeparators={[',']}
                            options={topics}
                        />
                    </Form.Item>
                    <Form.Item label="" name="photo" valuePropName="fileList" getValueFromEvent={normFile}
                               isList={false}>
                        <Upload
                            name="image"
                            // action={handleImageUpload}
                            // beforeUpload={() => false}
                            fileList={fileList}
                            customRequest={handleUpload}
                            listType="picture-card"
                            onPreview={(file) => handlePreview(file)}
                            onChange={handleChange}
                            onRemove={deleteImg}
                            // beforeUpload={() => false}
                            maxCount={1}
                            accept=".jpg, .jpeg, .png, .pdf"
                        >
                            {
                                fileList.length > 0 ? '' : uploadButton
                            }
                        </Upload>
                        <label className='upload-label text-center'> {t('uploadImage')}</label>

                    </Form.Item>
                    <Collapse
                        items={itemsCollapse}
                        defaultActiveKey={['1']}
                        onChange={onChangeCollapse}
                        expandIcon={({isActive}) =>
                            isActive ? <PlusOutlined/> : <PlusOutlined/>
                        }
                    />
                    <div className="flex justify-end mt-4">
                        {
                            editId ?
                                <Button
                                    type={"primary"}
                                    htmlType={"submit"}
                                    loading={postCollectionLoading}
                                >
                                    Edit collection
                                </Button>
                                :
                                <Button
                                    type={"primary"}
                                    htmlType={"submit"}
                                    loading={postCollectionLoading}
                                >
                                    Create collection
                                </Button>
                        }
                    </div>
                </Form>
            </Modal>
            <Modal open={previewOpen} title={""} footer={null} onCancel={handleCancelPreviewModal}>
                <img
                    alt="example"
                    style={{
                        width: '100%',
                    }}
                    src={previewImage}
                />
            </Modal>
        </div>
    );
}

export default ProfilePage;
