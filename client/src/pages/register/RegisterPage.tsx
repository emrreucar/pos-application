import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { IoIosLogIn } from "react-icons/io";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { formatPhoneNumber, unmaskPhoneNumber } from "../../lib/utils";
import { useAuthStore } from "../../store/useAuthStore";

const schema = yup.object({
  name: yup.string().required("İsim zorunludur"),
  surname: yup.string().required("Soyisim zorunludur"),
  company_name: yup.string().required("Şirket adı zorunludur"),
  phone_number: yup
    .string()
    .required("Telefon numarası zorunludur")
    .matches(/^\(\d{3}\) \d{3}-\d{4}$/, "Telefon numarası geçersiz"),
  username: yup.string().required("Kullanıcı adı zorunludur"),
  password: yup
    .string()
    .required("Şifre zorunludur")
    .min(6, "Şifre en az 6 karakter olmalıdır"),
  email: yup
    .string()
    .email("Geçerli bir email adresi girin")
    .required("Email zorunludur"),
});

type FormData = yup.InferType<typeof schema>;

const RegisterPage = () => {
  const { signUp, loading } = useAuthStore();

  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const watchName = watch("name");
  const watchSurname = watch("surname");
  const watchCompanyName = watch("company_name");
  const watchPhoneNumber = watch("phone_number");
  const watchUsername = watch("username");
  const watchPassword = watch("password");
  const watchEmail = watch("email");

  const onSubmit = async (data: FormData) => {
    const payload = {
      ...data,
      phone_number: unmaskPhoneNumber(data.phone_number),
    };
    try {
      const result = await signUp(payload);
      if (result === true) {
        navigate("/giris-yap");
      }
    } catch (error) {
      console.error("Kayıt hatası:", error);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setValue("phone_number", formatted, { shouldValidate: true }); // react-hook-form'a yeni değeri bildirmem gerekiyor.
  };

  return (
    <section className="flex gap-10 items-center justify-center h-screen bg-gray-100">
      {/* left side - image */}
      <div className="flex-1 hidden lg:block w-full h-full">
        <img
          src="/images/register-bg.jpg"
          alt="Background"
          className="w-full h-full object-cover rounded-r-3xl brightness-95"
        />
      </div>

      {/* right side - form */}
      <article className="flex-[1.2] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-lg">
          <span className="text-xl font-medium mb-4 text-center block">
            Üye Olun
          </span>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="İsim"
              value={watchName}
              {...register("name")}
              errorMessage={errors.name?.message}
              required
            />
            <Input
              label="Soyisim"
              value={watchSurname}
              {...register("surname")}
              errorMessage={errors.surname?.message}
              required
            />
            <Input
              label="Şirket Adı"
              value={watchCompanyName}
              {...register("company_name")}
              errorMessage={errors.company_name?.message}
              required
            />
            <Input
              type="text"
              label="Telefon"
              value={watchPhoneNumber}
              {...register("phone_number")}
              errorMessage={errors.phone_number?.message}
              required
              onChange={handlePhoneChange}
            />
            <Input
              label="Kullanıcı Adı"
              value={watchUsername}
              {...register("username")}
              errorMessage={errors.username?.message}
              required
            />
            <Input
              type="email"
              value={watchEmail}
              label="Email"
              {...register("email")}
              errorMessage={errors.email?.message}
              required
            />
            <Input
              type="password"
              value={watchPassword}
              label="Şifre"
              {...register("password")}
              errorMessage={errors.password?.message}
              required
            />

            <Button
              type="submit"
              size="md"
              variant="primary"
              fullWidth
              leftIcon={<IoIosLogIn size={20} color="white" />}
              loading={loading}
            >
              Üye Ol
            </Button>
          </form>

          <span className="text-sm text-gray-500 mt-4 block text-center">
            Zaten bir hesabınız var mı?{" "}
            <Link to="/giris-yap" className="text-blue-500 hover:underline">
              Giriş Yapın
            </Link>
          </span>
        </div>
        <span className="absolute bottom-0 left-1/5">
          &copy; Made with by{" "}
          <Link
            to="https://www.linkedin.com/in/emreucar13/"
            target="_blank"
            className="font-semibold text-blue-500 hover:underline"
          >
            Emre Uçar
          </Link>
        </span>
      </article>
    </section>
  );
};

export default RegisterPage;
