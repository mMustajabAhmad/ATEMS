import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';

const EvaluationMid1Details = () => {
    const [selectedMid, setSelectedMid] = useState(null);
    const userId = useParams();

    useEffect(() => {
        const fetchSelectedMid = async () => {
            try {
                const response = await fetch(`http://localhost:5000/gc/viewPendingMid/${userId.rollno}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${Cookies.get('jwtoken')}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSelectedMid(data.selectedMidEvaluation);
                } else {
                    throw new Error('Failed to fetch selected Mid1');
                }
            } catch (error) {
                console.error('Error fetching selected Mid1:', error);
            }
        };

        fetchSelectedMid();
    }, [userId]);

    const handleApprove = async () => {
        try {
            const response = await fetch(`http://localhost:5000/gc/approveMidComments/${userId.rollno}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookies.get('jwtoken')}`
                }
            });

            const data = await response.json();
            if (response.ok) {
                // Proposal approved successfully, update UI or show a success message
                console.log('Mid Evaluation approved successfully');
                window.alert(data.message)
            } else {
                // Handle error
                console.error('Failed to approve proposal');
            }
        } catch (error) {
            console.error('Error approving proposal:', error);
        }
    };

    return (
        <>
            {selectedMid ? (
                <div className='flex flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8'>
                    <div className="mt-2 bg-teal-500 shadow overflow-hidden sm:rounded-lg w-[90%]">
                        <div className="px-4 py-5 sm:px-6">
                            <p className="max-w-2xl text-md text-white">
                                Thesis 1 Mid Evaluation Details
                            </p>
                        </div>
                        <div className="border-t border-gray-200">
                            <dl>
                                {/* Render selectedMid details here */}
                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-2 sm:px-6">
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Thesis Title
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedMid[0].thesistitle}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Roll No
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedMid[0].rollno}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            Student Name
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedMid[0].stdname}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-1">
                                        <dt className="text-sm font-medium text-gray-500">
                                            GC Comment Review
                                        </dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                            {selectedMid[0].gcMidCommentsReview}
                                        </dd>
                                    </div>
                                    {/* Add more fields as needed */}
                                </div>
                            </dl>
                        </div>
                    </div>
                </div>
            ) : (
                <div>Loading Thesis 1 Mid Evaluation...</div>
            )}

            {/* Examiner Evaluation Section */}
            {selectedMid ? (
                <>
                    <div className='flex flex-1 flex-col justify-center items-center px-6 lg:px-8'>
                        <div className="bg-gray-500 shadow overflow-hidden sm:rounded-lg w-[90%]">
                            <div className="px-4 py-5 sm:px-6">
                                <p className="max-w-2xl text-md text-white">
                                    Examiners Evaluation
                                </p>
                            </div>
                            <div className="border-t border-gray-200">

                                <dl>
                                    {/* Render selectedMid details here */}
                                    {selectedMid.map((proposal, index) => (
                                        <>

                                            <div key={index} className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Examiner {index + 1}
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedMid[index].facultyid}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Examiner Name
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedMid[index].facname}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Literature Review Rank
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedMid[index].literatureReviewRank}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Problem Gap Identified
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {(selectedMid[index].problemGapIdentified) ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Problem Clearly Defined
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {(selectedMid[index].problemClearlyDefined) ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-1">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Problem Placement
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {(selectedMid[index].problemPlacement) ? "Yes" : "No"}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Solution Understanding
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedMid[index].solutionUnderstanding}
                                                    </dd>
                                                </div>
                                                <div className="sm:col-span-3">
                                                    <dt className="text-sm font-medium text-gray-500">
                                                        Examiner Comments
                                                    </dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0">
                                                        {selectedMid[index].comments}
                                                    </dd>
                                                </div>
                                                {/* Add more fields as needed */}
                                                <hr class="h-px my-8 bg-gray-400 border-0 dark:bg-gray-700" />

                                            </div>
                                        </>
                                    ))}
                                </dl>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-center align-center mx-12'>
                        <div className='p-2 w-full'>
                            <div className='w-full px-3'>
                                <button onClick={handleApprove} className="m-4 flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
                                    type="button"
                                >
                                    Approve
                                </button>
                            </div>
                        </div>
                    </div>
                </>

            ) : (
                <div>Loading Thesis 1 Examiner Evaluation...</div>
            )}


        </>
    );
};

export default EvaluationMid1Details;
