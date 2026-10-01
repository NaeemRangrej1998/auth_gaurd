import React, { useState } from "react";

const VirtualTableComponent = ({ columns, data }) => {
  const [scrollTop, setScrollTop] = useState(0);
  const rowHeight = 40;
  const containerHeight = 200;
  const overscan = 2;
  const totalHeight = data.length * rowHeight;
  const firstVisibleIndex = Math.floor(
    scrollTop / rowHeight
  );
  const visibleRows = Math.ceil(
    containerHeight / rowHeight
  );
  // const startIndex = firstVisibleIndex;
  // const endIndex = startIndex + visibleRows;
  // Start and end with overscan
  const startIndex = Math.max(
    0,
    firstVisibleIndex - overscan
  );

  const endIndex = Math.min(
    data.length,
    firstVisibleIndex + visibleRows + overscan
  );
  const visibleData = data.slice(
    startIndex,
    endIndex
  );
  const offsetY = startIndex * rowHeight;
  const handleScroll = (event) => {
    setScrollTop(event.currentTarget.scrollTop);
  };
  return (
    <div
      style={{
        height: containerHeight,
        overflowY: "auto",
        width: "100%"
      }}
      onScroll={handleScroll}
    >
      <div
        style={{
          height: totalHeight,
          position: "relative",
        }}
      >
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
          }}
        >
          <table className="w-full  border-b border-gray-200">
            <thead className="bg-gray-200">
              <tr className="border-b border-gray-200">
                {columns.map((column: any) => (
                  <th key={column.key} className=" p-2 text-left">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {visibleData.map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={column.key} className="border-b border-gray-200 p-2">
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>

  );
};

export default VirtualTableComponent;