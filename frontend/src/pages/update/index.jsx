import UserLayout from '@/layout/UserLayout'
import React, { useState } from 'react'
import styles from "./index.module.css"
import { useDispatch } from 'react-redux';
import { updateUser, updateUserProfile } from '@/config/redux/action/authAction';
import { useRouter } from 'next/router';

export default function UpdateProfile() {

    const dispatch  = useDispatch();
    const router = useRouter();

      const [email , setEmail] = useState("");
      const [profilePic , setProfilePic] = useState("");
      const [username , setUsername] = useState("");
      const [name , setName] = useState("");
    
      const handleUpdateUser = () => {
    //    dispatch(updateUser({ token : localStorage.getItem("token"), email,  username,name}));
       dispatch(updateUserProfile({ file : profilePic, token : localStorage.getItem("token")}));

       router.push("/profile")
      }


    return (
        <UserLayout>

            <div style={{ display: "flex", justifyContent: "center" }} className="container">

                <div className="MainContainer">

                    <div className={styles.inputContainers}>

                         <div className={styles.inputRow}>

                            <input onChange={(e) => setUsername(e.target.value)} className={styles.inputFields} type="text" placeholder='Username' />
                            <input onChange={(e) => setName(e.target.value)} className={styles.inputFields} type="text" placeholder='Name' />

                        </div>

                        <input onChange={(e) => setEmail(e.target.value)} className={styles.inputFields} type="text" placeholder='Email' />
                      
                        
                       <input onChange={(e) => setProfilePic(e.target.value)} value={profilePic} className={styles.inputFields} type="file" placeholder='Chage profile picture' />


                        {/* <input onChange={(e) => setEmail(e.target.value)} className={styles.inputFields} type="text" placeholder='Education' />
                        <input onChange={(e) => setPassword(e.target.value)} className={styles.inputFields} type="text" placeholder='Password' /> */}


                        <div className={styles.button}
                            onClick={handleUpdateUser}
                        > Update</div>

                    </div>
                </div>

            </div>

        </UserLayout>
    )
}
