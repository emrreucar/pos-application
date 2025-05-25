import Input from "../../components/ui/Input";
import { FaLock, FaUser } from "react-icons/fa";
import Button from "../../components/ui/Button";
import { IoIosLogIn } from "react-icons/io";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

// const TEXTS = [
//   {
//     id: 1,
//     title: "POS ÇÖZÜMLERİ",
//     description:
//       "İhtiyaçlarınıza özel geliştirilmiş, hızlı ve güvenilir POS yazılımları. Müşteri deneyimini iyileştiren ve iş süreçlerinizi kolaylaştıran yenilikçi çözümlerle sektörde fark yaratın.",
//   },
//   {
//     id: 2,
//     title: "RESPONSİVE TASARIM & KURUMSAL ÇÖZÜMLER",
//     description:
//       "Mobil uyumlu tasarım ve kurumsal çözümlerle, her cihazda mükemmel performans. İşletmenizin ihtiyaçlarına özel, esnek ve ölçeklenebilir POS sistemleri ile rekabette öne çıkın.",
//   },
//   {
//     id: 3,
//     title: "FATURALANDIRMA, STOK TAKİBİ VE RAPORLAMA",
//     description:
//       "Tüm süreçlerinizi tek panelden kolayca yönetin. Güncel stok yönetimi, detaylı raporlar ve özelleştirilebilir faturalar parmaklarınızın ucunda.",
//   },
//   {
//     id: 4,
//     title: "YENİLİKÇİ, ESNEK VE GÜVENİLİR POS YAZILIMLARI",
//     description:
//       "Sektörel ihtiyaçlarınıza uygun geliştirilmiş POS yazılımlarıyla işinizi bir adım öteye taşıyın.",
//   },
// ];

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
            Tekrar, hoşgeldiniz. Giriş Yapın
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

      {/* right side - image */}
      <div className="flex-1 hidden lg:block w-full h-full relative">
        <img
          src="/images/login-bg2.jpg"
          alt="Background"
          className="w-full h-full object-cover rounded-l-3xl brightness-95"
        />

        {/* <div className="absolute top-0 left-0 w-full h-full rounded-l-3xl text-white flex flex-col gap-10 items-start justify-center">
          {TEXTS.map((text) => (
            <div
              key={text.id}
              className="flex flex-col items-start gap-2 px-10"
            >
              <span className="text-2xl font-bold">{text.title}</span>
              <span>{text.description}</span>
            </div>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default LoginPage;
