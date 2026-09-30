import React from "react";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onPageSize: (size: number) => void;
    pageSize: number;
    pageSizeOptions?: number[];
    totalItems?: number;
};

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    onPageSize,
    pageSize,
    totalItems,
    pageSizeOptions = [10, 20, 50, 100, 500, 1000],
}) => {
    const getPageNumbers = (): (number | string)[] => {
        const delta = 1;
        const range: (number | string)[] = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            range.unshift("...");
        }
        if (currentPage + delta < totalPages - 1) {
            range.push("...");
        }

        range.unshift(1);
        if (totalPages > 1) range.push(totalPages);

        return range;
    };

    const handleClick = (page: any) => {
        if (page !== "..." && page !== currentPage) {
            onPageChange(page);
        }
    };

    const pageNumbers = getPageNumbers();

    const startEntry = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endEntry = Math.min(currentPage * pageSize, totalItems || 0);

    return (
        <nav
            className="isolate flex flex-col sm:flex-row space-x-2 justify-between rounded-md shadow-2xs my-2 px-2"
            aria-label="Pagination"
        >
            <div className="flex flex-1 items-center space-x-2 ">
                <div className="flex flex-1 justify-between">
                    <div className="flex items-center space-x-2 mr-auto">
                        <label
                            htmlFor="pageSize"
                            className="text-sm font-medium text-nowrap text-gray-700"
                        >
                            Showing {startEntry} to {endEntry} of {totalItems} entries
                        </label>
                        {/*<span className="text-xs xl:text-sm">{totalItems}</span>*/}
                    </div>

                    <div className="flex items-center ">
                        <label
                            htmlFor="pageSize"
                            className="text-sm font-medium text-nowrap text-gray-700 mr-2"
                        >
                            Items per page:
                        </label>
                        <select
                            id="pageSize"
                            value={pageSize}
                            onChange={(e) => onPageSize(Number(e.target.value))}
                            className="block w-full py-2 text-center rounded-md border-gray-300 shadow-xs focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        >
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="flex item-center justify-center max-md:my-2">
                <button
                    onClick={() => handleClick(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50  focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                    <span className="sr-only">Previous</span>
                    <svg className="size-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M11.78 5.22a.75.75 0 0 1 0 1.06L8.06 10l3.72 3.72a.75.75 0 1 1-1.06 1.06l-4.25-4.25a.75.75 0 0 1 0-1.06l4.25-4.25a.75.75 0 0 1 1.06 0Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>

                {pageNumbers.map((page, idx) =>
                    page === "..." ? (
                        <span
                            key={idx}
                            className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-gray-300 ring-inset focus:outline-offset-0"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={idx}
                            onClick={() => handleClick(page)}
                            className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${page === currentPage
                                ? "z-10 bg-blue-600 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                : "text-gray-900 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                                }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    onClick={() => handleClick(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-gray-300 ring-inset hover:bg-gray-50 dark:hover:bg-gray-900 focus:z-20 focus:outline-offset-0 disabled:opacity-50"
                >
                    <span className="sr-only">Next</span>
                    <svg className="size-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M8.22 5.22a.75.75 0 0 1 1.06 0l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L11.94 10 8.22 6.28a.75.75 0 0 1 0-1.06Z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </nav>
    );
};

export default Pagination;
