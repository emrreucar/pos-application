<img width="2553" height="1224" alt="image" src="https://github.com/user-attachments/assets/d902d284-3d2b-4daa-8699-d995ea46a59d" />


# 🛒 Modern POS System - Satış Noktası Uygulaması

React, TypeScript ve modern web teknolojileri kullanılarak geliştirilmiş, işletmeler için kapsamlı satış noktası (Point of Sale) sistemi.

## 🌟 Özellikler

- 🔐 **Güvenli Kimlik Doğrulama** - JWT tabanlı kullanıcı yetkilendirmesi
- 📦 **Ürün Yönetimi** - Ürün ekleme, düzenleme, silme ve kategori yönetimi
- 🛍️ **Satış İşlemleri** - Hızlı ve kolay satış yapma, sepet yönetimi
- 🧾 **Fiş ve Fatura** - Otomatik fiş oluşturma ve yazdırma
- 📊 **Raporlama** - Günlük, haftalık, aylık satış raporları
- 👥 **Müşteri Yönetimi** - Müşteri kayıtları ve satış geçmişi
- 💰 **Kasa Yönetimi** - Günlük kasa açılış/kapanış işlemleri
- 📱 **Responsive Tasarım** - Tablet ve desktop uyumlu arayüz
- ⚡ **Hızlı Arama** - Ürün ve müşteri için anlık arama
- 🏪 **Multi-Store** - Çoklu mağaza desteği

## 🛠️ Teknoloji Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form** - Form state management
- **Zustand** - Lightweight state management

### Backend & Database
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Microsoft SQL Server** - Relational database
- **JWT** - JSON Web Token authentication

## 📋 Gereksinimler

- Node.js 18.0 veya üzeri
- npm veya yarn package manager
- Microsoft SQL Server 2019 veya üzeri
- SQL Server Management Studio (opsiyonel)

## 🚀 Kurulum

1. **Depoyu klonlayın**
```bash
git clone <your-repo-url>
cd pos-system
```

2. **Backend bağımlılıklarını yükleyin**
```bash
cd server
npm install
```

3. **Frontend bağımlılıklarını yükleyin**
```bash
cd client
npm install
```

4. **Environment variables ayarlayın**
Server klasöründe `.env` dosyası oluşturun:
```env
# Database
MSSQL_DATABASE=your_database_name
MSSQL_SERVER=your_database_server
MSSQL_USERNAME=your_username
MSSQL_PASSWORD=your_password

# JWT
JWT_SECRET="your_jwt_secret_key"

# Server
PORT=your_port_number
NODE_ENV="development"

# CORS
```

Client klasöründe `.env` dosyası oluşturun:
```env
# API Base URL
VITE_API_URL=http://localhost:4000/api
VITE_BASE_IMAGE_URL=http://localhost:4000
```

5. **Backend server'ı başlatın**
```bash
cd server
npm run dev
Server is running on port 4000...
Connected to MSSQL database...
```

7. **Frontend uygulamasını başlatın**
```bash
cd client
npm run dev
```

Backend [http://localhost:4000](http://localhost:4000), Frontend [http://localhost:7000](http://localhost:7000) adresinde çalışacaktır.

## 🏗️ Proje Yapısı

```
pos-system/
├── server/
│   ├── src/
│   │   ├── controllers/         # Route controllers
│   │   ├── lib/                 # Database and jwt controls
│   │   ├── middlewares/         # Express middleware
│   │   ├── routes/              # API routes
│   │   └── validators/          # Express validator
│   │   └── index.js             
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── context/          # Context Api
│   │   ├── hooks/            # Custom hooks
│   │   ├── lib/              # Custom axios connection and utils.ts
│   │   ├── pages/            # Page components
│   │   ├── store/            # Zustand stores
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx
│   │   ├── index.css
│   │   ├── main.tsx           
│   └── package.json
└── README.md
```

## 📱 Ana Sayfalar

- **Dashboard** - Günlük satış özeti ve hızlı erişim
- **Satış Ekranı** - POS terminal arayüzü
- **Ürün Yönetimi** - Ürün CRUD işlemleri
- **Kategori Yönetimi** - Ürün kategorileri
- **Müşteri Yönetimi** - Müşteri kayıtları
- **Satış Raporları** - Detaylı satış analizleri
- **Kasa Yönetimi** - Günlük kasa işlemleri
- **Kullanıcı Yönetimi** - Personel ve yetki yönetimi

## 🔧 Önemli Özellikler

### Satış İşlemleri
- Hızlı ürün arama ve ekleme
- Sepet yönetimi (miktar, indirim)
- Çoklu ödeme yöntemi (nakit, kart, çek)
- Otomatik fiş yazdırma

### Ürün Yönetimi
- Toplu ürün import/export
- Kategori bazlı filtreleme
- Stok takibi ve uyarıları
- Resim upload desteği
- Fiyat geçmişi

### Raporlama
- Günlük satış raporu
- En çok satan ürünler
- Müşteri analizi
- Kar-zarar hesaplaması
- Excel export özelliği

### Kullanıcı Yetkilendirmesi
- Admin, Manager, Kasiyer rolleri
- Sayfa bazlı erişim kontrolü
- İşlem logları
- Session yönetimi

## 🌐 Deployment

### Production Build
```bash
# Frontend build
cd client
npm run build

# Backend production
cd server
npm run build
npm start
```

## 🔒 Güvenlik

- JWT token tabanlı authentication
- Password hashing (bcrypt)
- Rate limiting
- CORS protection
- SQL injection prevention
- XSS protection

## 🤝 Katkıda Bulunma

Bu proje aktif olarak geliştirilmektedir. Katkılarınızı memnuniyetle karşılarım:

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Sorularınız için:
- GitHub Issues kullanabilirsiniz
- Email: emre.ucarr1@gmail.com

---

⭐ Projeyi beğendiyseniz yıldız vermeyi unutmayın!

## 🙏 Teşekkürler

Bu proje modern POS sistemlerinin ihtiyaçlarını karşılamak amacıyla geliştirilmiştir. Küçük ve orta ölçekli işletmelerin dijital dönüşümüne katkıda bulunmayı hedeflemektedir.
