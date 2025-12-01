import {
  useReactTable,
  getCoreRowModel,
  createColumnHelper,
  flexRender,
} from "@tanstack/react-table";
import type { Pokemon } from "../lib/types/pokemon";

const columnHelper = createColumnHelper<Pokemon>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
  }),
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => (
      <span className="font-medium capitalize text-gray-900">
        {info.getValue()}
      </span>
    ),
  }),
  columnHelper.accessor("types", {
    header: "Type(s)",
    cell: (info) => {
      const types = info.getValue();
      return (
        <div className="flex gap-2">
          {types.map((t) => (
            <span
              key={t.slot}
              className="px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700"
            >
              {t.type.name}
            </span>
          ))}
        </div>
      );
    },
  }),
  columnHelper.accessor("sprites", {
    header: () => <div className="text-center">Sprite</div>,
    cell: (info) => {
      const sprite = info.getValue().front_default;
      return sprite ? (
        <div className="flex items-center justify-center">
          <img
            src={sprite}
            alt={info.row.original.name}
            className="w-16 h-16 object-contain"
          />
        </div>
      ) : null;
    },
  }),
];

interface PokemonTableProps {
  data: Pokemon[];
}

export function PokemonTable({ data }: PokemonTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
      <table className="min-w-full">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="bg-gradient-to-r from-blue-50 to-indigo-50">
              {headerGroup.headers.map((header) => {
                const isSpriteColumn = header.column.id === "sprites";
                return (
                  <th
                    key={header.id}
                    className={`px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider ${
                      isSpriteColumn ? "text-center" : "text-left"
                    }`}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-blue-50 transition-colors duration-150 cursor-pointer">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

