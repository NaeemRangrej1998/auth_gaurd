// import React from 'react'

// const CommonTable = ({ columns, data, rowActions, isLoading = false }: any) => {
//     return (
//         <>
//             <table>
//                 <thead>
//                     <tr>
//                         {columns.map((column, index) => (
//                             <th key={index} >
//                                 {column.label}
//                             </th>
//                         ))}
//                         <th>Actions</th>
//                     </tr>
//                 </thead>
//                 <tbody>

//                     {
//                         isLoading && (
//                             <tr>
//                                 <td colSpan={columns.length + 1} className="text-center">
//                                     Loading...
//                                 </td>
//                             </tr>
//                         )
//                     }
//                     {!isLoading && data.length === 0 && (
//                         <tr>
//                             <td colSpan={columns.length + 1} className="text-center">
//                                 No data available
//                             </td>
//                         </tr>
//                     )}
//                     {!isLoading && data.map((row, index) => (
//                         // this for row
//                         <tr key={index}>
//                             {/* this will get row data based on column name */}
//                             {columns.map((column, index) => (
//                                 <td key={index}>
//                                     {column.render ? column.render(row) : row[column.key]}
//                                 </td>
//                             ))}
//                             {rowActions && (
//                                 <td>
//                                     {rowActions(row, index)}
//                                 </td>
//                             )}
//                         </tr>
//                     ))}
//                 </tbody>

//             </table>
//         </>
//     )
// }

// export default CommonTable

import React, { useState, useEffect, useMemo } from "react";

type Column<T> = {
    key: keyof T;
    label: string;
    render?: (row: T) => React.ReactNode;
};

type CommonTableProps<T> = {
    columns: Column<T>[];
    data: T[];
    rowActions?: (row: T, index: number) => React.ReactNode;
    isLoading?: boolean;
    maxHeight?: string;
    handleSelect?: (selectedRows: T[], rows: T[]) => void;
    selectedId?: T[];
    useAdId?: keyof T;
};

const CommonTable = <T,>({
    columns,
    data,
    rowActions,
    isLoading = false,
    maxHeight,
    handleSelect,
    selectedId: defaultSelected,
    useAdId = "id" as keyof T,
}: CommonTableProps<T>) => {
    const [selectedId, setSelectedId] = useState<T[]>(defaultSelected || []);

    useEffect(() => {
        if (Array.isArray(defaultSelected)) {
            setSelectedId(defaultSelected);
        }
    }, [defaultSelected]);

    const selectedMap = useMemo(
        () => new Map(selectedId.map((r) => [r[useAdId], r])),
        [selectedId, useAdId]
    );

    const allSelected = data.length > 0 && data.every((r) => selectedMap.has(r[useAdId]));
    const isSomeSelected = selectedId.length > 0 && !allSelected;

    const emit = (rows: T[]) => handleSelect?.(rows, rows);

    const toggleSelectAll = () => {
        if (!allSelected) {
            setSelectedId(data);
            emit(data);
        } else {
            setSelectedId([]);
            emit([]);
        }
    };

    const toggleSelectOne = (row: T) => {
        const id = row[useAdId];
        const next = selectedMap.has(id)
            ? selectedId.filter((r) => r[useAdId] !== id)
            : [...selectedId, row];
        setSelectedId(next);
        emit(next);
    };

    return (
        <div className="w-full overflow-x-auto border-b border-gray-200 bg-white "
            style={maxHeight ? { maxHeight, overflowX: "auto" } : {}}
        >
            <table className="w-full min-w-max text-left text-sm text-gray-700">

                {/* ================= HEADER ================= */}
                <thead className="bg-gray-100 text-xs uppercase text-gray-600">
                    <tr>
                        {handleSelect && (
                            <th className="w-12 px-6 py-4 text-center sticky left-0 z-10 bg-gray-100">
                                <input
                                    type="checkbox"
                                    className="cursor-pointer h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-primary-500"
                                    checked={allSelected}
                                    ref={(input) => {
                                        if (input) input.indeterminate = isSomeSelected;
                                    }}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                        )}
                        {columns.map((column) => (
                            <th
                                key={String(column.key)}
                                className="whitespace-nowrap px-6 py-4 font-semibold"
                            >
                                {column.label}
                            </th>
                        ))}

                        {rowActions && (
                            <th className="whitespace-nowrap px-6 py-4 text-center font-semibold">
                                Actions
                            </th>
                        )}
                    </tr>
                </thead>

                {/* ================= BODY ================= */}
                <tbody className="divide-y divide-gray-200">
                    {/* Data */}
                    {!isLoading &&
                        data.map((row, rowIndex) => {
                            const isChecked = selectedMap.has(row[useAdId]);
                            return (
                                <tr
                                    key={rowIndex}
                                    className={`transition-colors hover:bg-gray-50 ${isChecked ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
                                >
                                    {handleSelect && (
                                        <td className={`w-12 px-6 py-4 text-center sticky left-0 z-10 ${isChecked ? 'bg-blue-50' : 'bg-white'}`}>
                                            <input
                                                type="checkbox"
                                                className="cursor-pointer h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 accent-primary-500"
                                                checked={isChecked}
                                                onChange={() => toggleSelectOne(row)}
                                            />
                                        </td>
                                    )}
                                    {columns.map((column) => (
                                        <td
                                            key={String(column.key)}
                                            className="whitespace-nowrap px-6 py-4"
                                        >
                                            {column.render
                                                ? column.render(row)
                                                : String(row[column.key] ?? "")}
                                        </td>
                                    ))}

                                    {rowActions && (
                                        <td className="whitespace-nowrap px-6 py-4 text-center right: -1 zIndex: 0">
                                            {rowActions(row, rowIndex)}
                                        </td>
                                    )}
                                </tr>
                            );
                        })}
                </tbody>
            </table>
            {isLoading && data.length === 0 && (

                <div className="flex h-44 items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 " />
                </div>

            )}
            {/* Empty */}
            {!isLoading && data.length === 0 && (
                <div className="flex h-44 items-center justify-center text-gray-500 text-2xl">
                    No data available
                </div>
            )}

        </div>
    );
};

export default CommonTable;