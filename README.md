# BigQuery Release Hub

Nowoczesna aplikacja webowa zbudowana przy użyciu **Python Flask** (backend) oraz czystego **HTML5, CSS3 i JavaScript** (frontend). Narzędzie służy do pobierania, analizowania, filtrowania i wygodnego udostępniania oficjalnych informacji o zmianach (Release Notes) usługi Google Cloud BigQuery w serwisach społecznościowych, takich jak X (Twitter).

---

## 🚀 Główne Funkcje

1. **Inteligentne Parsowanie Kanału**:
   Dzięki modułom `feedparser` i `BeautifulSoup` aplikacja rozbija zbiorcze, codzienne wpisy zmian od Google na pojedyncze kafelki dedykowane konkretnym modyfikacjom (np. nowe funkcjonalności, poprawki błędów czy ogłoszenia).
2. **Nowoczesny Interfejs (Premium Glassmorphism)**:
   Interfejs zaprojektowany w stylu ciemnego pulpitu nawigacyjnego (Dark Mode) z przezroczystymi panelami z efektem rozmycia tła (backdrop blur), dynamicznymi gradientami oraz subtelnymi mikroanimacjami ulepszającymi doświadczenie użytkownika (UX).
3. **Zaawansowane Wyszukiwanie i Filtrowanie**:
   Dynamiczne wyszukiwanie tekstu w czasie rzeczywistym oraz dedykowane zakładki pozwalające filtrować aktualizacje według kategorii:
   *   *Wszystkie* (All)
   *   *Nowe funkcje* (Features)
   *   *Zmiany* (Changes)
   *   *Ogłoszenia* (Announcements)
   *   *Błędy i Deprecjacje* (Issues & Deprecations)
4. **Kompozytor Wpisów X (Twitter)**:
   Możliwość zaznaczenia jednej lub kilku aktualizacji w celu stworzenia zbiorczego podsumowania zmian. Kompozytor automatycznie generuje treść wpisu, wstawia link źródłowy, hasztagi oraz oferuje:
   *   Dynamiczny wskaźnik limitu znaków (do 280) wraz z animowanym pierścieniem postępu.
   *   Kopiowanie gotowego szkicu jednym kliknięciem.
   *   Przekierowanie do oficjalnego kreatora X (Web Intent).
5. **Wbudowana Pamięć Podręczna (Cache)**:
   Serwer przechowuje dane w pamięci przez 5 minut, co zapobiega spowalnianiu aplikacji i ogranicza częste wysyłanie zapytań do API Google Cloud.
6. **Odporność na Awarię Sieci**:
   W przypadku problemów z łącznością internetową serwer automatycznie serwuje ostatnio pobrane dane z pamięci podręcznej.

---

## 📁 Struktura Projektu

```
agy_projects/
├── app.py                  # Serwer Flask i parser wpisów (Python)
├── requirements.txt        # Zależności i pakiety Pythona
├── README.md               # Dokumentacja projektu (ten plik)
├── .gitignore              # Reguły wykluczeń Git
├── templates/
│   └── index.html          # Struktura HTML strony głównej z ikonami SVG
└── static/
    ├── css/
    │   └── style.css       # Style wizualne, ciemny motyw i animacje
    └── js/
        └── app.js          # Logika frontendowa, asynchroniczne pobieranie i interakcje
```

---

## 🛠️ Instalacja i Uruchomienie

### 1. Wymagania wstępne
Upewnij się, że na swoim komputerze masz zainstalowany program **Python 3**.

### 2. Klonowanie i instalacja pakietów
Przejdź do katalogu projektu w terminalu i utwórz wirtualne środowisko:

```bash
# Utworzenie wirtualnego środowiska
python3 -m venv venv

# Aktywacja środowiska na systemie Linux/macOS
source venv/bin/activate

# Instalacja wymaganych zależności
pip install -r requirements.txt
```

### 3. Uruchomienie serwera lokalnego
Uruchom serwer Flask za pomocą poniższego polecenia:

```bash
python app.py
```

Aplikacja domyślnie nasłuchuje na porcie `5000`. Możesz ją otworzyć w przeglądarce pod adresem:
👉 **[http://127.0.0.1:5000](http://127.0.0.1:5000)**

### 4. Ręczne odświeżanie pamięci podręcznej (Cache Bypass)
Aby wymusić pobranie najnowszych danych bezpośrednio z kanału XML Google Cloud (z pominięciem 5-minutowego cache), kliknij przycisk **"Refresh Feed"** w prawym górnym rogu ekranu aplikacji. Wyśle to zapytanie z parametrem `/api/releases?refresh=true`, które natychmiastowo zaktualizuje pamięć podręczną na serwerze.

---

## 🐦 Udostępnianie aktualizacji na platformie X (Twitter)

1. **Wybór aktualizacji**: Najedź kursorem na dowolną kartę na osi czasu. Kliknięcie w kartę zaznaczy ją (zostanie podświetlona jasnoniebieską ramką z symbolem wyboru w rogu).
2. **Pasek akcji**: Zaznaczenie co najmniej jednej karty spowoduje wysunięcie się dolnego paska podsumowującego wybór.
3. **Tworzenie Wpisu**: Kliknij **"Draft Tweet"**.
   *   Jeśli zaznaczono **jeden kafel**: Wygenerowana zostanie treść zawierająca datę, typ zmiany, skrócony opis aktualizacji, bezpośredni link kotwiczny do tej sekcji dokumentacji oraz hasztagi `#BigQuery #GoogleCloud`.
   *   Jeśli zaznaczono **wiele kafli**: Stworzona zostanie chronologiczna lista punktowa w pigułce z ogólnym odnośnikiem do strony głównej wykazu zmian.
4. **Publikacja**: Możesz skopiować treść za pomocą **"Copy Draft"** lub kliknąć **"Post to X"**, co otworzy nową kartę z wypełnionym wpisem na Twitterze.
