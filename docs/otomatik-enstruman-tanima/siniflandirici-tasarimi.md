---
sidebar_position: 3
---

# Sınıflandırıcı Tasarımı

:::caution Kitap Hazırlanma Aşamasındadır
Kitabın içeriği üzerinde aktif olarak çalışmaktayız. Bu uyarıyı gördüğünüz içerikler taslak halindedir ve değişiklik gösterebilir.
:::

## Öznitelikler ("inputs", `X`) ve etiketler ("outputs", `y`) için matrislerin formatlanması

Şimdi sınıflandırıcıların giriş-çıkış formatlarına uygun matrisleri hazırlayabiliriz. Giriş-çıkış formatlarını öğrenmek için `scikit-learn` dokümantasyonunu veya [örneklerini](https://scikit-learn.org/stable/tutorial/index.html) inceleyebilirsiniz.

```python title='Öznitelikler ve etiketlerin formatlanması'
# Son kolon dışındaki kolonlar öznitelikleri içeriyor
# girdi matrisimiz (X) bu kolonlardan oluşacak.
X = yeni_tablo.iloc[:, :-1].values
# Çıktılar etiket bilgilerini içeriyor olacak. Bu bilgiler son kolonda bulunuyor.
# Sınıflandırıcı eğitiminde kullanabilmek için enstrüman ismi şeklinde
# saklanan bu bilgileri sayısal bilgilere dönüştürmemiz gerekli.

# enstruman verisini kategorik tür veriye dönüştürelim
yeni_tablo.enstruman = pd.Categorical(yeni_tablo.enstruman)
# her kategoriyi bir tam sayı olarak temsil edelim
y = np.array(yeni_tablo.enstruman.cat.codes)

# Oluşturuduğumuz matrislerde ilk örneğe ait girdi ve çıktıları gözlemleyelim
print('İlk örneğin öznitelikleri:', X[0])
print('İlk örneğin etiketi:', y[0])

# Değerler: ebclar: 0, flute: 1, vibraphone: 2, violin: 3
print('Tüm etiket bilgileri:', y)
```

```text title='Öznitelikler ve etiketlerin formatlanması çıktısı'
İlk örneğin öznitelikleri: [-0.89044625 -0.13709963 -1.16405286 -1.11405441 -0.27708955 -0.24315723
 -0.32869924 -0.29145824  0.34627508 -0.27817516  0.2266906  -0.71112873
  0.14387051 -1.53441394 -1.16728741 -1.52893143 -0.46152501 -0.54677574
 -0.85802104 -0.57940291 -1.15038369  0.7190526   0.10523263  0.31479254
 -0.80355581  0.33067124  0.          0.43368505 -0.10325158  0.60938321
  0.         -1.02922941  0.16956578 -0.98226945 -1.19781227 -0.20586919
 -0.20375006 -0.2526325  -0.24389984  0.25338217 -0.48812569  1.09384935
  0.09107977 -0.07216878 -0.10154773 -0.64453122 -0.55969605 -0.83005669
  0.48995881  1.47423731  0.97808436 -1.67019698  1.59312583  0.19122359
 -0.38674263 -0.30168394 -0.16808687 -0.1208459  -0.24159756 -0.66950925
  2.22105267  0.95025129  1.07622279 -0.57745474 -1.20803622 -0.49410468
 -0.55473094 -0.72327379 -0.59340292 -0.61207154 -0.56836182 -0.9070352
  0.03567326 -0.39086404 -1.02426223 -1.22917164 -0.55429106 -0.71471612]
İlk örneğin etiketi: 0
Tüm etiket bilgileri: [0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1
 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 3 3
 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 2 2 2
 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2]
```

## Verinin eğitim ve test alt kümelerine bölünmesi

Veri setimizin bir kısmını sınıflandırıcıyı eğitirken, başka bir kısmını da eğittiğimiz sınıflandırıcıyı test etmek için kullanacağız.

![Verinin alt kümelere bölünmesi](/img/otomatik-enstruman-tanima/verinin-altkumelere-bolunmesi.svg)

```python title='sklearn kütüphanesi train_test_split fonksiyonu ile veri setinin bölünmesi'
from sklearn.model_selection import train_test_split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.33, random_state=42)

print('Eğitim kümesindeki öznitelikler matrisi boyutu:', X_train.shape,
      '\nEğitim kümesindeki etiket matrisi boyutu:', y_train.shape)
print('Test kümesindeki öznitelikler matrisi boyutu:', X_test.shape,
      '\nTest kümesindeki etiket matrisi boyutu:', y_test.shape)
```

```text title='sklearn kütüphanesi train_test_split fonksiyonu ile veri setinin bölünmesi çıktısı'
Eğitim kümesindeki öznitelikler matrisi boyutu: (96, 78)
Eğitim kümesindeki etiket matrisi boyutu: (96,)
Test kümesindeki öznitelikler matrisi boyutu: (48, 78)
Test kümesindeki etiket matrisi boyutu: (48,)
```

## Makine öğrenmesi metodunun tanımlanması ve eğitilmesi

Şimdi bir makine öğrenmesi modeli eğitebiliriz. Bir destek vektör makinesi sınıflandırıcısı tanımlayıp eğitelim.

```python title='sklearn ile destek vektör makinesi sınıflandırıcı eğitimi'
from sklearn import svm
# tanımlama adımı
clf = svm.SVC(gamma=1 / (X_train.shape[-1] * X_train.var()), random_state=0)
# eğitim adımı
clf.fit(X_train, y_train)
```

```text title='sklearn ile destek vektör makinesi sınıflandırıcı eğitimi çıktısı'
SVC(C=1.0, break_ties=False, cache_size=200, class_weight=None, coef0=0.0,
    decision_function_shape='ovr', degree=3, gamma=0.013433328131426465,
    kernel='rbf', max_iter=-1, probability=False, random_state=0,
    shrinking=True, tol=0.001, verbose=False)
```

### Eğitilen modelin test edilmesi

Modelimiz eğitildiğine göre test verileri üzerinden testimizi yapabiliriz. Bunun için test kümesinin özniteliklerini sınıflandırıcıya vererek etiketi tahmin etmesini isteyeceğiz. Ardından tahmin edilen bu değerler ile gerçek etiketleri karşılaştıracağız.

```python title='Özniteliklerin tahmin edilmesi ve doğruluk hesabı'
# sınıflandırıcı aracılığyla özniteliklerden etiketlerin tahmin edilmesi
y_pred = clf.predict(X_test)

# Tahmin edilen etiketler ile gerçek etiketleri karşılaştıralım
tahmin_dogruluk_matrisi = y_test == y_pred

print(tahmin_dogruluk_matrisi)

# Verimiz dengeli olduğu için "accuracy" ölçütü sınıflandırıcımızın
# performansını temsil eden önemli ölçütlerden birisi olarak düşünülebilir.
accuracy = np.sum(tahmin_dogruluk_matrisi)/len(tahmin_dogruluk_matrisi)
print('accuracy:', accuracy)
```

```text title='Özniteliklerin tahmin edilmesi ve doğruluk hesabı çıktısı'
[ True  True  True  True  True  True  True  True  True  True  True  True
  True  True  True  True False  True  True  True  True  True  True  True
  True  True  True  True  True  True  True  True  True  True  True  True
  True  True  True  True  True  True  True  True  True  True  True  True]
accuracy: 0.9791666666666666
```

**Gözlem:** Burada gözlediğimiz değer bize sistem performansı açısından önemli bir bilgi verse de bu değeri etkileyen farkında olmadığımız faktörler olabilir. Testimizin zayıf olduğu noktaları dikkatlice düşünmeli ve sonuçla beraber bunları raporlamalıyız. Örneğin veri kümemizdeki örnek sayısı gerçek dünyayı temsil edemeyecek kadar az. Bu sebeple gerçek bir uygulamada bu sınıflandırıcının başarısının yukarıda raporlanan düzeydekinden farklı olacağını bilmeliyiz. **Ayrıca testlerimizde yanlılık oluşturacak önemli bir faktör var!!:** Örneklerimizi oluştururken dosyalardan parçalar aldık. Rastgele parçaları kararak yaptığımız testlerde eğitim kümesindeki ve test kümesindeki parçalar birbirlerinden farklı olmakla beraber aynı dosyalardan gelebiliyorlardı. Oysa ki test kümesi ile eğitim kümesi arasında bu tür bağların olmaması gerekir. **Sizin fark ettiğiniz başka sorunlar var mı?**

**!!! İlk testte 0.9 üzeri bir sonuç elde ettiyseniz özellikle şüphelenin:**
Kodunuzu kontrol edin. Test kümenizdeki verilerin gerçek uygulama koşullarında elde edilecek verileri temsil edip etmediğini sorgulayın. Test ve eğitim kümeleri arasında olası bağları sorgulayın.

Son adım olarak karıştırma matrisini (**confusion matrix**) çizdirip inceleyelim.

```python title='Confusion matrix oluşturulması'
from sklearn.metrics import confusion_matrix
import seaborn as sns

siniflar = np.unique(yeni_tablo.enstruman)
conf_mat = pd.DataFrame(confusion_matrix(y_test, y_pred),
                        columns=siniflar, index=siniflar)
conf_mat.index.name = 'Gerçek etiket'
conf_mat.columns.name = 'Tahmin edilen'
plt.figure(figsize=(7, 3))
sns.set(font_scale=1.2)
sns.heatmap(conf_mat, cmap='Blues', annot_kws={'size': 12}, annot=True)
```

![Confusion Matrix](/img/otomatik-enstruman-tanima/confusion-matrix.png)

## Eğittiğimiz sistemin verili bir ses dosyası üzerinde etiketleme işlemi için kullanılması

Eğitim ve test işlemlerini yaparak bir sınıflandırıcı hazırladık. Şimdi ise tasarlanmış bir sınıflandırıcının kullanım demosunu yapmak için veri kümemizdeki tüm örnekleri bu sınıflandırıcıdan geçireceğiz.

```python title='Sınıflandırıcının veri kümemiz üzerinde kullanılması'
# Etiket değer-isim tablosu
siniflar = {0: 'ebclar', 1: 'flute', 2: 'vibraphone', 3: 'violin'}


def enstruman_tani(dosya, skaler_oznitelik_isimleri, normalizasyon_araci, siniflar, siniflandirici):
    '''
    Verili bir ses dosyasının hangi enstrümanın kaydı olduğunu tahmin eder ve
    çıktı olarak enstrüman ismini verir
    '''
    # Dosyanın özniteliklerinin hesaplanması
    oznitelikler, oznitelik_pencereler = es.MusicExtractor(
        lowlevelSilentFrames='drop', lowlevelFrameSize=2048,
        lowlevelHopSize=1024, lowlevelStats=['mean', 'stdev'])(dosya)
    # Özniteliklerin bir alt-kümesini kullanmıştık, onları seçelim
    secilmis_oznitelikler = [oznitelikler['lowlevel.'+oznitelik_ismi]
                             for oznitelik_ismi in skaler_oznitelik_isimleri]
    # Öznitelik değerlerine normalizasyon adımında tanımlanmış oranları uygulayalım
    oranlanmis_oznitelikler = normalizasyon_araci.transform(
        np.array(secilmis_oznitelikler).reshape(1, -1))

    # Sınıflandırıcı etiketi tahmin etsin
    y_pred = siniflandirici.predict(oranlanmis_oznitelikler)

    return siniflar[y_pred[0]]


# Her bir dosyanın otomatik sınıflandırılma işlemleri
for dosya in bolut_dosyalari:
    enstruman_tahmini = enstruman_tani(
        dosya, skaler_secilmis_oznitelikler, normalizasyon_araci, siniflar, clf)

    # Çıktıyı dosya ismiyle beraber yazdıralım
    print(dosya, ' dosyası sınıflandırma sonucu: ', enstruman_tahmini)
```

```text title='Sınıflandırıcının veri kümemiz üzerinde kullanılması çıktısı'
instrument/segments/flute_0.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_1.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_2.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_3.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_4.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_5.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_6.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_7.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_8.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_9.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_10.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_11.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_12.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_13.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_14.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_15.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_16.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_17.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_18.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_19.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_20.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_21.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_22.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_23.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_24.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_25.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_26.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_27.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_28.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_29.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_30.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_31.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_32.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_33.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_34.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/flute_35.wav  dosyası sınıflandırma sonucu:  flute
instrument/segments/Violin_0.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_1.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_2.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_3.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_4.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_5.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_6.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_7.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_8.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_9.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_10.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_11.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_12.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_13.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_14.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_15.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_16.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_17.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_18.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_19.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_20.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_21.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_22.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_23.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_24.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_25.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_26.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_27.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_28.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_29.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_30.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_31.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_32.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_33.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_34.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_35.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_36.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_37.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_38.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_39.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_40.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_41.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_42.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_43.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_44.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_45.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_46.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_47.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_48.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_49.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_50.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_51.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_52.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_53.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_54.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_55.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_56.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_57.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_58.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_59.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_60.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_61.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_62.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_63.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_64.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_65.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_66.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_67.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_68.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_69.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_70.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_71.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_72.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_73.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_74.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/Violin_75.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/EbClar_0.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_1.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_2.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_3.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_4.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_5.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_6.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_7.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_8.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_9.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_10.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_11.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_12.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_13.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_14.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_15.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_16.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_17.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_18.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_19.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_20.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_21.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_22.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_23.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_24.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_25.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_26.wav  dosyası sınıflandırma sonucu:  violin
instrument/segments/EbClar_27.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_28.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_29.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_30.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_31.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_32.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_33.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_34.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_35.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_36.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_37.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/EbClar_38.wav  dosyası sınıflandırma sonucu:  ebclar
instrument/segments/Vibraphone_0.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_1.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_2.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_3.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_4.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_5.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_6.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_7.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_8.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_9.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_10.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_11.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_12.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_13.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_14.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_15.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_16.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_17.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_18.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_19.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_20.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_21.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_22.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_23.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_24.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_25.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_26.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_27.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_28.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_29.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_30.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_31.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_32.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_33.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_34.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_35.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_36.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_37.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_38.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_39.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_40.wav  dosyası sınıflandırma sonucu:  vibraphone
instrument/segments/Vibraphone_41.wav  dosyası sınıflandırma sonucu:  vibraphone
```

## Birden fazla sınıflandırıcının karşılaştırılması

Makine öğrenmesi problemlerini çalışırken hangi sınıflandırıcının probleme daha uygun olduğuna karar vermemiz gerekir. Çoğunlukla uygulanan yöntem, bir dizi sınıflandırıcıyı test etmek ve başarıları üzerinden sınıflandırıcıları karşılaştırmaktır. Şimdi birden fazla sınıflandırıcının bu problem üzerinde performansının karşılaştıracağız.

Birden fazla sınıflandırıcı karşılaştırmalı olarak test edildiğinde ya da bir sınıflandırıcının sonuçları farklı tasarım parametreleriyle incelendiğinde verilerin nasıl eğitim ve test kümelerine bölünmesi gerektiği üzerine dikkatlice düşünülmesi gereken bir noktadır. **Genel prensip olarak** test verisi hiçbir karar alma sürecinde kullanılmamalıdır. Çünkü test verisi sistemin karşılaşmadığı gerçek uygulama verilerini temsil eder. Ne bir modelin tasarım pamatrelerine karar verirken, ne de çeşitli makine öğrenmesi modelleri arasında seçim yaparken test verisini kullanmamalıyız. Bu durumda, eğitim kümemizde ikinci bir bölme işlemi yapmaya ihtiyaç duyarız (veri kümesinin train-validation-test olarak ayrılma ihtiyacı konusunda [ilgili Wikipedia sayfasını](https://en.wikipedia.org/wiki/Training,_validation,_and_test_sets) okuyabilirsiniz). Bu bölme işlemi için tek seferde rastgele yapılacak bir bölünmede yapılacak seçimler her rastgele bölünmede farklı sonuç vereceği için tek eğitim-test yerine çok sayıda eğitim-test deneyi tasarlamakta fayda vardır. "Cros validation" ismi verilen bu süreci iyi anlamak ve doğru uygulamak deneylerimizin güvenilirliği açısından büyük önem arz etmektedir.

| ![Cross Validation](/img/otomatik-enstruman-tanima/cross-validation.png) |
| :----------------------------------------------------------------------: |
|                       _"Cross Validation" süreci_                        |

```python title='Birden fazla sınıflandırıcının karşılaştırılması'
# https://scikit-learn.org/stable/auto_examples/classification/plot_classifier_comparison.html
# bu implementasyon yukarıdaki örnekten esinlenerek oluşturulmuştur
# cross validasyonda kullanacağımız sınıflandırıcıları import edelim
from sklearn.discriminant_analysis import QuadraticDiscriminantAnalysis
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier, AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.gaussian_process.kernels import RBF
from sklearn.gaussian_process import GaussianProcessClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.datasets import make_moons, make_circles, make_classification
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
import warnings
warnings.filterwarnings('ignore')  # uyarıları bastıralım

siniflandiricilar = [
    KNeighborsClassifier(3),
    SVC(kernel='linear', C=0.025, random_state=0),
    SVC(gamma=1 / (X_train.shape[-1] * X_train.var()), random_state=0),
    GaussianProcessClassifier(1.0 * RBF(1.0), random_state=0),
    MLPClassifier(alpha=1, max_iter=1000, random_state=0),
    GaussianNB()]

isimler = ['KNN', 'Linear SVM', 'RBF SVM',
           'Gaussian Process', 'Neural Net', 'Naive Bayes']

# Test skorlarını saklamak için listeler oluşturalım
skorlar = {}
for isim in isimler:
    skorlar[isim] = []

# Veri setimizi eğitim ve test için ayıralım
X_train_val, X_test, y_train_val, y_test = train_test_split(
    X, y, test_size=0.20, random_state=0)

# daha güvenilir sonuçlar için testimizi 10 kere tekrar edelim
test_sayisi = 10
for iterasyon in range(test_sayisi):
    x_train, x_val, y_train, y_val = train_test_split(
        X_train_val, y_train_val, test_size=1/test_sayisi, random_state=iterasyon)
    # verinin normalize edilmesi (eğitim verisinden öğrenilip, eğitim ve test verisine uygulanır)
    scaler = StandardScaler().fit(x_train)
    norm_x_train = scaler.transform(x_train)
    norm_x_val = scaler.transform(x_val)

    # her bir sınıflandırıcıyı test edelim
    for isim, siniflandirici in zip(isimler, siniflandiricilar):
        siniflandirici.fit(norm_x_train, y_train)
        skor = siniflandirici.score(norm_x_val, y_val)
        skorlar[isim].append(skor)

for isim, skor in skorlar.items():
    print('{0}:\taccuracy = {1:1.2f}, +-{2:1.2f},\tdeğerler: {3}'.format(
        isim, np.mean(skor), np.std(skor), np.around(skor, decimals=4)))
```

```text title='Birden fazla sınıflandırıcının karşılaştırılması çıktısı'
KNN:	accuracy = 0.99, +-0.03,	değerler: [1.     1.     1.     1.     0.9167 1.     1.     1.     1.     1.    ]
Linear SVM:	accuracy = 0.95, +-0.06,	değerler: [1.     1.     1.     0.9167 0.9167 0.9167 0.9167 0.8333 1.     1.    ]
RBF SVM:	accuracy = 0.95, +-0.06,	değerler: [1.     1.     1.     0.9167 1.     0.9167 0.8333 0.9167 0.9167 1.    ]
Gaussian Process:	accuracy = 0.96, +-0.08,	değerler: [1.     1.     1.     1.     1.     0.9167 0.9167 0.75   1.     1.    ]
Neural Net:	accuracy = 0.98, +-0.03,	değerler: [1.     1.     1.     1.     1.     0.9167 1.     0.9167 1.     1.    ]
Naive Bayes:	accuracy = 0.90, +-0.06,	değerler: [1.     0.8333 0.9167 1.     0.8333 0.9167 0.8333 0.9167 0.8333 0.9167]
```

Bu karşılaştırma sonucunda tercih ettiğiniz bir sınıflandırıcı var ise test verisi üzerindeki performansını raporlayabilirsiniz.

```python title='Seçilen bir modelin performansının raporlanması'
from sklearn.metrics import classification_report

scaler = StandardScaler().fit(X_train_val)
norm_x_train_val = scaler.transform(X_train_val)
norm_x_test = scaler.transform(X_test)
selected_model = SVC(kernel='linear', C=0.025, random_state=0)
selected_model.fit(norm_x_train_val, y_train_val)
y_pred = selected_model.predict(norm_x_test)
print('Test verisi sayısı:', len(y_pred))
print(classification_report(y_test, y_pred))
```

```text title='Seçilen bir modelin performansının raporlanması çıktısı'
Test verisi sayısı: 29
              precision    recall  f1-score   support

           0       1.00      0.86      0.92         7
           1       0.89      1.00      0.94         8
           2       1.00      1.00      1.00         9
           3       1.00      1.00      1.00         5

    accuracy                           0.97        29
   macro avg       0.97      0.96      0.97        29
weighted avg       0.97      0.97      0.97        29
```

İsterseniz Sklearn kütüphanesindeki [çapraz doğrulama araçlarını](https://scikit-learn.org/stable/modules/cross_validation.html) da kullanabilirsiniz.

```python title='Çapraz doğrulama ("Cross validation") uygulaması'
from sklearn.metrics import classification_report

scaler = StandardScaler().fit(X_train_val)
norm_x_train_val = scaler.transform(X_train_val)
norm_x_test = scaler.transform(X_test)
selected_model = SVC(kernel='linear', C=0.025, random_state=0)
selected_model.fit(norm_x_train_val, y_train_val)
y_pred = selected_model.predict(norm_x_test)
print('Test verisi sayısı: ', len(y_pred))
print(classification_report(y_test, y_pred))
```

```text title='Çapraz doğrulama ("Cross validation") uygulaması çıktısı'
KNN 	, skorlar:  [1.         0.95652174 1.         1.         1.        ]
Linear SVM 	, skorlar:  [0.95652174 1.         1.         1.         1.        ]
RBF SVM 	, skorlar:  [1.         1.         1.         0.91304348 1.        ]
Gaussian Process 	, skorlar:  [1.         1.         1.         0.7826087  0.65217391]
Neural Net 	, skorlar:  [0.95652174 1.         1.         1.         1.        ]
Naive Bayes 	, skorlar:  [0.91304348 0.86956522 1.         0.86956522 0.95652174]
```

Bu karşılaştırmayı tamamladıktan sonra modeller arasından birisini seçip şimdi test kümemiz üzerinde performansını raporlayabiliriz.

```python title='Linear SVM modelinin test kümemiz üzerindeki performansının raporlanması'
from sklearn.metrics import classification_report
scaler = StandardScaler().fit(X_train_val)
norm_x_train_val = scaler.transform(X_train_val)
norm_x_test = scaler.transform(X_test)
# Linear SVM modelini seçtik
selected_model = SVC(kernel='linear', C=0.025, random_state=0)
selected_model.fit(norm_x_train_val, y_train_val)
y_pred = selected_model.predict(norm_x_test)

siniflar = ['ebclar', 'flute', 'vibraphone', 'violin']
conf_mat = pd.DataFrame(confusion_matrix(y_test, y_pred),
                        columns=siniflar, index=siniflar)
conf_mat.index.name = 'Gerçek etiket'
conf_mat.columns.name = 'Tahmin edilen'
plt.figure(figsize=(7, 5))
sns.set(font_scale=1.2)
sns.heatmap(conf_mat, cmap='Blues', annot_kws={'size': 12}, annot=True)

print('Test kümesi örnek sayısı:', len(y_pred))
print(classification_report(y_test, y_pred, target_names=siniflar))
```

```text title='Linear SVM modelinin test kümemiz üzerindeki performansının raporlanması çıktısı'
Test kümesi örnek sayısı: 29
              precision    recall  f1-score   support

      ebclar       1.00      0.86      0.92         7
       flute       0.89      1.00      0.94         8
  vibraphone       1.00      1.00      1.00         9
      violin       1.00      1.00      1.00         5

    accuracy                           0.97        29
   macro avg       0.97      0.96      0.97        29
weighted avg       0.97      0.97      0.97        29
```

| ![Linear SVM Karıştırma Matrisi](/img/otomatik-enstruman-tanima/linear-svm-confusion-matrix.png) |
| :----------------------------------------------------------------------------------------------: |
|                _Linear SVM modelinin test kümemiz üzerindeki karıştırma matrisi_                 |

## Peki derin öğrenme modellerini kullanabilir miyiz?

Derin öğrenme modellerinin performansı veri sayısının fazla olduğu durumlarda konvansiyonel modelleri aşmaktadır.
Elimizdeki veri boyutu küçük olduğu için derin öğrenme modellerinin daha yüksek başarı göstermesini beklemiyoruz. Yine de altta bir örnek sunuyoruz.

```python title='Derin öğrenme modeli için verinin eğitim ve test için bölünmesi ve normalizasyonu'
# Yine verimizi eğitim ve test altkümelerine bölerek başlayalım
X_train_val, X_test, y_train_val, y_test = train_test_split(
    X, y, test_size=0.20, random_state=1)
# ..ve normalizasyon uygulayalım
scaler = StandardScaler().fit(X_train_val)
norm_x_train_val = scaler.transform(X_train_val)
norm_x_test = scaler.transform(X_test)
```

Sinir ağımız çıkış katmanında 4 (kategori sayısı kadar) nöron içerecek ve her nöron'un çıkışı ilgili örneğin o kategoriye ait olma olasılığını verecek. Bu, çıktının 0-1 arası değerler taşıyan 4 boyutlu bir vektör olduğu anlamına gelir. Eğitime başlayabilmek için elimizdeki etiket verilerini de bu temsile çevirmeliyiz.
Örneğin: `'violin'` sınıfına ait bir örnek 3 etiketi ile temsil ediliyor. Bunu yukarıda bahsedilen 4 boyutlu vektör şekilinde temsil ettiğimizde [0 0 0 1] vektörünü elde ederiz. Benzer şekilde bir `'ebclar'` örneği için etiket 0 ve 4 boyutlu vektör temsili [1 0 0 0] olacaktır. Bu çeşit temsile **one-hot encoding** ismi verilmektedir. Bazen Türkçe makalelerde bu terim için "bir-sıcak temsil" gibi anlaşılması zor karşılıklar da kullanılmaktadır.

```python title='Eğitim ve test verilerinin "one-hot encoding" temsiline dönüştürülmesi'
from sklearn.preprocessing import OneHotEncoder

onehot_encoder = OneHotEncoder(sparse=False)
y_train_val_onehot = onehot_encoder.fit_transform(
    y_train_val.reshape(len(y_train_val), 1))
y_test_onehot = onehot_encoder.fit_transform(y_test.reshape(len(y_test), 1))
print('One-hot encoding, y_train_val boyutu = ', y_train_val_onehot.shape)
print('One-hot encoding, y_test boyutu = ', y_test_onehot.shape)
```

```text title='Eğitim ve test verilerinin "one-hot encoding" temsiline dönüştürülmesi çıktısı'
One-hot encoding, y_train_val boyutu = (115, 4)
One-hot encoding, y_test boyutu = (29, 4)
```

Yapay sinir ağ modelimizi Keras kütüphanesini kullanarak tanımlayalım ve model özetini inceleyelim.

```python title='Yapay sinir ağı modelinin tanımlanması'
from keras.models import Sequential
from keras import layers


def model_olustur(oznitelik_sayisi):
    model = Sequential()

    # Giriş katmanı
    model.add(layers.BatchNormalization(
        name='InputLayer', input_shape=(oznitelik_sayisi,)))

    # 1. saklı katman
    model.add(layers.Dense(name='HiddenLayer_1', units=32))
    model.add(layers.BatchNormalization())
    model.add(layers.Activation('relu'))
    model.add(layers.Dropout(0.3))

    # 2. saklı katman
    model.add(layers.Dense(name='HiddenLayer_2', units=16))
    model.add(layers.BatchNormalization())
    model.add(layers.Activation('relu'))
    model.add(layers.Dropout(0.3))

    # Çıkış katmanı
    model.add(layers.Dense(name='Output_layer', units=4))
    model.add(layers.Activation('sigmoid'))

    return model


model = model_olustur(X_train_val.shape[1])
# model özetini inceleyelim
model.summary()
```

```text title='Yapay sinir ağı modelinin tanımlanması çıktısı'
Model: "sequential"
_________________________________________________________________
Layer (type)                 Output Shape              Param #
=================================================================
InputLayer (BatchNormalizati (None, 78)                312
_________________________________________________________________
HiddenLayer_1 (Dense)        (None, 32)                2528
_________________________________________________________________
batch_normalization (BatchNo (None, 32)                128
_________________________________________________________________
activation (Activation)      (None, 32)                0
_________________________________________________________________
dropout (Dropout)            (None, 32)                0
_________________________________________________________________
HiddenLayer_2 (Dense)        (None, 16)                528
_________________________________________________________________
batch_normalization_1 (Batch (None, 16)                64
_________________________________________________________________
activation_1 (Activation)    (None, 16)                0
_________________________________________________________________
dropout_1 (Dropout)          (None, 16)                0
_________________________________________________________________
Output_layer (Dense)         (None, 4)                 68
_________________________________________________________________
activation_2 (Activation)    (None, 4)                 0
=================================================================
Total params: 3,628
Trainable params: 3,376
Non-trainable params: 252
_________________________________________________________________
```

Eğitim için bir optimizasyon algoritması seçip modeli derleyelim ve eğitimi başlatalım.

```python title='Yapay sinir ağı modelinin "Adam" optimizasyon algoritması ile eğitilmesi'
model.compile(optimizer='Adam', loss='categorical_crossentropy',
              metrics=['accuracy'])
summary = model.fit(X_train_val, y_train_val_onehot,
                    batch_size=32, epochs=100, validation_split=0.3, verbose=1,)
```

```text title='Yapay sinir ağı modelinin "Adam" optimizasyon algoritması ile eğitilmesi çıktısı'
Epoch 1/100
3/3 [==============================] - 1s 127ms/step - loss: 1.6876 - accuracy: 0.2961 - val_loss: 1.4621 - val_accuracy: 0.2000
Epoch 2/100
3/3 [==============================] - 0s 24ms/step - loss: 1.7898 - accuracy: 0.3102 - val_loss: 1.4097 - val_accuracy: 0.2286
Epoch 3/100
3/3 [==============================] - 0s 25ms/step - loss: 1.5505 - accuracy: 0.2773 - val_loss: 1.3609 - val_accuracy: 0.2286
Epoch 4/100
3/3 [==============================] - 0s 24ms/step - loss: 1.5815 - accuracy: 0.3211 - val_loss: 1.3161 - val_accuracy: 0.2857
Epoch 5/100
3/3 [==============================] - 0s 24ms/step - loss: 1.4101 - accuracy: 0.3055 - val_loss: 1.2769 - val_accuracy: 0.4000
Epoch 6/100
3/3 [==============================] - 0s 25ms/step - loss: 1.3390 - accuracy: 0.4172 - val_loss: 1.2413 - val_accuracy: 0.4000
Epoch 7/100
3/3 [==============================] - 0s 28ms/step - loss: 1.2468 - accuracy: 0.4961 - val_loss: 1.2101 - val_accuracy: 0.4286
Epoch 8/100
3/3 [==============================] - 0s 26ms/step - loss: 1.2327 - accuracy: 0.4539 - val_loss: 1.1793 - val_accuracy: 0.5143
Epoch 9/100
3/3 [==============================] - 0s 29ms/step - loss: 1.1126 - accuracy: 0.5578 - val_loss: 1.1495 - val_accuracy: 0.5143
Epoch 10/100
3/3 [==============================] - 0s 29ms/step - loss: 1.1211 - accuracy: 0.5156 - val_loss: 1.1211 - val_accuracy: 0.5143
Epoch 11/100
3/3 [==============================] - 0s 28ms/step - loss: 1.1618 - accuracy: 0.4750 - val_loss: 1.0938 - val_accuracy: 0.6000
Epoch 12/100
3/3 [==============================] - 0s 26ms/step - loss: 1.2026 - accuracy: 0.4258 - val_loss: 1.0692 - val_accuracy: 0.6286
Epoch 13/100
3/3 [==============================] - 0s 29ms/step - loss: 1.1141 - accuracy: 0.5563 - val_loss: 1.0467 - val_accuracy: 0.6286
Epoch 14/100
3/3 [==============================] - 0s 30ms/step - loss: 0.9653 - accuracy: 0.6406 - val_loss: 1.0254 - val_accuracy: 0.6286
Epoch 15/100
3/3 [==============================] - 0s 27ms/step - loss: 1.0950 - accuracy: 0.5266 - val_loss: 1.0047 - val_accuracy: 0.6571
Epoch 16/100
3/3 [==============================] - 0s 28ms/step - loss: 1.0580 - accuracy: 0.6266 - val_loss: 0.9844 - val_accuracy: 0.6571
Epoch 17/100
3/3 [==============================] - 0s 25ms/step - loss: 1.0012 - accuracy: 0.5906 - val_loss: 0.9665 - val_accuracy: 0.6571
Epoch 18/100
3/3 [==============================] - 0s 24ms/step - loss: 0.9688 - accuracy: 0.5883 - val_loss: 0.9489 - val_accuracy: 0.6857
Epoch 19/100
3/3 [==============================] - 0s 25ms/step - loss: 0.9237 - accuracy: 0.6687 - val_loss: 0.9322 - val_accuracy: 0.7143
Epoch 20/100
3/3 [==============================] - 0s 29ms/step - loss: 0.8399 - accuracy: 0.7562 - val_loss: 0.9170 - val_accuracy: 0.7143
Epoch 21/100
3/3 [==============================] - 0s 24ms/step - loss: 0.9784 - accuracy: 0.5992 - val_loss: 0.9015 - val_accuracy: 0.7143
Epoch 22/100
3/3 [==============================] - 0s 24ms/step - loss: 0.8376 - accuracy: 0.7258 - val_loss: 0.8874 - val_accuracy: 0.7143
Epoch 23/100
3/3 [==============================] - 0s 26ms/step - loss: 0.8922 - accuracy: 0.6242 - val_loss: 0.8722 - val_accuracy: 0.7143
Epoch 24/100
3/3 [==============================] - 0s 26ms/step - loss: 0.8306 - accuracy: 0.7148 - val_loss: 0.8585 - val_accuracy: 0.7429
Epoch 25/100
3/3 [==============================] - 0s 25ms/step - loss: 0.8236 - accuracy: 0.6289 - val_loss: 0.8446 - val_accuracy: 0.7429
Epoch 26/100
3/3 [==============================] - 0s 25ms/step - loss: 0.7876 - accuracy: 0.7508 - val_loss: 0.8311 - val_accuracy: 0.7429
Epoch 27/100
3/3 [==============================] - 0s 26ms/step - loss: 0.7546 - accuracy: 0.7445 - val_loss: 0.8190 - val_accuracy: 0.7714
Epoch 28/100
3/3 [==============================] - 0s 24ms/step - loss: 0.8030 - accuracy: 0.7180 - val_loss: 0.8054 - val_accuracy: 0.7714
Epoch 29/100
3/3 [==============================] - 0s 23ms/step - loss: 0.8525 - accuracy: 0.6273 - val_loss: 0.7946 - val_accuracy: 0.8000
Epoch 30/100
3/3 [==============================] - 0s 27ms/step - loss: 0.7836 - accuracy: 0.7641 - val_loss: 0.7841 - val_accuracy: 0.8000
Epoch 31/100
3/3 [==============================] - 0s 25ms/step - loss: 0.7403 - accuracy: 0.7977 - val_loss: 0.7732 - val_accuracy: 0.8000
Epoch 32/100
3/3 [==============================] - 0s 28ms/step - loss: 0.7395 - accuracy: 0.6703 - val_loss: 0.7626 - val_accuracy: 0.8000
Epoch 33/100
3/3 [==============================] - 0s 27ms/step - loss: 0.7463 - accuracy: 0.8102 - val_loss: 0.7529 - val_accuracy: 0.8000
Epoch 34/100
3/3 [==============================] - 0s 27ms/step - loss: 0.7682 - accuracy: 0.8086 - val_loss: 0.7427 - val_accuracy: 0.8000
Epoch 35/100
3/3 [==============================] - 0s 27ms/step - loss: 0.7448 - accuracy: 0.7625 - val_loss: 0.7318 - val_accuracy: 0.8000
Epoch 36/100
3/3 [==============================] - 0s 28ms/step - loss: 0.6622 - accuracy: 0.7586 - val_loss: 0.7213 - val_accuracy: 0.8000
Epoch 37/100
3/3 [==============================] - 0s 27ms/step - loss: 0.6374 - accuracy: 0.8039 - val_loss: 0.7114 - val_accuracy: 0.8000
Epoch 38/100
3/3 [==============================] - 0s 28ms/step - loss: 0.6998 - accuracy: 0.7766 - val_loss: 0.6993 - val_accuracy: 0.8286
Epoch 39/100
3/3 [==============================] - 0s 31ms/step - loss: 0.6638 - accuracy: 0.7844 - val_loss: 0.6891 - val_accuracy: 0.8286
Epoch 40/100
3/3 [==============================] - 0s 28ms/step - loss: 0.6792 - accuracy: 0.7969 - val_loss: 0.6792 - val_accuracy: 0.8571
Epoch 41/100
3/3 [==============================] - 0s 26ms/step - loss: 0.6399 - accuracy: 0.8148 - val_loss: 0.6695 - val_accuracy: 0.8571
Epoch 42/100
3/3 [==============================] - 0s 25ms/step - loss: 0.6516 - accuracy: 0.8344 - val_loss: 0.6606 - val_accuracy: 0.8571
Epoch 43/100
3/3 [==============================] - 0s 25ms/step - loss: 0.6333 - accuracy: 0.7781 - val_loss: 0.6522 - val_accuracy: 0.8571
Epoch 44/100
3/3 [==============================] - 0s 25ms/step - loss: 0.5753 - accuracy: 0.8812 - val_loss: 0.6421 - val_accuracy: 0.8571
Epoch 45/100
3/3 [==============================] - 0s 25ms/step - loss: 0.6145 - accuracy: 0.8391 - val_loss: 0.6338 - val_accuracy: 0.8571
Epoch 46/100
3/3 [==============================] - 0s 25ms/step - loss: 0.5392 - accuracy: 0.8578 - val_loss: 0.6261 - val_accuracy: 0.8857
Epoch 47/100
3/3 [==============================] - 0s 27ms/step - loss: 0.6319 - accuracy: 0.7484 - val_loss: 0.6196 - val_accuracy: 0.8857
Epoch 48/100
3/3 [==============================] - 0s 27ms/step - loss: 0.6770 - accuracy: 0.7562 - val_loss: 0.6143 - val_accuracy: 0.8857
Epoch 49/100
3/3 [==============================] - 0s 25ms/step - loss: 0.4999 - accuracy: 0.8453 - val_loss: 0.6070 - val_accuracy: 0.8857
Epoch 50/100
3/3 [==============================] - 0s 26ms/step - loss: 0.5646 - accuracy: 0.8477 - val_loss: 0.5999 - val_accuracy: 0.9143
Epoch 51/100
3/3 [==============================] - 0s 26ms/step - loss: 0.6104 - accuracy: 0.8625 - val_loss: 0.5920 - val_accuracy: 0.9143
Epoch 52/100
3/3 [==============================] - 0s 29ms/step - loss: 0.6714 - accuracy: 0.7570 - val_loss: 0.5852 - val_accuracy: 0.9143
Epoch 53/100
3/3 [==============================] - 0s 26ms/step - loss: 0.5031 - accuracy: 0.8508 - val_loss: 0.5773 - val_accuracy: 0.9143
Epoch 54/100
3/3 [==============================] - 0s 26ms/step - loss: 0.5776 - accuracy: 0.8906 - val_loss: 0.5706 - val_accuracy: 0.9143
Epoch 55/100
3/3 [==============================] - 0s 24ms/step - loss: 0.5988 - accuracy: 0.8281 - val_loss: 0.5642 - val_accuracy: 0.9143
Epoch 56/100
3/3 [==============================] - 0s 30ms/step - loss: 0.5646 - accuracy: 0.8352 - val_loss: 0.5581 - val_accuracy: 0.9429
Epoch 57/100
3/3 [==============================] - 0s 27ms/step - loss: 0.4730 - accuracy: 0.8625 - val_loss: 0.5540 - val_accuracy: 0.9429
Epoch 58/100
3/3 [==============================] - 0s 26ms/step - loss: 0.4698 - accuracy: 0.8789 - val_loss: 0.5492 - val_accuracy: 0.9429
Epoch 59/100
3/3 [==============================] - 0s 29ms/step - loss: 0.5224 - accuracy: 0.8297 - val_loss: 0.5427 - val_accuracy: 0.9429
Epoch 60/100
3/3 [==============================] - 0s 29ms/step - loss: 0.4551 - accuracy: 0.9180 - val_loss: 0.5370 - val_accuracy: 0.9429
Epoch 61/100
3/3 [==============================] - 0s 31ms/step - loss: 0.4872 - accuracy: 0.9328 - val_loss: 0.5297 - val_accuracy: 0.9429
Epoch 62/100
3/3 [==============================] - 0s 26ms/step - loss: 0.4983 - accuracy: 0.8969 - val_loss: 0.5205 - val_accuracy: 0.9429
Epoch 63/100
3/3 [==============================] - 0s 31ms/step - loss: 0.4927 - accuracy: 0.9148 - val_loss: 0.5127 - val_accuracy: 0.9429
Epoch 64/100
3/3 [==============================] - 0s 29ms/step - loss: 0.3995 - accuracy: 0.9375 - val_loss: 0.5048 - val_accuracy: 0.9429
Epoch 65/100
3/3 [==============================] - 0s 28ms/step - loss: 0.4098 - accuracy: 0.9133 - val_loss: 0.4982 - val_accuracy: 0.9429
Epoch 66/100
3/3 [==============================] - 0s 28ms/step - loss: 0.4471 - accuracy: 0.8875 - val_loss: 0.4923 - val_accuracy: 0.9429
Epoch 67/100
3/3 [==============================] - 0s 27ms/step - loss: 0.5123 - accuracy: 0.8305 - val_loss: 0.4864 - val_accuracy: 0.9429
Epoch 68/100
3/3 [==============================] - 0s 25ms/step - loss: 0.5191 - accuracy: 0.8695 - val_loss: 0.4808 - val_accuracy: 0.9429
Epoch 69/100
3/3 [==============================] - 0s 25ms/step - loss: 0.5009 - accuracy: 0.8688 - val_loss: 0.4766 - val_accuracy: 0.9429
Epoch 70/100
3/3 [==============================] - 0s 26ms/step - loss: 0.3402 - accuracy: 0.9797 - val_loss: 0.4722 - val_accuracy: 0.9429
Epoch 71/100
3/3 [==============================] - 0s 27ms/step - loss: 0.4346 - accuracy: 0.8992 - val_loss: 0.4656 - val_accuracy: 0.9429
Epoch 72/100
3/3 [==============================] - 0s 27ms/step - loss: 0.4642 - accuracy: 0.8609 - val_loss: 0.4601 - val_accuracy: 0.9429
Epoch 73/100
3/3 [==============================] - 0s 28ms/step - loss: 0.4300 - accuracy: 0.8352 - val_loss: 0.4561 - val_accuracy: 0.9429
Epoch 74/100
3/3 [==============================] - 0s 31ms/step - loss: 0.4520 - accuracy: 0.8516 - val_loss: 0.4530 - val_accuracy: 0.9429
Epoch 75/100
3/3 [==============================] - 0s 31ms/step - loss: 0.4184 - accuracy: 0.8977 - val_loss: 0.4516 - val_accuracy: 0.9429
Epoch 76/100
3/3 [==============================] - 0s 26ms/step - loss: 0.4569 - accuracy: 0.8609 - val_loss: 0.4508 - val_accuracy: 0.9429
Epoch 77/100
3/3 [==============================] - 0s 24ms/step - loss: 0.3949 - accuracy: 0.9227 - val_loss: 0.4499 - val_accuracy: 0.9429
Epoch 78/100
3/3 [==============================] - 0s 27ms/step - loss: 0.3469 - accuracy: 0.9313 - val_loss: 0.4469 - val_accuracy: 0.9429
Epoch 79/100
3/3 [==============================] - 0s 25ms/step - loss: 0.4257 - accuracy: 0.8852 - val_loss: 0.4445 - val_accuracy: 0.9429
Epoch 80/100
3/3 [==============================] - 0s 28ms/step - loss: 0.3936 - accuracy: 0.9187 - val_loss: 0.4427 - val_accuracy: 0.9429
Epoch 81/100
3/3 [==============================] - 0s 25ms/step - loss: 0.4234 - accuracy: 0.8828 - val_loss: 0.4407 - val_accuracy: 0.9429
Epoch 82/100
3/3 [==============================] - 0s 28ms/step - loss: 0.4239 - accuracy: 0.9008 - val_loss: 0.4397 - val_accuracy: 0.9429
Epoch 83/100
3/3 [==============================] - 0s 25ms/step - loss: 0.3547 - accuracy: 0.9469 - val_loss: 0.4389 - val_accuracy: 0.9429
Epoch 84/100
3/3 [==============================] - 0s 26ms/step - loss: 0.4536 - accuracy: 0.8266 - val_loss: 0.4369 - val_accuracy: 0.9429
Epoch 85/100
3/3 [==============================] - 0s 24ms/step - loss: 0.3192 - accuracy: 0.9375 - val_loss: 0.4352 - val_accuracy: 0.9429
Epoch 86/100
3/3 [==============================] - 0s 25ms/step - loss: 0.3128 - accuracy: 0.9359 - val_loss: 0.4335 - val_accuracy: 0.9429
Epoch 87/100
3/3 [==============================] - 0s 29ms/step - loss: 0.3488 - accuracy: 0.9430 - val_loss: 0.4318 - val_accuracy: 0.9429
Epoch 88/100
3/3 [==============================] - 0s 25ms/step - loss: 0.3765 - accuracy: 0.9070 - val_loss: 0.4303 - val_accuracy: 0.9429
Epoch 89/100
3/3 [==============================] - 0s 26ms/step - loss: 0.3244 - accuracy: 0.8953 - val_loss: 0.4296 - val_accuracy: 0.9429
Epoch 90/100
3/3 [==============================] - 0s 25ms/step - loss: 0.3858 - accuracy: 0.8953 - val_loss: 0.4267 - val_accuracy: 0.9429
Epoch 91/100
3/3 [==============================] - 0s 26ms/step - loss: 0.3074 - accuracy: 0.9289 - val_loss: 0.4254 - val_accuracy: 0.9429
Epoch 92/100
3/3 [==============================] - 0s 26ms/step - loss: 0.3947 - accuracy: 0.8352 - val_loss: 0.4242 - val_accuracy: 0.9429
Epoch 93/100
3/3 [==============================] - 0s 27ms/step - loss: 0.4183 - accuracy: 0.8523 - val_loss: 0.4217 - val_accuracy: 0.9429
Epoch 94/100
3/3 [==============================] - 0s 31ms/step - loss: 0.3084 - accuracy: 0.9531 - val_loss: 0.4202 - val_accuracy: 0.9429
Epoch 95/100
3/3 [==============================] - 0s 25ms/step - loss: 0.4226 - accuracy: 0.8914 - val_loss: 0.4210 - val_accuracy: 0.9429
Epoch 96/100
3/3 [==============================] - 0s 27ms/step - loss: 0.3456 - accuracy: 0.9437 - val_loss: 0.4233 - val_accuracy: 0.9429
Epoch 97/100
3/3 [==============================] - 0s 23ms/step - loss: 0.2841 - accuracy: 0.9719 - val_loss: 0.4252 - val_accuracy: 0.9429
Epoch 98/100
3/3 [==============================] - 0s 26ms/step - loss: 0.3225 - accuracy: 0.9453 - val_loss: 0.4274 - val_accuracy: 0.9429
Epoch 99/100
3/3 [==============================] - 0s 27ms/step - loss: 0.2795 - accuracy: 0.9219 - val_loss: 0.4295 - val_accuracy: 0.9429
Epoch 100/100
3/3 [==============================] - 0s 28ms/step - loss: 0.2643 - accuracy: 0.9875 - val_loss: 0.4309 - val_accuracy: 0.9429
```

Modelimiz eğitildi. `'accuracy'` modelin eğitim verisini ne düzeyde sınıflandırabildiğini, `'val_accuracy'` ise modelin validasyon verisini ne düzeyde sınıflandırabildiğini gösteriyor. İki değer de 1'e yakın, sonuç iyi görünüyor.

Bu modelden memnun olduğumuzu varsayalım ve son olarak test verisindeki başarıyı raporlayalım.

```python title='Eğittimiz derin öğrenme modelinin test verisi üzerinde başarısının raporlanması'
score = model.evaluate(X_test, y_test_onehot, verbose=0)
print('Test loss:', score[0])
print('Test accuracy:', score[1])
```

```text title='Eğittimiz derin öğrenme modelinin test verisi üzerinde başarısının raporlanması çıktısı'
Test loss: 0.25768259167671204
Test accuracy: 0.9655172228813171
```

Eğitim/öğrenme sürecinde her bir 'epoch'ta çıktıların nasıl değiştiğinin görselleştirilmesi yaygın bir uygulamadır. Bu, eğitim için yapılan seçimler (optimizasyon algoritması, epoch sayısı, vb.) ve modelin eğitim verisini ezberleyip ezberlemediği konusunda gözlemler yapmamıza imkan tanır. Son olarak eğitim eğrilerini çizdirelim.

```python title='Modelimizin accuracy ve loss değerlerinin epochlara göre değişiminin grafikleştirilmesi'
plt.plot(summary.history['accuracy'])
plt.plot(summary.history['val_accuracy'])
plt.title('model accuracy')
plt.ylabel('accuracy')
plt.xlabel('epoch')
plt.legend(['train', 'validation'], loc='lower right')
plt.show()

plt.plot(summary.history['loss'])
plt.plot(summary.history['val_loss'])
plt.title('model loss')
plt.ylabel('loss')
plt.xlabel('epoch')
plt.legend(['train', 'validation'], loc='upper right')
plt.show()
```

| ![accuracy değerinin değişim grafiği](/img/otomatik-enstruman-tanima/model-accuracy.png) | ![loss değerinin değişim grafiği](/img/otomatik-enstruman-tanima/model-loss.png) |
| :--------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------: |
|                      _`accuracy` değerinin epochlara göre değişimi_                      |                    _`loss` değerinin epochlara göre değişimi_                    |

## Egzersiz

Bu bölümde otomatik enstrüman sınıflandırması için bir örnek gördünüz. Şimdi isterseniz başka bir veri kümesinde aynı deneyi tekrarlamayı deneyebilirsiniz. Bunun için CompMusic projesinde toplanmış verilerden
[Mridangam Stroke dataset](https://compmusic.upf.edu/mridangam-stroke-dataset)i kullanabilirsiniz. Amaç 10 farklı vuruş sınıfını veya 6 farklı tonik sınıfını en yüksek doğruluk ile sınıflandırabilen bir sistemi tasarlamak.

Bu bölümde yapılana benzer şekilde tasarımınızı gerçekleştirdikten sonra isterseniz özniteliklere boyut azaltma (dimensionality reduction) tekniklerini uygulayıp performansa etkisini gözleyebilirsiniz.
