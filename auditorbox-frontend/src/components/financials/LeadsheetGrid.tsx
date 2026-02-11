import React, { useMemo } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, flexRender, ColumnDef, SortingState } from '@tanstack/react-table';
import { FileSpreadsheet, AlertTriangle, ArrowUpDown, ChevronDown } from 'lucide-react';

type Account = {
  code: string;
  name: string;
  prelim: number;
  adjustments: number;
  reported: number;
};

type LeadsheetGridProps = {
  leadsheetId: string;
  accounts: Account[];
  materiality: number;
  onAccountClick: (code: string) => void;
};

const LeadsheetGrid: React.FC<LeadsheetGridProps> = ({
  leadsheetId,
  accounts,
  materiality,
  onAccountClick,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const columns = useMemo<ColumnDef<Account>[]>(
    () => [
      {
        header: 'Account Code',
        accessorKey: 'code',
        cell: ({ getValue, row }) => (
          <button
            onClick={() => onAccountClick(row.original.code)}
            className="text-blue-400 hover:underline text-left"
          >
            {getValue() as string}
          </button>
        ),
        meta: { className: 'text-left' },
      },
      {
        header: 'Account Name',
        accessorKey: 'name',
        cell: ({ getValue }) => <div className="text-left">{getValue() as string}</div>,
        meta: { className: 'text-left' },
      },
      {
        header: ({ column }) => (
          <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Preliminary Balance
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        ),
        accessorKey: 'prelim',
        cell: ({ getValue }) => (
          <div className="text-right">{(getValue() as number).toLocaleString()}</div>
        ),
        meta: { className: 'text-right' },
      },
      {
        header: ({ column }) => (
          <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Adjustments
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        ),
        accessorKey: 'adjustments',
        cell: ({ getValue }) => (
          <div className="text-right">{(getValue() as number).toLocaleString()}</div>
        ),
        meta: { className: 'text-right' },
      },
      {
        header: ({ column }) => (
          <button onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            Reported Balance
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </button>
        ),
        accessorKey: 'reported',
        cell: ({ getValue }) => (
          <div className="text-right">{(getValue() as number).toLocaleString()}</div>
        ),
        meta: { className: 'text-right' },
      },
      {
        header: 'Variance %',
        accessorKey: 'variance',
        cell: ({ row }) => {
          const { prelim, adjustments } = row.original;
          const variance = prelim === 0 ? 0 : (adjustments / prelim) * 100;
          return (
            <div className="text-right">
              {prelim === 0 ? 'N/A' : variance.toFixed(2) + '%'}
            </div>
          );
        },
        meta: { className: 'text-right' },
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
          const { adjustments, prelim } = row.original;
          const absAdjustments = Math.abs(adjustments);
          const isMaterial = prelim !== 0 && absAdjustments > materiality;
          return (
            <div className="flex items-center justify-center">
              {isMaterial ? (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-green-500 flex items-center justify-center">
                  <div className="h-3 w-3 bg-green-500 rounded-full" />
                </div>
              )}
            </div>
          );
        },
        meta: { className: 'text-center' },
      },
    ],
    [materiality, onAccountClick]
  );

  const table = useReactTable({
    data: accounts,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  const totals = useMemo(() => {
    return accounts.reduce(
      (acc, curr) => ({
        prelim: acc.prelim + curr.prelim,
        adjustments: acc.adjustments + curr.adjustments,
        reported: acc.reported + curr.reported,
      }),
      { prelim: 0, adjustments: 0, reported: 0 }
    );
  }, [accounts]);

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white rounded-lg overflow-hidden border border-gray-700">
      <div className="p-4 border-b border-gray-700 flex items-center gap-3">
        <FileSpreadsheet className="h-6 w-6 text-blue-400" />
        <h2 className="text-lg font-semibold">Leadsheet: {leadsheetId}</h2>
      </div>
      <div className="p-4 border-b border-gray-700">
        <input
          type="text"
          placeholder="Search accounts..."
          className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={(table.getState().globalFilter as string) || ''}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
        />
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-800 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 border-b border-gray-700 font-medium"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-gray-700">
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-800 transition-colors"
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`px-4 py-2 ${(cell.column.columnDef.meta as any)?.className || ''
                      }`}
                  >
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-gray-800 font-semibold">
            <tr>
              <td colSpan={2} className="px-4 py-2 text-left border-b border-gray-700">
                Total
              </td>
              <td className="px-4 py-2 text-right border-b border-gray-700">
                {totals.prelim.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right border-b border-gray-700">
                {totals.adjustments.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-right border-b border-gray-700">
                {totals.reported.toLocaleString()}
              </td>
              <td colSpan={2} className="px-4 py-2 text-right border-b border-gray-700">
                {totals.prelim === 0 ? 'N/A' : ((totals.adjustments / totals.prelim) * 100).toFixed(2) + '%'}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="p-3 border-t border-gray-700 text-xs text-gray-400 flex items-center justify-between">
        <span>{table.getRowModel().rows.length} accounts</span>
        <div className="flex items-center gap-2">
          <span>Sort:</span>
          <ChevronDown className="h-3 w-3" />
        </div>
      </div>
    </div>
  );
};

export default LeadsheetGrid;