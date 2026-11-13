# Vybble

Dergi ve Swiss grid düzenleri için tarayıcıda çalışan sayfa kompozisyon aracı. Sunucu, derleme adımı veya bağımlılık gerektirmez.

## Dosyalar
- `index.html` sayfa iskeleti, font ve jsPDF bağlantıları
- `style.css` arayüz stilleri
- `app.js` düzen üreteci, öğe yönetimi, yapay zekâ önerileri, PDF/PNG dışa aktarma

## Yerelde çalıştırma
`index.html` dosyasını tarayıcıda aç, ya da klasörde `python3 -m http.server` çalıştırıp http://localhost:8000 adresine git.

## Yayınlama
- **Netlify:** app.netlify.com/drop adresine klasörü sürükle.
- **GitHub Pages:** dosyaları bir repoya yükle, Settings > Pages bölümünden ana dalı seç.
- **Vercel:** `vercel` komutunu klasörde çalıştır.

## Notlar
- Fontlar Google Fonts'tan yüklenir; ilk açılışta internet gerekir, sonra servis çalışanı bunları önbelleğe alır. PDF için jsPDF 2.5.1 yerel olarak `jspdf.umd.min.js` dosyasından gelir.
- Yapay zekâ önerileri bu bağımsız sürümde yerel kural motoruyla çalışır. Gerçek model çağrısı için `app.js` içindeki `$('ai').onclick` bloğunda `cap('sample')` yerine kendi arka uç (backend) uç noktanı çağır. API anahtarını tarayıcı koduna yazma.
- İndirme `cap('downloads')` yoksa standart `<a download>` ile yapılır.

## Google'da yayına alma
1. Klasörü Netlify, GitHub Pages veya Vercel ile yayınla; bir adres alırsın (örn. `https://dergi-atolyesi.netlify.app`). İstersen kendi alan adını bağla.
2. `index.html`, `robots.txt` ve `sitemap.xml` içindeki `https://ALAN-ADIN.com/` ifadesini gerçek adresinle değiştir.
3. search.google.com/search-console adresinde siteyi ekle ve sahipliği doğrula.
4. Search Console'da "Sitemap'ler" bölümüne `sitemap.xml` ekle, ana sayfa için "URL denetimi > Dizine eklenmesini iste" de.
5. Dizine girmesi genelde birkaç gün ile birkaç hafta sürer.


## Telefon ve tablette uygulama olarak kurma (PWA)
Editra kurulabilir bir web uygulamasıdır (PWA). Bunun için sitenin **HTTPS** ile yayınlanması gerekir (Netlify, GitHub Pages, Vercel zaten HTTPS verir). `file://` ile açınca servis çalışanı çalışmaz.
- **Android / Chrome:** siteyi aç, ana sayfadaki "Ana ekrana ekle" kartına ya da menüdeki "Uygulamayı yükle"ye dokun.
- **iPhone / iPad (Safari):** Paylaş düğmesi, sonra "Ana Ekrana Ekle".
- Kurulumdan sonra çevrimdışı açılır; projeler cihazın tarayıcı deposunda saklanır.
- Dosyalar: `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `apple-touch-icon.png`.
- Uygulama kabuğunu güncellediğinde `sw.js` içindeki `V` sürüm adını (ör. `editra-v5`) artır ki cihazlar yeni dosyaları alsın.
- App Store / Google Play için bu klasör Capacitor veya PWABuilder ile paketlenebilir; geliştirici hesabı ve imzalama gerekir.

## Yeni arayüz (Stüdyo)
Sol araç şeridi (V seç · T metin · M dikdörtgen · L elips · \ çizgi · I görsel · Z yakınlaştır), seçime göre değişen tek satırlık çubuk, tek sağ panel (Düzen / Öğe / Stil / Asistan). Ctrl+K komut paleti, `?` kısayol kılavuzu. Photoshop/Illustrator/InDesign kısayolları: Ctrl+Z/Shift+Z, Ctrl+C/X/V, Ctrl+J, Ctrl+G, Ctrl+] [ , Ctrl+2/3, Ctrl+0/1/=/-, Space basılı tutup sürükleyerek gezinme, Tab panelleri gizler, F önizleme, 0–9 opaklık.

### Gruplu araç şeridi ve seçim (v18)
- **Araç grupları:** Seçim (V, A) · Metin (T) · Şekiller (M, L, \, U) · Çizim (P, B, X) · Görsel (I) · Renk ve ölçü (E, O) · Yakınlaştır (Z). Grup düğmesi son kullanılan aracı gösterir ve hatırlar.
- **Grubu açmak:** sağ tık, basılı tutma (telefonda), düğmenin köşesindeki üçgen ya da Shift+F10. Şekiller grubunda 13 hazır şekil önizlemeli olarak seçilir.
- **Seçimi bırakma:** Seç aracındayken sayfanın boş bir yerine ya da gri çalışma alanına tıklamak seçimi kaldırır (Esc de aynı işi yapar). Sürükleme, kaydırma ve iki parmakla yakınlaştırma seçimi bozmaz.
- Kod: `js/21-calisma-duzeni.js`; dışarıya `window.v4groups` ve `window.v4desel` açılır.

### Canlı arayüz: hareket katmanı (v22)
Tek dosyada (`js/25-canli.js`) toplanmış, her biri ayrı korumalı blokta çalışan efektler; biri hata verse bile diğerleri ve uygulama etkilenmez.
- **Ana sayfa:** imleci yaylı izleyen halka (etkileşimli öğede büyür, ana düğmede "Başla" yazar; yalnız fareyle), imlece çekilen mıknatıs düğmeler, harf harf yükselen ve imleç yaklaştıkça dalgalanan dev başlık (kelimeler satır ortasında bölünmez, ekran okuyucu tam cümleyi okur), imleçten kaçan ve tıklayınca dalga yayan nokta alanı, kaydırma ilerleme çubuğu, kaydırma hızıyla hızlanan kayan şerit, kelime kelime açılan bölüm başlıkları, kartlarda dönen ışık kenarı.
- **Her yerde:** tema değişince tıklanan noktadan dairesel açılım, ana sayfa ↔ editör perde geçişi, düğmelerde tıklama dalgası, yaylı anahtarlar, harf harf beliren açılış logosu, yaylı bildirimler.
- **Editör:** araç şeridi ve panel sekmelerinde seçili olana kayan gösterge, artboard değişince parlayan çerçeve, otomatik tasarımda öğelerin eski yerlerinden yenilerine akması, "Tasarla" düğmesinde denenen aday sayısının canlı akışı ve bitince kıvılcım.
- **Performans ve erişilebilirlik:** nokta alanı tek seferde 8 toplu çizimle boyanır (kare başına ≈1 ms işlemci), imleç durunca ≈0,8 sn'de sakinleşip tamamen durur, ekran dışındayken, sekme gizliyken ve editördeyken çalışmaz. Sistemdeki ya da Ayarlar'daki "Hareketi azalt" açıksa sürekli animasyonlar kapanır ve içerik hemen görünür. Dokunmatik cihazlarda imleç efektleri devre dışıdır.

### Animasyon ayarı (v26)
Windows'ta **Ayarlar → Erişilebilirlik → Görsel efektler → Animasyon efektleri** kapalıysa (bazı dizüstülerde, performans modunda ya da uzak masaüstünde varsayılan olarak kapalı gelir) tarayıcı "hareketi azalt" bildirir ve Vybble animasyonları buna uyarak kapatır.
- **Ayarlar → Animasyonlar:** *Sisteme göre* (varsayılan) · *Her zaman açık* (sistem kapatmış olsa bile Vybble'da açık) · *Azaltılmış*. Eski "Hareketi azalt" ayarı *Azaltılmış* olarak korunur.
- Bilgisayarda hareket kapalıysa ve seçim *Sisteme göre* ise ana sayfada bir kez öneri çıkar: "Bilgisayarında animasyonlar kapalı. Açayım mı?" (*Aç* / *Kapalı kalsın*); seçim hatırlanır.
- Teknik: `html[data-motion=on]` iken CSS'teki `prefers-reduced-motion` kuralları uygulanmaz; JS'teki tüm `reduced()` denetimleri aynı kurala bağlıdır.

### Dokunmatik hareket (v25)
`js/28-dokunmatik.js`; yalnız telefon ve tablette çalışır, bilgisayarda hiçbir şey değişmez; "Hareketi azalt" açıkken kapalı.
- **Eğim:** telefonu eğince ana sahnenin katmanları (dev V, noktalar, renk bulutları, rozetler) farklı derinlikte kayar, demo kartı 3D döner. Telefonu nasıl tutarsan tut o duruş "düz" kabul edilir. iPhone izin ister: "📱 Hareketi aç" düğmesi; sensörü veri gönderen telefonlarda (Android) izinsiz, kendiliğinden başlar.
- **Dokunma:** dokunulan yerden üç renkli halka (ana sayfa; yazı alanlarında ve editörde değil), başlığa dokununca harfler dokunulan noktadan dalga gibi zıplar.
- **Kaydırma:** ekranın ortasındaki kart öne çıkar ve ışık kenarı yanar (fare üstü efektinin dokunmatik karşılığı); hızlı kaydırınca başlıklar ve şerit hafifçe esner, durunca yaylı geri gelir.
- **Titreşim:** destekleyen telefonlarda önemli düğmelerde kısa titreşim (iPhone tarayıcısı titreşimi desteklemez).

### Vybble markası (v24)
Uygulamanın adı Editra'dan **Vybble** olarak değişti: sekme başlığı, açıklama, arama motoru verisi, uygulama adı (PWA), logolar, açılış ekranı, asistan, tanıtım metinleri, "… ile hazırlandı" imzası ve dışa aktarılan dosya adları (`vybble-yedek-*.json`, `.vybble` proje dosyası, `*.vybble-sablon.json`).
- **Logo:** yalnız V. İki kol ayrı çizilir (sol mor, sağ pembe-turuncu) ve köşe noktasından esneyebilir. İlk görünüşte kollar sırayla çizilip V yay gibi zıplar; üzerine gelince kollar esner; tıklayınca jöle; ana sayfada 7 sn'de bir kendiliğinden titreşir (editörde değil); açılış ekranında süzülür ve ritimle titreşir. Renk geçişleri tek ortak tanımda (`#vdefs`), böylece gizlenen bir kopya diğerlerini etkilemez. Simge dosyaları (`favicon.svg`, `icon-*.png`, `apple-touch-icon.png`, maskable sürüm) yeni V ile üretildi.
- **Marka hareketleri** (`js/27-vybble.js`): ana sahnede imlece ve kaydırmaya tepki veren dev V, yapay zekâ kutusunda yazılıp silinen örnek istekler (kutuya tıklayınca durur), alt bilgide dalgalanan vybble yazısı.
- **Veri uyumluluğu:** kayıtlar ve ayarlar aynı yerde kalır (IndexedDB `editra`, `editra-assets`; `editra.cfg` vb. anahtarlar bilerek değiştirilmedi, kullanıcı verisi kaybolmaz). Eski `editra-backup` yedekleri ve `.editra` proje dosyaları açılmaya devam eder. Eklentiler için asıl ad `window.vybble`; eski `window.editra` takma ad olarak çalışır.

### Canlı arayüz 2: ikinci hareket dalgası (v23)
`js/26-canli2.js`; her efekt ayrı korumalı blokta, "Hareketi azalt" açıkken kapalı.
- **Ana sayfa:** kaydırdıkça derinleşen giriş sahnesi (başlık hızlı, demo yavaş uzaklaşır), menü bağlantılarında ve bölüm etiketlerinde harf çözme (0,6 sn, sonunda metin birebir aslına döner, ekran okuyucu etiketi korunur), özellik kartlarının 3D eğimle sırayla açılması (mevcut belirme ve hover geçişleri korunur), ana düğmede renkli parçacık patlaması, ilerleme halkalı "başa dön" düğmesi, üzerine gelince duran kayan şerit.
- **Her yerde:** menüler ve pencereler yaylı açılır, bildirimlerde süre çubuğu, asistan düğmesi süzülür, asistan penceresi yaylı açılır.
- **Editör:** panel içeriği sekme yönüne göre kayar, yeni seçimde seçim kutusu "pop" yapar (yeniden çizimde tekrarlanmaz), bağlam çubuğu sırayla belirir, yakınlaştırma yüzdesi sayarak değişir, kaydedilince tik animasyonu, geri al / yinele simgesi döner, yeni artboard belirerek gelir, görsel yer tutucularında parıltı, görsel sürüklerken bırakma alanı nabız atar.

### Otomatik tasarım motoru (v20)
Görsel yüklenince sayfa kendiliğinden tasarlanır; sonra her öğe elle değiştirilebilir. Düzen sekmesindeki **✨ Otomatik tasarım** kartından: *Tasarla*, *🎲 Başka* ve yalnızca bir yönü değiştiren *Düzen · Renk · Yazı tipi · Görsel efekti*; *Tüm artboardlara uygula* bütün yayını aynı yazı çifti ve renk ailesiyle, sayfadan sayfaya değişen düzenle tasarlar.
- **Görsel analizi:** baskın renkler (k-ortalamalar), özne merkezi (kırpma odağı), düz zemin tespiti (sayfa rengi görselin zeminiyle birleşir), sakin ve kalabalık bölgeler.
- **Renk şemaları:** görselden türetilir (Kâğıt, Gece, Görselin zemini, Görselin tonu, Cesur renk, Mono, Krem). Gövde ve künye için en az 4,5:1, başlık için en az 3:1 kontrast zorunludur.
- **Tipografi:** 16 yazı tipi çifti (hepsi Türkçe karakterlerin tamamını içerir), görselin karakterine göre sıralanır. Gövde baskı puntosuna göre boyutlanır (A4'te ≈9,5 pt, asla 7 pt'nin altında değil); satır başına 32–78 karakterlik sütunlar.
- **Düzenler:** 12 sütunlu ızgaraya oturan 9 kalıp ve bunların parametreleriyle 250'yi aşkın düzen: üstte/altta/yanda görsel, başlık-görsel-metin, dev başlık, tam sayfa kapak (sakin bölgede ya da okunurluk kartında metin), galeri, yan galeri, tipografik sayfa.
- **Denetçi:** her aday ölçülür ve şu durumlarda reddedilir: metin–metin, metin–görsel ya da görsel–görsel çakışması (harflerin gerçek uzanımı yazı tipi ölçülerinden hesaplanır), kutudan ya da satırdan taşma, kenar boşluğuna taşma, yarım taşan görsel, %50'den fazla kırpma, okunmayan renk, bozuk hiyerarşi, çok dar/çok geniş sütun, büyük boşluk.
- **Doğrulama:** 5 sayfa formatı × 9 görsel düzeni × 4 metin yükü = 180 birleşimde 182.860 aday üretildi, 34.832'si denetimden geçti; bunlardan 2.684'ü tarayıcıda çizilip bağımsız olarak (kelime kelime ekran ölçümüyle) yeniden denetlendi: kusur 0. Çok küçük sosyal medya formatına çok fazla metin konursa motor okunmaz punto kullanmak yerine bunu söyler ve mevcut düzeni korur.
- **Eklenen nesneler:** sayfadaki şekiller (dikdörtgen, daire, çizgi, şekil kütüphanesi, kalem ve fırça çizimleri) tasarımın parçasıdır. Her biri oranı ve dönüşü korunarak ızgaraya hizalı boş bir yere konur, gerekirse küçültülür; hiçbir metne, görsele ya da başka şekle değmez, yer yoksa o aday reddedilir. Sayfanın yarısından büyük şekil arka plan sayılır ve yazıların onun renginde de okunması şart koşulur. Kilitli ya da gruplu öğeler taşınmaz; metin ve görseller onlara değmeyecek şekilde yerleşir.
- Kod: `js/23-oto-tasarim.js` (analiz, renk, tipografi, ölçüm) ve `js/24-oto-motor.js` (şemalar, kalıplar, denetçi, arama, arayüz). API: `window.v4ad`.

### Artboard'lar (v19)
- Alttaki sayfa şeridi kaldırıldı; projedeki bütün sayfalar çalışma alanında yan yana **artboard** olarak durur. Etkin artboard düzenlenir, diğerleri gerçek çizim motoruyla çizilmiş önizlemelerdir; tıklayınca düzenlenebilir olur.
- **Taşı:** artboardın üstündeki ad etiketini (ya da masaüstünde önizlemenin kendisini) sürükle. Kenarlar diğer artboardlara mıknatıslanır, üst üste binmez.
- **Kopyala:** **Alt** basılıyken sürükle · etiketteki ⧉ · sağ tık menüsü (Sağa / Aşağı kopyala) · Ctrl+Shift+D.
- **Ekle / sil:** son artboardın yanındaki ＋ Artboard kutusu · sağ tık → Sil.
- **Tümünü göster:** Shift+0. **Gezinme:** Space basılı tut + sürükle (El aracı ve H kısayolu kaldırıldı).
- **Sıra:** sayfa sırası her zaman artboardların konumundan gelir: yukarıdan aşağı, soldan sağa. PDF tek dosyada, PNG `ad-01.png, ad-02.png…` olarak tek zip içinde bu sırayla kaydedilir; "Yalnız bu artboard · PNG" tek sayfayı indirir. Sıra değişince yorum iğneleri ve "sayfaya git" bağlantıları yeni sıraya taşınır.
- Konumlar projeyle birlikte `pages[i].ab = {x, y}` (sayfa genişliği biriminde) olarak saklanır. Kod: `js/22-artboard.js`.

### Geniş çalışma alanı
Sayfanın etrafında her yöne kayan sonsuz hissi veren çalışma alanı: Space basılı tutup sürükle, tekerlek, Shift+tekerlek, seçim yokken ok tuşları, mini harita (Ctrl+Shift+M), Shift+1 ortala, Shift+2 seçime yakınlaştır, Ctrl+\ yan paneli gizle, Ctrl+Alt+P sayfa şeridini gizle, Alt+Shift+L/C/R/T/M/B hizala.

### Çizim, efekt, tipografi ve sunum araçları (v9)
**Çizim ve vektör:** Kalem (P: tık=köşe, sürükle=eğri, ilk noktaya tık=kapat), Düğüm düzenleme (A), Şekiller (U: yıldız, çokgen, patlama, ok, kalp, konuşma balonu, halka, artı, baklava, kurdele, şimşek), Ölçü (O), Silgi (X). Ctrl+Shift+O "Yola çevir". Birleştir/Çıkar/Kesiştir/Dışla (pathfinder; sonuç çokgen yoldur). Çizgi stilleri: kesikli, noktalı, uç ve köşe biçimi, oklar.
**Efekt ve görsel:** Doğrusal/dairesel degrade (orta durak), gölge, katman bulanıklığı, buzlu cam, karışım modları, seviyeler/ton/tonlama/gölge-vurgu/keskinlik/poster, yeni filtreler, pipet (E), renk tabanlı arka plan kaldırma.
**Tipografi:** Madde ve numaralı liste (Ctrl+Shift+8 / 7), büyük baş harf (ayrı harf kutusu, metin etrafından akar), tablo oluşturucu (Ctrl+Alt+Y; CSV/yapıştırma), temel çizgi ızgarası (Ctrl+Alt+B) ve ızgaraya oturtma, tipografik temizlik (tırnak, tire, üç nokta, boşluklar).
**Sunum ve dosya:** Mockup sahneleri (kitap, dergi, çerçeveli poster, telefon, kartvizit, ekran) PNG olarak; SVG içe aktarma (Ctrl+Alt+V; yol, dikdörtgen, daire, çokgen, çizgi; dönüşümler ve yaylar desteklenir); sayfa çevirmeli Flipbook HTML; kayıt sırasında 10 dakikada bir otomatik sürüm.
**Bilinen sınırlar:** Pathfinder çıktısı çokgendir. Buzlu cam SVG çıktısında yoktur. SVG filtreli efektler Safari'de tuval dışa aktarımında görünmeyebilir. SVG içe aktarmada metin, görsel, kırpma ve degrade desteklenmez (degrade düz renge çevrilir). Arka plan kaldırma yapay zekâ değil, renk tabanlıdır. Tablo canlı bir nesne değil, gruplanmış metin kutularıdır. OpenType özellikleri ve sekme durakları eklenmedi.

### Katalog ve yayın araçları (v8)
- **Aynı boyut / aynı yükseklik:** birden çok öğe seçiliyken bağlam çubuğundan; hizala/dağıt zaten vardı.
- **Kırpma:** görsel seçiliyken kırp (zoom kaydırıcısı + sürükleyerek odak); Esc çıkar.
- **Metin zinciri:** metin kutusunu sonraki sayfaya bağla; taşan metin zincirdeki kutulara akar. Zinciri kır / kopyala desteklenir. Zincirli kutular tek sütun, düz metin varsayar; baştaki kutuyu silmek hikâyeyi siler.
- **Toplu içe aktar:** birden çok fotoğrafı seç, her biri bir sayfaya yerleşir.
- **CSV'den katalog:** CSV (başlık satırlı) yükle; her satır bir ürün sayfası/ızgara olur. Demo şablon dahil.
- **Bul ve değiştir (Ctrl+F / Ctrl+H):** tüm sayfalarda; "hepsini değiştir" geri alınamaz. Yazım denetimi yerinde düzenlemede açık (tr).
- **Şablon galerisi:** hazır şablonlar + kendi sayfanı şablon olarak kaydet (tarayıcıda localStorage'da saklanır).
- **Dışa aktarma:** SVG (metin konumları yaklaşık, tüm efektler taşınmaz), PNG zip, SVG zip, CMYK PDF (basit dönüşüm, ICC profili yok).
- **Yorum modu:** paylaşılabilir önizlemede N ile not/iğne ekle (tarayıcıda saklanır).
- **Erişilebilirlik:** klavye odağı, azaltılmış hareket, Alt+. / Alt+, ile öğeler arası geçiş.

### Profesyonel araçlar (v7)
- **Serbest dönüştürme:** seçili öğenin 8 tutamacı ve döndürme tutamacı var. Shift: oranı koru / 15° adımla döndür, Alt: merkezden ölçekle. Ok tuşlarıyla (Shift: 5 birim) ince taşıma. "Izgaraya oturt" düğmesi öğeyi tekrar gride bağlar.
- **Akıllı kılavuzlar:** sürüklerken sayfa kenarı/ortası, kenar boşluğu, diğer öğeler ve kendi kılavuzlarına mıknatıs gibi yapışır. Ctrl basılıysa kapalı.
- **Cetveller ve kılavuzlar (Ctrl+R):** cetvelden sürükleyerek kılavuz çek; çift tıkla ya da cetvele geri bırakarak sil. Ctrl+; kılavuzları gizler.
- **Yerinde yazı düzenleme:** metne çift tıkla ya da Enter. Ctrl+Enter ya da dışarı tıklama kaydeder, Esc de kaydeder.
- **Baskı kontrolü (Ctrl+Alt+K):** tüm sayfalarda düşük dpi görsel, boş görsel kutusu, sığmayan metin, 6 pt altı yazı, 3 mm güvenli alan dışı ve sayfa dışına taşan öğeleri listeler; "Git" ile ilgili öğeye atlar. PDF RGB üretilir, CMYK dönüşümü matbaada/PDF aracında yapılmalıdır (uyarı olarak belirtilir).
- **Sayfa genel bakışı (Ctrl+Alt+O):** tüm sayfalar küçük resim olarak; sürükle-sırala, çoğalt, sil, ekle.
- **Görselden palet:** görsel seçiliyken "Palet çıkar" baskın renkleri bulur, tek tıkla arka plana/yazılara/şekillere uygular.
- **Yay üzerinde yazı:** metin seçiliyken "Yay" düğmesi ya da Mizanpaj > "Yay / kavis" kaydırıcısı. Tek satır çalışır; +değer kemer, -değer kase.
- **Nesne etrafında metin sarma:** metin seçiliyken "Sar". Metnin **üstündeki** (daha ön katmandaki) görsel ve şekillerin etrafında akar; daire şekli gerçek konturuna göre sarılır. Döndürülmüş/dikey metinde ve yay metinde çalışmaz.
- **Fırça (B):** sürükleyerek karala, Shift düz çizgi. Her çizgi ayrı, ölçeklenebilir bir öğedir.
- **Paylaşılabilir önizleme (Ctrl+Alt+H):** tüm sayfaları tek bir HTML dosyasına gömer; ok tuşu/kaydırma, ızgara ve tam ekran ile her cihazda açılır.
- Taşma payı ve kesim işaretleri PDF çıktısında (Baskı sekmesi) açılır; taşma payı tuvalin kenarlarının genişletilmesiyle üretilir.
- Gerçek yapay zekâ asistanı, hesaplar ve bulutta kaydetme/link paylaşma bir sunucu gerektirir; bu statik sürümde yoktur.

### Aşama L–O: kılavuz, baskı, marka, kütüphane, dergi, hareket, eklentiler (v10)
**Akıllı kılavuz 2.0 (Ctrl+Alt+G):** sürüklerken eşit boşluk (mm etiketli), optik hizalama (kalın yazının ve dairenin göz payı), altın oran çizgileri (%38,2 / %61,8), ızgara kenarlarına yapışma. Ctrl basılıyken hepsi geçici kapanır. Altın oran tipografi ölçeği, "geniş/dar sütuna yerleştir" ve "tüm serbest öğeleri ızgaraya oturt" komutları var.
**Sayfa bağlantıları:** öğeyi seçip "Bağlantı": başka sayfaya ya da web adresine (http, https, mailto). Önizleme, flipbook ve RGB PDF'te çalışır; sunumda "↩ Geri" ile döner. CMYK PDF'te bağlantı yoktur (sayfa görüntüye çevrildiği için).
**Sürüm geçmişi:** sürümleri yan yana görsel karşılaştır (sürüm ↔ şimdi), adlandır, güvenli geri yükle (geri yüklemeden önce şimdiki hâl ayrı sürüm olarak saklanır). En fazla 20 sürüm.
**Baskı Merkezi (Ctrl+Alt+X):** 300 dpi (eşik seçilebilir) kontrolü, taşma/kesim işareti hazırlığı, canlı RGB renk uyarısı, PDF/X hazırlık listesi ve özel renk listesi. **Sınırlar:** Pantone lisanslıdır, hazır liste yoktur; matbaanın verdiği adı ve CMYK karşılığını kendin kaydedersin ve PDF'te bu CMYK kullanılır, gerçek spot kanalı yazılmaz. Editra ICC profili gömmez ve OutputIntent yazmaz; bu yüzden PDF/X-1a/X-4 olarak **doğrulanamaz** (matbaa şart koşuyorsa Acrobat Preflight ya da Ghostscript ile dönüştür). CMYK dönüşümü basit formüldür.
**Asset Manager (Ctrl+Alt+A):** logo, font, renk, mockup, ikon; tarayıcıda (IndexedDB) saklanır ve her projede kullanılabilir. Yüklediğin fontlar font listelerine "Kendi fontların" olarak eklenir ve kullanılan fontlar .editra dosyasına gömülür.
**Font bilgisi (Ctrl+Alt+F):** benzer fontlar, eşleşme önerileri, lisans durumu ve Türkçe karakter (ğ ı ş ç ö ü) desteği denetimi. Türkçe denetimi fontun yüklenmiş olmasını gerektirir (çevrimdışıysa "doğrulanamadı" der).
**Marka Kiti++ (Ctrl+Alt+M):** marka tonu, yasaklı sözcükler, font sistemi, kullanılmayacak renkler, sosyal medya kuralları (emoji, karakter sınırı, zorunlu etiket) ve minimum boşluk; "Tasarımı denetle" tüm sayfaları tarar.
**İçerik kütüphanesi (Ctrl+Alt+L):** 30 ikon, 12 çıkartma, 10 desen, 7 doku, film greni, 6 çerçeve, 12 gradyan. Hepsi koda gömülü vektör/hesaplanmış, telifsiz; renkler değiştirilebilir.
**Dergi Modu (Ctrl+Alt+D):** master sayfa, çalışan başlık ({baslik}, {bolum}, {sayfa}, {toplam}; çift/tek sayfada karşılıklı), dipnot, tıklanabilir içindekiler, sütunlar, paragraf ve karakter stilleri. Karakter stilleri metin kutusunun tamamına uygulanır; kutu içinde satır içi biçim yoktur.
**Mockup:** kitap, dergi, poster, telefon, kartvizit, ekran + masa üstü, duvar, billboard; "Tüm sahneler · zip" ile tek tıkta hepsi.
**Tek tuş portföy:** kayıtlı çalışmalardan kapak, içindekiler, proje sayfaları, mockup sayfaları, CV ve iletişim sayfası.
**Hareket tasarımcısı (Ctrl+Alt+R):** zaman çizelgesi, keyframe (sürükleyerek zamanla), ease in/out/geri tepme/zıplama, hazır hareketler, hareket bulanıklığı, morph; WebM kaydı ve PNG dizisi (zip). **Sınırlar:** morph şekillerde köşe yuvarlama (kare↔daire) ve iki öğe arasında çapraz geçiştir, gerçek yol (düğüm) morph'u yoktur; hareket bulanıklığı yön bağımsızdır; WebM gerçek zamanlı kaydedilir (sekme açık kalmalı); MP4/GIF yoktur.
**Eklenti Pazarı (Ctrl+Alt+Z):** eklentiler `sandbox`'lı bir iframe'de çalışır, ağ erişimi yoktur (CSP) ve yalnızca `editra` API'si üzerinden sayfaya öğe ekleyebilir; izinler (ekleme, okuma, indirme) tek tek denetlenir. Yerleşik: QR kod (sürüm 1-40, UTF-8), Code 128 / EAN-13 barkod, Türkçe takvim, Instagram grid + carousel bölücü, SVG animatör. Kendi eklentini HTML parçası olarak yükleyebilirsin. **Sınır:** herkese açık bir eklenti kayıt sunucusu yoktur; eklentiler tarayıcıda saklanır.

### Kod yapısı (v13)
Tek parça `app.js` kaldırıldı; kod `js/` klasöründe, yükleme sırasıyla numaralı 18 dosyaya bölündü. Davranış değişmedi; dosyalar `index.html` içinde sırayla (`defer`) yüklenir ve hepsi aynı global kapsamı paylaşır, yani **sıra önemlidir**.
`01-temel` (veri, çizim, dışa aktarma) · `02-calisma-alani` (projeler, sayfalar, ana sayfa) · `03-ai-yonetmen` · `04-v3-duzen` · `05-studyo-arayuz` (araç şeridi, bağlamsal çubuk, kısayollar) · `06-donusum-kilavuz-baski` · `07-yazi-firca-zincir` · `08-iceaktar-disaaktar` · `09-kalem-sekil` · `10-renk-efekt-liste` · `11-mockup-svg-flipbook` · `12-kilavuz-baglanti-surum` · `13-asset-font-marka` · `14-baski-merkezi` · `15-dergi-kutuphane-portfoy` · `16-eklentiler` · `17-hareket` · `99-baslat` (uygulamayı başlatır, her zaman en sonda).
Yeni özellik eklerken yeni bir numaralı dosya aç, `index.html` ve `sw.js` listesine sırasıyla ekle. Tek dosyalık sürüm (`dergi-atolyesi.html`) bu dosyaları birleştirerek üretilir.
Bu işlem sırasında bulunan hata: arayüz erişilebilirlik kodu açık pencerelere `data-a` işareti koyuyordu; Akıllı kılavuz ayarlarında bir seçeneği tıklamak pencereyi kapatıyordu. İşaret `data-a11y` olarak değiştirildi.


### Tanıtım sayfası, interaktif yayınlar, yedekleme (v10)
**Ana sayfa:** Slogan “Tasarla. Bas. Yayınla.”; sağda Editra'nın kendi düzen motoruyla çizilen canlı demo (tür sekmeleri, başlık, stil, karıştır, “Bu tasarımla başla” ile gerçek projeye dönüşür). Gradient mesh arka plan, fare takibi, kart parıltısı, parallax, kaydırınca belirme. “Hareketi azalt” ayarı ve sistem tercihi tüm animasyonları kapatır. Başlık fontu Clash Display, metin Satoshi (Fontshare; yüklenemezse Bricolage Grotesque). Özellik ve yapay zekâ kartlarındaki “Hazır / Cihazda çalışır / Yakında” etiketleri gerçek durumu gösterir; rakam bandı uygulamanın içinden canlı sayılır (`js/19-tanitim.js`).
**İnteraktif yayınlar:** ⋯ menüsü → “İnteraktif öğe ekle”: Video (YouTube, Vimeo, MP4), Spotify, Google Haritalar, 3D model (GLB), GIF/animasyon, Lottie, Form (e-postaya gelir ya da Google Forms/Typeform), QR kod, Web sayfası. Öğe sayfada QR kodlu bir kart olarak durur: basılı çıktıda QR, PDF/flipbook/önizlemede tıklanabilir bağlantı, Dışa aktar → “İnteraktif yayın (HTML)” dosyasında canlı içerik. Yüklenen dosyalar (en fazla 3–15 MB) projeyle birlikte saklanır. Düzenlemek için öğeye çift tıkla (`js/20-interaktif.js`, QR için `qrcode.min.js`, MIT).
**Yedekleme:** Ana sayfa → Depolama: “Tümünü yedekle” tüm çalışmaları, varlıkları ve ayarları tek `.json` dosyasına alır; “Yedeği geri yükle” geri getirir (`js/18-yedek.js`).
**Bilinen sınırlar:** Canlı öğeler internet bağlantısı ister. Bazı web siteleri gömülmeye izin vermez (o zaman “Yeni sekmede aç” bağlantısı kullanılır). 3D ve Lottie oynatıcıları jsDelivr'den yüklenir. Bulut yapay zekâ araçları (görsel büyütme, yeniden yazma, çeviri) ve ekip çalışma alanı henüz yok.
