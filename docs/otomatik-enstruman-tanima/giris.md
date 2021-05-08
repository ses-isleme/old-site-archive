---
sidebar_position: 1
sidebar_label: Giriş
---

# Otomatik ses sınıflandırma

Otomatik ses sınıflandırma, verilen bir ses kaydının  tanımlanmış kategorilerden hangisine ait olduğunun otomatik bulunması işlemidir ve giderek artan sayıda uygulamada kullanılmaktadır. Bu uygulamalara örnek olarak [çevresel ses sınıflandırma](https://paperswithcode.com/task/environmental-sound-classification), [konuşma tanıma](https://paperswithcode.com/task/speech-recognition) (bu problemde kaydın küçük kesitleri sınıflandırılmaktadır), [hastalık tespiti için kalp sesi sınıflandırması](https://paperswithcode.com/task/ecg-classification) gibi örnekler verilebilir. Bu bölümde amacımız otomatik enstrüman sesi sınıflandırması problemi üzerinden otomatik ses sınıflandırması sistem tasarımı problemini ele almak ve ilgili okuyuculara bu konu için bir başlangıç noktası sağlamaktır. İçerik, araştırma materyalinden çok eğitim materyali olarak düşünülmelidir. Bu konudaki güncel araştırmalara ulaşmak için [Google Scholar](https://scholar.google.com/scholar?as_ylo=2017&q=musical+instrument+classification&hl=en&as_sdt=0,5) üzerinden makalelere erişmenizi ve incelemenizi öneririz. 

Herhangi bir makine öğrenmesi problemini ele alırken öncelikle aşağıdaki adımları izlemeliyiz:

*   Hedeflenen uygulamanın ya da araştırma probleminin sınırlarının net bir şekilde tanımlanması
*   Test edilecek modellerin listelenmesi
*   Ölçme ve değerlendirme kriterlerinin belirlenmesi
*   Kullanılacak verilerin elde edilmesi, etiketlerin incelenmesi ve veriler üzerinde yapılacak ön işlemlere karar verilmesi

Bu konuları ele almadan önce ilgili konuda literatür taraması yapmak, en azından güncel bir literatür özet makalesi okumakta büyük fayda vardır.  

Yukarıdaki maddederi ele alırken, "Evrensel kümemiz nedir?", "Hangi verileri toplayabilirim?", "Topladığım verilerin güvenilir etiketleri var mı? Yoksa bu etiketleri nasıl toplar/edinirim?" sorularını da sürekli olarak sorgulamalıyız.

![Akis](/img/otomatik-enstruman-tanima/genel-akis.png)

Bu problemde sınırları şu şekilde belirledik:

*   Gürültüsüz stüdyo ortamında monofonik olarak (tek enstrümanla icra edilen) izole nota seslendirmeleri olarak kaydedilmiş seslerin otomatik sınıflandırması üzerine çalışacağız. Nota seslendirmelerini 4 farklı kategoride (flüt, klarinet, viyolin, vibrafon) sınıflandıracağız.
*   sklearn kütüphanesinde mevcut bir dizi otomatik sınıflandırıcı modelinin test edip karşılaştıracağız
*   Ölçüt olarak standart otomatik sınıflandırma ölçütlerini kullanılacağız (kesinlik, doğruluk, vb.)
*   Veri kümesi olarak bir konservatuvar sitesinde bulunan verileri kullanacağız [*the IOWA:MIS dataset*](http://theremin.music.uiowa.edu/MIS.html) Bu veri setinin seçerken etiketlerin dosya isimlerinde mevcut olması ve ekstra etiketleme emeğine ihtiyaç duymamasına dikkat ettik.

## Bölüm organizasyonu

Daha kolay takip edilebilmesi için bölümü üç aşamaya ayırdık. 

1.   [**Veri inceleme ve ön işleme:**](./veri-inceleme-on-isleme) Öncelikle verileri indirip inceleyecek, içeriğini anlamaya çalışacak ve testlerde kullanılabilmesi için bir dizi ön işleme adımına tabi tutacağız. Veriler üzerine inceleme yapmak problemin doğasını anlamak için kullanılmasını şiddetle tavsiye ettiğimiz bir yöntemdir. Uygun temsillerin ve modellerin seçilebilmesi için önemli bir gerekliliktir.
2.   [**Öznitelik hesaplama:**](./oznitelik-hesaplama) Her bir örnek/kayıt için öznitelikleri hesaplayacak ve öznitelik uzayında bazı incelemeler yapacağız. Daha iyi sonuçlar alabilmek için öznitelikler üzerinde uygulayabileceğimiz bir dizi ön işleme adımını ele alacağız.
3.   [**Sınıflandırıcı tasarımı ve testleri**](./siniflandirici-tasarimi): Bu noktada `sklearn` kütüphanesinde varolan hazır tasarımları kullanacak ve veriler üzerinde performanslarını karşılaştıracağız.