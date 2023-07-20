import {useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import {getCollectionItemByIdApi} from "../api/config/CollectionItemCrud.js";
import {Button, Empty, Input, message, Space} from "antd";
import { SendOutlined } from '@ant-design/icons';
import io from 'socket.io-client'
import {useTranslation} from "react-i18next";
import {BASE_URL} from "../api/host.js";

let socket = null
if(!socket){
    socket = io(BASE_URL)
}

function Comments({language}) {
    const {t} = useTranslation()
    const {id} = useParams()
    const [collectionItem, setCollectionItem] = useState(null)
    const [comments, setComments] = useState([])
    const [text, setText] = useState("")
    const sendMessage = () =>{
        if(text.trim().length > 0){
            socket.emit('send_comment', {collectionItemId: id, userId: user?.id, message: text})
            setText("")
            message.success("Comment sent")
        }
    }

    useEffect(()=>{
       getCollectionItemByIdApi(id).then(res=>{
              setCollectionItem(res.data)
           console.log(res.data)
       })
           .catch(()=>{
               message.error("Get collection item failed")
           })
    },[language])
    const user = JSON.parse(localStorage.getItem("current_user"))
    useEffect(() => {
        socket.emit('join_room', {collectionItemId: id, userId: user?.id})
        socket.on('comments', (data) => {
            console.log(data)
            setComments(data)
        })
    },[socket])
    return (
        <div className="containerr">
            <h2 className={"text-center font-bold mt-[30px]"}>
                {t('collectionItem') + ': ' +collectionItem?.name}
            </h2>
            <div className="px-[20px] py-[10px] flex flex-col h-[68vh] overflow-y-scroll rounded-[8px]" style={{border:'1px solid #ccc'}}>

                {
                    comments?.length < 1 ?
                        <div className="w-full h-full flex items-center justify-center">
                            <Empty description={"No comments"} />
                        </div>
                        :
                    comments?.map((item, index)=>{
                        if (item?.UserId === user?.id){
                            return (
                                <div key={index} className="block mb-2">
                                    <div className={"px-[20px] py-[10px] rounded-[20px] rounded-br-[4px] rounded-tr-[18px] bg-blue-50 inline-block float-right"} style={{border:"1px solid #ccc"}}>
                                        <h4 className="font-bold">
                                            {item?.user?.name}
                                        </h4>
                                        <p className="mb-2">
                                            {item?.text}
                                        </p>
                                    </div>
                                </div>
                            )
                        }
                        return (
                            <div key={index} className="block mb-2">
                                <div className={"px-[20px] py-[10px] rounded-[20px] rounded-bl-[4px] rounded-tl-[18px] bg-yellow-50 inline-block"} style={{border:"1px solid #ccc"}}>
                                    <h4 className="font-bold">
                                        {item?.user?.name}
                                    </h4>
                                    <p className="mb-2">
                                        {item?.text}
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className="px-[0px] mt-4">
                <Space.Compact style={{ width: '100%' }}>
                    <Input onChange={(e)=>setText(e.target.value)} placeholder={t('writeComment')} />
                    <Button disabled={user?.id ? false : true} onClick={()=>sendMessage()} type="primary"> <SendOutlined /> </Button>
                </Space.Compact>
            </div>
        </div>
    );
}

export default Comments;
