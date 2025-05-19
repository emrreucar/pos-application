import Input from "../../components/ui/Input";
import { FaLock, FaUser } from "react-icons/fa";
import Button from "../../components/ui/Button";
import { IoIosLogIn } from "react-icons/io";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const schema = yup.object({
  username: yup.string().required("Kullanıcı adı zorunludur"),
  password: yup
    .string()
    .required("Şifre zorunludur")
    .min(6, "Şifre en az 6 karakter olmalıdır"),
});

type FormData = yup.InferType<typeof schema>;

const LoginPage = () => {
  const { login, loading } = useAuthStore();

  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const watchUsername = watch("username");
  const watchPassword = watch("password");

  const onSubmit = async (data: FormData) => {
    try {
      const result = await login(data);
      if (result) {
        navigate("/");
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
    }
  };

  return (
    <section className="flex gap-10 items-center justify-center h-screen bg-gray-100">
      {/* left side - form */}
      <article className="flex-[1.2] flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-lg">
          <span className="text-xl font-medium mb-4 text-center block">
            Tekrar, Hoşgeldiniz. Giriş Yapın
          </span>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="Kullanıcı Adı"
              value={watchUsername}
              {...register("username")}
              icon={<FaUser size={18} color="lightgray" />}
              errorMessage={errors.username?.message}
            />
            <Input
              type="password"
              value={watchPassword}
              label="Şifre"
              {...register("password")}
              icon={<FaLock size={18} color="lightgray" />}
              errorMessage={errors.password?.message}
            />
            <Button
              type="submit"
              size="md"
              variant="primary"
              fullWidth
              leftIcon={<IoIosLogIn size={20} color="white" />}
              loading={loading}
            >
              Giriş Yap
            </Button>
          </form>

          <span className="text-sm text-gray-500 mt-4 block text-center">
            Hesabınız yok mu?{" "}
            <Link to="/uye-ol" className="text-blue-500 hover:underline">
              Üye Olun
            </Link>
          </span>
        </div>
      </article>

      {/* right side - image */}
      <div className="flex-1 hidden lg:block w-full h-full">
        <img
          src="/images/login-bg2.jpg"
          alt="Background"
          className="w-full h-full object-cover rounded-l-3xl brightness-95"
        />
      </div>
    </section>
  );
};

export default LoginPage;
