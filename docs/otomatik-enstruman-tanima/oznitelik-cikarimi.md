---
sidebar_position: 3
---

# Öznitelik Çıkarımı

Şimdi bölütlenmiş her bir ses dosyası için öznitelikler hesaplayıp kategori/etiket/enstrüman bilgisi ile beraber tek bir veri dosyası içerisine yazabiliriz. Öznitelik çıkarımı için Essentia kütüphanesinin [MusicExtractor](https://essentia.upf.edu/documentation/reference/std_MusicExtractor.html) fonksiyonunu kullanacağız.

Öncelikle tek bir dosya için çalıştırıp verdiği çıktıyı inceleyelim:

```python title='Tek dosya için öznitelik çıkarımı'
import essentia.standard as es

dosya = bolut_dosyalari[0]  # listeden ilk dosyayı kullanalım
oznitelikler, oznitelik_pencereler = es.MusicExtractor(
    lowlevelSilentFrames='drop',
    lowlevelFrameSize=2048,
    lowlevelHopSize=1024,
    lowlevelStats=['mean', 'stdev'])(dosya)
```

Essentia-MusicExtractor çok sayıda temel özniteliği hızlı bir şekilde hesaplayıp çıktı olarak verir. Biz, kodumuzun ve gösterimlerimizin kısa ve anlaşılır olması için, bunların içerisinde tek bir skaler değerle temsil edilen düşük seviye (low-level) öznitelikleri kullanacağız ve diğer öznitelikleri dışarıda bırakacağız.

```python title='Düşük seviye skaler özelliklerin seçilmesi'
skaler_oznitelikler = [
    descriptor for descriptor in oznitelikler.descriptorNames()
    if 'lowlevel' in descriptor and isinstance(oznitelikler[descriptor], float)
]
print('Kullanılacak oznitelikler:\n' + '\n'.join(skaler_oznitelikler))
```

```text title='Düşük seviye skaler özelliklerin seçilmesi çıktısı'
Kullanılacak oznitelikler:
lowlevel.average_loudness
lowlevel.barkbands_crest.mean
lowlevel.barkbands_crest.stdev
lowlevel.barkbands_flatness_db.mean
lowlevel.barkbands_flatness_db.stdev
lowlevel.barkbands_kurtosis.mean
lowlevel.barkbands_kurtosis.stdev
lowlevel.barkbands_skewness.mean
lowlevel.barkbands_skewness.stdev
lowlevel.barkbands_spread.mean
lowlevel.barkbands_spread.stdev
lowlevel.dissonance.mean
lowlevel.dissonance.stdev
lowlevel.dynamic_complexity
lowlevel.erbbands_crest.mean
lowlevel.erbbands_crest.stdev
lowlevel.erbbands_flatness_db.mean
lowlevel.erbbands_flatness_db.stdev
lowlevel.erbbands_kurtosis.mean
lowlevel.erbbands_kurtosis.stdev
lowlevel.erbbands_skewness.mean
lowlevel.erbbands_skewness.stdev
lowlevel.erbbands_spread.mean
lowlevel.erbbands_spread.stdev
lowlevel.hfc.mean
lowlevel.hfc.stdev
lowlevel.loudness_ebu128.integrated
lowlevel.loudness_ebu128.loudness_range
lowlevel.loudness_ebu128.momentary.mean
lowlevel.loudness_ebu128.momentary.stdev
lowlevel.loudness_ebu128.short_term.mean
lowlevel.loudness_ebu128.short_term.stdev
lowlevel.melbands_crest.mean
lowlevel.melbands_crest.stdev
lowlevel.melbands_flatness_db.mean
lowlevel.melbands_flatness_db.stdev
lowlevel.melbands_kurtosis.mean
lowlevel.melbands_kurtosis.stdev
lowlevel.melbands_skewness.mean
lowlevel.melbands_skewness.stdev
lowlevel.melbands_spread.mean
lowlevel.melbands_spread.stdev
lowlevel.pitch_salience.mean
lowlevel.pitch_salience.stdev
lowlevel.silence_rate_20dB.mean
lowlevel.silence_rate_20dB.stdev
lowlevel.silence_rate_30dB.mean
lowlevel.silence_rate_30dB.stdev
lowlevel.silence_rate_60dB.mean
lowlevel.silence_rate_60dB.stdev
lowlevel.spectral_centroid.mean
lowlevel.spectral_centroid.stdev
lowlevel.spectral_complexity.mean
lowlevel.spectral_complexity.stdev
lowlevel.spectral_decrease.mean
lowlevel.spectral_decrease.stdev
lowlevel.spectral_energy.mean
lowlevel.spectral_energy.stdev
lowlevel.spectral_energyband_high.mean
lowlevel.spectral_energyband_high.stdev
lowlevel.spectral_energyband_low.mean
lowlevel.spectral_energyband_low.stdev
lowlevel.spectral_energyband_middle_high.mean
lowlevel.spectral_energyband_middle_high.stdev
lowlevel.spectral_energyband_middle_low.mean
lowlevel.spectral_energyband_middle_low.stdev
lowlevel.spectral_entropy.mean
lowlevel.spectral_entropy.stdev
lowlevel.spectral_flux.mean
lowlevel.spectral_flux.stdev
lowlevel.spectral_kurtosis.mean
lowlevel.spectral_kurtosis.stdev
lowlevel.spectral_rms.mean
lowlevel.spectral_rms.stdev
lowlevel.spectral_rolloff.mean
lowlevel.spectral_rolloff.stdev
lowlevel.spectral_skewness.mean
lowlevel.spectral_skewness.stdev
lowlevel.spectral_spread.mean
lowlevel.spectral_spread.stdev
lowlevel.spectral_strongpeak.mean
lowlevel.spectral_strongpeak.stdev
lowlevel.zerocrossingrate.mean
lowlevel.zerocrossingrate.stdev
```

Tüm dosyalar için öznitelik çıkarımı işleminin yapıp, skaler öznitelikleri alıp elde ettiğimiz tüm verileri `data.csv` isimli bir dosyaya yazalım.

Bu tercihimiz şuna dayanıyor: birçok makine öğrenmesi veri kümesi satırların örnekleri, sütunların öznitelikleri içerdiği tablolar şeklinde saklanıp paylaşılıyor. Örnekler için bakınız: [Kaggle verileri](https://www.kaggle.com/), [UC Irvine Machine Learning Repository](https://archive.ics.uci.edu/ml/index.php).

**_Çalıştığımız alanda kullanılan formatlarla uyumlu format tercih etmek, araç ve veri paylaşımını, bu sayede başka araştırmacılarla işbirliğini kolaylaştıracaktır._**

Yaygın tercih son kolonda etiket bilgisinin bulunması olduğu için biz de öyle yapacağız.

```python title='Her dosya için öznitelik çıkarımı ve data.csv dosyasına yazım işlemi'
# Her dosya için oznitelik çıkarımı ve data.csv dosyasına yazım işlemi
# data.csv dosyasında her satır bir örneği temsil edecek,
# önce öznitelikleri, en sonda da sınıf bilgisini içerecek
veri_dosyasi = os.path.join(bolutler_klasoru, 'data.csv')
dosya_sayaci = 0
with open(veri_dosyasi, 'w') as yazici:
    # İlk kolon olarak öznitelik isimlerini,
    # son kolon olarak sınıf bilgisini temsilen 'enstruman' yazalım
    yazilacak_satir = ','.join(
        skaler_oznitelikler + ['enstruman']).replace('lowlevel.', '') + '\n'
    yazici.write(yazilacak_satir)
    for dosya in bolut_dosyalari:
        if '.wav' in dosya:
            dosya_sayaci += 1
            if dosya_sayaci % 20 == 0:  # 20 dosyada bir ekrana bilgi yazdır
                print(dosya_sayaci,
                      'adet dosya işlendi, işlenmekte olan dosya: ', dosya)
            oznitelikler, oznitelik_pencereler = es.MusicExtractor(
                lowlevelSilentFrames='drop',
                lowlevelFrameSize=2048,
                lowlevelHopSize=1024,
                lowlevelStats=['mean', 'stdev'])(dosya)
            secilmis_oznitelikler = [
                oznitelikler[oznitelik_ismi]
                for oznitelik_ismi in skaler_oznitelikler]
            # sınıf bilgisinin dosya isminden elde edilmesi
            enstruman = dosya.split('/')[-1].split('_')[0].lower()
            yazilacak_satir = str(secilmis_oznitelikler)[
                1:-1] + ',' + enstruman + '\n'
            yazici.write(yazilacak_satir)
print(dosya_sayaci, 'adet dosya işlendi')
```

```text title='Her dosya için öznitelik çıkarımı ve data.csv dosyasına yazım işlemi çıktısı'
20 adet dosya işlendi, işlenmekte olan dosya:  instrument/segments/Violin_19.wav
40 adet dosya işlendi, işlenmekte olan dosya:  instrument/segments/Violin_39.wav
60 adet dosya işlendi, işlenmekte olan dosya:  instrument/segments/Violin_59.wav
80 adet dosya işlendi, işlenmekte olan dosya:  instrument/segments/flute_3.wav
100 adet dosya işlendi, işlenmekte olan dosya:  instrument/segments/flute_23.wav
120 adet dosya işlendi, işlenmekte olan dosya:  instrument/segments/Vibraphone_7.wav
140 adet dosya işlendi, işlenmekte olan dosya:  instrument/segments/Vibraphone_27.wav
160 adet dosya işlendi, işlenmekte olan dosya:  instrument/segments/EbClar_5.wav
180 adet dosya işlendi, işlenmekte olan dosya:  instrument/segments/EbClar_25.wav
193 adet dosya işlendi
```

## Özniteliklerin incelenmesi ve ön işlemesi

Dosyalar için hesaplanan bütün öznitelikler, her biri bir satırda olacak şekilde tek bir dosyaya yazıldı: `data.csv`. Bu temsilde kolonlar öznitelikleri, satırlar da her bir örneği/dosyayı temsil etmekte. Bu, makine öğrenmesi verilerinde sıkça kullanılan bir düzendir.

Verileri yükleyip incelemeye başlayalım. Bunun için [`pandas`](https://pandas.pydata.org/docs/getting_started/index.html) kütüphanesi kullanacağız.

```python title='Verilerinin ilk satırlarının görüntülenmesi'
import pandas as pd

# Verilerin okunması
tablo = pd.read_csv(veri_dosyasi)
# Verinin baş kısmının görüntülenmesi
tablo.head()
```

| average_loudness | barkbands_crest.mean | barkbands_crest.stdev | barkbands_flatness_db.mean | barkbands_flatness_db.stdev | barkbands_kurtosis.mean | barkbands_kurtosis.stdev | barkbands_skewness.mean | barkbands_skewness.stdev | barkbands_spread.mean | barkbands_spread.stdev | dissonance.mean | dissonance.stdev | dynamic_complexity | erbbands_crest.mean | erbbands_crest.stdev | erbbands_flatness_db.mean | erbbands_flatness_db.stdev | erbbands_kurtosis.mean | erbbands_kurtosis.stdev | erbbands_skewness.mean | erbbands_skewness.stdev | erbbands_spread.mean | erbbands_spread.stdev | hfc.mean  | hfc.stdev | loudness_ebu128.integrated | loudness_ebu128.loudness_range | loudness_ebu128.momentary.mean | loudness_ebu128.momentary.stdev | loudness_ebu128.short_term.mean | loudness_ebu128.short_term.stdev | melbands_crest.mean | melbands_crest.stdev | melbands_flatness_db.mean | melbands_flatness_db.stdev | melbands_kurtosis.mean | melbands_kurtosis.stdev | melbands_skewness.mean | melbands_skewness.stdev | ... | silence_rate_20dB.stdev | silence_rate_30dB.mean | silence_rate_30dB.stdev | silence_rate_60dB.mean | silence_rate_60dB.stdev | spectral_centroid.mean | spectral_centroid.stdev | spectral_complexity.mean | spectral_complexity.stdev | spectral_decrease.mean | spectral_decrease.stdev | spectral_energy.mean | spectral_energy.stdev | spectral_energyband_high.mean | spectral_energyband_high.stdev | spectral_energyband_low.mean | spectral_energyband_low.stdev | spectral_energyband_middle_high.mean | spectral_energyband_middle_high.stdev | spectral_energyband_middle_low.mean | spectral_energyband_middle_low.stdev | spectral_entropy.mean | spectral_entropy.stdev | spectral_flux.mean | spectral_flux.stdev | spectral_kurtosis.mean | spectral_kurtosis.stdev | spectral_rms.mean | spectral_rms.stdev | spectral_rolloff.mean | spectral_rolloff.stdev | spectral_skewness.mean | spectral_skewness.stdev | spectral_spread.mean | spectral_spread.stdev | spectral_strongpeak.mean | spectral_strongpeak.stdev | zerocrossingrate.mean | zerocrossingrate.stdev | enstruman |
| ---------------- | -------------------- | --------------------- | -------------------------- | --------------------------- | ----------------------- | ------------------------ | ----------------------- | ------------------------ | --------------------- | ---------------------- | --------------- | ---------------- | ------------------ | ------------------- | -------------------- | ------------------------- | -------------------------- | ---------------------- | ----------------------- | ---------------------- | ----------------------- | -------------------- | --------------------- | --------- | --------- | -------------------------- | ------------------------------ | ------------------------------ | ------------------------------- | ------------------------------- | -------------------------------- | ------------------- | -------------------- | ------------------------- | -------------------------- | ---------------------- | ----------------------- | ---------------------- | ----------------------- | --- | ----------------------- | ---------------------- | ----------------------- | ---------------------- | ----------------------- | ---------------------- | ----------------------- | ------------------------ | ------------------------- | ---------------------- | ----------------------- | -------------------- | --------------------- | ----------------------------- | ------------------------------ | ---------------------------- | ----------------------------- | ------------------------------------ | ------------------------------------- | ----------------------------------- | ------------------------------------ | --------------------- | ---------------------- | ------------------ | ------------------- | ---------------------- | ----------------------- | ----------------- | ------------------ | --------------------- | ---------------------- | ---------------------- | ----------------------- | -------------------- | --------------------- | ------------------------ | ------------------------- | --------------------- | ---------------------- | --------- |
| 0.990684         | 13.966096            | 5.504938              | 0.391892                   | 0.131075                    | 12.337907               | 39.297791                | 1.322440                | 2.893653                 | 23.940214             | 13.117479              | 0.408981        | 0.060369         | 9.041045           | 13.309873           | 4.778175             | 0.332570                  | 0.088456                   | -0.342470              | 1.615965                | 0.184409               | 0.537337                | 22.708614            | 11.916921             | 9.756293  | 14.707431 | -10.417274                 | 0.0                            | -14.852727                     | 7.602245                        | -14.345962                      | 0.0                              | 18.336485           | 7.896185             | 0.394292                  | 0.141539                   | 47.171944              | 362.129120              | 1.790965               | 4.043743                | ... | 0.0                     | 1.0                    | 0.0                     | 0.575342               | 0.494291                | 1937.785767            | 729.501343              | 3.712329                 | 2.407064                  | -1.377688e-09          | 1.877327e-09            | 0.006085             | 0.008414              | 0.000467                      | 0.000769                       | 0.000119                     | 0.000116                      | 0.002832                             | 0.004308                              | 0.002484                            | 0.003750                             | 5.220189              | 0.839127               | 0.013114           | 0.009113            | 16.724209              | 20.762644               | 0.001946          | 0.001466           | 2247.712646           | 1342.458008            | 2.417375               | 1.789011                | 3517494.75           | 2351486.500           | 0.836513                 | 0.881791                  | 0.066975              | 0.037090               | violin    |
| 0.980992         | 14.842050            | 8.005159              | 0.459877                   | 0.182189                    | 3681.557373             | 13189.571289             | 16.032242               | 42.557171                | 14.094480             | 11.886636              | 0.448883        | 0.050458         | 13.512960          | 15.800659           | 9.380403             | 0.287965                  | 0.081215                   | 4.501371               | 9.468204                | 0.697257               | 1.834853                | 23.216032            | 15.647773             | 13.458484 | 14.996409 | -10.110178                 | 0.0                            | -18.492256                     | 13.500790                       | -13.110081                      | 0.0                              | 21.825361           | 12.295666            | 0.423175                  | 0.209241                   | 25541.517578           | 76630.750000            | 54.522022              | 123.392258              | ... | 0.0                     | 1.0                    | 0.0                     | 0.406977               | 0.491271                | 2010.038940            | 946.941833              | 3.779070                 | 2.911090                  | -1.448591e-09          | 1.327289e-09            | 0.006688             | 0.006353              | 0.000385                      | 0.000471                       | 0.000163                     | 0.000178                      | 0.004407                             | 0.004618                              | 0.001319                            | 0.001607                             | 5.891174              | 1.280658               | 0.015280           | 0.009793            | 8.760670               | 5.728553                | 0.002219          | 0.001265           | 2042.898560           | 1547.567139            | 1.782818               | 0.670414                | 4230923.50           | 2746448.000           | 3.196332                 | 3.226596                  | 0.068785              | 0.051212               | violin    |
| 0.990684         | 17.817942            | 4.598412              | 0.413352                   | 0.144167                    | 54.268314               | 174.754013               | 3.004832                | 6.051124                 | 18.294971             | 10.685389              | 0.369757        | 0.083798         | 6.193280           | 18.062973           | 6.631323             | 0.344739                  | 0.084556                   | 15.489976              | 37.149120               | 0.492145               | 2.080161                | 27.920609            | 15.020202             | 23.914366 | 19.824785 | -10.355789                 | 0.0                            | -11.965288                     | 4.106338                        | -13.956363                      | 0.0                              | 22.325401           | 7.115120             | 0.436046                  | 0.149835                   | 27.989334              | 67.664238               | 3.109752               | 3.256610                | ... | 0.0                     | 1.0                    | 0.0                     | 0.281250               | 0.449609                | 1804.075073            | 759.301392              | 4.375000                 | 2.619041                  | -3.802290e-09          | 2.818559e-09            | 0.016520             | 0.012368              | 0.001822                      | 0.001846                       | 0.000280                     | 0.000312                      | 0.002607                             | 0.002059                              | 0.011110                            | 0.008910                             | 5.141592              | 0.919535               | 0.024073           | 0.012750            | 8.635427               | 11.308197               | 0.003583          | 0.001811           | 2358.894775           | 1606.046753            | 1.724165               | 1.329086                | 3944500.50           | 1188167.875           | 2.518367                 | 1.782688                  | 0.069221              | 0.040761               | violin    |
| 0.990684         | 17.656893            | 4.118634              | 0.367775                   | 0.125469                    | 1.523820                | 3.768350                 | 0.679743                | 1.209198                 | 20.088648             | 8.982120               | 0.374811        | 0.088572         | 4.138185           | 22.275450           | 7.305641             | 0.359138                  | 0.096671                   | 25.049183              | 62.678246               | 0.617784               | 2.197876                | 28.379591            | 15.772503             | 23.882612 | 19.157127 | -11.362382                 | 0.0                            | -12.776234                     | 3.672523                        | -15.595175                      | 0.0                              | 27.828623           | 4.885487             | 0.379335                  | 0.135656                   | 6.049039               | 5.283234                | 1.781069               | 1.397336                | ... | 0.0                     | 1.0                    | 0.0                     | 0.203704               | 0.402751                | 1856.569336            | 586.884888              | 4.611111                 | 2.003854                  | -3.779804e-09          | 2.947810e-09            | 0.016432             | 0.012815              | 0.001007                      | 0.000865                       | 0.000349                     | 0.000462                      | 0.009774                             | 0.008347                              | 0.010165                            | 0.009088                             | 5.019566              | 1.020412               | 0.028116           | 0.017739            | 15.700159              | 23.770699               | 0.003645          | 0.001658           | 2393.774170           | 1158.552002            | 2.308136               | 2.154232                | 3568710.00           | 1205866.125           | 2.738390                 | 1.739794                  | 0.081389              | 0.039106               | violin    |
| 0.990684         | 19.166706            | 6.532612              | 0.528129                   | 0.205500                    | 3830.154785             | 10929.935547             | 17.959423               | 32.941238                | 12.019314             | 12.085437              | 0.408593        | 0.102159         | 17.528576          | 20.366528           | 8.737727             | 0.288603                  | 0.124916                   | 22.906935              | 37.851063               | 1.689268               | 2.055339                | 25.500593            | 19.446293             | 14.564484 | 20.178207 | -9.364533                  | 0.0                            | -20.611929                     | 15.600307                       | -15.051775                      | 0.0                              | 25.720842           | 11.789266            | 0.538844                  | 0.212388                   | 46073.800781           | 99546.765625            | 93.226692              | 154.472946              | ... | 0.0                     | 1.0                    | 0.0                     | 0.568965               | 0.495221                | 1436.247925            | 771.396484              | 2.206897                 | 2.347109                  | -2.368066e-09          | 2.618626e-09            | 0.010259             | 0.011666              | 0.000726                      | 0.001148                       | 0.000407                     | 0.000393                      | 0.007951                             | 0.010602                              | 0.000090                            | 0.000229                             | 6.200566              | 1.681997               | 0.025696           | 0.014974            | 10.671324              | 16.747379               | 0.002545          | 0.001879           | 1171.331299           | 1332.816406            | 2.099767               | 1.607889                | 5926907.50           | 3187507.500           | 1.404606                 | 1.785565                  | 0.038692              | 0.043927               | violin    |

5 rows × 85 columns

Kolonların doğru şekilde öznitelik adlarıyla isimlendirildiğini (ilk 84 kolon), son kolonda kategori/sınıf bilgisi olduğunu görüyoruz.

Bir veri tablosu yüklediğinizde işlemlere başlamadan verinin içerisinde `NaN` değerler olup olmadığını kontrol etmemizde fayda var. Eğer `NaN` değerler varsa bunları temizlememiz lazım. Bunun için kullanabileceğimiz stratejilere diğer bölümlerimizde değineceğiz.

[todo]: # "NaN değerlerin temizlendiği bir bölüme link ver"

```python title='NaN değer kontrolü'
# .isnull()'ın döndürdüğü True/False değerleri içeren
# matrisin toplamı sıfırdan farklı ise True (yani NaN) değer vardır
print(tablo.isnull().sum().sum())
```

**Gözlem:** `NaN` değer yok, devam edebiliriz.

Verilerin öznitelik uzayında nasıl dağıldığını incelemek de çok faydalı olacaktır. İki örnek çizim görelim

```python title='İki örnek öznitelik dağılımı grafikleri'
import seaborn as sns
sns.relplot(x="melbands_flatness_db.mean", y="spectral_centroid.mean",
            hue="enstruman", style="enstruman", data=tablo)
sns.relplot(x="spectral_complexity.mean", y="spectral_flux.stdev",
            hue="enstruman", style="enstruman", data=tablo)
```

![Öznitelik Örnek 1](/img/otomatik-enstruman-tanima/oznitelik-ornek1.png)
![Öznitelik Örnek 2](/img/otomatik-enstruman-tanima/oznitelik-ornek2.png)

Bu tür grafikler oluşturup incelerken amacımız verinin hangi eksenlerde/özniteliklerde birbirinden rahat ayrılabileceğini öngörmek. Örneğin üstteki grafikte `spectral_flux_stdev` özniteliğinin vibrafon örneklerini diğerlerinden ayırmada faydalı olacağını öngörebiliyoruz; o eksende veri dağılımda bir ayrılma gözlenebiliyor. Öznitelik uzayında veriler ne kadar iç içe ise o kadar zor bir otomatik sınıflandırma problemi ile yüzyüzeyiz demektir.

Benzer grafikleri son 6 öznitelik üzerinden olası tüm ikililer için çizdirelim ve farklı kategorilerdeki verilerin bir arada gruplanıp gruplanmadığını gözleyelim.

```python title='Son 6 özniteliğin ikili kombinasyonlarının dağılımı grafikleri'
sns.pairplot(tablo.iloc[:, -7:], hue='enstruman')
```

![Öznitelik İkili Grafikler](/img/otomatik-enstruman-tanima/oznitelik-ikili.png)

Bir sonraki adımda özniteliklerin istatistiksel özelliklerini inceleyelim.

```python title='Veriye dair "Descriptive statistics"'
tablo.describe()
```

| average_loudness | barkbands_crest.mean | barkbands_crest.stdev | barkbands_flatness_db.mean | barkbands_flatness_db.stdev | barkbands_kurtosis.mean | barkbands_kurtosis.stdev | barkbands_skewness.mean | barkbands_skewness.stdev | barkbands_spread.mean | barkbands_spread.stdev | dissonance.mean | dissonance.stdev | dynamic_complexity | erbbands_crest.mean | erbbands_crest.stdev | erbbands_flatness_db.mean | erbbands_flatness_db.stdev | erbbands_kurtosis.mean | erbbands_kurtosis.stdev | erbbands_skewness.mean | erbbands_skewness.stdev | erbbands_spread.mean | erbbands_spread.stdev | hfc.mean   | hfc.stdev  | loudness_ebu128.integrated | loudness_ebu128.loudness_range | loudness_ebu128.momentary.mean | loudness_ebu128.momentary.stdev | loudness_ebu128.short_term.mean | loudness_ebu128.short_term.stdev | melbands_crest.mean | melbands_crest.stdev | melbands_flatness_db.mean | melbands_flatness_db.stdev | melbands_kurtosis.mean | melbands_kurtosis.stdev | melbands_skewness.mean | melbands_skewness.stdev | ... | silence_rate_20dB.mean | silence_rate_20dB.stdev | silence_rate_30dB.mean | silence_rate_30dB.stdev | silence_rate_60dB.mean | silence_rate_60dB.stdev | spectral_centroid.mean | spectral_centroid.stdev | spectral_complexity.mean | spectral_complexity.stdev | spectral_decrease.mean | spectral_decrease.stdev | spectral_energy.mean | spectral_energy.stdev | spectral_energyband_high.mean | spectral_energyband_high.stdev | spectral_energyband_low.mean | spectral_energyband_low.stdev | spectral_energyband_middle_high.mean | spectral_energyband_middle_high.stdev | spectral_energyband_middle_low.mean | spectral_energyband_middle_low.stdev | spectral_entropy.mean | spectral_entropy.stdev | spectral_flux.mean | spectral_flux.stdev | spectral_kurtosis.mean | spectral_kurtosis.stdev | spectral_rms.mean | spectral_rms.stdev | spectral_rolloff.mean | spectral_rolloff.stdev | spectral_skewness.mean | spectral_skewness.stdev | spectral_spread.mean | spectral_spread.stdev | spectral_strongpeak.mean | spectral_strongpeak.stdev | zerocrossingrate.mean | zerocrossingrate.stdev |
| ---------------- | -------------------- | --------------------- | -------------------------- | --------------------------- | ----------------------- | ------------------------ | ----------------------- | ------------------------ | --------------------- | ---------------------- | --------------- | ---------------- | ------------------ | ------------------- | -------------------- | ------------------------- | -------------------------- | ---------------------- | ----------------------- | ---------------------- | ----------------------- | -------------------- | --------------------- | ---------- | ---------- | -------------------------- | ------------------------------ | ------------------------------ | ------------------------------- | ------------------------------- | -------------------------------- | ------------------- | -------------------- | ------------------------- | -------------------------- | ---------------------- | ----------------------- | ---------------------- | ----------------------- | --- | ---------------------- | ----------------------- | ---------------------- | ----------------------- | ---------------------- | ----------------------- | ---------------------- | ----------------------- | ------------------------ | ------------------------- | ---------------------- | ----------------------- | -------------------- | --------------------- | ----------------------------- | ------------------------------ | ---------------------------- | ----------------------------- | ------------------------------------ | ------------------------------------- | ----------------------------------- | ------------------------------------ | --------------------- | ---------------------- | ------------------ | ------------------- | ---------------------- | ----------------------- | ----------------- | ------------------ | --------------------- | ---------------------- | ---------------------- | ----------------------- | -------------------- | --------------------- | ------------------------ | ------------------------- | --------------------- | ---------------------- |
| 193.000000       | 193.000000           | 193.000000            | 193.000000                 | 193.000000                  | 193.000000              | 193.000000               | 193.000000              | 193.000000               | 193.000000            | 193.000000             | 193.000000      | 193.000000       | 193.000000         | 193.000000          | 193.000000           | 193.000000                | 193.000000                 | 193.000000             | 193.000000              | 193.000000             | 193.000000              | 193.000000           | 193.000000            | 193.000000 | 193.000000 | 193.000000                 | 193.0                          | 193.000000                     | 193.000000                      | 193.000000                      | 193.0                            | 193.000000          | 193.000000           | 193.000000                | 193.000000                 | 193.000000             | 193.000000              | 193.000000             | 193.000000              | ... | 193.000000             | 193.000000              | 193.000000             | 193.000000              | 193.000000             | 193.000000              | 193.000000             | 193.000000              | 193.000000               | 193.000000                | 1.930000e+02           | 1.930000e+02            | 193.000000           | 193.000000            | 1.930000e+02                  | 193.000000                     | 1.930000e+02                 | 1.930000e+02                  | 193.000000                           | 193.000000                            | 1.930000e+02                        | 1.930000e+02                         | 193.000000            | 193.000000             | 193.000000         | 193.000000          | 193.000000             | 193.000000              | 193.000000        | 193.000000         | 193.000000            | 193.000000             | 193.000000             | 193.000000              | 1.930000e+02         | 1.930000e+02          | 193.000000               | 193.000000                | 193.000000            | 193.000000             |
| 0.986378         | 18.737075            | 3.533494              | 0.430367                   | 0.102611                    | 283.950436              | 628.912521               | 3.632873                | 4.466254                 | 9.637900              | 8.297742               | 0.378581        | 0.068661         | 4.423657           | 20.334707           | 5.178872             | 0.409486                  | 0.094720                   | 18.817250              | 17.592866               | 1.235512               | 1.443289                | 16.547586            | 12.781241             | 24.323515  | 17.045091  | -9.917248                  | 0.0                            | -11.125669                     | 2.664602                        | -13.647154                      | 0.0                              | 23.737525           | 4.502573             | 0.450065                  | 0.104105                   | 3012.575911            | 7499.255243             | 7.647195               | 11.267097               | ... | 0.999869               | 0.000814                | 0.999171               | 0.002782                | 0.231555               | 0.371828                | 1458.036380            | 400.415318              | 4.438503                 | 2.036040                  | -5.512389e-09          | 3.731882e-09            | 0.023011             | 0.015592              | 2.104459e-04                  | 0.000250                       | 1.485447e-04                 | 2.915556e-04                  | 0.012854                             | 0.008831                              | 9.800995e-03                        | 6.792110e-03                         | 5.101570              | 1.056068               | 0.020691           | 0.023357            | 28.524502              | 18.527053               | 0.004050          | 0.001959           | 1540.656583           | 760.391840             | 3.335839               | 1.303501                | 3.089806e+06         | 2.443487e+06          | 3.835344                 | 2.347946                  | 0.055322              | 0.022904               |
| 0.006414         | 4.673740             | 1.205451              | 0.079073                   | 0.040251                    | 999.687053              | 2476.937968              | 6.138560                | 7.892060                 | 6.017748              | 4.982078               | 0.078875        | 0.025878         | 4.426984           | 6.022991            | 1.960102             | 0.080642                  | 0.037934                   | 33.644639              | 19.463037               | 2.281535               | 0.861485                | 9.802134             | 7.523653              | 13.451981  | 6.738825   | 3.348636                   | 0.0                            | 4.445027                       | 3.530941                        | 5.392517                        | 0.0                              | 5.772736            | 2.122230             | 0.086242                  | 0.043252                   | 14622.096981           | 36752.063325            | 22.480858              | 37.341062               | ... | 0.001822               | 0.011307                | 0.008411               | 0.027470                | 0.178162               | 0.090253                | 596.341929             | 246.045671              | 2.479986                 | 1.104633                  | 3.230890e-09           | 2.544036e-09            | 0.013025             | 0.009600              | 4.745901e-04                  | 0.000788                       | 8.510136e-04                 | 2.289085e-03                  | 0.012164                             | 0.006963                              | 1.080937e-02                        | 6.869763e-03                         | 0.665796              | 0.335180               | 0.010345           | 0.015770            | 27.333752              | 18.302429               | 0.001398          | 0.000517           | 710.809230            | 561.415954             | 1.765826               | 0.898022                | 8.214654e+05         | 1.145177e+06          | 2.399718                 | 1.485965                  | 0.023783              | 0.015384               |
| 0.944595         | 7.485431             | 1.186291              | 0.260509                   | 0.030590                    | -1.065718               | 0.525588                 | -7.482044               | 0.199631                 | 0.358621              | 0.380970               | 0.111837        | 0.008352         | 0.000000           | 7.657479            | 0.895091             | 0.258179                  | 0.029221                   | -1.468161              | 0.241148                | -8.758108              | 0.213421                | 0.660656             | 0.630457              | 5.722024   | 5.030395   | -21.203791                 | 0.0                            | -31.063751                     | 0.000000                        | -26.873251                      | 0.0                              | 9.693776            | 0.884998             | 0.261742                  | 0.029536                   | -1.292677              | 0.324016                | -5.284896              | 0.295431                | ... | 0.974684               | 0.000000                | 0.898734               | 0.000000                | 0.000000               | 0.000000                | 474.717651             | 34.998024               | 0.592593                 | 0.000000                  | -1.874196e-08          | 6.953977e-10            | 0.002463             | 0.003874              | 7.131407e-07                  | 0.000001                       | 5.052241e-08                 | 4.021336e-08                  | 0.000040                             | 0.000094                              | 2.660335e-08                        | 2.241019e-08                         | 3.290138              | 0.351987               | 0.007268           | 0.006443            | 4.563084               | 2.417063                | 0.001239          | 0.000925           | 448.608398            | 5.137959               | 0.950112               | 0.320254                | 1.384234e+06         | 3.002080e+05          | 0.805183                 | 0.336106                  | 0.017263              | 0.005875               |
| 0.982277         | 15.009151            | 2.775762              | 0.367775                   | 0.072194                    | 5.696008                | 11.835285                | 0.806964                | 1.204419                 | 5.727080              | 5.118143               | 0.352449        | 0.050458         | 1.464391           | 16.067286           | 3.749556             | 0.342134                  | 0.068718                   | 1.375713               | 3.896536                | 0.035675               | 0.800957                | 9.397035             | 7.277045              | 13.881898  | 12.416042  | -11.903687                 | 0.0                            | -13.187655                     | 1.048645                        | -16.215620                      | 0.0                              | 19.816256           | 3.216540             | 0.385293                  | 0.070532                   | 8.162437               | 16.978226               | 1.298464               | 1.369625                | ... | 1.000000               | 0.000000                | 1.000000               | 0.000000                | 0.112360               | 0.315808                | 1009.829651            | 227.158356              | 2.352941                 | 1.224036                  | -8.460598e-09          | 2.630761e-09            | 0.013309             | 0.011623              | 1.967868e-05                  | 0.000016                       | 5.986385e-07                 | 7.331721e-07                  | 0.003312                             | 0.002906                              | 2.081505e-05                        | 4.946472e-05                         | 4.689804              | 0.805853               | 0.012555           | 0.013582            | 13.335919              | 6.699384                | 0.002952          | 0.001551           | 1003.193909           | 388.462433             | 2.298176               | 0.673138                | 2.620606e+06         | 1.742066e+06          | 1.990636                 | 1.165608                  | 0.038632              | 0.012656               |
| 0.990684         | 18.754087            | 3.416812              | 0.422366                   | 0.098511                    | 11.744921               | 29.479961                | 1.685290                | 2.010876                 | 8.556025              | 7.706514               | 0.389932        | 0.066582         | 3.441756           | 19.749996           | 4.945286             | 0.399279                  | 0.088883                   | 4.501371               | 10.486266               | 0.893352               | 1.251155                | 15.191008            | 11.847535             | 20.120611  | 16.222181  | -10.051680                 | 0.0                            | -11.352070                     | 1.876387                        | -13.204257                      | 0.0                              | 23.457668           | 4.065306             | 0.435192                  | 0.096370                   | 19.071980              | 31.145819               | 2.510457               | 2.153121                | ... | 1.000000               | 0.000000                | 1.000000               | 0.000000                | 0.148936               | 0.356026                | 1346.718872            | 374.113831              | 3.802083                 | 1.837235                  | -4.606483e-09          | 3.604847e-09            | 0.019107             | 0.014927              | 6.438150e-05                  | 0.000040                       | 2.238669e-06                 | 2.339812e-06                  | 0.008509                             | 0.006996                              | 6.064334e-03                        | 5.181897e-03                         | 5.171982              | 1.022271               | 0.018220           | 0.016551            | 18.559053              | 10.370736               | 0.003909          | 0.001951           | 1378.125000           | 627.297546             | 2.775611               | 0.956108                | 3.019486e+06         | 2.246092e+06          | 3.288788                 | 2.212921                  | 0.051336              | 0.018890               |
| 0.990684         | 22.895193            | 4.060771              | 0.488050                   | 0.125469                    | 57.957664               | 69.372810                | 3.784954                | 3.243659                 | 13.196887             | 10.348627              | 0.422459        | 0.086174         | 6.218259           | 24.923046           | 6.325545             | 0.480741                  | 0.117593                   | 15.489976              | 23.878176               | 2.176526               | 1.976935                | 23.436314            | 16.844233             | 33.818462  | 20.245600  | -7.578106                  | 0.0                            | -8.293778                      | 2.894800                        | -9.212072                       | 0.0                              | 28.324905           | 5.374242             | 0.508227                  | 0.131040                   | 58.224792              | 54.085941               | 4.420871               | 3.005034                | ... | 1.000000               | 0.000000                | 1.000000               | 0.000000                | 0.350877               | 0.455645                | 1937.233643            | 480.384216              | 6.469388                 | 2.589776                  | -3.033188e-09          | 4.392115e-09            | 0.035358             | 0.018220              | 1.850278e-04                  | 0.000144                       | 9.208047e-05                 | 1.131888e-04                  | 0.019438                             | 0.013864                              | 1.739991e-02                        | 1.254114e-02                         | 5.566424              | 1.304174               | 0.028116           | 0.024974            | 28.012707              | 24.892929               | 0.005398          | 0.002343           | 2060.806641           | 990.779724             | 3.632512               | 1.734667                | 3.373299e+06         | 2.829670e+06          | 5.056057                 | 3.150032                  | 0.067383              | 0.027325               |
| 0.990684         | 26.508205            | 8.019905              | 0.636219                   | 0.264137                    | 9113.943359             | 22528.576172             | 33.979153               | 56.715870                | 26.559134             | 32.050819              | 0.494816        | 0.148598         | 26.790888          | 33.474640           | 10.417783            | 0.595512                  | 0.203694                   | 217.838882             | 146.570282              | 7.767689               | 4.628944                | 47.612461            | 46.973072             | 65.986137  | 44.591309  | -3.449030                  | 0.0                            | -3.565113                      | 19.439484                       | -4.645581                       | 0.0                              | 34.744820           | 12.295666            | 0.688190                  | 0.281047                   | 121898.000000          | 330556.500000           | 156.422592             | 244.689011              | ... | 1.000000               | 0.157084                | 1.000000               | 0.301681                | 0.815789               | 0.499600                | 3501.017334            | 1762.545410             | 12.616667                | 7.096635                  | -4.685441e-10          | 3.371068e-08            | 0.072219             | 0.127545              | 4.675088e-03                  | 0.007994                       | 1.144988e-02                 | 3.126619e-02                  | 0.049981                             | 0.032855                              | 4.107901e-02                        | 2.404658e-02                         | 6.814042              | 1.843862               | 0.066207           | 0.095205            | 153.195908             | 103.272141              | 0.006768          | 0.004965           | 4256.789551           | 2818.890381            | 9.847508               | 5.230999                | 6.583575e+06         | 6.047925e+06          | 11.551766                | 11.142884                 | 0.162156              | 0.109800               |

8 rows × 84 columns

**Gözlem:** Özniteliklerin dinamik aralıkları çok farklı, normalize etmeliyiz. Bazı öznitelikler (örneğin `average_loudness`) bu problem için kullanılması anlamsız veya hemem hemen sabit değerler içeriyor. Varyansı düşük öznitelikleri dışarıda bırakabiliriz.

Varyansı ortalama değerinin binde birinin altında olan kolonları dışarıda bırakalım.

```python title='Düşük varyanslı özniteliklerin eliminasyonu'
dusuk_varyansli_oznitelikler = []
for kolon in tablo.columns:
    if kolon != 'enstruman':
        varyans = np.var(tablo[kolon])
        if varyans < np.mean(tablo[kolon]) * 0.001:
            print(
                kolon, ':\tvaryans =', np.var(tablo[kolon]),
                'ortalama =', np.mean(tablo[kolon]))
            dusuk_varyansli_oznitelikler.append(kolon)

print('Öznitelikler atılmadan önceki boyut:', tablo.shape)
tablo = tablo.drop(columns=dusuk_varyansli_oznitelikler)
skaler_secilmis_oznitelikler = list(tablo.columns)[:-1]
print('Öznitelikler atıldıktan sonraki boyut:', tablo.shape)
```

```text title='Düşük varyanslı özniteliklerin eliminasyonu çıktısı'
average_loudness :	varyans = 4.0925308291175505e-05 ortalama = 0.9863784164962374
silence_rate_20dB.mean :	varyans = 3.3036432587549304e-06 ortalama = 0.9998688265449642
silence_rate_30dB.mean :	varyans = 7.037403313105367e-05 ortalama = 0.9991705213803701
spectral_decrease.stdev :	varyans = 6.43858322811942e-18 ortalama = 3.731881552774557e-09
spectral_rms.mean :	varyans = 1.94345481923845e-06 ortalama = 0.004050059184321043
spectral_rms.stdev :	varyans = 2.656053866388477e-07 ortalama = 0.0019590600762863695
Öznitelikler atılmadan önceki boyut: (193, 85)
Öznitelikler atıldıktan sonraki boyut: (193, 79)
```

### Özniteliklerin ön işlemesi

Sınıflandırıcı modelimizi eğitmeye başlamadan önce öznitelik verimiz üzerinde uygulayabileceğimiz ön işleme adımlarına değinelim.

#### Normalizasyon

Öznitelik normalizasyonu makine öğrenmesi modelinin eğitilebilmesi için gerekli ön adımlardan birisidir. Özniteliklerin normalize edilmemesi (öznitelikler arasında büyük boyut farklılıklarının olması) optimizasyon sürecinde modelin iç parametrelerinin iyileştirilmesini zorlaştırmaktadır. Verimize baktığımızda örneğin `melbands_kurtosis.mean` ile `melbands_flatness_db.mean` büyüklükleri arasında 6000 kat civarında fark olduğunu gözlüyoruz. Öncelikle bu farklılıkları gidermeliyiz.

Çok farklı normalizasyon stratejileri mevcuttur ve kullanılan modele uygun bir strateji tercih edilmelidir. Bu konuda kısa bir özet incelemek isterseniz: [Normalization Techniques At A Glance](https://developers.google.com/machine-learning/data-prep/transform/normalization) ya da [Compare the effect of different scalers on data with outliers](https://scikit-learn.org/stable/auto_examples/preprocessing/plot_all_scaling.html#sphx-glr-auto-examples-preprocessing-plot-all-scaling-py) sayfalarını inceleyebilirsiniz. Bu bölümde yaygın kullanılan yöntemlerden birisi olan "Standard scaling"i `sklearn` kütüphanesinde gerçeklendiği şekliyle kullanacağız.

```python title='sklearn kütüphanesinin preprocessing araçları ile normalizasyon'
from sklearn import preprocessing

yeni_tablo = tablo.copy()
normalizasyon_araci = preprocessing.StandardScaler()
# aracının egitimi ve uygulanması (son kolon hariç)
yeni_tablo.iloc[:, :-1] = normalizasyon_araci.fit_transform(
    tablo.iloc[:, :-1].values)
yeni_tablo.describe()
```

| barkbands_crest.mean | barkbands_crest.stdev | barkbands_flatness_db.mean | barkbands_flatness_db.stdev | barkbands_kurtosis.mean | barkbands_kurtosis.stdev | barkbands_skewness.mean | barkbands_skewness.stdev | barkbands_spread.mean | barkbands_spread.stdev | dissonance.mean | dissonance.stdev | dynamic_complexity | erbbands_crest.mean | erbbands_crest.stdev | erbbands_flatness_db.mean | erbbands_flatness_db.stdev | erbbands_kurtosis.mean | erbbands_kurtosis.stdev | erbbands_skewness.mean | erbbands_skewness.stdev | erbbands_spread.mean | erbbands_spread.stdev | hfc.mean      | hfc.stdev     | loudness_ebu128.integrated | loudness_ebu128.loudness_range | loudness_ebu128.momentary.mean | loudness_ebu128.momentary.stdev | loudness_ebu128.short_term.mean | loudness_ebu128.short_term.stdev | melbands_crest.mean | melbands_crest.stdev | melbands_flatness_db.mean | melbands_flatness_db.stdev | melbands_kurtosis.mean | melbands_kurtosis.stdev | melbands_skewness.mean | melbands_skewness.stdev | melbands_spread.mean | melbands_spread.stdev | pitch_salience.mean | pitch_salience.stdev | silence_rate_20dB.stdev | silence_rate_30dB.stdev | silence_rate_60dB.mean | silence_rate_60dB.stdev | spectral_centroid.mean | spectral_centroid.stdev | spectral_complexity.mean | spectral_complexity.stdev | spectral_decrease.mean | spectral_energy.mean | spectral_energy.stdev | spectral_energyband_high.mean | spectral_energyband_high.stdev | spectral_energyband_low.mean | spectral_energyband_low.stdev | spectral_energyband_middle_high.mean | spectral_energyband_middle_high.stdev | spectral_energyband_middle_low.mean | spectral_energyband_middle_low.stdev | spectral_entropy.mean | spectral_entropy.stdev | spectral_flux.mean | spectral_flux.stdev | spectral_kurtosis.mean | spectral_kurtosis.stdev | spectral_rolloff.mean | spectral_rolloff.stdev | spectral_skewness.mean | spectral_skewness.stdev | spectral_spread.mean | spectral_spread.stdev | spectral_strongpeak.mean | spectral_strongpeak.stdev | zerocrossingrate.mean | zerocrossingrate.stdev |
| -------------------- | --------------------- | -------------------------- | --------------------------- | ----------------------- | ------------------------ | ----------------------- | ------------------------ | --------------------- | ---------------------- | --------------- | ---------------- | ------------------ | ------------------- | -------------------- | ------------------------- | -------------------------- | ---------------------- | ----------------------- | ---------------------- | ----------------------- | -------------------- | --------------------- | ------------- | ------------- | -------------------------- | ------------------------------ | ------------------------------ | ------------------------------- | ------------------------------- | -------------------------------- | ------------------- | -------------------- | ------------------------- | -------------------------- | ---------------------- | ----------------------- | ---------------------- | ----------------------- | -------------------- | --------------------- | ------------------- | -------------------- | ----------------------- | ----------------------- | ---------------------- | ----------------------- | ---------------------- | ----------------------- | ------------------------ | ------------------------- | ---------------------- | -------------------- | --------------------- | ----------------------------- | ------------------------------ | ---------------------------- | ----------------------------- | ------------------------------------ | ------------------------------------- | ----------------------------------- | ------------------------------------ | --------------------- | ---------------------- | ------------------ | ------------------- | ---------------------- | ----------------------- | --------------------- | ---------------------- | ---------------------- | ----------------------- | -------------------- | --------------------- | ------------------------ | ------------------------- | --------------------- | ---------------------- |
| 1.930000e+02         | 1.930000e+02          | 1.930000e+02               | 1.930000e+02                | 1.930000e+02            | 1.930000e+02             | 1.930000e+02            | 1.930000e+02             | 1.930000e+02          | 1.930000e+02           | 1.930000e+02    | 1.930000e+02     | 1.930000e+02       | 1.930000e+02        | 1.930000e+02         | 1.930000e+02              | 1.930000e+02               | 1.930000e+02           | 1.930000e+02            | 1.930000e+02           | 1.930000e+02            | 1.930000e+02         | 1.930000e+02          | 1.930000e+02  | 1.930000e+02  | 1.930000e+02               | 193.0                          | 1.930000e+02                   | 1.930000e+02                    | 1.930000e+02                    | 193.0                            | 1.930000e+02        | 1.930000e+02         | 1.930000e+02              | 1.930000e+02               | 1.930000e+02           | 1.930000e+02            | 1.930000e+02           | 1.930000e+02            | 1.930000e+02         | 1.930000e+02          | 1.930000e+02        | 1.930000e+02         | 1.930000e+02            | 1.930000e+02            | 1.930000e+02           | 1.930000e+02            | 1.930000e+02           | 1.930000e+02            | 1.930000e+02             | 1.930000e+02              | 1.930000e+02           | 1.930000e+02         | 1.930000e+02          | 1.930000e+02                  | 1.930000e+02                   | 1.930000e+02                 | 1.930000e+02                  | 1.930000e+02                         | 1.930000e+02                          | 1.930000e+02                        | 1.930000e+02                         | 1.930000e+02          | 1.930000e+02           | 1.930000e+02       | 1.930000e+02        | 1.930000e+02           | 1.930000e+02            | 1.930000e+02          | 1.930000e+02           | 1.930000e+02           | 1.930000e+02            | 1.930000e+02         | 1.930000e+02          | 1.930000e+02             | 1.930000e+02              | 1.930000e+02          | 1.930000e+02           |
| 1.369083e-16         | -4.747570e-17         | 8.743725e-17               | -4.005144e-17               | -3.093740e-17           | 1.351826e-17             | 3.163848e-17            | -6.701605e-17            | 1.622191e-16          | -6.787892e-17          | -3.014284e-16   | -2.979770e-16    | -2.047873e-16      | -5.522353e-17       | 1.161995e-16         | 1.185005e-16              | 6.356458e-17               | -1.104471e-16          | 1.196510e-16            | 1.380588e-16           | 7.823333e-17            | -4.717010e-17        | 2.807196e-16          | -7.133039e-17 | 2.539707e-16  | 2.076635e-16               | 0.0                            | 1.159119e-16                   | -1.599181e-16                   | -1.231024e-16                   | 0.0                              | 1.633696e-16        | 1.104471e-16         | -1.357578e-16             | -1.830718e-16              | -3.810999e-17          | 6.859798e-17            | 3.739093e-18           | -3.595282e-17           | 1.242529e-16         | -4.026716e-17         | -6.902941e-18       | -1.185005e-16        | 1.492761e-16            | -5.910643e-17           | 1.069956e-16           | -1.069956e-16           | -1.466875e-16          | -9.779167e-17           | -3.221373e-17            | 5.694926e-17              | -3.681569e-17          | -8.628676e-18        | 8.283529e-17          | -9.318970e-17                 | 3.221373e-17                   | -1.510018e-17                | -2.574222e-17                 | -3.365184e-17                        | -4.141765e-17                         | 2.358505e-17                        | 8.628676e-18                         | 3.175353e-16          | -1.932824e-16          | 1.829279e-16       | 1.472627e-16        | 4.832059e-17           | 2.991274e-17            | 1.731488e-16          | -6.902941e-18          | 2.876225e-17           | 1.133233e-16            | -1.725735e-16        | -2.887730e-16         | -4.630723e-17            | -1.336007e-16             | -6.730368e-17         | 1.265539e-17           |
| 1.002601e+00         | 1.002601e+00          | 1.002601e+00               | 1.002601e+00                | 1.002601e+00            | 1.002601e+00             | 1.002601e+00            | 1.002601e+00             | 1.002601e+00          | 1.002601e+00           | 1.002601e+00    | 1.002601e+00     | 1.002601e+00       | 1.002601e+00        | 1.002601e+00         | 1.002601e+00              | 1.002601e+00               | 1.002601e+00           | 1.002601e+00            | 1.002601e+00           | 1.002601e+00            | 1.002601e+00         | 1.002601e+00          | 1.002601e+00  | 1.002601e+00  | 1.002601e+00               | 0.0                            | 1.002601e+00                   | 1.002601e+00                    | 1.002601e+00                    | 0.0                              | 1.002601e+00        | 1.002601e+00         | 1.002601e+00              | 1.002601e+00               | 1.002601e+00           | 1.002601e+00            | 1.002601e+00           | 1.002601e+00            | 1.002601e+00         | 1.002601e+00          | 1.002601e+00        | 1.002601e+00         | 1.002601e+00            | 1.002601e+00            | 1.002601e+00           | 1.002601e+00            | 1.002601e+00           | 1.002601e+00            | 1.002601e+00             | 1.002601e+00              | 1.002601e+00           | 1.002601e+00         | 1.002601e+00          | 1.002601e+00                  | 1.002601e+00                   | 1.002601e+00                 | 1.002601e+00                  | 1.002601e+00                         | 1.002601e+00                          | 1.002601e+00                        | 1.002601e+00                         | 1.002601e+00          | 1.002601e+00           | 1.002601e+00       | 1.002601e+00        | 1.002601e+00           | 1.002601e+00            | 1.002601e+00          | 1.002601e+00           | 1.002601e+00           | 1.002601e+00            | 1.002601e+00         | 1.002601e+00          | 1.002601e+00             | 1.002601e+00              | 1.002601e+00          | 1.002601e+00           |
| -2.413679e+00        | -1.952222e+00         | -2.153696e+00              | -1.793942e+00               | -2.858469e-01           | -2.543549e-01            | -1.815381e+00           | -5.420284e-01            | -1.545996e+00         | -1.593183e+00          | -3.390651e+00   | -2.336561e+00    | -1.001847e+00      | -2.110280e+00       | -2.191173e+00        | -1.881145e+00             | -1.731129e+00              | -6.044995e-01          | -8.938402e-01           | -4.391609e+00          | -1.431327e+00           | -1.624978e+00        | -1.619211e+00         | -1.386403e+00 | -1.787544e+00 | -3.379256e+00              | 0.0                            | -4.497147e+00                  | -7.566065e-01                   | -2.459055e+00                   | 0.0                              | -2.439099e+00       | -1.709043e+00        | -2.189334e+00             | -1.728536e+00              | -2.066535e-01          | -2.045718e-01           | -5.767451e-01          | -2.945873e-01           | -1.252810e+00        | -1.306283e+00         | -1.812008e+00       | -1.713083e+00        | -7.216878e-02           | -1.015477e-01           | -1.303064e+00          | -4.130579e+00           | -1.653206e+00          | -1.489023e+00           | -1.554812e+00            | -1.847976e+00             | -4.105364e+00          | -1.581670e+00        | -1.223792e+00         | -4.430734e-01                 | -3.158812e-01                  | -1.749448e-01                | -1.276814e-01                 | -1.056117e+00                        | -1.258135e+00                         | -9.090689e-01                       | -9.912645e-01                        | -2.727776e+00         | -2.106071e+00          | -1.300857e+00      | -1.075339e+00       | -8.789037e-01          | -8.824998e-01           | -1.540341e+00         | -1.348765e+00          | -1.354568e+00          | -1.097750e+00           | -2.081656e+00        | -1.876438e+00         | -1.266000e+00            | -1.357416e+00             | -1.604452e+00         | -1.109786e+00          |
| -7.997061e-01        | -6.302225e-01         | -7.936345e-01              | -7.576489e-01               | -2.790654e-01           | -2.497770e-01            | -4.615510e-01           | -4.143809e-01            | -6.515712e-01         | -6.398671e-01          | -3.321691e-01   | -7.052544e-01    | -6.701994e-01      | -7.103647e-01       | -7.311014e-01        | -8.373625e-01             | -6.872351e-01              | -5.197529e-01          | -7.055400e-01           | -5.272580e-01          | -7.475489e-01           | -7.313865e-01        | -7.334882e-01         | -7.782329e-01 | -6.887088e-01 | -5.947515e-01              | 0.0                            | -4.650926e-01                  | -4.588467e-01                   | -4.775407e-01                   | 0.0                              | -6.810407e-01       | -6.075578e-01        | -7.530016e-01             | -7.782242e-01              | -2.060052e-01          | -2.041174e-01           | -2.831406e-01          | -2.657453e-01           | -7.094147e-01        | -6.173044e-01         | -7.960688e-01       | -7.271429e-01        | -7.216878e-02           | -1.015477e-01           | -6.707649e-01          | -6.223168e-01           | -7.535483e-01          | -7.059972e-01           | -8.431443e-01            | -7.370013e-01             | -9.148799e-01          | -7.468425e-01        | -4.145155e-01         | -4.030075e-01                 | -2.967747e-01                  | -1.742990e-01                | -1.273779e-01                 | -7.864447e-01                        | -8.532084e-01                         | -9.071407e-01                       | -9.840487e-01                        | -6.200653e-01         | -7.484489e-01          | -7.885209e-01      | -6.214362e-01       | -5.571165e-01          | -6.479157e-01           | -7.580944e-01         | -6.642076e-01          | -5.891643e-01          | -7.037712e-01           | -5.726592e-01        | -6.140928e-01         | -7.707181e-01            | -7.977398e-01             | -7.035951e-01         | -6.678179e-01          |
| 3.649516e-03         | -9.704639e-02         | -1.014457e-01              | -1.021421e-01               | -2.729989e-01           | -2.426349e-01            | -3.180954e-01           | -3.119293e-01            | -1.802483e-01         | -1.189795e-01          | 1.442841e-01    | -8.054407e-02    | -2.223759e-01      | -9.733227e-02       | -1.194802e-01        | -1.269003e-01             | -1.542735e-01              | -4.266092e-01          | -3.660828e-01           | -1.503595e-01          | -2.236066e-01           | -1.387562e-01        | -1.244255e-01         | -3.132501e-01 | -1.224323e-01 | -4.024974e-02              | 0.0                            | -5.106588e-02                  | -2.238114e-01                   | 8.234535e-02                    | 0.0                              | -4.860512e-02       | -2.065769e-01        | -1.729040e-01             | -1.792886e-01              | -2.052571e-01          | -2.037309e-01           | -2.290881e-01          | -2.447086e-01           | -1.903039e-01        | -2.291572e-01         | 4.108674e-02        | -1.905253e-01        | -7.216878e-02           | -1.015477e-01           | -4.649315e-01          | -1.755511e-01           | -1.871527e-01          | -1.071748e-01           | -2.572898e-01            | -1.804421e-01             | 2.811184e-01           | -3.005391e-01        | -6.941831e-02         | -3.085701e-01                 | -2.663702e-01                  | -1.723669e-01                | -1.266742e-01                 | -3.581281e-01                        | -2.642785e-01                         | -3.465863e-01                       | -2.350010e-01                        | 1.060301e-01          | -1.010925e-01          | -2.394787e-01      | -4.326934e-01       | -3.655322e-01          | -4.468003e-01           | -2.292518e-01         | -2.376855e-01          | -3.180861e-01          | -3.878483e-01           | -8.582596e-02        | -1.728183e-01         | -2.283508e-01            | -9.110321e-02             | -1.680577e-01         | -2.615907e-01          |
| 8.919906e-01         | 4.385482e-01          | 7.313819e-01               | 5.693650e-01                | -2.266515e-01           | -2.264873e-01            | 2.483926e-02            | -1.553175e-01            | 5.929533e-01          | 4.127232e-01           | 5.577450e-01    | 6.785065e-01     | 4.064322e-01       | 7.637854e-01        | 5.865285e-01         | 8.858865e-01              | 6.045314e-01               | -9.915184e-02          | 3.237756e-01            | 4.135202e-01           | 6.210604e-01            | 7.046061e-01         | 5.414336e-01          | 7.076758e-01  | 4.761709e-01  | 7.003524e-01               | 0.0                            | 6.387490e-01                   | 6.536402e-02                    | 8.245901e-01                    | 0.0                              | 7.967299e-01        | 4.118008e-01         | 6.761575e-01              | 6.243640e-01               | -2.025725e-01          | -2.031051e-01           | -1.438876e-01          | -2.218349e-01           | 4.241717e-01         | 2.956457e-01          | 8.683626e-01        | 5.606366e-01         | -7.216878e-02           | -1.015477e-01           | 6.714836e-01           | 9.311053e-01            | 8.056511e-01           | 3.258618e-01            | 8.210395e-01             | 5.025886e-01              | 7.693388e-01           | 9.503784e-01         | 2.744399e-01          | -5.369730e-02                 | -1.343377e-01                  | -6.652197e-02                | -7.812318e-02                 | 5.427142e-01                         | 7.246237e-01                          | 7.048221e-01                        | 8.390361e-01                         | 7.000074e-01          | 7.421442e-01           | 7.196678e-01       | 1.027991e-01        | -1.877262e-02          | 3.487205e-01            | 7.336749e-01          | 4.114366e-01           | 1.684450e-01           | 4.813768e-01            | 3.460044e-01         | 3.381029e-01          | 5.100132e-01             | 5.411784e-01              | 5.084298e-01          | 2.881321e-01           |
| 1.667046e+00         | 3.731450e+00          | 2.610066e+00               | 4.023387e+00                | 8.855729e+00            | 8.864421e+00             | 4.956407e+00            | 6.637748e+00             | 2.819201e+00          | 4.780104e+00           | 1.477485e+00    | 3.097007e+00     | 5.065616e+00       | 2.187303e+00        | 2.679727e+00         | 2.312798e+00              | 2.880194e+00               | 5.930789e+00           | 6.644023e+00            | 2.870508e+00           | 3.707484e+00            | 3.177437e+00         | 4.556398e+00          | 3.105192e+00  | 4.098320e+00  | 1.936621e+00               | 0.0                            | 1.705326e+00                   | 4.763181e+00                    | 1.673613e+00                    | 0.0                              | 1.911732e+00        | 3.681674e+00         | 2.768293e+00              | 4.101604e+00               | 8.151678e+00           | 8.813041e+00            | 6.635082e+00           | 6.267336e+00            | 4.480643e+00         | 7.725002e+00          | 2.202786e+00        | 3.925120e+00         | 1.385641e+01            | 1.090931e+01            | 3.287759e+00           | 1.419392e+00            | 3.434765e+00           | 5.550485e+00            | 3.306242e+00             | 4.593162e+00              | 1.565192e+00           | 3.787763e+00         | 1.169250e+01          | 9.431832e+00                  | 9.852070e+00                   | 1.331439e+01                 | 1.356664e+01                  | 3.060093e+00                         | 3.459167e+00                          | 2.901129e+00                        | 2.518187e+00                         | 2.578754e+00          | 2.356478e+00           | 4.411331e+00       | 4.567875e+00        | 4.572942e+00           | 4.642307e+00            | 3.831122e+00          | 3.676155e+00           | 3.697196e+00           | 4.384871e+00            | 4.264155e+00         | 3.155682e+00          | 3.223917e+00             | 5.934065e+00              | 4.503764e+00          | 5.663165e+00           |

**Gözlem:** Öznitelikler normalize edildi. Şimdi tablomuzu makine öğrenmesi araçlarının kabul ettiği matrislere dönüştürebiliriz

**ÖNEMLİ:** Problemin ve verinin doğasına bağlı olarak özniteliklere uygulanması gereken çok sayıda işlem olabilir. Örneğin boyut azaltma işlemlerine ihtiyaç duyulabilir. Bölümün karmaşıklığını artırmamak için ön işlemeyi normalizasyon ile sınırlı tuttuk.

### Veri örnek sayısını dengeleme

Şimdi elimizdeki veri kümesinin kategorilere düşen örnek sayıları açısından dengeli olup olmadığına bakalım:

```python title='veri kümesi kategorilere düşen örnek sayılarının incelenmesi'
yeni_tablo.enstruman.value_counts()
```

```text title='veri kümesi kategorilere düşen örnek sayılarının incelenmesi çıktısı'
violin        76
vibraphone    42
ebclar        39
flute         36
Name: enstruman, dtype: int64
```

**Gözlem**: Verilerimiz kategorilere ait örnek sayıları açısından dengeli değil, bazı kategorilerde diğerlerine göre daha fazla sayıda örnek var. Bir dengeleme işlemi uygulamakta fayda var. Dengeli olmayan veri kümeleri üzerinde de makine öğrenmesi testleri tasarlayabiliriz. Fakat örneği karmaşıklaştırmamak için bu konuyu bu bölümde ele almayacağız.

Kategorilere ait veri sayılarının dengelenmesi için farklı stratejiler uygulanabilir. Sık kullanılan iki yöntem alttaki görsellerde özetlenmiştir. Fazla olan örnekleri atarak denge kurulumasına "undersampling" ismi verilir ve bu bölümde bu teknik kullanılmıştır. Diğer bir alternatif az örnek bulunan kategoriye yeni örnekleri ya var olan örnekleri doğrudan kopyalayarak, ya da kategorisini bozmadan değiştirip kopyalarak dengeyi sağlamaktır.

|      ![Veri Dengelemesi](/img/otomatik-enstruman-tanima/balancing.png)      |
| :-------------------------------------------------------------------------: |
| _Veri dengelenmesi stratejileri: **"Undersampling"** ve **"Oversampling"**_ |

En az sayıda örnek içeren küme flüt kümesi (36 örnek). Her kümede rastgele seçilmiş 36 örnek tutup gerisini dışarıda bırakarak örnek kümemizi dengeleyelim.

```python title='Undersampling ile veri setinin dengelenmesi'
en_az_sayi = yeni_tablo.enstruman.value_counts()['flute']
violin_tablo = yeni_tablo[yeni_tablo.enstruman ==
                          'violin'].sample(n=en_az_sayi, random_state=0)
vibraphone_tablo = yeni_tablo[yeni_tablo.enstruman ==
                              'vibraphone'].sample(n=en_az_sayi, random_state=0)
ebclar_tablo = yeni_tablo[yeni_tablo.enstruman ==
                          'ebclar'].sample(n=en_az_sayi, random_state=0)
flute_tablo = yeni_tablo[yeni_tablo.enstruman == 'flute']
# Oluşturduğumuz küçültülmüş kümeleri birleştirelim
yeni_tablo = pd.concat(
    [ebclar_tablo, flute_tablo, violin_tablo, vibraphone_tablo])
# Dağılıma tekrar bakabiliriz
yeni_tablo.enstruman.value_counts()
```

```text title='Undersampling ile veri setinin dengelenmesi çıktısı'
ebclar        36
vibraphone    36
violin        36
flute         36
Name: enstruman, dtype: int64
```
