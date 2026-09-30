import React, { useEffect, useState, useCallback } from 'react';
import CommonTable from '../components/CommonTable/CommonTable';
import Pagination from '../components/CommonTable/Pagination';
import { getPaginatedUsers } from '../service/users.api';
import { debounce } from '../util/helper/common';
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



const Users = () => {
    const [loading, setLoading] = useState(false);
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(2);
    const [searchValue, setSearchValue] = useState("");
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    const fetchUsersData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getPaginatedUsers(pageNumber, pageSize, searchValue);
            if (response.code === 200) {
                setUsers(response.data.users);
                setTotalPages(response.data.pages.totalPages);
                setTotalItems(response.totalUsers);
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        } finally {
            setLoading(false);
        }
    }, [pageNumber, pageSize, searchValue]);

    useEffect(() => {
        fetchUsersData();
    }, [fetchUsersData]);
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageNumber(1)
        const value = String(event.target.value || "").trim();
        debouncedSearch(value)
    };

    const debouncedSearch = useCallback(
        debounce((query: string) => {
            setSearchValue(query);
        }, 500),
        []
    );

    // Edit
    const handleEdit = (row) => {
        console.log("Edit:", row);
    };

    // Delete
    const handleDelete = (row) => {
        console.log("Delete:", row);
    };

    // Actions renderer
    const renderActions = (row, rowIdx) => {
        return (
            <div className="flex justify-center gap-2">
                <button
                    className="btn-primary"
                    onClick={() => handleEdit(row)}
                >
                    Edit
                </button>

                <button
                    className="btn-danger"
                    onClick={() => handleDelete(row)}
                >
                    Delete
                </button>
            </div>
        );
    };
    return (
        <div className="page-container">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <h2 className="page-title !mb-0">User List</h2>
                    {selectedUsers.length > 0 && (
                        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                            {selectedUsers.length} selected
                        </span>
                    )}
                </div>
                <div>
                    <input
                        type="search"
                        placeholder="Search users..."
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        // value={searchValue}
                        onChange={handleSearchChange}

                    />
                </div>
            </div>
            <CommonTable
                columns={columns}
                data={users}
                rowActions={renderActions}
                isLoading={loading}
                maxHeight="70vh"
            // selectedId={selectedUsers}
            // handleSelect={(selected) => setSelectedUsers(selected)}
            />
            <div className="bg-white sticky z-10 p-1 bottom-0">
                <Pagination
                    currentPage={pageNumber}
                    totalPages={totalPages}
                    onPageSize={(size) => {
                        setPageSize(size);
                        setPageNumber(1); // Reset to first page when page size changes
                    }}
                    pageSize={pageSize}
                    onPageChange={(e) => setPageNumber(e)}
                    totalItems={totalItems}
                />
            </div>
        </div>
    )
}

export default Users