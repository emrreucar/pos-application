import { useMemo, useState } from "react";
import { useUIContext } from "../../context/UIContext";

type Column<T> = {
  key: keyof T;
  label: string;
  isImage?: boolean;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  selectedRow?: T | null;
  onRowClick?: (row: T) => void;
};

function DataTable<T extends Record<string, any>>({
  columns,
  data,
  selectedRow,
  onRowClick,
}: Props<T>) {
  const { showSidebar } = useUIContext();

  const [filters, setFilters] = useState<Record<string, string>>({});

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      return columns.every((col) => {
        const filterValue = filters[col.key as string]?.toLowerCase() || "";
        const cellValue = String(item[col.key] ?? "").toLowerCase();
        return cellValue.includes(filterValue);
      });
    });
  }, [filters, data, columns]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <>
      <div
        className={`overflow-x-auto w-screen xl:w-[calc(100vw_-_300px)] base__card__container !p-0 h-[calc(100vh_-_250px)] ${
          !showSidebar && "!w-full"
        }`}
      >
        <table className="text-sm text-left text-gray-800 divide-y divide-gray-200 min-w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="px-3 py-2 whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
            </tr>

            <tr className="bg-gray-100 sticky top-0">
              {columns.map((col) => (
                <th key={String(col.key)} className="px-2 py-1">
                  {!col.isImage && (
                    <input
                      type="text"
                      value={filters[col.key as string] || ""}
                      onChange={(e) =>
                        handleFilterChange(col.key as string, e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs text-black"
                      placeholder="Ara"
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filteredData.map((row, i) => {
              const isSelected =
                selectedRow && row.id === (selectedRow as any).id;

              return (
                <tr
                  key={i}
                  className={`bg-gray-50 hover:bg-gray-100 cursor-pointer ${
                    isSelected ? "bg-primary-light/30" : ""
                  }`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {columns.map((col) => (
                    <td
                      key={String(col.key)}
                      className="px-3 py-1 whitespace-nowrap text-sm font-semibold text-gray-800"
                    >
                      {col.isImage ? (
                        <img
                          src={
                            row[col.key]
                              ? import.meta.env.VITE_BASE_IMAGE_URL +
                                row[col.key]
                              : "/images/no-image.jpg"
                          }
                          alt={col.label}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      ) : (
                        row[col.key]
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}

            {filteredData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="text-center text-gray-400 py-4"
                >
                  Sonuç bulunamadı.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pt-5 text-sm font-bold text-gray-800">
        {filteredData.length > 0 && (
          <span>{filteredData.length} veri bulundu.</span>
        )}
      </div>
    </>
  );
}

export default DataTable;
