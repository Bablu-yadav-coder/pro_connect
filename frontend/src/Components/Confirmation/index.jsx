import React, { useState } from 'react'
import styles from "./index.module.css"

export default function Confirmation({ isModals, setIsModals, setIsRemove }) {

    return (
        <div>


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
                        <h3> Are You Sure?</h3>


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
                            <p>Are you sure want to delete this post?</p>

                        </div>


                        <div




                            style={{ display: "flex", justifyContent: "space-between" }}>

                            <button

                                onClick={() => {
                                     setIsRemove(false) 

                                    setIsModals(false);
                                }}

                                className={styles.button2}>Cancel</button>

                            <button className={styles.button}

                                onClick={() => {
                                     setIsRemove(true) 

                                    setIsModals(false);
                                }}


                            >Delete</button>
                        </div>


                    </div>
                </div>



            }



        </div>
    )
}
