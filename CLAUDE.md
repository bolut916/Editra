# Vybble: Claude için proje notları

Vybble (eski adı Editra), tarayıcıda çalışan Türkçe bir dergi, katalog, kapak ve baskı tasarım aracı.
Yayında: https://bolut916.github.io/Editra/ (GitHub Pages, `main` dalı, kök klasör).
Kullanıcı Türkçe konuşur ve çoğunlukla **iPhone Safari** üzerinden dener.
Kullanıcıya her zaman Türkçe, kısa ve teknik olmayan bir dille yanıt ver.

## Yapı
- Derleme adımı, paket yöneticisi, framework yok. Düz HTML + CSS + JS.
- `index.html`: tüm sayfa iskeleti (açılış ekranı `#splash`, ana sayfa `#home`, editör `#edw`).
- `style.css`: tek stil dosyası. Kurallar katman katman eklenmiş; sonra gelen öncekini ezer.
  Yeni stilleri dosyanın sonuna ekle ve önce çakışan eski kuralı ara.
- `js/`: `defer` ile sırayla yüklenen modüller. Sıra `index.html`'deki `<script>` etiketleri
  ve `js/_order.txt` ile aynıdır. Yeni modül eklersen **üçünü birden** güncelle:
  `index.html`, `js/_order.txt`, `sw.js` içindeki `SHELL` listesi.
- Modüllerin çoğu global kapsamı paylaşır (`S`, `PROJ`, `CFG`, `STY`, `MODES`, `$`, `mk`, `render`,
  `draw`, `place`, `pageSnap`, `saveNow`, `openEditor`, `toast`…). Yeni modülleri
  `(function(){ ... })();` içine yaz, dışarıya yalnızca `window.xxx` ile açtığını ver.
- Global fonksiyonları sarmalamak için `const eski=window.f; window.f=function(){...eski...}`
  kalıbı kullanılıyor (`pack`, `unpack`, `showHome`, `bakInfo`).

### Önemli modüller
| Dosya | İçerik |
|---|---|
| `01-temel.js` | Durum `S`, stiller `STY`, modlar `MODES`, düzen üreteci `gen/lay`, çizim `draw(W)` |
| `02-calisma-alani.js` | Ayarlar `CFG`, IndexedDB (`DB`, `dbPut/dbGet/dbAll`), proje `pack/unpack`, ana sayfa, yeni tasarım sihirbazı |
| `05-studyo-arayuz.js` | Araç şeridi, sağ panel (`#dockp`), ⋯ menüsü (`#mmenu`), komut paleti (`v4cmd`) |
| `12-kilavuz-baglanti-surum.js` | Bağlantılar (`e.lk`, `v4links`): PDF, flipbook ve önizlemede tıklanır |
| `18-yedek.js` | Tüm çalışmaları tek `.json` olarak yedekle / geri yükle |
| `19-tanitim.js` | Tanıtım sayfası: canlı demo (gerçek motorla çizer, `S`'yi saklayıp geri koyar), animasyonlar, sayaçlar |
| `20-interaktif.js` | İnteraktif öğeler (video, Spotify, harita, 3D, GIF, Lottie, form, QR, web) ve “İnteraktif yayın (HTML)” dışa aktarımı; medya `PROJ.media` içinde |
| `23-oto-tasarim.js`, `24-oto-motor.js` | Otomatik tasarım motoru: görsel analizi, renk şemaları, 9 kalıptan 284 düzen, denetçi (`window.v4ad`) |
| `25`–`29` | Hareket katmanları: canlı arayüz, ikinci dalga, Vybble logosu ve marka, dokunmatik, sahne anahtarları |
| `30-kategori.js` | Kategori sahneleri: her kategori için 6 galeri (Klasör, Ayraç, Yay, Halka, Spot, Çember); `window.v4kat` |
| `99-baslat.js` | Başlatma; her zaman en son yüklenir |

## Kurallar
1. **Servis çalışanı:** `sw.js` önce ağdan alır, internet yoksa önbelleğe düşer.
   Uygulama dosyalarını her değiştirdiğinde `sw.js` içindeki `const V='vybble-vNN'`
   sürümünü **bir artır**.
2. **Telefon önce:** Her arayüz değişikliğini 390×844 (iPhone) boyutunda test et.
   `100vh` yerine `100dvh` kullan (Safari çubukları). Menüler ve pencereler kaydırılabilir olmalı,
   yatay taşma olmamalı.
3. **Hareket:** Yeni animasyonlar hem `@media(prefers-reduced-motion:reduce)` hem
   `:root[data-motion=reduce]` altında kapatılmalı. Medya sorgusunun içindeki seçicilerin başına
   `:root:not([data-motion=on])` ekle (kullanıcı Ayarlar'da "Her zaman açık" seçtiyse sistem ayarı geçersiz).
   JS'te `reduced=()=>(matchMedia(...).matches&&R.dataset.motion!='on')||R.dataset.motion=='reduce'` kullan.
4. **Ad:** Kullanıcıya görünen her yerde ad **Vybble**. İç kimlikler (IndexedDB `editra`, `editra-assets`,
   `editra.cfg` vb. localStorage anahtarları, eklenti mesaj işareti `editra:1`) bilerek değiştirilmedi: değişirse
   kullanıcıların çalışmaları kaybolur. Eski `editra-backup` yedekleri ve `.editra` dosyaları açılmalı.
5. **Tema:** Renkleri `:root` değişkenleriyle yaz (`--bg --pn --tx --mu --ln --soft --pr`).
   Açık ve koyu temada kontrol et.
6. **Dürüstlük:** Tanıtım sayfasında var olmayan bir özelliği “Hazır” diye gösterme
   (“Yakında” kullan). Uydurma kullanıcı sayısı, puan ya da yorum ekleme; rakamlar
   uygulamanın içinden hesaplanır (`19-tanitim.js` içindeki `STAT`).
   Kural tabanlı araçları “gerçek yapay zekâ” gibi sunma.
7. **Güvenlik:** Kullanıcı girdisini HTML'e `esc()` ya da `textContent` ile koy.
   Gömülü içerikte yalnızca `https://` kabul et. API anahtarını tarayıcı koduna yazma.
8. **Dış kaynaklar:** Fontlar Google Fonts ve Fontshare'den gelir (Clash Display, Satoshi).
   Dışa aktarılan HTML'de Lottie ve model-viewer jsDelivr'den sabit sürümle yüklenir.
   Yeni kütüphaneyi repoya dosya olarak koy (örn. `qrcode.min.js`) ve lisans başlığını koru.

## Test
Sunucu: depo kökünde `python3 -m http.server 8765`.
Playwright ortamda hazır (`require('playwright')`, `chromium.launch()`).
- Açılış ekranını geçmek için `#go` düğmesine bas
  (`getByText('Başla')` yanlışlıkla “Ücretsiz başla”yı bulur).
- Test sırasında servis çalışanını kapat: `browser.newContext({serviceWorkers:'block'})`.
- Konsolda `pageerror` olmamalı; `document.documentElement.scrollWidth === innerWidth` olmalı.
- Fontshare, jsDelivr ve YouTube test ortamının ağında kapalı olabilir; bu beklenen bir durumdur.

## Git
- Değişiklikleri oturumun verdiği dalda geliştir, PR aç; kullanıcı GitHub'da kendisi birleştirir.
- Birleştirilen PR'dan sonra dalı güncel `main`'den yeniden başlat.

## Bilinen eksikler / yol haritası
- Bulut yapay zekâ (görsel büyütme, metin yeniden yazma, çeviri) için sunucu gerekir; henüz yok.
- Ekip çalışma alanı ve bulut varlıkları yok (her şey cihazda; yedek dosyasıyla taşınır).
- `index.html`, `robots.txt`, `sitemap.xml` içindeki `https://ALAN-ADIN.com/` henüz
  gerçek adresle değiştirilmedi.
