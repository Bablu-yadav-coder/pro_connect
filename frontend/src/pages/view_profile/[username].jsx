import { BASE_URL, clientServer } from '@/config';
import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import styles from "./index.module.css";
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import { getAllPost } from '@/config/redux/action/postAction';
import { getConnectionRequest, getMyConnections, sendConnectionRequest } from '@/config/redux/action/authAction';
import { setSelectedUser } from '@/config/redux/reducer/socketReducer';


export default function ViewProfile({ userProfile }) {

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const postState = useSelector((state) => state.post);
  const authState = useSelector((state) => state.auth);
  const [userPosts, setUserPosts] = useState([]);

  const [isCurrentUserInConnection, setIsCurrentUserInConnection] = useState(false);

  const [isConnectionNull, setIsConnectionNull] = useState(true);


  



  const getUserPosts = async () => {
    await dispatch(getAllPost());
    await dispatch(getConnectionRequest({ token: localStorage.getItem("token") }));
    await dispatch(getMyConnections({ token: localStorage.getItem("token") }));
  }


  useEffect(() => {
    let posts = postState.post.filter((post) => {
      return post.userId.username === router.query.username
    })

    setUserPosts(posts);

  }, [postState.post]);


  useEffect(()=> {
    return () => {
      setUserPosts([]);
    }
  }, [])


  useEffect(() => {

    if (authState.connections.some(user => user.connectionId._id === userProfile.userId._id)) {
      setIsCurrentUserInConnection(true);

      if (authState.connections.find(user => user.connectionId._id === userProfile.userId._id).status_accepted == true) {
        setIsConnectionNull(false);
      }
    }


    if (authState.connectionRequest.some(user => user.userId._id === userProfile.userId._id)) {
      setIsCurrentUserInConnection(true);

      if (authState.connectionRequest.find(user => user.userId._id === userProfile.userId._id).status_accepted == true) {
        setIsConnectionNull(false);
      }
    }
  }, [authState.connections, authState.connectionRequest])



  useEffect(() => {
    getUserPosts();
  }, [])




  return (
    <UserLayout>
      <DashboardLayout>


        <div className={styles.main_container}>

          <div className={styles.container}>

            <div>

              <div className={styles.background_container}>

                <div className={styles.backDrop}></div>

                <img src={`${BASE_URL}/${userProfile.userId.profilePic}`} alt="" />


              </div>


              <div style={{ paddingTop: "5rem" }} className={styles.userprofile_container}>

                <div style={{ display: "flex", gap: "0.7rem" }} className={styles.profileContainer}>

                  <div style={{ flex: "0.8", paddingInline: "1.5rem", paddingBottom: "1.5rem" }}>

                    <div style={{ display: "flex", width: "fit-content", alignItems: "center", gap: "1.2rem" }}>

                      <h2>{userProfile.userId.name}</h2>
                      <p>@{userProfile.userId.username}</p>
                    </div>
                    <div style={{ marginBlock: "0.5rem" }}>

                      <p >{userProfile.bio}</p>
                      <p>{userProfile.currentPost}</p>

                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>

                      {isCurrentUserInConnection ? <button className={styles.connectBtn}> {isConnectionNull ? "Pending" : "Connected"}</button>

                        :
                        <button onClick={async () => {

                          await dispatch(sendConnectionRequest({ token: localStorage.getItem("token"), userId: userProfile.userId._id }))
                        }} className={styles.connectBtn}>

                          connect
                        </button>

                      }


                      <button onClick={async () => {
                        await dispatch(setSelectedUser(userProfile.userId));
                        router.push("/message");
                      }} className={styles.connectBtn}>

                        Message
                      </button>


                      <div
                        onClick={async () => {
                          const response = await clientServer.get(`/user/download_resume?id=${userProfile.userId._id}`);

                          window.open(`${BASE_URL}/${response.data.message}`, "_blank")

                        }}

                        style={{ width: "1.2rem", cursor: "pointer" }}>

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>

                      </div>





                    </div>




                  </div>



                </div>


              </div>

            </div>








            {userProfile.pastWork.length !== 0 &&


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
                        <img style={{ height: "50px", width: "50px" }}
                        src="/images/ExperienceLogo.jpeg"/>


                        
                        <div>
                          <h4> {data.company}  </h4>
                          {data.position}
                          <p>{data.years} Years</p>
                        </div>

                      </div>

                    )
                  })}

                </div>
              </div>



            }










            {userProfile.education.length !== 0 &&

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

                        <img style={{ height: "50px", width: "50px" }}  src="/images/EducationLogo.jpeg" alt="" />
                        <div>
                          <h4> {data.school}  </h4>
                          {data.degree}
                          <p>{data.fieldOfStudy} </p>
                        </div>

                      </div>

                    )
                  })}

                </div>
              </div>



            }




            {userPosts.length !== 0 && 


              <div style={{ padding: "1rem", margin : '1rem 0 2.5rem 0'}} >

                <h3>Recent Activity</h3>
                
                {userPosts.map((post) => {
                  return (

                    <div key={post._id} className={styles.postCard}>

                      <div className={styles.card}>

                        <div className={styles.postContainer}>

                          {post.media !== "" ? <img src={`${BASE_URL}/${post.media}`} />
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



            }



          </div>

        </div>

      </DashboardLayout>
    </UserLayout>
  )
}



///////// server side rendering   ....................................................




export async function getServerSideProps(context) {

  const request = await clientServer.get("/user/get_user_based_on_username", {
    params: {
      username: context.query.username,
    }
  });
  const response = await request.data;

  return ({ props: { userProfile: response } });
}


