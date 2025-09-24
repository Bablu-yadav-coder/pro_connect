import React from 'react'
import styles from "./style.module.css"
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { reset } from '@/config/redux/reducer/authReducer';

import toggleLamp from "@/components/toggleLamp";

export default function NavBarComponent() {

    const router = useRouter();
    const authState = useSelector((state) => state.auth);
    const dispatch = useDispatch();


    return (
        <div className={styles.container}>

            <div className={styles.mainContainer}>

                <div className={styles.mainContainer_left}>


                    <div onClick={() => {
                        router.push("/dashboard")
                    }}>
                        <img style={{ width: "150px", height: "100%" }} src="/images/logo3.jpg" alt="" />
                    </div>

                </div>



                <toggleLamp />





                <div className={styles.mainContainer_right}>




                    {authState.profileFetched &&

                        <div>

                            <div style={{ display: "flex", gap: "1.2rem", cursor: "pointer", }}>

                                <p className={styles.showName}>Hay, {authState.user.userId.name} </p>
                                <p
                                    onClick={() => {
                                        router.push("/profile")
                                    }}

                                    style={{ fontWeight: "bold" }}>Profile</p>

                                <p onClick={() => {
                                    localStorage.removeItem("token");
                                    router.push("/login");
                                    dispatch(reset());

                                }} style={{ fontWeight: "bold" }}>Logout</p>

                            </div>

                        </div>

                    }




                    {!authState.profileFetched &&
                        <div onClick={() => {
                            router.push("/login");
                        }} className={styles.buttonJoin}>
                            <p>Be a part</p>
                        </div>

                    }

                </div>
            </div>

        </div>
    )
}
