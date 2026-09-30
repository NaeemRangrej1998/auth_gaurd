import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllModules, getRolePermissions, setRolePermission } from '../service/permissions.api';
import { FaArrowLeft } from 'react-icons/fa';

const RolePermissions = () => {
    const { roleId } = useParams<{ roleId: string }>();
    const navigate = useNavigate();
    const [modules, setModules] = useState<any[]>([]);
    const [permissions, setPermissions] = useState<any>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [roleId]);

    const fetchData = async () => {
        if (!roleId) return;
        setLoading(true);
        try {
            const modRes = await getAllModules();
            if (modRes.code === 200) {
                setModules(modRes.data);
            }

            const permRes = await getRolePermissions(parseInt(roleId));
            if (permRes.code === 200) {
                const permMap: any = {};
                permRes.data.forEach((p: any) => {
                    permMap[p.moduleId] = JSON.parse(p.accessTypes);
                });
                setPermissions(permMap);
            }
        } catch (error) {
            console.error("Failed to fetch permissions", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckboxChange = async (moduleId: number, type: string, checked: boolean) => {
        if (!roleId) return;
        
        const currentPerms = permissions[moduleId] || { add: false, edit: false, delete: false, view: false };
        const updatedPerms = { ...currentPerms, [type]: checked };
        
        // Optimistic update
        setPermissions((prev: any) => ({
            ...prev,
            [moduleId]: updatedPerms
        }));

        try {
            await setRolePermission(parseInt(roleId), {
                moduleId,
                canAdd: updatedPerms.add,
                canEdit: updatedPerms.edit,
                canDelete: updatedPerms.delete,
                canView: updatedPerms.view
            });
        } catch (error) {
            console.error("Failed to save permission", error);
            // Revert on failure
            fetchData();
        }
    };

    return (
        <div className="page-container">
            <div className="flex items-center gap-4 mb-6">
                <button 
                    onClick={() => navigate('/roles')}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
                >
                    <FaArrowLeft />
                </button>
                <div>
                    <h2 className="text-xl font-semibold text-gray-800">Role Permissions</h2>
                    <p className="text-sm text-gray-500">Manage permissions for role ID: {roleId}</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : (
                    <table className="w-full text-left text-sm text-gray-600">
                        <thead className="bg-gray-50 text-gray-700 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-medium">Module Name</th>
                                <th className="px-6 py-4 font-medium text-center">View</th>
                                <th className="px-6 py-4 font-medium text-center">Add</th>
                                <th className="px-6 py-4 font-medium text-center">Edit</th>
                                <th className="px-6 py-4 font-medium text-center">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {modules.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No modules available.
                                    </td>
                                </tr>
                            )}
                            {modules.map((mod) => {
                                const perms = permissions[mod.moduleId || mod.id] || { view: false, add: false, edit: false, delete: false };
                                return (
                                    <tr key={mod.moduleId || mod.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {mod.moduleName}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={perms.view}
                                                onChange={(e) => handleCheckboxChange(mod.moduleId || mod.id, 'view', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={perms.add}
                                                onChange={(e) => handleCheckboxChange(mod.moduleId || mod.id, 'add', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={perms.edit}
                                                onChange={(e) => handleCheckboxChange(mod.moduleId || mod.id, 'edit', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <input 
                                                type="checkbox" 
                                                checked={perms.delete}
                                                onChange={(e) => handleCheckboxChange(mod.moduleId || mod.id, 'delete', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default RolePermissions;
