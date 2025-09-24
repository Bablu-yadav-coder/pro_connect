import NavBarComponent from '@/Components/Navbar/index'
import React from 'react'

export default function UserLayout( {children}) {
  return (
    <div>

      
      <NavBarComponent/>
      {children}
    </div>
  )
}
