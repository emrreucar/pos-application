import { Plus, X } from "lucide-react";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { IoMdPrint } from "react-icons/io";

interface ActionsProps {
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onPrint?: () => void;
}

const Actions: React.FC<ActionsProps> = ({
  onAdd,
  onEdit,
  onDelete,
  onPrint,
}) => {
  return (
    <div className="flex gap-2 mb-4 base__card__container">
      {onAdd && (
        <button
          onClick={onAdd}
          title="Ekle"
          className="bg-slate-800 text-white rounded-md p-1.5 hover:bg-slate-700 transition"
        >
          <Plus size={15} />
        </button>
      )}

      {onEdit && (
        <button
          onClick={onEdit}
          title="Düzenle"
          className="bg-slate-800 text-white rounded-md p-1.5 hover:bg-slate-700 transition"
        >
          <CiEdit size={15} />
        </button>
      )}

      {onPrint && (
        <button
          onClick={onPrint}
          title="Yazdır"
          className="bg-slate-800 text-white rounded-md p-1.5 hover:bg-slate-700 transition"
        >
          <IoMdPrint size={15} />
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          title="Sil"
          className="bg-slate-800 text-red-500 rounded-md p-1.5 hover:bg-slate-700 transition"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export default Actions;
