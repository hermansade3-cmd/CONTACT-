# Contact — Maelekezo

Faili za app (zote ziwe kwenye folda moja):

```
index.html              ← app yote (HTML + CSS + JS)
sw.js                   ← Service Worker (offline)
manifest.webmanifest    ← kuisakinisha kama app
icon-192.png  icon-512.png  icon-maskable-512.png
```

## 1. Kufungua na kutest kwenye simu ya Android

**Njia ya haraka (kompyuta + simu kwenye Wi‑Fi moja):**
1. Kwenye kompyuta, ndani ya folda ya app: `python3 -m http.server 8000`
2. Fungua `http://<IP-ya-kompyuta>:8000` kwenye Chrome ya simu.
   - Kumbuka: Service Worker, install ya PWA na alama ya kidole zinahitaji **HTTPS** (au `localhost`). Kwa majaribio kamili tumia GitHub Pages (hatua 2).

**Mambo ya kujaribu:** ongeza mwasiliani → hariri → futa (angalia Recycle Bin) → tafuta kwa jina/namba/email → import VCF/CSV → export → weka password → toka kwenye app kisha rudi (lazima password) → funga mtandao na ufungue tena (inafanya kazi offline).

## 2. Kuweka kwenye GitHub Pages
1. Tengeneza repository mpya GitHub (mfano `contact`).
2. Pakia faili zote 6 (`index.html`, `sw.js`, `manifest.webmanifest` na picha 3) kwenye mzizi wa repo.
3. **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `main` / `(root)` → Save.**
4. Subiri dakika 1–2. Anwani: `https://<jina-lako>.github.io/contact/`
5. **Ikiwa unatumia Firebase (wingu):** Firebase Console → Authentication → Settings → **Authorized domains** → ongeza `<jina-lako>.github.io`. Weka pia Firestore Rules (hapa chini).

## 3. Kuisakinisha kama app (Android / Samsung)
1. Fungua anwani ya GitHub Pages kwenye **Chrome**.
2. Menyu ⋮ → **Install app** (au **Add to Home screen**). Au: Mipangilio ya Contact → "Sakinisha kama app".
3. Itaonekana kwenye skrini ya nyumbani na kufunguka bila upau wa kivinjari.
4. Ukiwa na toleo jipya la faili, fungua app ukiwa na mtandao mara moja ili ijisasishe.

## 4. Backup na kurejesha data
- **Backup:** Mipangilio → Data → **Backup**. Unaweza kuweka nywila ya kusimba faili (AES‑256). Faili la `.json` linahifadhiwa kwenye Downloads. Tarehe ya mwisho inaonekana kwenye Mipangilio.
- **Restore:** Mipangilio → **Rejesha kutoka backup** → chagua faili (weka nywila kama imesimbwa).
  - **Unganisha (inapendekezwa):** huongeza zinazokosekana, hakuna kinachofutwa.
  - **Badilisha zote:** hufuta zilizopo — inakuuliza uthibitisho.
- **Nakala nyepesi:** "Hamisha zote (VCF/CSV)" — VCF inafunguka kwenye Contacts za Android/Google.
- **Wingu (hiari):** Mipangilio → Akaunti ya wingu → Ingia. Anwani zinasawazishwa kupitia Firebase.

### Firestore Rules (kwa wingu)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/contacts/{doc} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
  }
}
```

## 5. Hali ya vipengele

### Vinafanya kazi moja kwa moja (bila huduma ya ziada)
Orodha A–Z, picha, search (jina/namba/email/kampuni/label), idadi, recently added/viewed, favorites, menyu ya vitendo kwa kila contact, kuchagua nyingi (bonyeza kwa muda mrefu), jina la kati, namba/email nyingi (Mobile/Home/Work/Other), picha kutoka galari/kamera, labels/groups (unda, ongeza, badilisha jina, futa bila kufuta contacts), profile (piga, SMS, WhatsApp, nakili, shiriki, hariri, futa, favorites), import VCF + CSV (Google Contacts na CSV rahisi) yenye ukaguzi wa duplicates na muhtasari, export VCF/CSV (moja, waliochaguliwa, zote), duplicates + kuunganisha kwa kuhakiki (hakuna taarifa inayopotea; zilizounganishwa huenda Recycle Bin), Recycle Bin siku 30 + kufuta kabisa, backup/restore (yenye usimbaji hiari, merge ni chaguo-msingi), password/PIN (PBKDF2 — haitunzwi kama maandishi), kufunga papo hapo ukitoka + idle lock, confirmation kwa vitendo hatari (kufuta zote kunahitaji kuandika "FUTA"), Light/Dark, Kiswahili/English, mpangilio wa majina, density, faragha, About, offline kupitia IndexedDB + Service Worker.

### Vinahitaji ruhusa / huduma / mazingira maalum
| Kipengele | Kinachohitajika |
|---|---|
| Kamera | Ruhusa ya kamera ya kivinjari |
| Alama ya kidole / uso | HTTPS + kifaa chenye biometric + Chrome; ni kinga ya app tu, haisimbi data |
| Kuchagua contacts kutoka simu | Chrome ya Android (Contact Picker API) + ruhusa; website haisomi contacts zote, ni ulizochagua tu |
| Kushiriki contact | Web Share API (Chrome ya Android); vinginevyo inanakili maandishi |
| Install kama PWA / offline | HTTPS (GitHub Pages) |
| Cloud sync / Google login | Firebase (hiari, bure kwa matumizi madogo): Authentication na Firestore Rules, Authorized domain |
| WhatsApp | WhatsApp iwe imesakinishwa; weka msimbo wa nchi kwenye Mipangilio (chaguo-msingi 255) |

## 6. Mipaka ya usalama (soma)
- Website **haiwezi** kusoma wala kubadilisha contacts za mfumo wa Android moja kwa moja. Tumia VCF/CSV au kichagua-contacts cha Chrome.
- Password inazuia kuona anwani **ndani ya app**. Anwani zimehifadhiwa kwenye IndexedDB **bila usimbaji**; mtu mwenye ufikiaji wa kifaa chako na zana za kivinjari anaweza kuzisoma. Backup ndiyo inayoweza kusimbwa. Tumia pia kufunga simu.
- Ukisahau password na hujaunganisha akaunti ya wingu, data ya kifaa inapaswa kufutwa (rejesha kutoka backup).
- Contacts zilizofutwa nje ya app hii (mfano kwenye Contacts za simu) haziwezi kurejeshwa na app hii bila backup.
- Makundi matupu (yasiyo na wanachama) hayasawazishwi kwenye wingu; yanabaki kwenye kifaa na kwenye backup.
