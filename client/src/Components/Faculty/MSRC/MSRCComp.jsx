import React, { useState, useEffect } from 'react'
import Cookies from 'js-cookie';
import RoleTabs from '../RoleTabs'



function MSRCComp() {

  const userId = Cookies.get('userId');
  const [facultyData, setfacultyData] = useState([]);

  useEffect(() => {
    async function fetchfacultyData() {
      try {
        const response = await fetch(`http://localhost:5000/faculty/showFacData/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${Cookies.get('jwtoken')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setfacultyData(data);
        } else {
          throw new Error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Failed to retrieve data: ', error);
      }
    }

    fetchfacultyData();
  }, [userId]);

  const [isMSRC, setIsMSRC] = useState(false);

  useEffect(() => {
    console.log(facultyData.role)
    // Assuming facultyData is an object and facultyData.role is an array
    if (facultyData && facultyData.role && facultyData.role.includes) {

      if (facultyData.role.includes("MSRC")) {
        setIsMSRC(true);
        console.log("This is an MSRC role.");
      }
    } else {
      // Handle the case when facultyData or facultyData.role is undefined or null
      console.log("Error: Missing data");
    }

  }, [facultyData]);
  return (
    <>
      {isMSRC ? (
        <RoleTabs />
      ) : (<>
        <p>Not an MSRC</p>
      </>)}
    </>
  )
}

export default MSRCComp