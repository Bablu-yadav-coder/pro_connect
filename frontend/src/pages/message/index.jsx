import React, { useEffect, useRef, useState } from 'react'
import styles from "./index.module.css"
import { useRouter } from 'next/router'
import { useDispatch, useSelector } from 'react-redux'
import UserLayout from '@/layout/UserLayout'
import { getAboutUser, getMessageParticipantsUser } from '@/config/redux/action/authAction'
import { BASE_URL, clientServer } from '@/config'
import { setSelectedUser, setMessages } from "@/config/redux/reducer/socketReducer"
import { getAllMessages } from '@/config/redux/action/socket/socketAction'
import { getSocket } from '@/Components/ChatWrapper/socket'
import LeftsideBar from '@/Components/LeftsideBar'


export default function Message() {
    const router = useRouter()
    const dispatch = useDispatch()
    const authState = useSelector(state => state.auth);
    const { selectedUser, messages } = useSelector(state => state.socketio);


    const [textMessage, setTextMessage] = useState();
    const [isModals, setIsModals] = useState();
    const chatScrollToTop = useRef(null);
    const scrollToTop = useRef(null);


    useEffect(() => {
        if (localStorage.getItem("token") === null) {
            router.push("/login");
        }
        dispatch(getMessageParticipantsUser());


    }, []);

    useEffect(() => {
        dispatch(getAboutUser({ token: localStorage.getItem("token") }))
        if (selectedUser) {
            dispatch(getAllMessages({ receiverId: selectedUser._id }));
        }

        scrollToTop.current.scrollTop = scrollToTop.current.scrollHeight;


    }, [selectedUser]);



    const sendMessage = async (msg) => {
        if (selectedUser) {
            const res = await clientServer.post("send_messages", {
                token: localStorage.getItem("token"),
                receiverId: selectedUser._id,
                message: msg
            });

            if (res.data.success) {
                dispatch(setMessages([...messages, res.data.newMessage]));

            }

            setTextMessage("");

        }
    }




    useEffect(() => {
        return () => {
            dispatch(setSelectedUser(null));
        }
    }, [])


    useEffect(() => {
        const socket = getSocket();

        socket?.on('newMessage', (newMessage) => {
            dispatch(setMessages([...messages, newMessage]));
        })

        if (chatScrollToTop.current) {
            chatScrollToTop.current.scrollTop =
                chatScrollToTop.current.scrollHeight;
        }
        return () => {
            socket?.off('newMessage');
        }
    }, [messages]);





    return (
        <UserLayout>

            <div className="container" ref={scrollToTop} >


                <div className={styles.homeContainer} >



                    <div className={styles.sidebar}>

                        <LeftsideBar setIsModals={setIsModals} />


                    </div>





                    <div style={{ padding: "0.8rem", flex: "0.18" }} className={styles.homeContainer_feedContainer}>


                        {authState.user &&
                            <div className={styles.right_container} >

                                <img className={styles.profilePicture} src={`${BASE_URL}/${authState.user.userId.profilePic}`} alt="" />
                                <div>

                                    <b style={{ display: "block" }}>{authState.user.userId.name}</b>

                                </div>
                            </div>}

                        <hr />


                        {authState.getMessageParticipants.length != 0 && authState.getMessageParticipants.conversation.map((participants, idx) => {


                            return (

                                participants.participants.map((user, idx) => {


                                    return (

                                        <div key={idx}
                                            onClick={() => {

                                                dispatch(setSelectedUser(user))

                                                console.log(scrollToTop)



                                            }}
                                            onDoubleClick={() => dispatch(setSelectedUser(null))}
                                        >

                                            {authState.user && user._id != authState.user.userId._id &&

                                                <div className={styles.right_container}>

                                                    <img className={styles.profilePicture} src={`${BASE_URL}/${user.profilePic}`} alt="" />
                                                    <div>

                                                        <i style={{ display: "block" }}>{user.name}</i>

                                                    </div>
                                                </div>
                                            }

                                        </div>

                                    )
                                })

                            )
                        })}

                    </div>







                    <div style={{ flex: "0.75", padding: "none" }} className={styles.homeContainer_extraContainer}>
                        {
                            selectedUser ?
                                <div className={styles.container_box} >

                                    <div

                                        onClick={() => {
                                            router.push(`/view_profile/${selectedUser.username}`)
                                        }}

                                        style={{ hover: "none" }} className={styles.ankit_bhai}>

                                        <img style={{ width: "3rem" }} className={styles.profilePicture} src={`${BASE_URL}/${selectedUser.profilePic}`} alt="" />
                                        <i> {selectedUser.username}</i>

                                    </div>



                                    <div className={styles.msg_container} >

                                        <div className={styles.message_container} id='chatBox' ref={chatScrollToTop} >

                                            {messages && messages.map((msg, idx) => {


                                                return (
                                                    <div key={idx} >

                                                        {msg.senderId === authState.user.userId._id ?

                                                            <div style={{ display: "flex", justifyContent: "end" }}>

                                                                <p className={styles.message_style} >{msg.message}</p>

                                                            </div>


                                                            : <div style={{ display: "flex", justifyContent: "start" }}>

                                                                <p className={styles.message_style2} >{msg.message}</p>

                                                            </div>


                                                        }


                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>


                                    <div className={styles.send_message}>


                                        <input onChange={(e) => setTextMessage(e.target.value)} value={textMessage} className={styles.inputFields} type="text" placeholder='Message' />
                                        <div className={styles.button}

                                            onClick={() => {
                                                sendMessage(textMessage);


                                            }}
                                        >
                                            Send &nbsp;&nbsp;
                                            <svg style={{ width: "1rem", }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                                            </svg>


                                        </div>

                                    </div>

                                </div>

                                :

                                <div className={styles.default_message_container}>

                                    <img style={{ width: "200px", borderRadius: "50%" }} src="/images/chat.avif" alt="" />
                                    <h1 className='font-medium'>Your messages</h1>
                                    <span>Send a message to start a chat.</span>


                                </div>
                        }
                    </div>


                </div>


            </div>
        </UserLayout>
    )
}
