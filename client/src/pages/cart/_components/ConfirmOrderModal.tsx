import { useEffect } from "react";
import Modal from "../../../components/ui/Modal";
import { useCustomersStore } from "../../../store/useCustomersStore";
import { useSetsStore } from "../../../store/useSetsStore";
import { useCartStore } from "../../../store/useCartStore";
import Select from "../../../components/ui/Select";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { formatCurrency } from "../../../lib/utils";
import { useBillsStore } from "../../../store/useBillsStore";
import { useNavigate } from "react-router-dom";

const schema = yup.object({
  customer_id: yup.number().required("Müşteri seçimi zorunludur"),
  payment_method_id: yup.number().required("Ödeme yöntemi seçimi zorunludur"),
});

type FormData = yup.InferType<typeof schema>;

const ConfirmOrderModal = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { cartItems, totalPrice, clearCart } = useCartStore();
  const { fetchPaymentMethods, paymentMethods } = useSetsStore();
  const { fetchCustomers, customers } = useCustomersStore();
  const { createBill, error } = useBillsStore();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (visible) {
      fetchCustomers();
      fetchPaymentMethods();
    }
  }, [visible]);

  const customersOptions = customers.map((customer) => ({
    label: customer.name + " " + customer.surname,
    value: customer.id,
  }));

  const paymentMethodsOptions = paymentMethods.map((method) => ({
    label: method.name,
    value: method.id,
  }));

  const onSubmit = async (data: FormData) => {
    const payload = {
      customer_id: data.customer_id,
      payment_method_id: data.payment_method_id,
      cart_items: cartItems.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price,
      })),
    };

    try {
      const result = await createBill(payload);

      if (result === "success") {
        onClose();
        clearCart();
        navigate("/faturalar");
      } else {
        console.error("Sipariş oluşturulamadı:", error);
      }
    } catch (error) {
      console.error("Sipariş oluşturma hatası:", error);
    }
  };

  return (
    <Modal
      open={visible}
      title="Siparişi Onayla"
      onClose={() => {
        onClose();
      }}
      onConfirm={() => {
        handleSubmit(onSubmit)();
      }}
      height="lg:h-[50vh] h-[60vh]"
      width="lg:max-w-[35%] sm:max-w-[60%] max-w-[90%]"
    >
      <form
        className="flex-1 overflow-y-auto  h-full px-1 flex flex-col justify-between"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="space-y-4">
          <Controller
            name="customer_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Müşteri Seçin"
                value={field.value}
                onChange={field.onChange}
                options={customersOptions}
                placeholder="Müşteri Ara.."
                errorMessage={errors.customer_id?.message as string}
                required
              />
            )}
          />
          <Controller
            name="payment_method_id"
            control={control}
            render={({ field }) => (
              <Select
                label="Ödeme Yöntemi Seçin"
                value={field.value}
                onChange={field.onChange}
                options={paymentMethodsOptions}
                placeholder="Ödeme Yöntemi Ara.."
                errorMessage={errors.payment_method_id?.message as string}
                required
              />
            )}
          />
        </div>

        <div className="mt-auto flex items-center justify-between font-bold text-lg text-red-500 border-t border-gray-300 pt-4">
          <span>Genel Toplam: </span>
          <span> {formatCurrency(totalPrice())} </span>
        </div>
      </form>
    </Modal>
  );
};

export default ConfirmOrderModal;
