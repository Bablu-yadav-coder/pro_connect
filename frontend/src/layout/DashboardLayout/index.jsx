import React, { useEffect, useState } from 'react';
import styles from "./index.module.css"
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reset, setTokenIsThere } from '@/config/redux/reducer/authReducer';
import { BASE_URL } from '@/config';
import { createPost, getAllPost } from '@/config/redux/action/postAction';
import Flash from '@/Components/Flash';
import LeftsideBar from '@/Components/LeftsideBar';


export default function DashboardLayout({ children, setFlash }) {

    const router = useRouter();
    const dispatch = useDispatch();

    const authState = useSelector(state => state.auth)
    const [isModals, setIsModals] = useState(false);  /// used for popup create new post
    const [postMedia, setPostMedia] = useState();
    const [postContent, setPostContent] = useState('');


    useEffect(() => {
        if (localStorage.getItem("token") == null) {
            router.push("/");
        }
        dispatch(setTokenIsThere());
    });



    const handleNewPost = async () => {
        console.log(postMedia);
        console.log(postContent);

        await dispatch(createPost({ file: postMedia, body: postContent }))

        dispatch(getAllPost());

        // <Flash >  {message  : "New Post Created!", severity : "success", open : true}</Flash>


        setPostMedia(null);
        setPostContent('');
        setIsModals(false)


    }


    return (
        <>


            <div className="container">


                <div className={styles.homeContainer}>

                    <div>
                        <LeftsideBar setIsModals={setIsModals} />


                    </div>
                    <div style={{ padding: "0.8rem" }} className={styles.homeContainer_feedContainer}>


                        {children}


                    </div>



                    <div className={styles.homeContainer_extraContainer}>


                        <h3>Top Profiles</h3>
                        {authState.user && authState.user && 
                            authState.all_users.filter(user => user.userId._id !== authState.user.userId._id).map((user, idx) => {

                                return (




                                    <div key={idx} className={styles.right_container}

                                        onClick={() => {
                                            router.push(`/view_profile/${user.userId.username}`)
                                        }}

                                    >


                                        <img className={styles.profilePicture} src={`${BASE_URL}/${user.userId.profilePic}`} alt="" />
                                        <div>

                                            <b style={{ display: "block" }}>{user.userId.name}</b>
                                            <i>{user.bio}</i>

                                        </div>

                                    </div>

                                )
                            })}

                    </div>











                </div>


            </div>




            <div className={styles.mobileNavbar}>

                <div onClick={() => {
                    router.push("/dashboard")
                }} >

                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                        <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
                    </svg>

                </div>


                <div onClick={() => {
                    router.push("/discover")
                }}>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>


                </div>


                <div onClick={() => {
                    router.push("/my_connections")
                }}

                >


                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                    </svg>


                </div>

            </div>




            {isModals &&



                <div className={styles.newPost_container}


                    onClick={(e) => {
                        e.stopPropagation()
                        setIsModals(false)
                    }}

                >

                    <div className={styles.create_post}

                        onClick={(e) => {
                            e.stopPropagation()
                        }}

                    >
                        <h3> Create a post</h3>


                        <div style={{ display: "flex", justifyContent: "end", cursor: "pointer", position: "relative" }}

                            onClick={() => {
                                setIsModals(false);
                            }}
                        >

                            <div style={{ width: "1.8rem", fontWeight: "700", textAlign: "end", position: "absolute", top: "-2.5rem" }}>

                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div style={{ display: "flex" }} >

                            <textarea


                                placeholder='Add Your Thoughts!'
                                onChange={(e) => setPostContent(e.target.value)}
                                rows={13}

                                value={postContent}
                                style={{ width: "100%", }}
                                name="" id=""></textarea>
                        </div>

                        <input

                            onChange={(e) => setPostMedia(e.target.files[0])}

                            type="file" hidden id='select_img' />


                        <div style={{ display: "flex", justifyContent: "space-between" }}>

                            <label for='select_img' style={{ fontSize: "0.8rem" }} className={styles.button}>Image</label>

                            <button className={styles.button}

                                onClick={handleNewPost}

                            >Post</button>
                        </div>


                    </div>
                </div>



            }

        </>
    )
}
