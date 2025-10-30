# MobiVersite - E-commerce Platform

Modern e-ticaret platformu Next.js 15, React ve Tailwind CSS ile geliştirilmiştir.

## 🚀 Özellikler

- **Modern UI/UX**: Tailwind CSS ile responsive ve kullanıcı dostu arayüz
- **Ürün Yönetimi**: 20+ ürün ile kapsamlı ürün kataloğu
- **Sepet Sistemi**: LocalStorage ile kalıcı sepet yönetimi
- **İstek Listesi**: Beğenilen ürünleri kaydetme
- **Kullanıcı Kimlik Doğrulama**: Cookie tabanlı giriş sistemi
- **Sipariş Geçmişi**: Kullanıcı sipariş takibi
- **API Entegrasyonu**: JSON Server ile REST API
- **Middleware Koruması**: Korumalı sayfalar için otomatik yönlendirme

## 🛠️ Teknolojiler

- **Frontend**: Next.js 15, React 19, JavaScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **API**: Axios, JSON Server
- **Authentication**: Cookie-based
- **Deployment**: Vercel Ready

## 📦 Kurulum

### Gereksinimler
- Node.js 18.17.0 veya üzeri
- npm veya yarn

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone <repository-url>
cd mobiversite
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **JSON Server'ı başlatın** (Terminal 1)
```bash
npm run json-server
```

4. **Next.js uygulamasını başlatın** (Terminal 2)
```bash
npm run dev
```

5. **Uygulamayı açın**
- Ana uygulama: http://localhost:3000
- JSON Server API: http://localhost:3001

## 🔑 Demo Hesap

Giriş yapmak için aşağıdaki bilgileri kullanabilirsiniz:
- **Kullanıcı Adı**: demo
- **Şifre**: demo123

## 📁 Proje Yapısı

```
src/
├── app/                    # Next.js 15 App Router
│   ├── cart/              # Sepet sayfası
│   ├── login/             # Giriş sayfası
│   ├── products/          # Ürün listesi ve detayları
│   ├── profile/           # Kullanıcı profili
│   ├── wishlist/          # İstek listesi
│   ├── layout.js          # Ana layout
│   ├── page.js            # Ana sayfa
│   ├── loading.js         # Global loading
│   └── not-found.js       # 404 sayfası
├── components/            # React bileşenleri
│   ├── Navbar.js          # Navigasyon
│   ├── ProductCard.js     # Ürün kartı
│   ├── ProductDetail.js   # Ürün detayı
│   └── CartItem.js        # Sepet öğesi
├── context/               # React Context API
│   ├── AuthContext.js     # Kimlik doğrulama
│   ├── CartContext.js     # Sepet yönetimi
│   └── WishlistContext.js # İstek listesi
└── lib/
    └── api.js             # API fonksiyonları
```

## 🎯 Ana Özellikler

### 1. Ürün Yönetimi
- 20+ ürün ile zengin katalog
- Kategori bazlı filtreleme
- Ürün detay sayfaları
- Responsive ürün kartları

### 2. Sepet Sistemi
- LocalStorage ile kalıcı sepet
- Miktar güncelleme
- Ürün kaldırma
- Toplam fiyat hesaplama

### 3. İstek Listesi
- Beğenilen ürünleri kaydetme
- Bağımsız sepet yönetimi
- Kolay erişim

### 4. Kimlik Doğrulama
- Cookie tabanlı oturum yönetimi
- Middleware ile sayfa koruması
- Otomatik yönlendirme

### 5. Sipariş Sistemi
- Sipariş oluşturma
- Sipariş geçmişi
- Durum takibi

## 🔧 API Endpoints

JSON Server aşağıdaki endpoint'leri sağlar:

- `GET /products` - Tüm ürünler
- `GET /products/:id` - Ürün detayı
- `GET /users` - Kullanıcılar
- `POST /orders` - Sipariş oluştur
- `GET /orders` - Siparişler

## 📱 Responsive Tasarım

- Mobile-first yaklaşım
- Tablet ve desktop uyumlu
- Touch-friendly arayüz
- Optimized görsel deneyim

## 🚀 Deployment

### Vercel ile Deploy

1. **Vercel hesabınızda projeyi import edin**
2. **Environment variables ayarlayın**
3. **Deploy edin**

### JSON Server için Alternatif

Production ortamında JSON Server yerine gerçek bir API kullanmanız önerilir.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 👨‍💻 Geliştirici

Bu proje modern React ve Next.js teknolojileri kullanılarak geliştirilmiştir.

---

**Not**: Bu proje eğitim amaçlı geliştirilmiştir ve production kullanımı için ek güvenlik önlemleri alınması önerilir.