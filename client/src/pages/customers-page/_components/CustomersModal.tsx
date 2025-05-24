import { useForm } from "react-hook-form";
import Input from "../../../components/ui/Input";
import Modal from "../../../components/ui/Modal";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect } from "react";
import { Customer, useCustomersStore } from "../../../store/useCustomersStore";
import { formatPhoneNumber, unmaskPhoneNumber } from "../../../lib/utils";

const schema = yup.object({
  name: yup.string().required("Müşteri adı zorunludur."),
  surname: yup.string().required("Müşteri soyadı zorunludur."),
  email: yup
    .string()
    .email("Geçersiz e-posta adresi.")
    .required("E-posta zorunludur."),
  phone_number: yup.string().required("Telefon numarası zorunludur."),
  address: yup.string().required("Adres zorunludur."),
  tc_no: yup
    .string()
    .test("tc-no-format", "TC Kimlik No 11 haneli olmalıdır.", (value) => {
      if (!value) return true; // boşsa geç
      return /^\d{11}$/.test(value); // varsa kontrol et
    })
    .required("TC Kimlik No zorunludur."),
});

type FormData = yup.InferType<typeof schema>;

const CustomersModal = ({
  visible,
  onClose,
  isAddOperation,
  selectedRow,
  setSelectedRow,
}: {
  visible: boolean;
  onClose: () => void;
  isAddOperation: boolean;
  selectedRow: Customer | null;
  setSelectedRow: (row: Customer | null | any) => void;
}) => {
  const { createCustomer, updateCustomer, loading } = useCustomersStore();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema) as any,
  });

  const watchName = watch("name");
  const watchSurname = watch("surname");
  const watchEmail = watch("email");
  const watchPhoneNumber = watch("phone_number");
  const watchAddress = watch("address");
  const watchTcNo = watch("tc_no");

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        name: data.name,
        surname: data.surname,
        email: data.email,
        phone_number: unmaskPhoneNumber(data.phone_number as string),
        address: data.address,
        tc_no: data.tc_no,
      };

      if (isAddOperation) {
        await createCustomer(payload as Customer);
      } else {
        await updateCustomer(payload as Customer, selectedRow?.id as number);
      }
      onClose();
      setSelectedRow(null);
      setValue("name", "");
      setValue("surname", "");
      setValue("email", "");
      setValue("phone_number", "");
      setValue("address", "");
      setValue("tc_no", "");
    } catch (error) {
      console.error("Müşteri ekleme hatası:", error);
    }
  };

  useEffect(() => {
    if (!isAddOperation && selectedRow) {
      setValue("name", selectedRow.name);
      setValue("surname", selectedRow.surname);
      setValue("email", selectedRow.email as string);
      setValue("phone_number", selectedRow.phone_number as string);
      setValue("address", selectedRow.address as string);
      setValue("tc_no", selectedRow.tc_no as string);
    } else {
      resetValues();
    }
  }, [selectedRow, isAddOperation]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("phone_number", formatted, { shouldValidate: true }); // react-hook-form'a yeni değeri bildirmem gerekiyor.
  };

  const resetValues = () => {
    setValue("name", "");
    setValue("surname", "");
    setValue("email", "");
    setValue("phone_number", "");
    setValue("address", "");
    setValue("tc_no", "");

    errors.name = undefined;
    errors.surname = undefined;
    errors.email = undefined;
    errors.tc_no = undefined;
    errors.phone_number = undefined;
    errors.address = undefined;
  };

  return (
    <Modal
      open={visible}
      title={isAddOperation ? "Müşteri Ekle" : "Müşteri Düzenle"}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Adı"
            value={watchName}
            {...register("name")}
            errorMessage={errors.name?.message as string}
            required
          />
          <Input
            label="Soyadı"
            value={watchSurname}
            {...register("surname")}
            errorMessage={errors.surname?.message as string}
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            value={watchEmail as string}
            {...register("email")}
            errorMessage={errors.email?.message as string}
            required
          />
          <Input
            type="text"
            label="Telefon Numarası"
            value={watchPhoneNumber as string}
            {...register("phone_number")}
            onChange={handlePhoneChange}
            errorMessage={errors.phone_number?.message as string}
            required
          />
        </div>
        <Input
          label="Adres"
          value={watchAddress as string}
          {...register("address")}
          errorMessage={errors.address?.message as string}
          required
        />
        <Input
          type="number"
          label="TC Kimlik No"
          value={watchTcNo as string}
          {...register("tc_no")}
          errorMessage={errors.tc_no?.message as string}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length <= 11) {
              setValue("tc_no", value, { shouldValidate: true });
            }
          }}
          required
        />
      </form>
    </Modal>
  );
};

export default CustomersModal;
