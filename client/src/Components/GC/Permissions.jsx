import React, { useState, useEffect, useRef } from 'react';
import Cookie from 'js-cookie';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';


export default function Permissions() {
    const toastTopCenter = useRef(null);

    const [proposalVisible, setProposalVisible] = useState(false);
    const [mid1Visible, setMid1Visible] = useState(false);
    const [final1Visible, setFinal1Visible] = useState(false);

    const [proposalPermissionStatus, setProposalPermissionStatus] = useState(false);
    const [mid1PermissionStatus, setMid1PermissionStatus] = useState(false);
    const [final1PermissionStatus, setFinal1PermissionStatus] = useState(false);

    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchProposalPermissionStatus();
    }, []);

    const fetchProposalPermissionStatus = async () => {
        try {
            const response = await fetch('http://localhost:5000/gc/proposalEvaluationStatus', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`,
                }
            });
            const data = await response.json();
            const status = Boolean(data.gcproposalpermission);
            setProposalPermissionStatus(status);
        } catch (error) {
            console.error('Error fetching proposal permission status:', error);
            setMessage('Failed to fetch proposal permission status');
        }
    };

    useEffect(() => {
        fetchMid1PermissionStatus();
    }, []);

    const fetchMid1PermissionStatus = async () => {
        try {
            const response = await fetch('http://localhost:5000/gc/midEvaluationStatus', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`,
                }
            });
            const data = await response.json();
            const status = Boolean(data.midEvaluationPermission);
            setMid1PermissionStatus(status);
        } catch (error) {
            console.error('Error fetching mid1 permission status:', error);
            setMessage('Failed to fetch mid1 permission status');
        }
    };

    useEffect(() => {
        fetchFinal1PermissionStatus();
    }, []);

    const fetchFinal1PermissionStatus = async () => {
        try {
            const response = await fetch('http://localhost:5000/gc/finalEvaluationStatus', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`,
                }
            });
            const data = await response.json();
            const status = Boolean(data.finalEvaluationPermission);
            setFinal1PermissionStatus(status);
        } catch (error) {
            console.error('Error fetching final1 permission status:', error);
            setMessage('Failed to fetch final1 permission status');
        }
    };

    const showMessage = (severity, label) => {
        toastTopCenter.current.show({ severity, summary: label, detail: label, life: 3000 });
    };

    const handleProposalTogglePermission = () => {
        setProposalVisible(true);
    };

    const handleMid1TogglePermission = () => {
        setMid1Visible(true);
    };

    const handleFinal1TogglePermission = () => {
        setFinal1Visible(true);
    };


    const handleConfirmProposalPermission = async () => {
        try {
            let endpoint = '';
            let newStatus = '';

            // Determine which action to perform based on current permission status
            if (proposalPermissionStatus) {
                endpoint = 'http://localhost:5000/gc/revokePropEvalPermission';
                newStatus = false;
            } else {
                endpoint = 'http://localhost:5000/gc/grantPropEvalPermission';
                newStatus = true;
            }

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`,
                }
            });

            const data = await response.json();
            setMessage(data.message);

            // Conditionally update the permission status based on the response message
            if (data.message === 'GC permission granted for all proposal evaluations' ||
                data.message === 'GC permission revoked for all proposal evaluations') {
                setProposalPermissionStatus(newStatus);
            }
            showMessage('success', message);

            // Close the dialog after performing the action
            setProposalVisible(false);
        } catch (error) {
            console.error('Error toggling proposal permission:', error);
            setMessage('Failed to toggle proposal permission');
        }
    };

    const handleConfirmMid1Permission = async () => {
        try {
            let endpoint = '';
            let newStatus = '';

            // Determine which action to perform based on current permission status
            if (mid1PermissionStatus) {
                endpoint = 'http://localhost:5000/gc/revokeMidEvalPermission';
                newStatus = false;
            } else {
                endpoint = 'http://localhost:5000/gc/grantMidEvalPermission';
                newStatus = true;
            }

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`,
                }
            });

            const data = await response.json();
            setMessage(data.message);

            // Conditionally update the permission status based on the response message
            if (data.message === 'Mid-evaluation permissions successfully granted.' ||
                data.message === 'Mid-evaluation permissions revoked for all record.') {
                setMid1PermissionStatus(newStatus);
            }

            showMessage('success', message);

            // Close the dialog after performing the action
            setMid1Visible(false);

        } catch (error) {
            console.error('Error toggling mid1 permission:', error);
            setMessage('Failed to toggle mid1 permission');
        }
    };

    const handleConfirmFinal1Permission = async () => {
        try {
            let endpoint = '';
            let newStatus = '';

            // Determine which action to perform based on current permission status
            if (final1PermissionStatus) {
                endpoint = 'http://localhost:5000/gc/revokeFinalEvalPermission';
                newStatus = false;
            } else {
                endpoint = 'http://localhost:5000/gc/grantFinalEvalPermission';
                newStatus = true;
            }

            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${Cookie.get('jwtoken')}`,
                }
            });

            const data = await response.json();
            setMessage(data.message);

            // Conditionally update the permission status based on the response message
            if (data.message === 'Final-evaluation permissions successfully granted.' ||
                data.message === 'Final-evaluation permissions revoked for all record.') {
                setFinal1PermissionStatus(newStatus);
            }

            showMessage('success', message);

            // Close the dialog after performing the action
            setFinal1Visible(false);

        } catch (error) {
            console.error('Error toggling mid1 permission:', error);
            setMessage('Failed to toggle mid1 permission');
        }
    };

    const headerElement = (
        <div className="inline-flex align-items-center justify-content-center gap-2">
            <span className="font-bold white-space-nowrap">Confirmation</span>
        </div>
    );

    const footerContentProposal = (
        <div>
            <Button label="Confirm" icon="pi pi-check" onClick={handleConfirmProposalPermission}
                className='flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' />
        </div>
    );

    const footerContentMid1 = (
        <div>
            <Button label="Confirm" icon="pi pi-check" onClick={handleConfirmMid1Permission}
                className='flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' />
        </div>
    );

    const footerContentFinal1 = (
        <div>
            <Button label="Confirm" icon="pi pi-check" onClick={handleConfirmFinal1Permission}
                className='flex-shrink-0 text-white bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-teal-300 dark:focus:ring-teal-800 shadow-md shadow-teal-500/50 dark:shadow-lg dark:shadow-teal-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2' />
        </div>
    );

    return (
        <>
            <Toast ref={toastTopCenter} position="top-center" />

            <Dialog visible={proposalVisible} modal header={headerElement} footer={footerContentProposal} style={{ width: '30rem' }} onHide={() => setProposalVisible(false)}>
                <p className="m-0">
                    Are you sure you want to {proposalPermissionStatus ? 'revoke' : 'grant'} the permission?
                </p>
            </Dialog>

            <Dialog visible={mid1Visible} modal header={headerElement} footer={footerContentMid1} style={{ width: '30rem' }} onHide={() => setMid1Visible(false)}>
                <p className="m-0">
                    Are you sure you want to {mid1PermissionStatus ? 'revoke' : 'grant'} the permission?
                </p>
            </Dialog>

            <Dialog visible={final1Visible} modal header={headerElement} footer={footerContentFinal1} style={{ width: '30rem' }} onHide={() => setFinal1Visible(false)}>
                <p className="m-0">
                    Are you sure you want to {final1PermissionStatus ? 'revoke' : 'grant'} the permission?
                </p>
            </Dialog>

            <div className='m-2 p-2 grid grid-cols-1'>
                <div className="mx-4">
                    <h2 className="my-4 text-left text-xl font-bold tracking-tight text-gray-950">
                        Evaluation Permissions
                    </h2>
                </div>
                <div className='mx-4'
                // style={{ border: '1px solid red' }}
                >
                    <h2 className='my-6 text-xl font-semibold tracking-tight text-gray-950'>
                        Thesis 1 Evaluation Permissions</h2>
                    <div className='m-4'>
                        <h3 className="my-4 text-left text-lg font-semibold tracking-tight text-gray-950">Defense Proposal Evaluation Permissions</h3>
                        <div className="flex justify-end px-6">
                            <button
                                onClick={handleProposalTogglePermission}
                                className="block ftext-teal-700 hover:text-white border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-teal-500 dark:text-teal-500 dark:hover:text-white dark:hover:bg-teal-600 dark:focus:ring-teal-800 text-sm px-5 py-2.5 text-center"
                            >
                                {proposalPermissionStatus ? 'Revoke Permission' : 'Grant Permission'}
                            </button>
                        </div>
                    </div>
                    <div className='m-4'>
                        <h3 className="my-4 text-left text-lg font-semibold tracking-tight text-gray-950">Mid Evaluation Permissions</h3>
                        <div className="flex justify-end px-6">
                            <button
                                onClick={handleMid1TogglePermission}
                                className="block ftext-teal-700 hover:text-white border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-teal-500 dark:text-teal-500 dark:hover:text-white dark:hover:bg-teal-600 dark:focus:ring-teal-800 text-sm px-5 py-2.5 text-center"
                            >
                                {mid1PermissionStatus ? 'Revoke Permission' : 'Grant Permission'}
                            </button>
                        </div>
                    </div>
                    <div className='m-4'>
                        <h3 className="my-4 text-left text-lg font-semibold tracking-tight text-gray-950">Final Evaluation Permissions</h3>
                        <div className="flex justify-end px-6">
                            <button
                                onClick={handleFinal1TogglePermission}
                                className="block ftext-teal-700 hover:text-white border border-teal-700 hover:bg-teal-800 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:border-teal-500 dark:text-teal-500 dark:hover:text-white dark:hover:bg-teal-600 dark:focus:ring-teal-800 text-sm px-5 py-2.5 text-center"
                            >
                                {final1PermissionStatus ? 'Revoke Permission' : 'Grant Permission'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}