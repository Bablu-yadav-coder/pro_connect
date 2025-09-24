import UserLayout from '@/layout/UserLayout'
import React, { useEffect } from 'react'
import DashboardLayout from '@/layout/DashboardLayout'
import { useDispatch, useSelector } from 'react-redux'

export default function Notification() {

    const { likeNotification } = useSelector(state => state.socketio);
    const dispatch = useDispatch();

 

    console.log(likeNotification)

    return (

        <UserLayout>

            <DashboardLayout>
                <div>
                    {likeNotification && likeNotification.map((user, idx) => {
                        console.log(user);
                        return (
                            <div>

                                Notification......


                            </div>
                        )
                    })}

                    notification


                </div>
            </DashboardLayout>

        </UserLayout>
    )
}
