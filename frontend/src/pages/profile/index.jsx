import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import styles from "./index.module.css"
import { useDispatch, useSelector } from 'react-redux'
import { BASE_URL, clientServer } from '@/config';
import { useRouter } from 'next/router';
import { getAboutUser } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/DashboardLayout';
import { getAllPost } from '@/config/redux/action/postAction';

export default function index() {

    const authState = useSelector((state) => state.auth);
    const postState = useSelector((state) => state.post);
    const router = useRouter();
    const dispatch = useDispatch();

    const [userProfile, setUserProfile] = useState({});

    const [userPosts, setUserPosts] = useState([]);

    const [isModal, setIsModal] = useState(false);
    const [isModals, setIsModals] = useState(false);

    useEffect(() => {

        if (localStorage.getItem("token") == null) {
            router.push("/login");
        }

        dispatch(getAboutUser({ token: localStorage.getItem("token") }));
        dispatch(getAllPost());


    }, []);

    useEffect(() => {



    }, [postState.post, userProfile]);


    useEffect(() => {
        return () => {
            setUserPosts([]);
        }
    }, [])

    useEffect(() => {

        if (authState.user != undefined) {
            setUserProfile(authState.user);

            let posts = postState.post.filter((post) => {
                return post.userId.username === authState.user.userId.username
            })

            // setUserPosts(posts);


        }

    }, [authState.user, postState.post]);





    const updateProfilePicture = async (file) => {

        try {

            const formData = new FormData();

            formData.append("profile_picture", file);
            formData.append("token", localStorage.getItem("token"));

            const response = await clientServer.post("/update_profile_picture", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            dispatch(getAboutUser({ token: localStorage.getItem("token") }));
        }

        catch (err) {
            console.error(err);
        }
    }

    const handleUpdateData = async () => {

        const updateUser = await clientServer.post("/user_update", {
            token: localStorage.getItem("token"),
            name: userProfile.userId.name
        })

        const updateProfile = await clientServer.post("/update_profile_data", {
            token: localStorage.getItem("token"),
            bio: userProfile.bio,
            currentPost: userProfile.currentPost,
            pastWork: userProfile.pastWork,
            education: userProfile.education,
        });


        await dispatch(getAboutUser({ token: localStorage.getItem("token") }));

    }



    const [inputData, setInputData] = useState({ company: "", position: "", years: "" })

    const [educationData, setEducationData] = useState({ school: "", degree: "", fieldOfStudy: "" })

    const handleWorkChange = (e) => {
        const { name, value } = e.target;

        setInputData({ ...inputData, [name]: value });

    }

    const handleAddEducation = (e) => {

        setEducationData({ ...educationData, [e.target.name]: e.target.value })
    }


    const deleData = async (data_id) => {
        console.log(data_id)
        const res = await clientServer.post("/posts/delete_post_data", {
            id: data_id,
            token: localStorage.getItem("token")
        })

        await dispatch(getAboutUser({ token: localStorage.getItem("token") }))

    }

    const handleDeletePastWork = async (data_id) => {
        console.log(data_id)
        const res = await clientServer.post("/posts/delete_pastwork", {
            id: data_id,
            token: localStorage.getItem("token")
        })

        console.log(res);
        await dispatch(getAboutUser({ token: localStorage.getItem("token") }))

    }


    return (

        <UserLayout>
            {authState.user && userProfile.userId &&

                <div className={styles.main_container}>
                    <div className={styles.container}>
                        <div>
                            <div className={styles.background_container}>
                                {/* // backDrop is for banner  */}
                                <div className={styles.backDrop}> </div>
                                <label htmlFor='updateProfilePic' className={styles.backDrop_overlay}>
                                    <p>Edit</p>

                                </label>
                                <input
                                    onChange={(e) => {
                                        updateProfilePicture(e.target.files[0])
                                    }}
                                    hidden type="file" id='updateProfilePic' />

                                <img src={`${BASE_URL}/${userProfile.userId.profilePic}`} alt="" />
                            </div>




                            <div style={{ paddingTop: "5rem" }} className={styles.userprofile_container}>
                                <div style={{ display: "flex", gap: "0.7rem" }} className={styles.profileContainer}>
                                    <div style={{ flex: "0.8" }}>

                                        <div className={styles.update_Btn_Container} >

                                            <input type="text" className={styles.updateUser} value={userProfile.userId.name} name='name'
                                                onChange={(e) => {
                                                    setUserProfile({ ...userProfile, userId: { ...userProfile.userId, name: e.target.value } })
                                                }}
                                            />


                                            {
                                                userProfile != authState.user &&
                                                <button
                                                    onClick={handleUpdateData}
                                                    style={{ fontSize: "1rem" }}
                                                    className={styles.connectBtn}> Update Profile
                                                </button>
                                            }

                                        </div>
                                        <p style={{ paddingInline: " 1.1rem" }}>@{userProfile.userId.username}</p>

                                        <div className={styles.profileDetails} style={{ marginBlock: "0.5rem" }}>

                                            <div style={{ display: "flex" }}>

                                                <textarea
                                                    placeholder='Add Bio'
                                                    value={userProfile.bio}
                                                    onChange={(e) => {
                                                        setUserProfile({ ...userProfile, bio: e.target.value })

                                                    }}
                                                    // rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                                                    style={{ width: "90%" }}
                                                    name="" id=""></textarea>
                                            </div>

                                            <div style={{ display: "flex" }} >
                                                <textarea
                                                    placeholder='Add Your current position'
                                                    onChange={(e) => {
                                                        setUserProfile({ ...userProfile, currentPost: e.target.value })

                                                    }}
                                                    value={userProfile.currentPost}
                                                    // rows={Math.max(3, Math.ceil(userProfile.bio.length / 80))}
                                                    style={{ width: "86%" }}
                                                    name="" id=""></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>









                        {/* show pastWork history  */}

                        {userProfile.pastWork.length !== 0 ?


                            <div className={styles.workHistory_container} >

                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <p style={{ marginTop: "0.8rem", marginBottom: "0.5rem", fontSize: "1.5rem", fontWeight: 500 }}
                                    >Experience</p>

                                    <div
                                        onClick={() => {
                                            setIsModal(true);
                                        }}
                                        className={styles.addWork}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>

                                    </div>
                                </div>


                                <div>
                                    {userProfile.pastWork.map((data, idx) => {
                                        return (
                                            <div key={idx} className={styles.workHistory} style={{ paddingLeft: "1.5rem", display: "flex" }}>
                                                <div style={{ display: "flex", gap: "1rem" }}>
                                                    <img style={{ height: "50px", width: "50px" }} src="/images/ExperienceLogo.jpeg" alt="" />

                                                    <div>
                                                        <h4> {data.company}  </h4>
                                                        {data.position}
                                                        <p>{data.years} Years</p>
                                                    </div>

                                                </div>

                                                <div
                                                    className={styles.delete_profileData}

                                                    onClick={() => handleDeletePastWork(data._id)}
                                                >

                                                    <svg style={{ width: "1.5rem", opacity: 0.2 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                                                    </svg>


                                                </div>
                                            </div>
                                        )
                                    })}

                                </div>
                            </div>

                            : <div
                                onClick={() => {
                                    setIsModal(true);
                                }}

                                style={{}}
                                className={styles.addWork}>
                                Add Work
                            </div>

                        }





                        {/* show education deatails */}

                        {userProfile.education.length !== 0 ?

                            <div className={styles.workHistory_container}>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <p style={{ marginTop: "0.8rem", marginBottom: "0.5rem", fontSize: "1.5rem", fontWeight: 500 }}
                                    >Education</p>

                                    <div
                                        onClick={() => {
                                            setIsModals(true);
                                        }}
                                        className={styles.addWork}>

                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </div>
                                </div>



                                <div  >

                                    {userProfile.education.map((data, idx) => {
                                        return (
                                            <div key={idx} className={styles.workHistory} style={{ paddingLeft: "1.5rem", display: "flex" }}>

                                                <div style={{ display: "flex", gap: "1rem" }}>

                                                    <img style={{ height: "50px", width: "50px" }}
                                                        src="/images/EducationLogo.jpeg" />

                                                    <div>
                                                        <h4> {data.school}  </h4>
                                                        {data.degree}
                                                        <p>{data.fieldOfStudy} </p>
                                                    </div>
                                                </div>


                                                <div
                                                    className={styles.delete_profileData}
                                                    onClick={() => deleData(data._id)}
                                                >
                                                    <svg style={{ width: "1.5rem", opacity: 0.3 }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                                        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clipRule="evenodd" />
                                                    </svg>
                                                </div>

                                            </div>

                                        )
                                    })}

                                </div>
                            </div>

                            : <div
                                onClick={() => {
                                    setIsModals(true);
                                }}

                                style={{}}

                                className={styles.addWork}>
                                Education
                            </div>

                        }


                        {/*add education details */}


                        {isModals &&
                            <div
                                onClick={() => {
                                    setIsModals(false)
                                }}
                                id={styles.commentsContainer}>

                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        className={styles.allCommentContainer}>

                                        <input onChange={handleAddEducation} name='school' className={styles.inputFields} type="text" placeholder='School/College' />
                                        <input onChange={handleAddEducation} name='degree' className={styles.inputFields} type="text" placeholder='Course/Discipline' />
                                        <input onChange={handleAddEducation} name='fieldOfStudy' className={styles.inputFields} type="text" placeholder='fields of study' />

                                        <button
                                            onClick={() => {
                                                setUserProfile({ ...userProfile, education: [...userProfile.education, educationData] });
                                                setIsModals(false);
                                            }}
                                            className={styles.addBtn}
                                        >Add</button>

                                    </div>
                                </div>

                            </div>
                        }




                        {/*add pastWork History details */}

                        {isModal &&
                            <div
                                onClick={() => {
                                    setIsModal(false)

                                }}
                                id={styles.commentsContainer}>

                                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                                    <div
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        className={styles.allCommentContainer}>



                                        <input onChange={handleWorkChange} name='company' className={styles.inputFields} type="text" placeholder='Company' />
                                        <input onChange={handleWorkChange} name='position' className={styles.inputFields} type="text" placeholder='Position' />

                                        <input onChange={handleWorkChange} name='years' className={styles.inputFields} type="text" placeholder='years' />


                                        <button
                                            onClick={() => {
                                                setUserProfile({ ...userProfile, pastWork: [...userProfile.pastWork, inputData] });

                                                setIsModal(false);
                                            }}
                                            className={styles.addBtn}

                                        >Add</button>

                                    </div>
                                </div>

                            </div>
                        }




                        {


                            <div style={{ padding: "1rem", margin: '1rem 0 2.5rem 0',}}>
                                <h3>Recent Activity</h3>
                                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap" }} >


                                    {postState.post.filter(post => post.userId._id == authState.user.userId._id).map((post) => {
                                        return (

                                            <div key={post._id} className={styles.postCard} style={{ width: "45%" }}>

                                                <div className={styles.card} >

                                                    <div className={styles.postContainer} >

                                                        {post.media !== "" ? <img style={{ width: '90px' }} src={`${BASE_URL}/${post.media}`} />
                                                            :

                                                            <div style={{ width: "3.5rem", height: "3.6rem" }}>
                                                                <p>{post.body}</p>
                                                            </div>}

                                                        <p style={{ maxHeight: "3.4rem" }}>{post.body.substring(0, 30)}......</p>
                                                    </div>



                                                </div>

                                            </div>
                                        )
                                    })}


                                </div>
                            </div>
                        }












                    </div>

                </div>

            }






        </UserLayout>
    )
}
