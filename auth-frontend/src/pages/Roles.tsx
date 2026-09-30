import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import CommonTable from '../components/CommonTable/CommonTable';
import { getAllRoles, createRole, updateRole, deleteRole } from '../service/roles.api';
import { FaEdit, FaTrash, FaPlus, FaKey } from 'react-icons/fa';
import RoleModal from '../components/Modal/RoleModal';
import ConfirmModal from '../components/Modal/ConfirmModal';

const columns = [
    {
        key: "roleId",
        label: "ID",
    },
    {
        key: "roleName",
        label: "Role Name",
        render: (row: any) => (
            <strong>{row.roleName}</strong>
        ),
    },
    {
        key: "description",
        label: "Description",
    },
];

const Roles = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [roles, setRoles] = useState<any[]>([]);

    // Modal states
    const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState<any>(null);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchRolesData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getAllRoles();
            if (response.code === 200) {
                setRoles(response.data);
            }
        } catch (error) {
            console.error("Failed to fetch roles", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRolesData();
    }, [fetchRolesData]);

    // Add/Edit
    const handleAdd = () => {
        setSelectedRole(null);
        setIsRoleModalOpen(true);
    };

    const handleEdit = (row: any) => {
        setSelectedRole(row);
        setIsRoleModalOpen(true);
    };

    const handleSaveRole = async (data: any) => {
        setIsActionLoading(true);
        try {
            if (selectedRole) {
                await updateRole(selectedRole.roleId || selectedRole.id, data);
            } else {
                await createRole(data);
            }
            setIsRoleModalOpen(false);
            fetchRolesData();
        } catch (error) {
            console.error("Failed to save role", error);
        } finally {
            setIsActionLoading(false);
        }
    };

    // Delete
    const handleDelete = (row: any) => {
        setSelectedRole(row);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!selectedRole) return;
        setIsActionLoading(true);
        try {
            await deleteRole(selectedRole.roleId || selectedRole.id);
            setIsDeleteModalOpen(false);
            fetchRolesData();
        } catch (error) {
            console.error("Failed to delete role", error);
        } finally {
            setIsActionLoading(false);
        }
    };

    // Actions renderer
    const renderActions = (row: any) => {
        return (
            <div className="flex justify-center gap-2">
                <button
                    title="Manage Permissions"
                    className="text-green-600 cursor-pointer text-lg"
                    onClick={() => navigate(`/roles/${row.roleId || row.id}/permissions`)}
                >
                    <FaKey size={12} />
                </button>

                <button
                    title="Edit Role"
                    className="text-blue-500 cursor-pointer text-lg"
                    onClick={() => handleEdit(row)}
                >
                    <FaEdit size={12} />
                </button>

                <button
                    title="Delete Role"
                    className="text-red-500 cursor-pointer text-lg"
                    onClick={() => handleDelete(row)}
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
                    <h2 className="page-title !mb-0">Roles Management</h2>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        <FaPlus size={12} /> Add Role
                    </button>
                </div>
            </div>
            <CommonTable
                columns={columns}
                data={roles}
                rowActions={renderActions}
                isLoading={loading}
                maxHeight="70vh"
            />

            <RoleModal
                isOpen={isRoleModalOpen}
                onClose={() => setIsRoleModalOpen(false)}
                onSave={handleSaveRole}
                role={selectedRole}
                isLoading={isActionLoading}
            />

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Role"
                message={`Are you sure you want to delete the role "${selectedRole?.roleName}"? This action cannot be undone.`}
                isLoading={isActionLoading}
            />
        </div>
    );
};

export default Roles;