// import React, { useState } from "react";

// const VirtualTableComponent = ({ columns, data }) => {
//   const [scrollTop, setScrollTop] = useState(0);
//   const rowHeight = 40;
//   const containerHeight = 200;
//   const overscan = 2;
//   const totalHeight = data.length * rowHeight;
//   const firstVisibleIndex = Math.floor(
//     scrollTop / rowHeight
//   );
//   const visibleRows = Math.ceil(
//     containerHeight / rowHeight
//   );
//   // const startIndex = firstVisibleIndex;
//   // const endIndex = startIndex + visibleRows;
//   // Start and end with overscan
//   const startIndex = Math.max(
//     0,
//     firstVisibleIndex - overscan
//   );

//   const endIndex = Math.min(
//     data.length,
//     firstVisibleIndex + visibleRows + overscan
//   );
//   const visibleData = data.slice(
//     startIndex,
//     endIndex
//   );
//   const offsetY = startIndex * rowHeight;
//   const handleScroll = (event) => {
//     setScrollTop(event.currentTarget.scrollTop);
//   };
//   return (
//     <div
//       style={{
//         height: containerHeight,
//         overflowY: "auto",
//         width: "100%"
//       }}
//       onScroll={handleScroll}
//     >
//       <div
//         style={{
//           height: totalHeight,
//           position: "relative",
//         }}
//       >
//         <div
//           style={{
//             transform: `translateY(${offsetY}px)`,
//           }}
//         >
//           <table className="w-full  border-b border-gray-200">
//             <thead className="bg-gray-200">
//               <tr className="border-b border-gray-200">
//                 {columns.map((column: any) => (
//                   <th key={column.key} className=" p-2 text-left">
//                     {column.label}
//                   </th>
//                 ))}
//               </tr>
//             </thead>

//             <tbody>
//               {visibleData.map((row) => (
//                 <tr key={row.id}>
//                   {columns.map((column) => (
//                     <td key={column.key} className="border-b border-gray-200 p-2">
//                       {row[column.key]}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>

//   );
// };

// export default VirtualTableComponent;
import React, { useState } from "react";

const VirtualTableComponent = ({ columns, data }) => {
  const [scrollTop, setScrollTop] = useState(0);

  const rowHeight = 50;
  const containerHeight = 500;
  const overscan = 3;

  // Total height of all rows
  const totalHeight = data.length * rowHeight;

  // How many rows can fit inside viewport
  const visibleRows = Math.ceil(
    containerHeight / rowHeight
  );

  // Which row is currently around the top
  const firstVisibleIndex = Math.floor(
    scrollTop / rowHeight
  );

  // Start index
  const startIndex = Math.max(
    0,
    firstVisibleIndex - overscan
  );

  // End index
  const endIndex = Math.min(
    data.length,
    firstVisibleIndex + visibleRows + overscan
  );

  // Only get required rows
  const visibleData = data.slice(
    startIndex,
    endIndex
  );

  // Space before visible rows
  const topSpace = startIndex * rowHeight;

  // Space after visible rows
  const bottomSpace =
    totalHeight -
    topSpace -
    visibleData.length * rowHeight;

  const handleScroll = (event) => {
    setScrollTop(event.currentTarget.scrollTop);
  };

  return (
    <div
      style={{
        height: containerHeight,
        overflowY: "auto",
        width: "100%",
      }}
      onScroll={handleScroll}
    >
      <table className="w-full border-b border-gray-200">

        {/* HEADER */}
        <thead className="bg-gray-200 sticky top-0 z-10">
          <tr className="border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={column.key}
                className="h-[40px] p-2 text-left"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          {/* TOP SPACE */}
          {topSpace > 0 && (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  height: topSpace,
                  padding: 0,
                  border: 0,
                }}
              />
            </tr>
          )}

          {/* VISIBLE ROWS */}
          {visibleData.map((row) => (
            <tr
              key={row.id}
              className="h-[40px]"
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  className="h-[40px] border-b border-gray-200 p-2"
                >
                  {row[column.key]}
                </td>
              ))}
            </tr>
          ))}

          {/* BOTTOM SPACE */}
          {bottomSpace > 0 && (
            <tr>
              <td
                colSpan={columns.length}
                style={{
                  height: bottomSpace,
                  padding: 0,
                  border: 0,
                }}
              />
            </tr>
          )}

        </tbody>
      </table>
    </div>
  );
};

export default VirtualTableComponent;