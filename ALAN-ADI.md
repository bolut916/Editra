# Kendi alan adına geçiş rehberi

Vybble şu an `https://bolut916.github.io/Editra/` adresinde. Kendi alan adına (örnek: `vybble.app`)
geçmek için aşağıdaki adımlar yeterli. Site yine ücretsiz olarak GitHub Pages'te kalır.

## ⚠️ Önce: çalışmalarını yedekle
Tarayıcılar her adresin verisini ayrı saklar. Yeni alan adına geçince GitHub, eski adresi
otomatik olarak yeni adrese yönlendirir ve **eski adresteki çalışmalar yeni adreste görünmez.**

1. Geçişten önce Vybble'ı aç → ana sayfa → **Depolama** kartı → **⬇ Tümünü yedekle**.
   Bir `.json` dosyası iner.
2. Geçişten sonra yeni adreste **⬆ Yedeği geri yükle** ile bu dosyayı aç. Her şey geri gelir.

Bunu Vybble'ı kullandığın her cihazda (telefon, bilgisayar) ayrı ayrı yap.

## 1. Alan adını al
Örnek alan adı satıcıları: Cloudflare Registrar (en ucuzu, yenilemede zam yok), Namecheap,
Porkbun. Türkiye'den `.com.tr` için: İsimtescil, Natro, Turhost.
`.app` ve `.dev` uzantıları HTTPS zorunlu olduğu için güvenlidir; GitHub Pages bunu destekler.

Satın almadan önce adın marka olarak başkasına ait olmadığını kontrol et
(Türk Patent: turkpatent.gov.tr, uluslararası: WIPO Global Brand Database).

## 2. DNS kayıtları (alan adı satıcısının panelinde)
Kök alan adı (`vybble.app`) için **A** kayıtları:

| Tür | Ad | Değer |
|---|---|---|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | bolut916.github.io |

İstersen IPv6 için **AAAA** kayıtları da ekle: `2606:50c0:8000::153`, `2606:50c0:8001::153`,
`2606:50c0:8002::153`, `2606:50c0:8003::153`.

Cloudflare kullanıyorsan bu kayıtlarda turuncu bulutu (proxy) **kapalı** tut, yoksa
GitHub HTTPS sertifikası veremez.

## 3. GitHub ayarı
GitHub → `bolut916/Editra` deposu → **Settings → Pages → Custom domain** → alan adını yaz →
**Save**. DNS yayılınca (birkaç dakika ile birkaç saat) **Enforce HTTPS** kutusunu işaretle.

## 4. Sitedeki adresleri güncelle
Claude'a “alan adım şu: …” demen yeterli. Şunlar değişecek:
- depo köküne `CNAME` dosyası (içinde yalnızca alan adı)
- `index.html` içindeki `canonical`, `og:url` ve yapılandırılmış veri adresi
- `robots.txt` ve `sitemap.xml` adresleri
- `sw.js` sürümü bir artar

Elle yapmak istersen bu dosyalarda `https://bolut916.github.io/Editra/` geçen her yeri
`https://ALAN-ADIN/` ile değiştir ve `CNAME` dosyasını ekle.

## 5. Sonra
- Google Search Console'a siteyi ekle ve `sitemap.xml`'i gönder (arama sonuçlarında çıkmak için).
- Gizlilik ve Koşullar sayfalarındaki iletişim satırına, istersen bir e-posta adresi ekle
  (şirket kurduğunda şirket unvanını da ekle).
