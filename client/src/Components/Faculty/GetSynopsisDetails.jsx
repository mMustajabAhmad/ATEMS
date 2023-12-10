import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookie from 'js-cookie';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';

export default function GetSynopsisDetails() {
    const { synopsisid } = useParams();
    const [synopsisData, setSynopsisData] = useState({ allSynopsis: [] });

    useEffect(() => {
        async function fetchSynopsisData() {
            try {
                const response = await fetch(`http://localhost:5000/faculty/supReviewRequest/${synopsisid}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setSynopsisData(data);
                    console.log('Synopsis Data Detail -> ', data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchSynopsisData();
    }, [synopsisid]);

    // const approveData = async (e) => {
    //     e.preventDetails();

    // }
    // const declineData = async (e)=>{
    //     e.preventDetails();
    // }

    return (
        <>

            <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8">

                {synopsisData.selectedSynopsis && (
                    <Card title={"Synopsis Request Detail"}>
                        <h3>Synopsis ID: {synopsisData.selectedSynopsis.synopsisid}</h3>
                        <h3>Synopsis Title: {synopsisData.selectedSynopsis.synopsistitle}</h3>
                        <p>Description: {synopsisData.selectedSynopsis.description}</p>
                        <p>Roll No: {synopsisData.selectedSynopsis.rollno}</p>
                        <p>Synopsis Status: {synopsisData.selectedSynopsis.synopsisstatus}</p>
                    </Card>
                )}
            </div>

                    <div className='mt-2 sm:mx-auto sm:w-full sm:max-w-sm flex flex-row gap-3'>
                    <form class="w-full max-w-lg">
                    <div class="flex flex-wrap -mx-3 mb-6">
                        {/* <hr class="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700" /> */}
                        <div className="w-full px-3 mb-6 md:mb-0">
                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                Select Internal 1
                            </label>
                            <Dropdown
                                // value={selectedfacultyname}
                                // onChange={(e) => setSelectedfacultyname(e.value)}
                                // options={facultyname}
                                className="mb-6 w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                        </div>
                        <div className="w-full px-3 mb-6 md:mb-0">
                            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                Select Internal 2
                            </label>
                            <Dropdown
                                // value={selectedfacultyname}
                                // onChange={(e) => setSelectedfacultyname(e.value)}
                                // options={facultyname}
                                className="mb-6 w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" />
                        </div>

                    </div>
                </form >
                    </div>
            <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm flex flex-row gap-3">
                <div className="w-1/2">
                    <button
                        className="block w-full flex-shrink-0 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-sm border-4 text-white py-1 px-2 rounded mb-2"
                        type="button"
                        name='approvedata'
                        // onClick={approveData}
                        >
                        APPROVE
                    </button>
                </div>
                <div className="w-1/2">
                    <button 
                    className="block w-full flex-shrink-0 bg-green-500 hover:bg-green-700 border-green-500 hover:border-green-700 text-sm border-4 text-white py-1 px-2 rounded mb-2"
                        type="button"
                        name='declinedata'
                        // onClick={declineData}
                        >
                        DECLINE
                    </button>
                </div>
            </div>
        </>
    );
}


