import React, { useEffect, useState, useCallback } from 'react';
import CommonTable from '../components/CommonTable/CommonTable';
import Pagination from '../components/CommonTable/Pagination';
import { getPaginatedUsers, createUser, updateUser, deleteUser } from '../service/users.api';
import { debounce } from '../util/helper/common';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import UserModal from '../components/Modal/UserModal';
import ConfirmModal from '../components/Modal/ConfirmModal';
import { usePermission } from '../context/Permissioncontext';
import { pageNames } from '../enum/Navigation';
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

    // Modal states
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);
    const { hasPermissions } = usePermission();
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

    // Add/Edit
    const handleAdd = () => {
        setSelectedUser(null);
        setIsUserModalOpen(true);
    };

    const handleEdit = (row: any) => {
        setSelectedUser(row);
        setIsUserModalOpen(true);
    };

    const handleSaveUser = async (data: any) => {
        setIsActionLoading(true);
        try {
            if (selectedUser) {
                await updateUser(selectedUser.id, data);
            } else {
                await createUser(data);
            }
            setIsUserModalOpen(false);
            fetchUsersData();
        } catch (error) {
            console.error("Failed to save user", error);
        } finally {
            setIsActionLoading(false);
        }
    };

    // Delete
    const handleDelete = (row: any) => {
        setSelectedUser(row);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedUser) return;
        setIsActionLoading(true);
        try {
            await deleteUser(selectedUser.id);
            setIsDeleteModalOpen(false);
            fetchUsersData();
        } catch (error) {
            console.error("Failed to delete user", error);
        } finally {
            setIsActionLoading(false);
        }
    };

    // Actions renderer
    const renderActions = (row, rowIdx) => {
        return (
            <div className="flex justify-center gap-2">
                {(hasPermissions(pageNames.users, "edit")) && (
                    <button
                        className="text-blue-500 cursor-pointer text-lg"
                        onClick={() => handleEdit(row)}
                    >
                        <FaEdit size={12} />
                    </button>
                )}
                {(hasPermissions(pageNames.users, "delete")) && (
                    <button
                        className="text-red-500 cursor-pointer text-lg"
                        onClick={() => handleDelete(row)}
                    >
                        <FaTrash size={12} />
                    </button>
                )}
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
                <div className="flex items-center gap-4">
                    {
                        (hasPermissions(pageNames.users, "add")) && (
                            <button
                                onClick={handleAdd}
                                className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <FaPlus size={12} /> Add User
                            </button>
                        )
                    }

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

            <UserModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
                onSave={handleSaveUser}
                user={selectedUser}
                isLoading={isActionLoading}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete User"
                message={`Are you sure you want to delete user "${selectedUser?.username}"? This action cannot be undone.`}
                isLoading={isActionLoading}
            />
        </div>
    )
}

export default Users