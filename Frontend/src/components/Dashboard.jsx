import React, { useEffect, useState } from 'react'
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <h1>this is dashboard of {user?.username}</h1>
    </div>
  )
}

export default Dashboard
