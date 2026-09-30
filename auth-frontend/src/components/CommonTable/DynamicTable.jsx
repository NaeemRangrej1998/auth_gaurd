// VirtualizedTable.jsx
"use client";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
// import { FiChevronDown, LiaSortUpSolid } from "react-icons/fi";
import { LiaSortSolid, LiaSortUpSolid } from "react-icons/lia";
/* ────────────────────────────────────────────────
   Column + prop types
────────────────────────────────────────────────── */

// (TypeScript types removed – `Column` and `VirtualTableProps` don't exist in JS.)
//
// Column shape:
//   columnLabel, columnKey, width, minWidth, maxWidth, isSticky, isSortable,
//   sortableKey, verticalAlign, render(value, row, index)
//
// Props:
//   columns, tableData, handleSelect, rowActions, fetchLoading, selectedId,
//   useAdId, maxHeight, rowHeight, overscan, checkboxWidth, actionWidth,
//   actionTitle, parentId, onSortChange, sortOrder

/* ────────────────────────────────────────────────
   Utilities
────────────────────────────────────────────────── */

const cellStyle = (col) => ({
  width: col.width,
  minWidth: col.minWidth,
  maxWidth: col.maxWidth,
  verticalAlign: col.verticalAlign ?? "middle",
});

/* ────────────────────────────────────────────────
   Top‑level component
────────────────────────────────────────────────── */

function VirtualizedTable({
  columns = [],
  tableData,
  handleSelect,
  rowActions,
  fetchLoading = false,
  selectedId: defaultSelected,
  useAdId = "id",
  rowHeight = 80,
  overscan = 50,
  checkboxWidth = 36,
  actionWidth = 150,
  maxHeight,
  actionTitle = "Actions",
  parentId = 'scroll',
  onSortChange,
  sortOrder,
  // onSortOrderChange,
}) {
  /* ---------- selection state ---------- */
  const [selectedId, setselectedId] = useState(defaultSelected || []);

  /* keep external defaultSelected in sync */
  useEffect(() => {
    if (Array.isArray(defaultSelected)) {
      setselectedId(defaultSelected);
    }
  }, [defaultSelected]);
  /* keep external defaultSelected in sync */
  useEffect(() => {
    const el = document.getElementById(parentId);
    if (el) {
      el.scrollTop = 0;
    }

    return () => {
      if (el) el.scrollTop = 0;
    }
  }, [parentId]);

  /* quick look‑up Map<id,row> */
  const selectedMap = useMemo(
    () => new Map(selectedId.map((r) => [r[useAdId], r])),
    [selectedId, useAdId]
  );

  /* Are all currently rendered rows selected? */
  const allSelected =
    tableData.length > 0 && tableData.every((r) => selectedMap.has(r[useAdId]));

  const emit = (rows) => handleSelect?.(rows, rows);

  /* ----- select / deselect helpers ----- */
  const toggleSelectAll = () => {
    if (!allSelected) {
      /* add only rows that are on this page */
      setselectedId(tableData);
      emit(tableData);
    } else {
      setselectedId([]);
      emit([]);
    }
  };

  const toggleSelectOne = (row) => {
    const id = row[useAdId];
    const next = selectedMap.has(id)
      ? selectedId.filter((r) => r[useAdId] !== id) // remove
      : [...selectedId, row]; // add
    setselectedId(next);
    emit(next);
  };

  /* ---------- virtual scroll ---------- */
  const [visibleRange, setVisibleRange] = useState([0, 20]);
  const scrollRef = useRef(null)

  // Prevent flicker and redundant renders
const scrollRaf = useRef(null);

const handleScroll = useCallback(
  (e) => {
    const target = !maxHeight ? e.currentTarget : scrollRef.current;
    if (!target) return;

    cancelAnimationFrame(scrollRaf.current);

    scrollRaf.current = requestAnimationFrame(() => {
      const { scrollTop, clientHeight } = target;
      const first = Math.floor(scrollTop / rowHeight);
      const last = Math.min(
        tableData.length - 1,
        Math.ceil((scrollTop + clientHeight) / rowHeight)
      );

      setVisibleRange([
        Math.max(0, first - overscan),
        Math.max(Math.min(tableData.length - 1, last + overscan), 20),
      ]);
    });
  },
  [maxHeight, rowHeight, tableData.length, overscan]
);

const handleDOMScroll = useCallback(
  (e) => {
    const target = !maxHeight
      ? e.target
      : scrollRef.current;
    if (!target) return;

    cancelAnimationFrame(scrollRaf.current);

    scrollRaf.current = requestAnimationFrame(() => {
      const { scrollTop, clientHeight } = target;
      const first = Math.floor(scrollTop / rowHeight);
      const last = Math.min(
        tableData.length - 1,
        Math.ceil((scrollTop + clientHeight) / rowHeight)
      );

      setVisibleRange([
        Math.max(0, first - overscan),
        Math.max(Math.min(tableData.length - 1, last + overscan), 20),
      ]);
    });
  },
  [maxHeight, rowHeight, tableData.length, overscan]
);

useEffect(() => {
  // Only attach to parent div when maxHeight is not set
  if (maxHeight) return;

  const el = document.getElementById(parentId);
  if (!el) return;

  el.addEventListener("scroll", handleDOMScroll, { passive: true });
  return () => el.removeEventListener("scroll", handleDOMScroll);
}, [maxHeight, handleDOMScroll, parentId]);


  const visibleRows = useMemo(
    () => tableData.slice(visibleRange[0], visibleRange[1] + 1),
    [tableData, visibleRange]
  );
  const topPad = visibleRange[0] * rowHeight;
  const bottomPad = (tableData.length - 1 - visibleRange[1]) * rowHeight;
  const colSpan =
    columns.length + (handleSelect ? 1 : 0) + (rowActions ? 1 : 0);

  /* ---------- render ---------- */

  // const [sortConfig, setSortConfig] = useState<
  //   { key: string; order: "ASC" | "DESC" | null, locked?: boolean; }[]
  // >([]);

  // useEffect(() => {
  //   if (sortOrder && sortOrder?.length) {
  //     setSortConfig(sortOrder);
  //   }
  // }, [sortOrder]);

  const handleSortClick = (columnKey, isLock) => {
    const idx = (sortOrder || []).findIndex((c) => c.key === columnKey);
    let config = [...(sortOrder || [])];
    const existing = idx > -1 ? config[idx] : null;

    if (isLock) {
      // --- label click: toggle lock ---
      if (existing) {
        if (existing.locked) {
          // already locked → remove
          config.splice(idx, 1);
        } else {
          // unlock → lock
          config[idx] = { ...existing, locked: true };
        }
      } else {
        // new locked column (default ASC)
        config = [...config.filter((c) => c.locked), { key: columnKey, order: null, locked: true }];
      }
    } else {
      // --- icon click: cycle order ---
      config = config.filter((c) => c.locked || c.key === columnKey); // keep locked + this one
      const i = config.findIndex((c) => c.key === columnKey);
      const col = i > -1 ? config[i] : null;
      
      if (!col) {
        // New column: start with ASC
        config.push({ key: columnKey, order: "ASC", locked: false });
      } else if (String(col.order).toUpperCase() === "ASC") {
        config[i] = { ...col, order: "DESC" };
      } else if (String(col.order).toUpperCase() === "DESC") {
        if (col.locked) {
          config[i] = { ...col, order: null }; // cycle to null if locked
        } else {
          config.splice(i, 1); // remove if not locked
        }
      } else if (!col.order) {
        config[i] = { ...col, order: "ASC" };
      }

    }
    const newConfig = (config ?? []).filter(x => x !== null);
    onSortChange?.(newConfig);
    return newConfig

  };




  return (
    <div
      onScroll={maxHeight ? handleScroll : (e) => { e.preventDefault() }}
      ref={scrollRef}
      style={maxHeight ? { maxHeight, overflowX: "auto" } : {}}
      className="overflow-x-auto custom-scrollbar">
      <table className="min-w-full text-sm text-left border-collapse">
        {/* ─── header ─────────────────────────────────────── */}
        <thead className="z-0 top-0 bg-gray-100 select-none">
          <tr>
            {handleSelect && (
              <th
                style={{
                  // ...cellStyle({}),
                  width: checkboxWidth,
                  position: "sticky",
                  left: 0,
                  zIndex: 0,
                }}
                className="border-b px-2  text-center bg-gray-100 dark:bg-gray-700!"
              >
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="accent-primary-500 hover:accent-primary-600 flex mx-auto"
                />
              </th>
            )}

            {/*  */}

            {columns.map((col, i) => {
              const sortIdx = (sortOrder || []).findIndex((s) => (s.key === col.columnKey || s.key === col.sortableKey));
              const activeSort = sortIdx > -1 ? (sortOrder || [])[sortIdx] : null;

              let sortIcon = <LiaSortSolid className="inline ml-1 text-gray-400" />;
              if (activeSort && activeSort.order) {
                sortIcon =
                  String(activeSort.order).toUpperCase() === "ASC" ? (
                    <LiaSortUpSolid className="inline ml-1 text-gray-600" />
                  ) : (
                    <LiaSortUpSolid className="inline ml-1 rotate-180 text-gray-600" />
                  );
              }

              return (
                <th
                  key={col.columnKey + i}
                  onClick={col.isSortable ? () => handleSortClick(col.sortableKey || col.columnKey, true) : undefined}
                  className={`border-b py-4 text-base font-semibold text-gray-600 px-2 whitespace-nowrap ${col.isSticky ? "bg-gray-100" : ""
                    }`}
                  style={{
                    ...cellStyle(col),
                    position: col.isSticky ? "sticky" : undefined,
                    left: col.isSticky ? checkboxWidth : undefined,
                    zIndex: col.isSticky ? 20 : undefined,
                  }}
                >
                  <span className="flex justify-between items-center">
                    {col.columnLabel ?? col.columnKey}
                    <div>
                    {activeSort && (!activeSort.order || activeSort.locked) &&  onSortChange && (
                      <span className="text-xs font-normal text-gray-500 ml-1">
                        ({sortIdx + 1})
                      </span>
                    )}
                    {col.isSortable && onSortChange && (
                      <button
                        className="outline-hidden border-none ml-1"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent double trigger
                          handleSortClick(col?.sortableKey || col.columnKey);
                        }}
                      >
                        {sortIcon}
                      </button>
                    )}
                    </div>
                  </span>
                </th>
              );
            })}


            {/*  */}

            {rowActions && (
              <th
                style={{
                  width: actionWidth,
                  // position: "sticky",
                  right: -1,
                  zIndex: 0,
                }}
                className="border-b md:sticky px-2 text-base text-gray-600 bg-gray-100 dark:bg-gray-700!"
              >
                {actionTitle}
              </th>
            )}
          </tr>
        </thead>

        {/* ─── body ───────────────────────────────────────── */}
        <tbody>
          {/* top spacer */}
          {topPad > 0 && (
            <tr>
              <td colSpan={colSpan} style={{ height: topPad }} />
            </tr>
          )}

          {/* visible rows */}
          {visibleRows.map((row, localIdx) => {
            const absIdx = visibleRange[0] + localIdx;
            const isChecked = selectedMap.has(row[useAdId]);
            return (
              <Row
                key={absIdx}
                row={row}
                rowIdx={absIdx}
                columns={columns}
                rowHeight={rowHeight}
                isSelected={isChecked}
                toggleSelectOne={
                  handleSelect ? () => toggleSelectOne(row) : undefined
                }
                fetchLoading={fetchLoading}
                rowActions={rowActions}
                useAdId={useAdId}
                checkboxWidth={checkboxWidth}
                actionWidth={actionWidth}
              />
            );
          })}

          {/* bottom spacer */}
          {bottomPad > 0 && (
            <tr>
              <td colSpan={colSpan} style={{ height: bottomPad }} />
            </tr>
          )}
        </tbody>
      </table>

      {/* ─── loading & empty states ─────────────────────── */}
      {fetchLoading && tableData.length === 0 && (
        <div className="flex h-44 items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 " />
        </div>
      )}

      {!fetchLoading && tableData.length === 0 && (
        <div className="flex h-44 items-center justify-center text-gray-500 text-2xl">
          No data available
        </div>
      )}
    </div>
  );
}

export default VirtualizedTable;

/* ────────────────────────────────────────────────
   Row (memoized)
────────────────────────────────────────────────── */

const Row = memo((props) => {
  const {
    row,
    rowIdx,
    columns,
    rowHeight,
    isSelected,
    toggleSelectOne,
    fetchLoading,
    rowActions,
    useAdId,
    checkboxWidth,
    actionWidth,
  } = props;

  return (
    <tr
      className={`group border-b  ${row.isAddedToReport ? "bg-slate-100  dark:bg-gray-900!" : "bg-white hover:bg-gray-50"}`}
      style={{ height: rowHeight }}
    >
      {toggleSelectOne && (
        <td
          style={{
            width: checkboxWidth,
            position: "sticky",
            left: 0,
            zIndex: 10,
          }}
          className={` text-center  ${row.isAddedToReport ? "bg-slate-100  dark:bg-gray-900!" : "bg-white group-hover:bg-gray-50 dark:group-hover:bg-gray-700"}`}
        >
          <div className="flex justify-center items-center h-full">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={toggleSelectOne}
              disabled={fetchLoading}
              className="accent-primary-500 hover:accent-primary-600"
            />
          </div>
        </td>
      )}

      {columns.map((col, i) => (
        <td
          key={col.columnKey + i}
          className={`px-2 text-base py-2 overflow-hidden dark:group-hover:bg-gray-700 text-muted ${col.isSticky ? "bg-white" : row.isAddedToReport ? "dark:bg-gray-900!" : ""
            }`}
          style={{
            ...cellStyle(col),
            position: col.isSticky ? "sticky" : undefined,
            left: col.isSticky ? checkboxWidth : undefined,
          }}
        ><div className="relative">
            {col.render
              ? col.render(row[col.columnKey], row, rowIdx)
              : (row[col.columnKey] ?? "—")}
            {fetchLoading && (
              <div className="absolute inset-0 w-full h-full bg-backGround animate-pulse z-10 rounded-xs"></div>
            )}
          </div>
        </td>
      ))}

      {rowActions && (
        <td
          className={`px-2 text-left md:sticky ${row.isAddedToReport ? "bg-slate-100  dark:bg-gray-900!" : "bg-white group-hover:bg-gray-50 dark:group-hover:bg-gray-700"}`}
          style={{
            // position: "sticky",
            right: 0,
            width: actionWidth,
            zIndex: 10,
          }}
        >
          <div className="relative">
            {rowActions(row, rowIdx)}
            {fetchLoading && (
              <div className="absolute inset-0 w-full h-full bg-backGround animate-pulse z-10 rounded-xs"></div>
            )}
          </div>
        </td>
      )}
    </tr>
  );
});

Row.displayName = "Row";