---
sidebar_position: 1
---

# Giriş

:::caution Kitap Hazırlanma Aşamasındadır
Kitabın içeriği üzerinde aktif olarak çalışmaktayız. Bu uyarıyı gördüğünüz içerikler taslak halindedir ve değişiklik gösterebilir.
:::

Ses teknolojisi hayatımızın her yerinde; bir yere nasıl gidileceğini artık yoldaki birine değil Siri'ye soruyor,
onu dinliyor ve o sese güvenerek döner kavşakta ikinci çıkışa gidiyoruz.
Bir dağ tepesindeki kamp çadırımızda mobil cihazımızla milyonlarca müzik kaydından birisini uzaktan erişimle dinleyebiliyoruz.
Son 20 yılda muazzam bir dönüşüm yaşadık ve bu dönüşüm hız kesmeden devam ediyor.
Dönüşümün parçası olmak veya sadece anlamak, birbirinden çekici araştırma sorularının içine dalmak için edinebileceğiniz en iyi araçlardan birisi ses işlemenin temellerini öğrenmek, ses işleme yapabilen programlar yazma yetisini edinmek.
Bu kitap bu yoldan yürüyeceklerin işini kolaylaştırmak için yazılmıştır.

## Sayısal Ses İşleme ve Alt Alanları

Sayısal ses, temelde basınç değişim dalgaları olan akustik ses sinyallerinin mikrofon türü sensörler ile elektriksel sinyallere dönüştürülmesi,
oradan da çevirici devreler yardımıyla bilgisayarda sayı dizileriyle temsil edilmesi ile elde edilir.
Sayısal ses işleme ise bu sayı dizileri üzerinde bilgisayar programları aracıyla analiz, bilgi çıkarma ve sentez işlemlerinin yapılmasına karşılık gelir.
Alan, uygulamaya göre özelleşmiş ve farklı camiaları olan alt alanlar içermektedir.
Örneğin konuşma sinyallerinin ele alındığı alt alan konuşma işleme ([speech processing](https://www.springer.com/gp/book/9783662533000)),
müzik sinyallerinin ele alındığı bazı alt alanlar müzik ses işleme, müzik bilgi erişim ([digital audio signal processing](https://onlinelibrary.wiley.com/doi/book/10.1002/9780470680018),
[sound and music computing](https://en.wikipedia.org/wiki/Sound_and_music_computing),
[music information retrieval](https://www.sciencedirect.com/topics/computer-science/music-information-retrieval)) olarak adlandırılır.
Temel tekniklerde kesişmekle beraber her bir alanın uygulama problemine göre değişen özelleşmiş teknikleri vardır ve bu sebeple araştırmacılar özel uygulama alanlarında uzmanlaşır,
kendileri gibi o alanda uzmanlaşmış bilim insanlarından oluşan camianın bir parçası olurlar.
Bu alanda çalışan araştırmacılar yoğunlukla camianın konferanslarına katılır ve camianın yayın organlarında makaleler yayınlarlar.
Sayısal ses işlemenin diğer alanlarındaki gelişmeleri nadiren ve sadece göz ucuyla takip ede(bili)rler.

Konuşma işleme uygulama alanı gündelik hayatımızda çok yer bulduğu için (konuşan navigasyon sistemleri, telefonla bankacılık, vb.)
bu alt alanda ülkemizde yetkinliği çok yüksek belirli sayıda araştırmacı bulunmakta, konu yaygın bir şekilde (araştırma projeleri, yüksek lisans ve doktora tez çalışmaları, şirket ARGE faaliyetleri ile) çalışılmaktadır.
Sayısal ses işlemenin diğer alt alanları için bunu söylemek oldukça zor. Bu kitapta, görece araştırmacı sayımızın az olduğu müzik ses işleme konularına yöneleceğiz ve bu alana kaynak sağlamaya çalışacağız.

## Bu kitap kimler için yazıldı?

Bu kitap öncelikle müzik ses işleme konularında pratik (kod yazarak ses işleme aracı geliştirme) yeteneklerini geliştirmek isteyen kişiler için yazıldı.
Buna ek olarak sayısal sinyal işleme kuramını öğrenen öğrencilere de pratik imkanı sağlayacağını düşünüyoruz.
Ayrıca MATLAB gibi farklı diller veya araçlarla sayısal sinyal işleme çalışmaları yapmakta olan ve Python’a geçiş yapmak isteyen kişilere de fayda sağlayacağını düşünüyoruz.

Sayısal ses işleme alanının kuramsal temelleri sinyal işleme kuramına dayanmaktadır.
Ülkemizde (ve dünyada) “sinyal işleme dersi” elektrik elektronik mühendisliği ve bazı bilgisayar mühendisliği bölümlerinde zorunlu temel dersler arasındadır.
Sayısal sinyal işleme kuramının detaylı şekilde anlatıldığı kitaplar çevirileriyle beraber
(örneğin [J. G. Proakis’in Digital Signal Processing kitabının çevirisi](https://www.nobelyayin.com/sayisal-sinyal-isleme-digital-signal-processing_3076.html)) mevcuttur.
İnternet üzerinden erişilebilen çok sayıda kaynak bulunmaktadır. Bu alanda ayrıca çok sayıda MATLAB uygulamaları içeren kaynak da bulunmaktadır.
Bu sebeple kuramın tekrarını gerekli en alt seviyede tutacağız ve Python uygulamalarına yoğunlaşacağız.
Kitabımız sinyal işleme kuramında bahsi geçen ancak gerçek sinyaller üzerinde analiz örneklerinin az olduğu konularda uygulamalar (Python kodlama örnekleri) içermektedir.
Bu uygulamaları tamamlayan bir okurun pratik alt yapısının oluşacağını ve kuramı gerçek sinyaller üzerine uygulama yetisinin önemli düzeyde artacağını öngörüyoruz.

Bu kitap okuyucusunun aşağıdaki yetilere sahip olduğunu varsayarak kurgulanmıştır:

- Herhangi bir programlama dilinde vektör ve matris işlemleri yapabilecek düzeyde program yazma yetisi
- Müzik kuramı temel kavramları bilgisi (gam, akor, tonalite, vb.)
- Sinyal işleme temel kavramlarına aşinalık

## Sayısal Müzik Ses İşleme

Bugün ülkemizde bilimle kesişimi çok az olduğu ve sanat alanının bir alt dalı olduğu düşünülen müzik eski çağlardan
bu yana birçok filozof ve bilim adamı için önemli çalışma konuları arasında yer almıştır.
Pisagor’a göre müzikal seslerin armonisi ile evrenin armonisi aynı prensiplere, hatta aynı kaynağa dayanıyordu.
Büyük bir sırrın yansıması gibi umulmadık noktalarda kendini gösteren “müzikal” sayıları bir düşünün:
Bir gamda 7 ses ve haftada 7 gün, oktavda 12 ses ve bir yılda 12 ay, bir düzinede 12 fincan, bir öğretiyi aktaran 12 havari, 12 imam,
müzikal beşliler çemberi oktava 41.turda oktavla hemen hemen birleşir ve 41 kere maşallah.

Bizler sesle çevrili bir evrende yaşarız. Bir sese maruz kalmadığımız bir an yoktur.
Sesle iletişim kurar, bazen bir kuş cıvıltısı duyduğumuzda herşeyden vazgeçip bütün dikkatimizi ona veririz.
Etkilendiğimiz müzikleri hemen arkadaşlarımızla paylaşmak isteriz. Facebook ve YouTube’un ilk yaygınlaşmaya başladığı günleri hatırlayın.
Müzik paylaşımı üzerinden büyüdüler ve bugün hayatlarımızdaki yerlerini aldılar.

Müzik biliminin öneminin çağlar boyunca artıp azaldığı dönemler olmuştur.
Ama, belki de oyunla (_to play_) olan ilişkisi sebebiyle, hemen her dönemde hayatın birçok alanında sürpriz yaratıcı buluşlara kaynaklık etmiştir.
Yüzlerce örnek sıralamak mümkün.
Örneğin bilinen ilk programlanabilir makinelerden birisi (belki ilki) 9.yy’da Bağdat’ta [**Banū Mūsā**](https://en.wikipedia.org/wiki/Ban%C5%AB_M%C5%ABs%C4%81)
kardeşler tarafından icat edilen [müzik kutusu](https://en.wikipedia.org/wiki/Music_box)dur.
Makinenin sadece üzerinde kodları taşıyan silindiri değiştirirsiniz ve size başka bir müzik çalar, makine (kutu) silindir üzerindeki kodu işlemiştir.
Silindir üzerindeki küçük metal parçalarıyla temsil edilen kod zamanla önce dokuma tezgahlarında, sonra ilk programlanabilir makinalarda kullanılan
[delikli kartlara](https://en.wikipedia.org/wiki/Punched_card) evrilmiştir.
Bu programlama şekli müzik alanındaki yolculuğuna ise [piano roll](https://en.wikipedia.org/wiki/Piano_roll) ve
[MIDI](https://en.wikipedia.org/wiki/MIDI) temsilleriyle devam etmiştir.


Müzik biliminin heyecan dolu yolculuğuna ve bugün devam eden araştırmalarına ülkemizde ilgi oldukça sınırlıdır. 
Aslında belki yaşayan en güçlü sanat damarımızdır müzik. 
Her köyde bağlama, kaval, davul çalan ve çok güzel türkü söyleyen insanlarımız vardır, dinlemeyi de severiz. 
Bu topraklarda müzik kadar yaygın ve geçmişle bağı güçlü şekilde devam eden çok az sanat dalı var. 
Ancak işin bilimsel yönüne olan ilgimiz için aynısını söylemek zordur. 
Oysa müzik biliminin her insanı cezbedecek çekicilikte heyecan dolu soruları vardır: 
[insanlar neden hüzünlü müzik dinlemeyi severler?](https://daily.jstor.org/why-do-we-listen-to-sad-music/#:~:text=One%20method%20is%20simple%3A%20by,different%20music%20makes%20them%20feel.&text=The%20team%20discovered%20that%20sad,nostalgia%2C%20peacefulness%2C%20and%20wonder.)
kısacık bir hicaz taksiminin beni belirli bir ruh haline sürüklemesini sağlayan ses ilişkileri nelerdir?
içimi kıpır kıpır eden o parçanın ritmik vuruşları arasındaki ilişki nedir? 

Değindiğimiz büyük soruları çalışmak birçok alandan bilgi gerektirir:
işitsel çalışmalar, duyu ve duygu çalışmaları, biliş, müziğin matematiği,
akustik, müzik kuramı, ses sinyal işleme, ... 
Elektrik Elektronik Mühendisliğinin “Sinyal İşleme” alanı ses analizi ve sentezi ile ilgili çok büyük bir bilgi birikimi oluşturmuş,
müzik teknolojisi alanına temel sağlamış bir alt dal olarak bize müzik araştırmalarında çok etkin bir şekilde kullanabileceğimiz araçlar sağlar. 
Bahsettiğimiz büyük soruların veya daha küçük ve eğlenceli olanlarının peşinden giderken yanımızda taşıyacağımız zengin bir alet çantası sunar bu dal. 
Bu kitaptaki amacımız da bu özel araştırma alanındaki deneyimlerimizi mümkün olduğunca sizlere alet çantanıza ekleyebileceğiniz şekilde sunmak. 
Bu metni okuyorsanız belki bir müzikle ilişkili sorunun büyüsüne zaten kapılmış ve ipuçları aramaktasınız.
