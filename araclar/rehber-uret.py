#!/usr/bin/env python3
"""Vybble rehber sayfaları üretici.
Kullanım: depo kökünde  python3 araclar/rehber-uret.py
rehber/*.html (Türkçe) ve rehber/en/*.html (İngilizce) dosyalarını baştan yazar; elle düzenleme yapma, içeriği burada değiştir."""
import html, json, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'rehber')
BASE = 'https://bolut916.github.io/Editra/'
DATE = '2026-11-17'
DATE_TR = '17 Kasım 2026'
os.makedirs(OUT, exist_ok=True)
e = html.escape

COMMON_STEPS_END = [
    ('Yazılarını düzenle', 'Başlığa, metne ya da fiyata dokunup yaz. Renk paletini ve yazı tiplerini sağ panelden değiştirebilirsin; “💡 Öneri” hazır başlıklar sunar.'),
]

G = [
 dict(slug='menu-tasarimi', kind='menu', tpl='restoran-menusu',
  title='Ücretsiz Menü Tasarımı: Restoran ve Kafe Menüsü Nasıl Hazırlanır?',
  h1='Ücretsiz menü tasarımı', lead='Restoran, kafe ya da pastane menünü tarayıcında, ücretsiz ve üyeliksiz hazırla. Matbaaya hazır PDF ya da masaya koyacağın QR kodlu dijital menü olarak çıkar.',
  desc='Restoran ve kafe menüsünü ücretsiz tasarla: menü ölçüleri (A4, A5, dar menü), fiyat listesi düzeni, QR menü ve matbaaya hazır PDF. Üyelik gerekmez.',
  cta='Menü tasarlamaya başla', cta2=('Hazır menü şablonuyla başla', 'restoran-menusu'),
  sizes=[('Dar menü (masa üstü, kılıf)', '100 × 210 mm'), ('A5 (tek yaprak, katlanmadan)', '148 × 210 mm'), ('A4 (ana menü, iki yüz)', '210 × 297 mm')],
  steps=[('Menü türünü aç', 'Aşağıdaki düğmeyle Vybble’ı menü ayarlarıyla aç. Boyutu (dar, A5, A4) ve sayfa sayısını seç, “Tasarıma başla →” de.'),
         ('Bölümleri yerleştir', 'Başlangıçlar, ana yemekler, tatlılar ve içecekler için ayrı başlıklar kullan. Her bölüme 5–8 ürün, okunaklı bir düzen için yeterlidir.'),
         ('Fiyatları hizala', 'Ürün adı ile fiyatı aynı satırda, arada noktalı çizgiyle yaz (ör. “Mercimek çorbası ........ 120 ₺”). “Menü tarzı katalog” şablonunda hazır örneği var.'),
         ('Fotoğraf ekle (isteğe bağlı)', 'Öne çıkan bir iki tabak fotoğrafı ekle; sağ paneldeki ✨ Otomatik tasarım, fotoğrafları yazıların üstüne binmeden yerleştirir.')]+COMMON_STEPS_END+[
         ('Bas ya da QR menü yap', 'Baskı için “Dışa aktar → PDF” al. Masa için “Dışa aktar → 📱 QR menü sayfası”: menün QR kodla misafirlerin telefonunda açılır.')],
  tips=['Menü yazısı en az 9 pt olsun; loş ortamda okunacağını unutma.', 'Bir sayfada en fazla iki yazı tipi kullan: başlık için karakterli, ürünler için sade bir yazı tipi.',
        'Fiyatları sağa hizala, para birimini her satırda aynı biçimde yaz.', 'Alerjen ve vejetaryen işaretleri için küçük simgeler ya da harfler kullan, sayfa altında açıklamasını ver.',
        'Laminasyon yapılacaksa kenarlardan 5 mm içeride kal; kesimde yazı kırpılmasın.'],
  faq=[('Menü tasarımı için hangi boyut en iyisi?', 'Tek sayfalık ana menüler için A4, kafeler ve masa üstü kılıflar için 100 × 210 mm dar menü, tatlı ve içecek kartları için A5 en yaygın boyutlardır.'),
       ('Menümü matbaaya nasıl göndermeliyim?', 'Taşma payı (3 mm) açık, kesim işaretli, CMYK PDF olarak gönder. Vybble’ın Baskı Merkezi (⋯ menüsü → Komut paleti) bu ayarları ve fotoğraf çözünürlüğünü kontrol eder.'),
       ('QR menü yapabilir miyim?', 'Evet. “Dışa aktar → 📱 QR menü sayfası” menünü telefonda açılan bir sayfaya çevirir; menü QR bağlantısının içinde taşınır, hiçbir sunucuya yüklenmez.'),
       ('Ücretli mi, üyelik gerekiyor mu?', 'Hayır. Vybble ücretsizdir, hesap açman gerekmez; tasarımların cihazında saklanır.')]),

 dict(slug='katalog-hazirlama', kind='katalog', tpl='luks-kahve-katalogu',
  title='Katalog Nasıl Hazırlanır? Ücretsiz Ürün Kataloğu Tasarımı',
  h1='Katalog nasıl hazırlanır?', lead='Ürün kataloğunu adım adım hazırla: doğru boyutu seç, ürünleri ızgaraya yerleştir, fiyat ve açıklamaları ekle, matbaaya hazır PDF ya da sayfa çevirmeli dijital katalog olarak paylaş.',
  desc='Ürün kataloğu hazırlama rehberi: katalog boyutları, sayfa düzeni, CSV’den otomatik katalog, matbaaya hazır PDF ve dijital flipbook. Ücretsiz ve üyeliksiz.',
  cta='Katalog hazırlamaya başla', cta2=('Hazır katalog şablonuyla başla', 'luks-kahve-katalogu'),
  sizes=[('A4 dikey (en yaygın)', '210 × 297 mm'), ('A4 yatay', '297 × 210 mm'), ('Kare', '210 × 210 mm'), ('A5 (cep kataloğu)', '148 × 210 mm')],
  steps=[('Kataloğu aç', 'Aşağıdaki düğmeyle Vybble’ı katalog ayarlarıyla aç. Boyutu ve sayfa sayısını seç; ilk sayfa otomatik olarak kapak olur.'),
         ('Ürün fotoğraflarını yükle', 'Sayfa başına 4–6 ürün çoğu katalog için idealdir. Fotoğrafları aynı ışıkta ve aynı arka planda çekersen katalog daha bütünlüklü görünür.'),
         ('Otomatik düzen', 'Sağ paneldeki ✨ Otomatik tasarım, fotoğraflarını ve yazılarını üst üste binmeden ızgaraya yerleştirir; beğenmezsen “🎲 Başka” ile yeni bir düzen dene.'),
         ('Çok ürün mü var? CSV kullan', 'Sayfaya {Ad}, {Fiyat} gibi yer tutucular yaz, ürün listeni CSV dosyası olarak yükle (⋯ menüsü → Komut paleti → “CSV’den katalog üret”). Vybble her kayıt için sayfayı kopyalar.')]+COMMON_STEPS_END+[
         ('Bas ya da dijital paylaş', 'Matbaa için “Dışa aktar → CMYK PDF”; müşterilerine göndermek için sayfa çevirmeli Flipbook ya da PNG.')],
  tips=['Her sayfada aynı ızgarayı kullan; okur ürünleri daha kolay karşılaştırır.', 'Fiyat, ürün adı ve kısa açıklama her üründe aynı sırada olsun.',
        'Zımbalı (tel dikiş) katalogda sayfa sayısı 4’ün katı olmalıdır: 8, 12, 16…', 'Ürün fotoğrafları basılacağı boyutta en az 300 dpi olmalı; Baskı Merkezi düşük çözünürlüklü fotoğrafları işaretler.',
        'Kapakta tek, güçlü bir görsel ve kısa bir başlık kullan; içerik sayfalarını kalabalıklaştırma.'],
  faq=[('Katalog kaç sayfa olmalı?', 'Zımbalı kataloglarda sayfa sayısı 4’ün katı olmalıdır (8, 12, 16). Küçük işletmeler için 8–12 sayfa genellikle yeterlidir.'),
       ('Katalog için en uygun kâğıt boyutu nedir?', 'En yaygın boyut A4 dikeydir (210 × 297 mm). Ürünleri geniş göstermek için A4 yatay, cepte taşınacak kataloglar için A5 tercih edilir.'),
       ('Yüzlerce ürünü tek tek mi yerleştirmeliyim?', 'Hayır. Ürün listeni CSV olarak yükleyip yer tutucularla sayfaları otomatik üretebilirsin.'),
       ('Kataloğu dijital olarak paylaşabilir miyim?', 'Evet. Sayfa çevirme animasyonlu Flipbook HTML ya da PNG olarak dışa aktarıp WhatsApp, e-posta veya web sitende paylaşabilirsin.')]),

 dict(slug='dergi-tasarimi', kind='dergi', tpl='moda-dergisi',
  title='Online Dergi Tasarımı: Ücretsiz Dergi Hazırlama Rehberi',
  h1='Online dergi tasarımı', lead='Okul dergisi, kurum bülteni ya da moda dergisi: kapaktan son sayfaya, akan metin, sayfa numaraları ve ızgara düzeniyle dergini tarayıcında hazırla.',
  desc='Ücretsiz online dergi tasarımı: dergi boyutları, kapak ve iç sayfa düzeni, sayfadan sayfaya akan metin, sayfa numarası, PDF ve sayfa çevirmeli dijital dergi.',
  cta='Dergi tasarlamaya başla', cta2=('Hazır dergi şablonuyla başla', 'moda-dergisi'),
  sizes=[('A4', '210 × 297 mm'), ('Dergi boyu', '230 × 300 mm'), ('Dergi 3:4', '210 × 280 mm'), ('A3 çift sayfa (açık yayılım)', '420 × 297 mm')],
  steps=[('Dergiyi aç', 'Aşağıdaki düğmeyle Vybble’ı dergi ayarlarıyla aç; boyutu ve sayfa sayısını seç. İlk sayfa kapak olur.'),
         ('Tüm sayfaları yan yana gör', 'Sayfalar tuvalde artboard olarak yan yana durur; bir sayfayı Alt ile sürükleyerek kopyalayabilir, sırasını değiştirebilirsin.'),
         ('Makaleleri yerleştir', 'Uzun yazıları metin zinciriyle sayfadan sayfaya akıt. Her makalenin açılış sayfasında büyük bir görsel ve başlık kullan.'),
         ('Otomatik tasarımı dene', 'Görsel eklediğin sayfada sağ paneldeki ✨ Otomatik tasarım, aynı içerikle yüzlerce farklı düzen önerir.')]+COMMON_STEPS_END+[
         ('Yayınla', 'Matbaa için CMYK PDF; dijital okur için sayfa çevirmeli Flipbook ya da video ve harita içeren interaktif yayın.')],
  tips=['Gövde metni 9–11 pt, satır uzunluğu 45–75 karakter olsun; iki ya da üç sütun kullan.', 'Ardışık iki sayfada aynı düzeni tekrarlama; okur sayfa çevirdiğinde değişim görsün.',
        'Sayfa numaralarını ikinci sayfadan başlat, kapağa numara koyma.', 'Sırt tarafında (iç kenar) yazıları kenardan en az 10 mm uzak tut.',
        'Kapakta en fazla 3–4 başlık (kapak satırı) kullan; logoyu her sayıda aynı yerde tut.'],
  faq=[('Dergi için standart boyut nedir?', 'Türkiye’de en yaygın dergi boyutları A4 (210 × 297 mm) ve 230 × 300 mm’dir. Daha ekonomik baskı için 210 × 280 mm de kullanılır.'),
       ('Dergiyi internette yayınlayabilir miyim?', 'Evet. Sayfa çevirme animasyonlu Flipbook HTML dosyası olarak dışa aktarıp web sitende yayınlayabilir ya da paylaşabilirsin.'),
       ('Dergimi kaç sayfa yapmalıyım?', 'Tel dikişli dergilerde sayfa sayısı 4’ün katı olmalıdır. Okul ve kurum dergileri genellikle 16–32 sayfadır.'),
       ('Birden fazla kişi aynı dergi üzerinde çalışabilir mi?', 'Şimdilik çalışmalar cihazda saklanır; projeyi yedek dosyası olarak dışa aktarıp başka bir cihazda açabilirsin. Ekip çalışma alanı henüz yok.')]),

 dict(slug='dergi-kapagi-yapma', kind='kapak', tpl='dergi-kapagi',
  title='Dergi Kapağı Yapma: Ücretsiz Kapak Tasarımı Rehberi',
  h1='Dergi kapağı yapma', lead='Göz alıcı bir dergi, kitap ya da albüm kapağı hazırla: tek güçlü fotoğraf, okunaklı başlık ve doğru ölçü. Tarayıcında, ücretsiz.',
  desc='Dergi kapağı nasıl yapılır? Kapak ölçüleri, başlık yerleşimi, fotoğraf seçimi ve baskı ayarları. Dergi, kitap ve albüm kapağını ücretsiz tasarla.',
  cta='Kapak tasarlamaya başla', cta2=('Hazır kapak şablonuyla başla', 'dergi-kapagi'),
  sizes=[('Dergi kapağı', '230 × 300 mm'), ('Katalog kapağı (A4)', '210 × 297 mm'), ('Kitap (açık, ön + arka)', '420 × 297 mm'), ('Albüm / kare', '200 × 200 mm')],
  steps=[('Kapağı aç', 'Aşağıdaki düğmeyle Vybble’ı kapak ayarlarıyla aç ve kapak türünü seç.'),
         ('Tek, güçlü bir fotoğraf seç', 'Kapakta tek bir odak noktası olsun. Fotoğrafın sakin (az detaylı) bir bölümü başlık için yer bırakmalı.'),
         ('Otomatik kapak düzeni', '✨ Otomatik tasarım, başlığı fotoğrafın en sakin bölgesine yerleştirir; okunurluk yetmezse başlığı bir renk kartının üstüne alır.'),
         ('Logo ve kapak satırları', 'Dergi adını (logo) üstte, 2–4 kısa kapak satırını yanda ya da altta topla.')]+COMMON_STEPS_END+[
         ('Dışa aktar', 'Baskı için CMYK PDF (taşma payı açık), sosyal medya için PNG.')],
  tips=['Başlık ile arka plan arasında güçlü kontrast olsun; açık fotoğrafta koyu, koyu fotoğrafta açık yazı.', 'Yüz içeren fotoğraflarda gözler genellikle sayfanın üst üçte birinde olmalı.',
        'Fotoğraf kenara kadar uzanıyorsa 3 mm taşma payının içine de taşmalı.', 'Kapak fotoğrafı tam sayfada en az 300 dpi olmalı (230 × 300 mm için yaklaşık 2717 × 3543 piksel).'],
  faq=[('Dergi kapağı ölçüsü nedir?', 'En yaygın dergi kapağı ölçüleri 230 × 300 mm ve A4’tür (210 × 297 mm). Baskı için her kenara 3 mm taşma payı eklenir.'),
       ('Kapak fotoğrafı kaç piksel olmalı?', '300 dpi baskı için 230 × 300 mm kapakta yaklaşık 2717 × 3543 piksel gerekir. Baskı Merkezi fotoğrafının yetip yetmediğini gösterir.'),
       ('Kitap kapağı yapabilir miyim?', 'Evet. “Kitap (açık)” boyutu ön ve arka kapağı tek sayfada (420 × 297 mm) hazırlamanı sağlar.')]),

 dict(slug='afis-tasarimi', kind='afis', tpl='konser-afisi',
  title='Ücretsiz Afiş Tasarımı: Etkinlik ve Konser Afişi Hazırlama',
  h1='Ücretsiz afiş tasarımı', lead='Konser, festival, sergi ya da kampanya afişini A3’ten A0’a kadar doğru ölçüde hazırla; uzaktan okunan başlık ve baskıya hazır dosya.',
  desc='Afiş ve poster tasarımı rehberi: A3, A2, A0 ve billboard ölçüleri, uzaktan okunurluk, baskı çözünürlüğü. Etkinlik afişini ücretsiz tasarla.',
  cta='Afiş tasarlamaya başla', cta2=('Hazır konser afişiyle başla', 'konser-afisi'),
  sizes=[('A3', '297 × 420 mm'), ('A2', '420 × 594 mm'), ('24 × 36 inç', '610 × 914 mm'), ('A0', '841 × 1189 mm'), ('Billboard (3:1)', '300 × 100 mm ölçekli')],
  steps=[('Afişi aç', 'Aşağıdaki düğmeyle Vybble’ı afiş ayarlarıyla aç ve boyutu seç.'),
         ('Mesajı üçe indir', 'Afişte yalnızca üç bilgi olmalı: ne (başlık), ne zaman, nerede. Gerisini küçük yaz ya da QR koda taşı.'),
         ('Dev başlık', 'Başlık afişin en büyük öğesi olsun; ✨ Otomatik tasarım dev başlık ve kapak düzenlerini dener.'),
         ('QR kod ekle', 'Bilet ya da kayıt sayfası için QR kod ekle; en az 20 × 20 mm olsun.')]+COMMON_STEPS_END+[
         ('Bas', 'CMYK PDF olarak dışa aktar. Büyük afişlerde 150 dpi genellikle yeterlidir; Baskı Merkezi’nde eşiği seçebilirsin.')],
  tips=['Başlık 5–10 metreden okunabilmeli: A3 afişte en az 60–80 pt.', 'En fazla iki yazı tipi ve bir vurgu rengi kullan.',
        'Tarih ve yer bilgisini her zaman aynı köşede topla.', 'Büyük boy afişlerde 150 dpi yeterlidir; yakından bakılacak A3 afişlerde 300 dpi tercih et.'],
  faq=[('Afiş için en yaygın boyut hangisi?', 'İç mekân duyuruları için A3 (297 × 420 mm), dış mekân ve etkinlikler için A2 ve 50 × 70 cm, büyük panolar için A0 kullanılır.'),
       ('Afiş kaç dpi olmalı?', 'Yakından bakılan A3 afişlerde 300 dpi, uzaktan bakılan büyük afişlerde 150 dpi yeterlidir.'),
       ('Afişi sosyal medyada da kullanabilir miyim?', 'Evet. Aynı tasarımı PNG olarak dışa aktarabilir ya da sosyal medya boyutunda yeni bir sayfa açıp kopyalayabilirsin.')]),

 dict(slug='kartvizit-tasarimi', kind='kartvizit', tpl='kartvizit',
  title='Kartvizit Tasarımı ve Kartvizit Ölçüleri (85×55, 90×50)',
  h1='Kartvizit tasarımı', lead='Ön ve arka yüzüyle kartvizitini doğru ölçüde hazırla; ince yazıların bile keskin basılması için 600 dpi ve güvenli kenar boşluğu.',
  desc='Kartvizit ölçüleri (85×55, 90×50, 85×54 mm), güvenli alan, taşma payı ve baskı ayarları. Kartvizitini ücretsiz tasarla, matbaaya hazır PDF al.',
  cta='Kartvizit tasarlamaya başla', cta2=('Hazır kartvizit şablonuyla başla', 'kartvizit'),
  sizes=[('Avrupa standardı', '85 × 55 mm'), ('Türkiye’de yaygın', '90 × 50 mm'), ('ISO (kredi kartı boyu)', '85 × 54 mm')],
  steps=[('Kartviziti aç', 'Aşağıdaki düğmeyle Vybble’ı kartvizit ayarlarıyla aç; matbaanın istediği ölçüyü seç. Ön ve arka yüz iki sayfa olarak gelir.'),
         ('Ön yüz', 'Ad soyad ve unvan büyük, logo küçük. İletişim bilgilerini arka yüze ya da ön yüzün altına koy.'),
         ('Arka yüz', 'Telefon, e-posta, adres ve web sitesi. İstersen QR kod ekle (en az 15–20 mm).')]+COMMON_STEPS_END+[
         ('Matbaaya gönder', 'Baskı Merkezi’nde çözünürlük eşiğini 600 dpi yap, taşma payı ve kesim işaretlerini aç, CMYK PDF al.')],
  tips=['Yazıları kesim çizgisinden en az 4–5 mm içeride tut.', 'En küçük yazı 7 pt’den küçük olmasın.',
        'Koyu zeminde ince yazı tipi kullanma; baskıda kaybolabilir.', 'Telefon ve e-postayı basmadan önce iki kez kontrol et.'],
  faq=[('Kartvizit ölçüsü kaç mm?', 'Türkiye’de en yaygın kartvizit ölçüsü 90 × 50 mm’dir. Avrupa standardı 85 × 55 mm, kredi kartı boyu 85 × 54 mm’dir.'),
       ('Kartvizit kaç dpi olmalı?', 'İnce yazı ve logoların keskin basılması için 600 dpi önerilir; fotoğraf içeriyorsa en az 300 dpi.'),
       ('Taşma payı gerekli mi?', 'Arka plan rengi ya da görsel kenara kadar uzanıyorsa evet, her kenara 3 mm taşma payı eklenmelidir.')]),

 dict(slug='matbaaya-hazir-pdf', kind='brosur', tpl=None,
  title='Matbaaya Hazır PDF: Taşma Payı, 300 DPI ve CMYK Rehberi',
  h1='Matbaaya hazır PDF nasıl hazırlanır?', lead='Taşma payı, kesim işareti, çözünürlük ve CMYK: dosyan matbaadan geri dönmesin diye bilmen gereken her şey, tek sayfada.',
  desc='Matbaaya hazır PDF rehberi: 3 mm taşma payı, güvenli alan, 300 dpi çözünürlük hesabı, CMYK renk, kesim işaretleri ve son kontrol listesi.',
  cta='Baskı işine başla', cta2=None,
  sizes=[('A4 + 3 mm taşma payı', '216 × 303 mm'), ('A5 + 3 mm taşma payı', '154 × 216 mm'), ('Kartvizit 90 × 50 + 3 mm', '96 × 56 mm')],
  steps=[('Taşma payı ekle (3 mm)', 'Kenara kadar uzanan fotoğraf ve renkler, kesim çizgisinin 3 mm dışına kadar taşmalı. Böylece kesimde beyaz çizgi kalmaz.'),
         ('Güvenli alanda kal', 'Yazı ve logolar kesim çizgisinden en az 5 mm içeride olmalı (dergi sırtında 10 mm).'),
         ('Çözünürlüğü kontrol et', 'Fotoğraf, basılacağı boyutta en az 300 dpi olmalı. Hesap: piksel ÷ (mm ÷ 25,4). Örnek: A4 genişliğinde (210 mm) 300 dpi için 2480 piksel gerekir.'),
         ('CMYK’ya çevir', 'Ekran RGB, baskı CMYK’dır. Canlı yeşil ve mavi tonlar baskıda biraz donuklaşır; buna hazırlıklı ol.'),
         ('Kesim işaretleri', 'PDF’in köşelerinde kesim işaretleri olsun; matbaa nereden keseceğini bilir.'),
         ('Vybble’da tek adımda', '⋯ menüsü → Komut paleti → “Baskı Merkezi” (bilgisayarda Ctrl+Alt+X): taşma payı ve kesim işaretlerini açar, düşük çözünürlüklü fotoğrafları işaretler, CMYK PDF indirir.')],
  tips=['Siyah yazılarda yalnızca siyah (%100 K) kullan; büyük siyah alanlarda zengin siyah tercih et.', 'Tel dikişli işlerde sayfa sayısı 4’ün katı olmalı.',
        'Yazı tiplerinin PDF’e gömüldüğünden emin ol (Google Fonts yazı tipleri serbestçe gömülebilir).', 'Göndermeden önce matbaana kendi şartlarını sor; bazıları 5 mm taşma payı ister.'],
  faq=[('Taşma payı kaç mm olmalı?', 'Matbaaların çoğu her kenarda 3 mm taşma payı ister. A4 bir dosya taşma payıyla 216 × 303 mm olur.'),
       ('300 dpi ne demek?', 'Basılı bir inçte (25,4 mm) 300 piksel demektir. Fotoğrafın piksel sayısını basılacağı mm’ye bölüp 25,4 ile çarparak hesaplarsın.'),
       ('RGB dosya gönderirsem ne olur?', 'Matbaa dosyayı CMYK’ya çevirir; renkler beklediğinden farklı çıkabilir. CMYK PDF göndermek sürprizleri azaltır.'),
       ('Kesim işareti şart mı?', 'Çoğu matbaa ister. Vybble’ın Baskı Merkezi kesim işaretlerini tek tıkla ekler.')]),
]

# ---------------- İngilizce içerik (aynı sıra ve kimliklerle) ----------------
EN_SLUG = {'menu-tasarimi':'menu-design','katalog-hazirlama':'catalog-design','dergi-tasarimi':'magazine-design','dergi-kapagi-yapma':'magazine-cover','afis-tasarimi':'poster-design','kartvizit-tasarimi':'business-card-design','matbaaya-hazir-pdf':'print-ready-pdf'}
EN = {
 'menu-tasarimi': dict(title='Free Menu Design: How to Make a Restaurant or Café Menu', h1='Free menu design',
  lead='Create your restaurant, café or bakery menu in your browser, free and without an account. Export a print-ready PDF or a QR menu guests open on their phones.',
  desc='Design a restaurant or café menu for free: menu sizes (A4, A5, narrow), price-list layout, QR menu page and print-ready PDF. No sign-up.',
  cta='Start designing a menu', cta2='Start from a menu template',
  sizes=[('Narrow menu (table stand, sleeve)','100 × 210 mm'),('A5 (single sheet)','148 × 210 mm'),('A4 (main menu, two sides)','210 × 297 mm')],
  steps=[('Open the menu type','Use the button below to open Vybble with menu settings. Pick the size (narrow, A5, A4) and page count, then tap “Start designing →”.'),
   ('Lay out the sections','Use separate headlines for starters, mains, desserts and drinks. Five to eight items per section keeps the page readable.'),
   ('Align the prices','Write the item name and price on one line with dot leaders, e.g. “Lentil soup ........ 6.50”. The line below becomes the description.'),
   ('Add photos (optional)','Add one or two hero dishes; ✨ Auto design places them without covering the text.'),
   ('Edit your text','Tap a headline, text or price to type. Change the palette and fonts in the right panel. 💡 Suggest offers ready-made headings.'),
   ('Print or share by QR','For print, use Export → PDF. For the table, Export → 📱 QR menu page creates a QR code that opens your menu on guests’ phones.')],
  tips=['Keep menu text at least 9 pt; it is often read in dim light.','Use no more than two typefaces: a characterful one for headings, a plain one for items.','Right-align prices and write the currency the same way on every line.','Mark allergens and vegetarian dishes with small symbols and explain them at the bottom.','If the menu will be laminated, keep text 5 mm inside the edges.'],
  faq=[('What size is best for a menu?','A4 for one-page main menus, a 100 × 210 mm narrow menu for cafés and table stands, A5 for dessert and drinks cards.'),
   ('How should I send my menu to the printer?','As a CMYK PDF with 3 mm bleed and crop marks. Vybble’s Print Centre checks these and your photo resolution.'),
   ('Can I make a QR menu?','Yes. Export → 📱 QR menu page turns your menu into a mobile page inside the QR link itself; nothing is uploaded to a server.'),
   ('Is it free? Do I need an account?','Vybble is free and needs no account; your designs are stored on your device.')]),
 'katalog-hazirlama': dict(title='How to Make a Product Catalog: Free Catalog Design', h1='How to make a catalog',
  lead='Build a product catalog step by step: pick the right size, place products on a grid, add prices and descriptions, then export a print-ready PDF or a page-flip digital catalog.',
  desc='Product catalog guide: catalog sizes, page layout, automatic catalogs from CSV, print-ready PDF and digital flipbook. Free, no sign-up.',
  cta='Start a catalog', cta2='Start from a catalog template',
  sizes=[('A4 portrait (most common)','210 × 297 mm'),('A4 landscape','297 × 210 mm'),('Square','210 × 210 mm'),('A5 (pocket catalog)','148 × 210 mm')],
  steps=[('Open the catalog','Use the button below to open Vybble with catalog settings. Choose size and page count; page one becomes the cover.'),
   ('Upload product photos','Four to six products per page suits most catalogs. Shoot them in the same light and on the same background for a consistent look.'),
   ('Automatic layout','✨ Auto design places your photos and text on the grid without overlaps. Don’t like it? Tap “🎲 Another”.'),
   ('Many products? Use CSV','Write placeholders such as {Name} and {Price} on a page and load your product list as a CSV file (⋯ menu → Catalog from CSV). Vybble copies the page for every row.'),
   ('Edit your text','Tap any headline, text or price to type; change palette and fonts in the right panel.'),
   ('Print or share','Export → PDF for print; for customers, send a page-flip magazine or PNG from Export → 📤 Send.')],
  tips=['Use the same grid on every page so readers can compare products.','Keep price, name and short description in the same order for every product.','Saddle-stitched catalogs need a page count divisible by 4: 8, 12, 16…','Product photos should be at least 300 dpi at print size; Print Centre flags low-resolution images.','Use one strong image and a short title on the cover.'],
  faq=[('How many pages should a catalog have?','Saddle-stitched catalogs need multiples of 4 (8, 12, 16). 8–12 pages is enough for most small businesses.'),
   ('What is the best paper size for a catalog?','A4 portrait (210 × 297 mm) is the most common. Use A4 landscape to show products wide, A5 for pocket catalogs.'),
   ('Do I have to place hundreds of products one by one?','No. Load your product list as CSV and generate the pages with placeholders.'),
   ('Can I share the catalog digitally?','Yes. Export a page-flip HTML flipbook or PNG and send it via WhatsApp, email or your website.')]),
 'dergi-tasarimi': dict(title='Online Magazine Design: Free Magazine Maker Guide', h1='Online magazine design',
  lead='School magazine, company newsletter or fashion magazine: build it from cover to back page with flowing text, page numbers and a real grid, right in your browser.',
  desc='Free online magazine design: magazine sizes, cover and inner-page layout, text flowing across pages, page numbers, PDF and page-flip digital magazine.',
  cta='Start a magazine', cta2='Start from a magazine template',
  sizes=[('A4','210 × 297 mm'),('Magazine size','230 × 300 mm'),('Magazine 3:4','210 × 280 mm'),('A3 spread (open)','420 × 297 mm')],
  steps=[('Open the magazine','Use the button below to open Vybble with magazine settings; pick the size and page count. Page one is the cover.'),
   ('See every page side by side','Pages sit next to each other as artboards; Alt-drag a page to copy it or reorder it.'),
   ('Place the articles','Flow long articles across pages with a text chain. Open each article with a large image and headline.'),
   ('Try auto design','On a page with an image, ✨ Auto design suggests hundreds of layouts for the same content.'),
   ('Edit your text','Tap any headline or text to type; palette and fonts are in the right panel.'),
   ('Publish','CMYK PDF for the printer; a page-flip flipbook or an interactive edition with video and maps for digital readers.')],
  tips=['Body text 9–11 pt, 45–75 characters per line; use two or three columns.','Don’t repeat the same layout on two consecutive pages.','Start page numbers on page two; the cover has none.','On the spine side keep text at least 10 mm from the edge.','Use at most 3–4 cover lines and keep the masthead in the same place every issue.'],
  faq=[('What is the standard magazine size?','A4 (210 × 297 mm) and 230 × 300 mm are the most common; 210 × 280 mm is a more economical option.'),
   ('Can I publish the magazine online?','Yes. Export a page-flip flipbook HTML file and publish or share it.'),
   ('How many pages should my magazine have?','Saddle-stitched magazines need multiples of 4. School and company magazines are usually 16–32 pages.'),
   ('Can several people work on one magazine?','For now designs are stored on your device; move a project between devices with a backup file. A team workspace is not available yet.')]),
 'dergi-kapagi-yapma': dict(title='How to Make a Magazine Cover: Free Cover Design Guide', h1='How to make a magazine cover',
  lead='Design an eye-catching magazine, book or album cover: one strong photo, a readable title and the right size. In your browser, for free.',
  desc='How to make a magazine cover: cover sizes, title placement, photo choice and print settings. Design magazine, book and album covers for free.',
  cta='Start a cover', cta2='Start from a cover template',
  sizes=[('Magazine cover','230 × 300 mm'),('Catalog cover (A4)','210 × 297 mm'),('Book (open, front + back)','420 × 297 mm'),('Album / square','200 × 200 mm')],
  steps=[('Open the cover','Use the button below to open Vybble with cover settings and pick the cover type.'),
   ('Choose one strong photo','A cover needs a single focal point. A calm (low-detail) area of the photo should leave room for the title.'),
   ('Automatic cover layout','✨ Auto design puts the title on the calmest area of the photo; if contrast is too low, it places the title on a colour card.'),
   ('Masthead and cover lines','Keep the magazine name at the top and group two to four short cover lines at the side or bottom.'),
   ('Edit your text','Tap any text to type; palette and fonts are in the right panel.'),
   ('Export','CMYK PDF with bleed for print, PNG for social media.')],
  tips=['Make sure the title contrasts strongly with the photo: dark text on light photos, light text on dark ones.','In portraits the eyes usually sit in the top third of the page.','If the photo runs to the edge it must extend into the 3 mm bleed.','A full-page cover photo needs at least 300 dpi (about 2717 × 3543 px for 230 × 300 mm).'],
  faq=[('What size is a magazine cover?','The most common sizes are 230 × 300 mm and A4 (210 × 297 mm). Add 3 mm bleed on each side for print.'),
   ('How many pixels should a cover photo be?','For 300 dpi on a 230 × 300 mm cover you need about 2717 × 3543 pixels. Print Centre tells you if your photo is enough.'),
   ('Can I make a book cover?','Yes. The “Book (open)” size puts front and back cover on one page (420 × 297 mm).')]),
 'afis-tasarimi': dict(title='Free Poster Design: How to Make an Event or Concert Poster', h1='Free poster design',
  lead='Make a concert, festival, exhibition or sale poster at the right size from A3 to A0, with a headline readable from a distance and a print-ready file.',
  desc='Poster design guide: A3, A2, A0 and billboard sizes, readability from a distance, print resolution. Design an event poster for free.',
  cta='Start a poster', cta2='Start from a concert poster',
  sizes=[('A3','297 × 420 mm'),('A2','420 × 594 mm'),('24 × 36 in','610 × 914 mm'),('A0','841 × 1189 mm'),('Billboard (3:1)','300 × 100 mm, scaled')],
  steps=[('Open the poster','Use the button below to open Vybble with poster settings and pick the size.'),
   ('Cut the message to three','A poster needs three things: what (headline), when and where. Make the rest small or move it to a QR code.'),
   ('Giant headline','Make the headline the largest element; ✨ Auto design tries giant-headline and cover layouts.'),
   ('Add a QR code','Add a QR code for tickets or sign-up; make it at least 20 × 20 mm.'),
   ('Edit your text','Tap any text to type; palette and fonts are in the right panel.'),
   ('Print','Export a CMYK PDF. For large posters 150 dpi is usually enough; set the threshold in Print Centre.')],
  tips=['The headline should be readable from 5–10 metres: at least 60–80 pt on an A3 poster.','Use at most two typefaces and one accent colour.','Always keep date and venue in the same corner.','150 dpi is enough for large posters; prefer 300 dpi for A3 posters seen up close.'],
  faq=[('What is the most common poster size?','A3 (297 × 420 mm) for indoor notices, A2 and 50 × 70 cm for outdoor and events, A0 for large boards.'),
   ('What dpi should a poster be?','300 dpi for A3 posters seen up close; 150 dpi for large posters seen from a distance.'),
   ('Can I use the poster on social media too?','Yes. Export it as PNG, or open a new page in a social-media size and copy the design.')]),
 'kartvizit-tasarimi': dict(title='Business Card Design and Sizes (85×55, 90×50 mm)', h1='Business card design',
  lead='Design both sides of your business card at the right size, at 600 dpi with a safe margin so even fine text prints sharp.',
  desc='Business card sizes (85×55, 90×50, 85×54 mm), safe area, bleed and print settings. Design your card for free and get a print-ready PDF.',
  cta='Start a business card', cta2='Start from a business card template',
  sizes=[('European standard','85 × 55 mm'),('Common in Turkey','90 × 50 mm'),('ISO (credit-card size)','85 × 54 mm')],
  steps=[('Open the business card','Use the button below to open Vybble with business-card settings and pick your printer’s size. Front and back come as two pages.'),
   ('Front','Name and title large, logo small. Put contact details on the back or at the bottom of the front.'),
   ('Back','Phone, email, address and website. Add a QR code if you like (at least 15–20 mm).'),
   ('Edit your text','Tap any text to type; palette and fonts are in the right panel.'),
   ('Send to the printer','In Print Centre set the resolution threshold to 600 dpi, turn on bleed and crop marks, and export a CMYK PDF.')],
  tips=['Keep text at least 4–5 mm inside the trim line.','The smallest text should not be under 7 pt.','Avoid thin typefaces on dark backgrounds; they can disappear in print.','Check your phone number and email twice before printing.'],
  faq=[('What size is a business card in mm?','85 × 55 mm is the European standard, 90 × 50 mm is common in Turkey and 85 × 54 mm is credit-card size.'),
   ('What dpi should a business card be?','600 dpi keeps fine text and logos sharp; at least 300 dpi if it contains photos.'),
   ('Do I need bleed?','Yes, if a background colour or image reaches the edge: add 3 mm bleed on each side.')]),
 'matbaaya-hazir-pdf': dict(title='Print-Ready PDF: Bleed, 300 DPI and CMYK Explained', h1='How to make a print-ready PDF',
  lead='Bleed, crop marks, resolution and CMYK: everything you need so your file isn’t rejected by the printer, on one page.',
  desc='Print-ready PDF guide: 3 mm bleed, safe area, 300 dpi resolution maths, CMYK colour, crop marks and a final checklist.',
  cta='Start a print job', cta2=None,
  sizes=[('A4 + 3 mm bleed','216 × 303 mm'),('A5 + 3 mm bleed','154 × 216 mm'),('Business card 90 × 50 + 3 mm','96 × 56 mm')],
  steps=[('Add bleed (3 mm)','Photos and colours that reach the edge must extend 3 mm beyond the trim line, so no white line is left after cutting.'),
   ('Stay in the safe area','Text and logos must be at least 5 mm inside the trim line (10 mm on a magazine spine).'),
   ('Check the resolution','A photo must be at least 300 dpi at its printed size. Maths: pixels ÷ (mm ÷ 25.4). Example: 300 dpi across A4 width (210 mm) needs 2480 pixels.'),
   ('Convert to CMYK','Screens are RGB, print is CMYK. Vivid greens and blues get slightly duller in print; be prepared.'),
   ('Crop marks','The PDF should have crop marks in the corners so the printer knows where to cut.'),
   ('In Vybble, in one place','⋯ menu → Print Centre (Ctrl+Alt+X on a computer): turns on bleed and crop marks, flags low-resolution photos and downloads a CMYK PDF.')],
  tips=['Use 100 % K black for black text; prefer rich black for large black areas.','Saddle-stitched jobs need a page count divisible by 4.','Make sure fonts are embedded in the PDF (Google Fonts can be embedded freely).','Ask your printer about their own requirements; some want 5 mm bleed.'],
  faq=[('How much bleed should I add?','Most printers want 3 mm on each side. An A4 file with bleed is 216 × 303 mm.'),
   ('What does 300 dpi mean?','300 pixels per printed inch (25.4 mm). Divide the photo’s pixels by the printed size in mm and multiply by 25.4.'),
   ('What happens if I send an RGB file?','The printer converts it to CMYK and colours may look different from what you expected. Sending a CMYK PDF avoids surprises.'),
   ('Are crop marks required?','Most printers ask for them. Vybble’s Print Centre adds them in one click.')]),
}
UI = {
 'tr': dict(lang='tr', loc='tr_TR', guides='Rehberler', open_app='Uygulamayı aç', all='Tüm rehberler', app='Uygulama', privacy='Gizlilik', terms='Koşullar', tagline='© 2026 Vybble · Tasarla. Bas. Yayınla.',
  crumb='Konum', free='Ücretsiz · üyelik yok · tarayıcında çalışır', sizes='Hazır ölçüler', fmt='Biçim', size='Ölçü', bleed='Baskı için her kenara 3 mm taşma payı eklenir. Ayrıntılar: <a href="{pdf}.html">Matbaaya hazır PDF rehberi</a>.',
  steps='Adım adım', tips='İpuçları', ready='<b>Hazırsan başlayalım.</b> Vybble bu ayarlarla açılır; birkaç dakikada ilk sayfan hazır.', faq='Sık sorulan sorular', more='Diğer rehberler', upd='Son güncelleme: ' + DATE_TR,
  idx_t='Tasarım ve Baskı Rehberleri', idx_d='Menü, katalog, dergi, kapak, afiş ve kartvizit tasarımı; matbaaya hazır PDF. Ölçüler, adımlar ve ipuçlarıyla ücretsiz rehberler.', idx_h='Tasarım ve baskı rehberleri',
  idx_l='Doğru ölçü, düzgün düzen, matbaaya hazır dosya. Her rehberde ölçüler, adım adım anlatım ve tek dokunuşla Vybble’da başlama düğmesi var.', read='Oku →', other_lang='English', q=''),
 'en': dict(lang='en', loc='en_US', guides='Guides', open_app='Open the app', all='All guides', app='App', privacy='Privacy (TR)', terms='Terms (TR)', tagline='© 2026 Vybble · Design. Print. Publish.',
  crumb='Breadcrumb', free='Free · no account · runs in your browser', sizes='Ready-made sizes', fmt='Format', size='Size', bleed='For print, add 3 mm bleed on every side. Details: <a href="{pdf}.html">Print-ready PDF guide</a>.',
  steps='Step by step', tips='Tips', ready='<b>Ready? Let’s start.</b> Vybble opens with these settings; your first page is ready in minutes.', faq='Frequently asked questions', more='More guides', upd='Last updated: 17 November 2026',
  idx_t='Design and Print Guides', idx_d='Menu, catalog, magazine, cover, poster and business card design; print-ready PDF. Free guides with sizes, steps and tips.', idx_h='Design and print guides',
  idx_l='The right size, a clean layout and a print-ready file. Every guide has sizes, step-by-step instructions and a button that opens Vybble ready to go.', read='Read →', other_lang='Türkçe', q='&lang=en'),
}

def head(L, title, desc, url, alt, depth, rh, ld):
    up = '../' * depth
    return f"""<!DOCTYPE html>
<html lang="{L['lang']}"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{title} · Vybble</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{url}">
{alt}
<meta property="og:type" content="article"><meta property="og:locale" content="{L['loc']}"><meta property="og:site_name" content="Vybble">
<meta property="og:title" content="{title}"><meta property="og:description" content="{desc}"><meta property="og:url" content="{url}">
<meta property="og:image" content="{BASE}og.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:image" content="{BASE}og.jpg">
<link rel="icon" href="{up}favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="{'../' * (depth - 1)}stil.css">
<script>try{{var t=(JSON.parse(localStorage.getItem('editra.cfg')||'{{}}')||{{}}).theme;if(t==='dark'||t==='light')document.documentElement.dataset.theme=t}}catch(e){{}}</script>
<script type="application/ld+json">{ld}</script>
</head><body>
<header class="top"><a class="home" href="{up}{('?lang=en' if L['lang']=='en' else '')}"><img src="{up}favicon.svg" alt="">Vybble</a><nav><a href="./"{rh}>{L['guides']}</a><a class="go" href="{up}{('?lang=en' if L['lang']=='en' else '')}">{L['open_app']}</a></nav></header>
"""

def foot(L, depth, other):
    up = '../' * depth
    return f"""<footer class="foot"><span>{L['tagline']}</span><a href="./">{L['all']}</a><a href="{other}" hreflang="{'tr' if L['lang']=='en' else 'en'}">{L['other_lang']}</a><a href="{up}">{L['app']}</a><a href="{up}gizlilik.html">{L['privacy']}</a><a href="{up}kosullar.html">{L['terms']}</a></footer>
<script defer src="{up}js/33-sayac.js"></script>
</body></html>
"""

def alts(tr_url, en_url):
    return f'<link rel="alternate" hreflang="tr" href="{tr_url}"><link rel="alternate" hreflang="en" href="{en_url}"><link rel="alternate" hreflang="x-default" href="{tr_url}">'

def build(lang):
    L = UI[lang]; depth = 1 if lang == 'tr' else 2; up = '../' * depth
    out_dir = OUT if lang == 'tr' else os.path.join(OUT, 'en'); os.makedirs(out_dir, exist_ok=True)
    pages = []
    for g in G:
        d = g if lang == 'tr' else {**g, **EN[g['slug']], 'slug': EN_SLUG[g['slug']], 'cta2': (EN[g['slug']]['cta2'], g['cta2'][1]) if g.get('cta2') else None}
        pages.append(d)
    pdf_slug = 'matbaaya-hazir-pdf' if lang == 'tr' else EN_SLUG['matbaaya-hazir-pdf']
    sub = 'rehber/' if lang == 'tr' else 'rehber/en/'
    for g, d in zip(G, pages):
        url = f"{BASE}{sub}{d['slug']}.html"; tr_url = f"{BASE}rehber/{g['slug']}.html"; en_url = f"{BASE}rehber/en/{EN_SLUG[g['slug']]}.html"
        other = (f"en/{EN_SLUG[g['slug']]}.html" if lang == 'tr' else f"../{g['slug']}.html")
        app = f"{up}?yeni={g['kind']}{L['q']}"
        ld = [{'@context':'https://schema.org','@type':'Article','headline':d['title'],'description':d['desc'],'inLanguage':lang,'datePublished':DATE,'dateModified':DATE,'image':BASE+'og.jpg','mainEntityOfPage':url,
               'author':{'@type':'Organization','name':'Vybble'},'publisher':{'@type':'Organization','name':'Vybble','logo':{'@type':'ImageObject','url':BASE+'icon-512.png'}}},
              {'@context':'https://schema.org','@type':'FAQPage','mainEntity':[{'@type':'Question','name':q,'acceptedAnswer':{'@type':'Answer','text':a}} for q,a in d['faq']]},
              {'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'Vybble','item':BASE},{'@type':'ListItem','position':2,'name':L['guides'],'item':BASE+sub},{'@type':'ListItem','position':3,'name':d['h1'],'item':url}]}]
        o = head(L, e(d['title']), e(d['desc']), url, alts(tr_url, en_url), depth, '', json.dumps(ld, ensure_ascii=False).replace('</','<\\/'))
        o += '<main class="art">\n'
        o += f'<nav class="crumb" aria-label="{L["crumb"]}"><a href="{up}">Vybble</a> › <a href="./">{L["guides"]}</a> › <span>{e(d["h1"])}</span></nav>\n'
        o += f'<h1>{e(d["h1"])}</h1>\n<p class="lead">{e(d["lead"])}</p>\n'
        o += f'<div class="cta"><a class="btn" href="{app}">{e(d["cta"])} →</a>'
        if d.get('cta2'): o += f'<a class="btn2" href="{up}?sablon={d["cta2"][1]}{L["q"]}">{e(d["cta2"][0])}</a>'
        o += f'<small>{L["free"]}</small></div>\n'
        o += f'<h2>{L["sizes"]}</h2>\n<div class="tw"><table><tr><th>{L["fmt"]}</th><th>{L["size"]}</th></tr>' + ''.join(f'<tr><td>{e(a)}</td><td>{e(b)}</td></tr>' for a,b in d['sizes']) + '</table></div>\n'
        if g['slug'] != 'matbaaya-hazir-pdf': o += '<p class="note">' + L['bleed'].format(pdf=pdf_slug) + '</p>\n'
        o += f'<h2>{L["steps"]}</h2>\n<ol class="steps">' + ''.join(f'<li><b>{e(t)}</b><span>{e(x)}</span></li>' for t,x in d['steps']) + '</ol>\n'
        o += f'<h2>{L["tips"]}</h2>\n<ul class="tips">' + ''.join(f'<li>{e(t)}</li>' for t in d['tips']) + '</ul>\n'
        o += f'<div class="cta box"><p>{L["ready"]}</p><a class="btn" href="{app}">{e(d["cta"])} →</a></div>\n'
        o += f'<h2>{L["faq"]}</h2>\n<div class="faq">' + ''.join(f'<details><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q,a in d['faq']) + '</div>\n'
        o += f'<h2>{L["more"]}</h2>\n<ul class="more">' + ''.join(f'<li><a href="{x["slug"]}.html">{e(x["h1"])}</a></li>' for x in pages if x is not d) + '</ul>\n'
        o += f'<p class="upd">{L["upd"]}</p>\n</main>\n' + foot(L, depth, other)
        open(os.path.join(out_dir, d['slug'] + '.html'), 'w').write(o)
    url = BASE + sub
    ld = {'@context':'https://schema.org','@type':'CollectionPage','name':'Vybble · ' + L['guides'],'url':url,'inLanguage':lang,'hasPart':[{'@type':'Article','headline':d['title'],'url':f'{url}{d["slug"]}.html'} for d in pages]}
    o = head(L, L['idx_t'], L['idx_d'], url, alts(BASE+'rehber/', BASE+'rehber/en/'), depth, ' aria-current="page"', json.dumps(ld, ensure_ascii=False))
    o += f'<main class="art">\n<h1>{L["idx_h"]}</h1>\n<p class="lead">{L["idx_l"]}</p>\n<div class="cards">'
    for d in pages: o += f'<a class="card" href="{d["slug"]}.html"><b>{e(d["h1"])}</b><span>{e(d["lead"])}</span><i>{L["read"]}</i></a>'
    o += '</div>\n</main>\n' + foot(L, depth, 'en/' if lang == 'tr' else '../')
    open(os.path.join(out_dir, 'index.html'), 'w').write(o)
    return [d['slug'] for d in pages]

for lang in ('tr', 'en'):
    print(lang, ' '.join(build(lang)))
