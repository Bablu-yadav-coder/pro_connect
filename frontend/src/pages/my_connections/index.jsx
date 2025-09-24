import { BASE_URL } from '@/config';
import { acceptConnection, getConnectionRequest, getMyConnections } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from "./index.module.css"
import { useRouter } from 'next/router';

export default function MyConnectionPage() {

    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);
    const router = useRouter();

    useEffect(() => {
        dispatch(getMyConnections({ token: localStorage.getItem("token") }));
        dispatch(getConnectionRequest({ token: localStorage.getItem("token") }))
    }, []);

    useEffect(() => {

        if (authState.connectionRequest.length !== 0) {
            console.log(authState.connectionRequest);
        }

    }, [authState.connectionRequest])

    return (

        <UserLayout>

            <DashboardLayout>

                <div className="container" style={{}}>



                    <h2 style={{ marginBottom: "1rem", paddingInlineStart: "1.8rem" }}>Connections</h2>

                    {authState.connectionRequest.filter(connection => connection.status_accepted !== null).map((user, index) => {



                        return (
                            <div onClick={() => {
                                router.push(`/view_profile/${user.userId.username}`);
                            }}

                                key={index} className={styles.container} style={{ marginTop: " 0.5rem" }}>
                                <img className={styles.profileImg} src={`${BASE_URL}/${user.userId.profilePic}`} alt="" />
                                <div>
                                    <b>{user.userId.name}</b>
                                    <p>@{user.userId.username}</p>
                                </div>

                            </div>
                        )
                    })}




                    {authState.connections.filter(connection => connection.status_accepted !== null).map((user, index) => {




                        return (
                            <div onClick={() => {
                                router.push(`/view_profile/${user.connectionId.username}`);
                            }}

                                key={index} className={styles.container} style={{ marginTop: " 0.5rem" }}>
                                <img className={styles.profileImg} src={`${BASE_URL}/${user.connectionId.profilePic}`} alt="" />
                                <div>
                                    <b>{user.connectionId.name}</b>
                                    <p>@{user.connectionId.username}</p>
                                </div>

                            </div>
                        )
                    })}





                </div>


            </DashboardLayout>

        </UserLayout>

    )
}
