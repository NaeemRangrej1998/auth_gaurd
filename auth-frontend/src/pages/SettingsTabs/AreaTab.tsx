import React, { useEffect, useState, useCallback } from 'react';
import CommonTable from '../../components/CommonTable/CommonTable';
import { getAllAreas, createArea, updateArea, deleteArea } from '../../service/areas.api';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import ConfirmModal from '../../components/Modal/ConfirmModal';

const AreaTab = () => {
    const [loading, setLoading] = useState(false);
    const [areas, setAreas] = useState<any[]>([]);

    // Simplistic inline modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selected, setSelected] = useState<any>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await getAllAreas();
            if (res.code === 200) setAreas(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (selected) await updateArea(selected.id, formData);
            else await createArea(formData);
            setIsModalOpen(false);
            fetchData();
        } catch (err) { }
    };

    const confirmDelete = async () => {
        if (!selected) return;
        try {
            await deleteArea(selected.id);
            setIsDeleteOpen(false);
            fetchData();
        } catch (err) { }
    };

    const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Area Name", render: (r: any) => <strong>{r.name}</strong> },
        { key: "description", label: "Description" },
    ];

    const renderActions = (row: any) => (
        <div className="flex justify-center gap-2">
            <button className="text-blue-500" onClick={() => { setSelected(row); setFormData({ name: row.name, description: row.description }); setIsModalOpen(true); }}><FaEdit size={12} /></button>
            <button className="text-red-500" onClick={() => { setSelected(row); setIsDeleteOpen(true); }}><FaTrash size={12} /></button>
        </div>
    );

    return (
        <div className="page-container">            <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Manage Areas</h3>
            <button onClick={() => { setSelected(null); setFormData({ name: '', description: '' }); setIsModalOpen(true); }} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                <FaPlus size={12} /> Add Area
            </button>
        </div>
            <CommonTable columns={columns} data={areas} rowActions={renderActions} isLoading={loading} maxHeight="70vh" />

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md bg-white rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4">{selected ? 'Edit Area' : 'Add Area'}</h3>
                        <form onSubmit={handleSave}>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Description</label>
                                    <input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50">Cancel</button>
                                <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
                                    {selected ? 'Update' : 'Save'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <ConfirmModal isOpen={isDeleteOpen} onClose={() => setIsDeleteOpen(false)} onConfirm={confirmDelete} title="Delete Area" message="Are you sure you want to delete this area?" />
        </div>
    );
};
export default AreaTab;
