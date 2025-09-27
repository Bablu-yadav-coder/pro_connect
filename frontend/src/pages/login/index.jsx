import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react';
import styles from "./styel.module.css"
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '@/config/redux/action/authAction';
import { emptyMessage } from '@/config/redux/reducer/authReducer';
import { Input, Button, TextField, Box } from '@mui/material';


export default function LoginComponent({ setFlash }) {


  const router = useRouter();
  const dispatch = useDispatch();

  const authState = useSelector((state) => state.auth);
  const [userLoginMethod, setUserLoginMethod] = useState(false);


  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");

  const [showPassword, setShowPassword] = useState(true);


  const handleRegister = () => {

    dispatch(registerUser({ username, password, email, name }));
    setFlash({ message: authState.message, severity: "success", open: true })

  }

  const handleLogin = async () => {
    await dispatch(loginUser({ email, password }));
    
    // setFlash({ message: "Welcome back to your account!", severity: "success", open: true })

  }



  useEffect(() => {
    if (authState.loggedIn) {
      router.push("/dashboard");
      setFlash({ message: authState.message, severity: "success", open: true })

    } else if (authState.isError) {
      setFlash({ message: authState.message, severity: "warning", open: true })

    }


  }, [authState.loggedIn, authState.isError])


  useEffect(() => {
    if (localStorage.getItem("token")) {
      router.push("/dashboard");
    }
  }, []);



  useEffect(() => {
    dispatch(emptyMessage());
  }, [userLoginMethod])


  const handleShowPassword = (e) => {
    let password = document.querySelector("#password");

    let type = password.getAttribute('type') == "password" ? 'text' : "password";

    password.setAttribute('type', type);




  }



  return (
    <UserLayout>



      <div className={styles.container}>

        <div className={styles.cardContainer}>






          <div className={styles.cardContainer_left}>

            <div>
              <p className={styles.cardLeft_heading}>  {userLoginMethod ? "Welcome Back to your Acccout!" : "Create a account"}</p>

             {authState.message && 
              <p style={{ marginTop: "8px", textAlign: "center", color: authState.isError ? "red" : "green" }}>{authState.message}</p>


             }


              <div className={styles.inputContainers}>

                {!userLoginMethod && <div className={styles.inputRow}>


                  <input id='username' onChange={(e) => setUsername(e.target.value)} className={styles.inputFields} type="text" placeholder='Username' />

                  <input id='name' onChange={(e) => setName(e.target.value)} className={styles.inputFields} type="text" placeholder='Name' />


                </div>}

                <input id='email' onChange={(e) => setEmail(e.target.value)} className={styles.inputFields} type="text" placeholder='Email' />
                <div className={styles.password}>

                  <input style={{ border: "none" }} id='password' type='password' onChange={(e) => setPassword(e.target.value)} className={styles.inputFields} placeholder='Password' />


                  <svg

                    onClick={() => {
                      handleShowPassword()

                    }}


                    style={{ width: "1.3rem", cursor: "pointer" }} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>




                </div>


                <div className={styles.button}
                  onClick={() => {
                    if (userLoginMethod) {
                      handleLogin();
                    } else {
                      handleRegister();
                    }

                  }}
                >

                  {userLoginMethod ? "Login" : "Register"}

                </div>


                <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>

                  <p style={{ opacity: "0.4" }}>  {userLoginMethod ? "Don't have any account? " : "Already have an account"} </p>
                  <div className={styles.button2}
                    onClick={() => {
                      setUserLoginMethod(!userLoginMethod)
                    }}

                    style={{ textAlign: "center" }}
                  >

                    {userLoginMethod ? "Register" : "Login"}

                  </div>
                </div>

              </div>




            </div>
          </div>




          {/* this div for roght container image */}
          <div className={styles.cardContainer_right}>



          </div>





        </div>


      </div>

    </UserLayout>

  )
}
