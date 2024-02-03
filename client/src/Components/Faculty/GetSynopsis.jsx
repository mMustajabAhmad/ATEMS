import { useState, useEffect } from 'react';
import Cookie from 'js-cookie';
import { NavLink } from 'react-router-dom';

export default function GetSynopsis() {
    const [synopsisData, setSynopsisData] = useState({ allSynopsis: [] });

    useEffect(() => {
        async function fetchSynopsisData() {
            try {
                const response = await fetch('http://localhost:5000/faculty/supAllRequests', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookie.get('jwtoken')}`
                    }
                });
                if (response.ok) {
                    const data = await response.json();
                    setSynopsisData(data);

                    // const rowData = data.map(item => item.synopsisid);

                    console.log('Synopsis Data -> ', data)



                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error('Failed to retrieve data: ', error);
            }
        }

        fetchSynopsisData();
    }, []);

    return (
        <>
            <div className="sm:mx-auto w-full">
                <h2 className="m-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Thesis Proposal Synopsis Requests
                </h2>
            </div>
            <div class="m-6 shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" class="px-6 py-3">
                                Student Roll Number
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Thesis Title
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Potential Areas
                            </th>
                            <th scope="col" class="px-6 py-3">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {synopsisData.allSynopsis.map(rowData => (
                            <tr className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-600" key={rowData.synopsisid}>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {rowData.rollno}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {rowData.synopsistitle}
                                </td>
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {rowData.potentialareas}
                                </td>
                                <td className="px-6 py-4">
                                    <NavLink to={`/supReviewRequest/${rowData.synopsisid}`} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                        View Details
                                    </NavLink>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}
