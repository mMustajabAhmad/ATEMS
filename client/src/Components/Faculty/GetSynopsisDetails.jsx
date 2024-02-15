import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Cookie from 'js-cookie';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';

export default function GetSynopsisDetails() {

    const navigate = useNavigate();
    const { synopsisid } = useParams();
    const [synopsisData, setSynopsisData] = useState({ selectedSynopsis: null, facultyList: [] });

    const [selectedInternal1, setselectedInternal1] = useState(null);
    const [selectedInternal2, setselectedInternal2] = useState(null);

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
                    console.log('Synopsis Data Detail + Faculty List --> ', data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchSynopsisData();
    }, [synopsisid]);

    const selectedValue = synopsisData.facultyList.map(item => ({ label: item.name, value: item.name }))


    const approveData = async (e) => {
        e.preventDefault();

        const internal1 = selectedInternal1;
        const internal2 = selectedInternal2;

        const InternalData = {
            internal1,
            internal2
        }

        console.log("Internal Data =", InternalData);


        const res = await fetch(`http://localhost:5000/faculty/approve-synopsis/${synopsisid}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${Cookie.get('jwtoken')}`
            },
            body: JSON.stringify(InternalData)

        });

        const data = await res.json();
        console.log("Response data:", data); // Log the response data

        if (res.status === 200) {
            if (data.message === "Invalid Credentials") {
                window.alert("Invalid Credentials");
                console.log("Invalid Credentials");
            } else {
                window.alert("Accepted Synopsis Successfully");
                console.log("Accepted Synopsis Successfully");
                navigate('/');
            }
        } else {
            window.alert("Something went wrong");
            console.log("Something went wrong");
        }
    }
    const declineData = async (e) => {
        e.preventDefault();

        const res = await fetch(`http://localhost:5000/faculty/decline-synopsis/${synopsisid}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `${Cookie.get('jwtoken')}`
            }
        });

        const data = await res.json();
        console.log("Response data:", data); // Log the response data

        if (res.status === 200) {
            if (data.message === "Invalid Credentials") {
                window.alert("Invalid Credentials");
                console.log("Invalid Credentials");
            } else {
                window.alert("Rejected Synopsis Successfully");
                console.log("Rejected Synopsis Successfully");
                navigate('/');
            }
        } else {
            window.alert("Something went wrong");
            console.log("Something went wrong");
        }
    }

    return (
        <>
            <div className='flex flex-1 flex-col justify-center px-6 py-12 lg:px-8'>

                <div className=""
                >

                    <div className="mt-2 bg-teal-500 shadow overflow-hidden sm:rounded-lg">

                        <div className="px-4 py-5 sm:px-6">
                            <p className="max-w-2xl text-md text-white">
                                Thesis Registration Synopsis Request Details
                            </p>
                        </div>
                        {synopsisData.selectedSynopsis && (

                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Thesis ID:
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                {synopsisData.selectedSynopsis.synopsisid}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Thesis Title:
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                {synopsisData.selectedSynopsis.synopsistitle}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Roll Number
                                            </dt>
                                            <dd className="text-sm text-gray-900">
                                            {synopsisData.selectedSynopsis.rollno}

                                            </dd>
                                        </div>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                    <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Thesis Status
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                {synopsisData.selectedSynopsis.synopsisstatus}
                                            </dd>
                                        </div>
                                        <div className="sm:col-span-1">
                                            <dt className="text-sm font-medium text-gray-500">
                                                Potential Areas
                                            </dt>
                                            <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                {synopsisData.selectedSynopsis.potentialareas}
                                            </dd>
                                        </div>
                                        
                                    </div>
                                </dl>
                            </div>

                        )}
                    </div>
                </div>

                <div className='mt-4 w-full flex justify-center'>
                    <form class="w-full">
                        <div class="grid grid-cols-2 flex flex-wrap -mx-3">
                            {/* <hr class="w-48 h-1 mx-auto my-4 bg-gray-100 border-0 rounded md:my-10 dark:bg-gray-700" /> */}
                            <div className="col-span-1 w-full px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Select Internal 1
                                </label>
                                <Dropdown
                                    value={selectedInternal1}
                                    options={selectedValue}
                                    className="mb-6 w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    onChange={(e) => { setselectedInternal1(e.value) }}
                                />
                            </div>
                            <div className="col-span-1 w-full px-3 mb-6 md:mb-0">
                                <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
                                    Select Internal 2
                                </label>
                                <Dropdown
                                    value={selectedInternal2}
                                    options={selectedValue}
                                    className="mb-6 w-full bg-gray-200 text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                    onChange={(e) => { setselectedInternal2(e.value) }}
                                />
                            </div>

                        </div>
                        <div className="mt-2 sm:mx-auto sm:w-full sm:max-w-sm flex flex-row gap-3"
                        >
                            <div className="grid grid-cols-2 w-full">
                                <button className="col-span-1 flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-3 py-2.5 text-center me-2 mb-2"
                                    type="button"
                                    name='approvedata'
                                    onClick={approveData}
                                >
                                    APPROVE
                                </button>
                                <button className="col-span-1 flex-shrink-0 text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 shadow-md shadow-red-500/50 dark:shadow-lg dark:shadow-red-800/80 font-medium rounded-lg text-sm px-3 py-2.5 text-center me-2 mb-2"
                                    type="button"
                                    name='declinedata'
                                    onClick={declineData}
                                >
                                    DECLINE
                                </button>
                            </div>
                        </div>
                    </form >
                </div>

            </div>
        </>
    );
}


