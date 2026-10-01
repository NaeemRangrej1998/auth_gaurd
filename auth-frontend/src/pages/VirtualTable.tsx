import React, { useEffect, useState, useCallback } from 'react';
import CommonTable from '../components/CommonTable/CommonTable';

import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import VirtualTableComponent from '../components/CommonTable/VirtualTableComponent';

const columns = [
    {
        key: "id",
        label: "ID",
    },
    {
        key: "username",
        label: "Name",
        render: (row) => (
            <strong>{row.username}</strong>
        ),
    },
    {
        key: "email",
        label: "Email",
    },
    {
        key: "roleName",
        label: "Role",
    },
];
const data = Array.from({ length: 10000 }, (_, index) => ({
    id: index + 1,
    username: `user${index + 1}`,
    email: `user${index + 1}`,
    roleName: `user${index + 1}`,
}));


const VirtualTable = () => {

    // Actions renderer
    const renderActions = (row, rowIdx) => {
        return (
            <div className="flex justify-center gap-2">
                <button
                    className="text-blue-500 cursor-pointer text-lg"

                >
                    <FaEdit size={12} />
                </button>
                <button
                    className="text-red-500 cursor-pointer text-lg"

                >
                    <FaTrash size={12} />
                </button>
            </div>
        );
    };
    return (
        <div className="page-container">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <h2 className="page-title !mb-0">User List</h2>

                </div>

            </div>
            <VirtualTableComponent
                columns={columns}
                data={data}
            />
        </div>
    )
}

export default VirtualTable