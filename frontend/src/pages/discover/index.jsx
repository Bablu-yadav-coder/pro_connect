import { getAboutUser, getAllUsers, searchUser } from '@/config/redux/action/authAction';
import DashboardLayout from '@/layout/DashboardLayout'
import UserLayout from '@/layout/UserLayout'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from "./index.module.css"
import { BASE_URL, clientServer } from '@/config';
import { useRouter } from 'next/router';

export default function Discoverpage() {

  const authState = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const router = useRouter()

  const [getUser, setGetUser] = useState("");

  useEffect(() => {

    if (!authState.all_profiles_fetched) {
      dispatch(getAllUsers());
    }
    dispatch(getAboutUser());

  }, []);

  useEffect(() => {
    if (getUser === "") {
      dispatch(getAllUsers());
    }
  }, [])


  const handleSearch = () => {

    if (getUser.length !== 0) {
      dispatch(searchUser({ username: getUser }));
    } else {
      dispatch(getAllUsers());
    }
  }

  if (authState.user) {

    return (
      <UserLayout>

        <DashboardLayout>

          <div>

            <div className={styles.search_profile}>
              <input onChange={(e) => {

                setGetUser(e.target.value)
                if (getUser === "") {
                  dispatch(getAllUsers());
                }
              }

              }

                type="text" placeholder='Search' />

              <button

                onClick={handleSearch}

              >search</button>

            </div>


            <div className={styles.container}>



              {authState.all_profiles_fetched &&
                authState.user &&

                authState.all_users.filter((user => user.userId._id !== authState.user.userId._id)).map((user, idx) => {

                  return (


                    <div key={idx}

                      onClick={() => {
                        router.push(`/view_profile/${user.userId.username}`)
                      }}
                      className={styles.card_container}>

                      <img src={`${BASE_URL}/${user.userId.profilePic}`} alt="" />

                      <div>
                        <h3>{user.userId.name}</h3>
                        <p>@{user.userId.username}</p>
                      </div>

                    </div>
                  )



                })



              }

            </div>

          </div>

        </DashboardLayout>


      </UserLayout>
    )
  }
  else {
    <UserLayout>

      <DashboardLayout>

        <h3><i>Refresh the page</i></h3>
      </DashboardLayout>
    </UserLayout>
  }
}
