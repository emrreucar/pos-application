import { Plus, X } from "lucide-react";
import React from "react";
import { CiEdit } from "react-icons/ci";
import { IoMdMail, IoMdPrint } from "react-icons/io";

interface ActionsProps {
  onAdd?: () => void;
  addTitle?: string;
  onEdit?: () => void;
  editTitle?: string;
  onDelete?: () => void;
  deleteTitle?: string;
  onPrint?: () => void;
  onEmail?: () => void;
}

const Actions: React.FC<ActionsProps> = ({
  onAdd,
  addTitle = "Ekle",
  onEdit,
  editTitle = "Düzenle",
  onDelete,
  deleteTitle = "Sil",
  onPrint,
  onEmail,
}) => {
  return (
    <div className="flex gap-2 mb-4 base__card__container">
      {onAdd && (
        <button
          onClick={onAdd}
          title={addTitle}
          className="bg-slate-800 text-white rounded-md p-1.5 hover:bg-slate-700 transition"
        >
          <Plus size={15} />
        </button>
      )}

      {onEdit && (
        <button
          onClick={onEdit}
          title={editTitle}
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

      {onEmail && (
        <button
          onClick={onEmail}
          title="Faturayı Mail'e Gönder"
          className="bg-slate-800 text-white rounded-md p-1.5 hover:bg-slate-700 transition"
        >
          <IoMdMail size={15} />
        </button>
      )}

      {onDelete && (
        <button
          onClick={onDelete}
          title={deleteTitle}
          className="bg-slate-800 text-red-500 rounded-md p-1.5 hover:bg-slate-700 transition"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
};

export default Actions;
