import React from 'react'
import Users from './Components/Users';


export const config = {
  endpoint: `https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json`,
};

const App = () => {
  return (
    <div>
      <Users />
    </div>
  )
}

export default App;
