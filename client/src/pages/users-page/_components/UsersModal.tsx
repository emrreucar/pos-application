import { useForm } from "react-hook-form";
import Input from "../../../components/ui/Input";
import Modal from "../../../components/ui/Modal";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { formatPhoneNumber, unmaskPhoneNumber } from "../../../lib/utils";
import { User, useUsersStore } from "../../../store/useUsersStore";

const schema = yup.object({
  username: yup.string().required("Kullanıcı adı zorunludur."),
  email: yup
    .string()
    .email("Geçersiz e-posta adresi.")
    .required("E-posta zorunludur."),
  role: yup.string().required("Yetki zorunludur."),
  name: yup.string().required("Müşteri adı zorunludur."),
  surname: yup.string().required("Müşteri soyadı zorunludur."),
  company_name: yup.string().required("Şirket adı zorunludur."),
  phone_number: yup.string().required("Telefon numarası zorunludur."),
});

type FormData = yup.InferType<typeof schema>;

const UsersModal = ({
  visible,
  onClose,
  isAddOperation,
  selectedRow,
  setSelectedRow,
}: {
  visible: boolean;
  onClose: () => void;
  isAddOperation: boolean;
  selectedRow: User | null;
  setSelectedRow: (row: User | null | any) => void;
}) => {
  const { updateUser, loading } = useUsersStore();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
  });

  const watchUsername = watch("username");
  const watchEmail = watch("email");
  const watchRole = watch("role");
  const watchName = watch("name");
  const watchSurname = watch("surname");
  const watchCompanyName = watch("company_name");
  const watchPhoneNumber = watch("phone_number");

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        name: data.name,
        surname: data.surname,
        company_name: data.company_name,
        phone_number: unmaskPhoneNumber(data.phone_number as string),
        username: data.username,
        email: data.email,
        role: data.role,
      };

      if (isAddOperation) {
        console.log("add operation");
      } else {
        await updateUser(payload as User, selectedRow?.id as number);
      }

      onClose();
      setSelectedRow(null);

      setValue("username", "");
      setValue("role", "");
      setValue("company_name", "");
      setValue("name", "");
      setValue("surname", "");
      setValue("email", "");
      setValue("phone_number", "");
    } catch (error) {
      console.error("Müşteri ekleme hatası:", error);
    }
  };

  useEffect(() => {
    if (!isAddOperation && selectedRow) {
      setValue("username", selectedRow.username);
      setValue("role", selectedRow.role);
      setValue("company_name", selectedRow.company_name);
      setValue("name", selectedRow.name);
      setValue("surname", selectedRow.surname);
      setValue("email", selectedRow.email as string);
      setValue("phone_number", selectedRow.phone_number as string);
    } else {
      resetValues();
    }
  }, [selectedRow, isAddOperation]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("phone_number", formatted, { shouldValidate: true }); // react-hook-form'a yeni değeri bildirmem gerekiyor.
  };

  const resetValues = () => {
    setValue("username", "");
    setValue("role", "");
    setValue("company_name", "");
    setValue("name", "");
    setValue("surname", "");
    setValue("email", "");
    setValue("phone_number", "");

    errors.username = undefined;
    errors.role = undefined;
    errors.company_name = undefined;
    errors.name = undefined;
    errors.surname = undefined;
    errors.email = undefined;
    errors.phone_number = undefined;
  };

  return (
    <Modal
      open={visible}
      title={isAddOperation ? "Kullanıcı Ekle" : "Kullanıcı Düzenle"}
      onClose={() => {
        onClose();
        if (isAddOperation) {
          resetValues();
        }
      }}
      onConfirm={() => {
        handleSubmit(onSubmit)();
      }}
      loading={loading}
      width="max-w-[90%] md:max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Input
            label="Kullanıcı Adı"
            value={watchUsername}
            {...register("username")}
            errorMessage={errors.username?.message as string}
          />
          <Input
            label="Adı"
            value={watchName}
            {...register("name")}
            errorMessage={errors.name?.message as string}
          />
          <Input
            label="Soyadı"
            value={watchSurname}
            {...register("surname")}
            errorMessage={errors.surname?.message as string}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            type="text"
            label="Şirket Adı"
            value={watchCompanyName as string}
            {...register("company_name")}
            errorMessage={errors.company_name?.message as string}
          />
          <Input
            label="Yetki"
            value={watchRole}
            {...register("role")}
            errorMessage={errors.role?.message as string}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            value={watchEmail as string}
            {...register("email")}
            errorMessage={errors.email?.message as string}
          />
          <Input
            type="text"
            label="Telefon Numarası"
            value={watchPhoneNumber as string}
            {...register("phone_number")}
            onChange={handlePhoneChange}
            errorMessage={errors.phone_number?.message as string}
          />
        </div>
      </form>
    </Modal>
  );
};

export default UsersModal;
