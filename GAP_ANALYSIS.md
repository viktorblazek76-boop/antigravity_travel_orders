# Audit Prototypu & GAP Analýza

Na základě analýzy dokumentu `Cestovní příkazy.docx` jsem porovnal aktuální stav prototypu v adresáři `Antigravity` s definovanými požadavky.

## 1. Co je JIŽ HOTOVO (Stav Prototypu)

Aktuální prototyp pokrývá vizuální a základní funkční rámec pro klíčové oblasti:

| Požadavek | Funkcionalita | Modul / Soubor | Stav |
| :--- | :--- | :--- | :--- |
| **REQ-01** | Zadání nového CP | `orders/new/page.tsx` | **Vizuálně kompletní.** Obsahuje typ cesty, itinerář, plánované náklady i zálohu. |
| **REQ-04** | Vyúčtování | `settlements/page.tsx` | **Základní flow.** Seznam schválených cest a formulář pro stravné/kilometry. |
| **REQ-06** | Číselníky | `vehicles/page.tsx`, `employees/page.tsx` | **Evidence.** Seznamy vozidel a zaměstnanců jsou připraveny jako UI. |
| **REQ-15** | Reporting | `reports/page.tsx` | **Dashboard.** Připravena integrace s Power BI (placeholder). |
| **REQ-18** | Konfigurace | `settings/page.tsx` | **Menu.** Rozcestník pro sazby, role a integrace. |

## 2. GAP Analýza (Co chybí / TBD)

Toto jsou kritické body ze specifikace, které v prototypu zatím nejsou plně zapracovány nebo jsou pouze v "mock" stavu:

*   **Zálohy (REQ-04, REQ-12):** Současný prototyp umožňuje zadat pouze jednu částku zálohy. Specifikace však vyžaduje možnost rozdělit zálohu na více částí (např. část hotově, část na kartu) a u zahraničních cest i v různých měnách. Chybí také validace, že záloha nepřesahuje plánované výdaje.
*   **Workflow & Schvalování (REQ-02, REQ-03):** Chybí engine pro "schvalovací matici" (automatické odesílání nadřízenému na základě AD atributů).
*   **Historie & Audit Trail (REQ-14):** Aplikace zatím neeviduje historii změn (kdo, kdy, co změnil).
*   **Integrace ERP (D365) (REQ-12):** Je připraveno pole v nastavení, ale chybí reálné mapování polí pro export/import dat do Dynamics 365.
*   **Lokalizace (REQ-09, REQ-10):** V kódu je vidět částečně česko-anglický mix, ale chybí přepínač jazyků a plná podpora angličtiny (REQ-09).
*   **GDPR & Retence (REQ-17):** Chybí logika pro automatické promazávání dat po 10 letech.

## 3. Doporučení pro rozvoj prototypu

Pro demonstraci (PoC) doporučuji do prototypu zapracovat tyto 3 priority, které mají největší "wow efekt":

### A. Dynamické výpočty (REQ-04)
Implementovat reálný výpočet stravného ve formuláři vyúčtování. Když uživatel zaškrtne "Oběd", částka stravného se automaticky sníží podle zákonných limitů.
> **Proč:** Ukáže to inteligenci systému a úsporu času pro uživatele.

### B. "Trackování" stavu (REQ-13)
Vylepšit dashboard o "Timeline" cestovního příkazu (Kde se CP nachází? U koho čeká na schválení?).
> **Proč:** To je nejčastější dotaz zaměstnanců ("Kdy dostanu peníze?").

### C. Mobilní náhled (REQ-07)
Vyladit formulář pro vyúčtování tak, aby umožňoval snadné nahrání fotky účtenky přímo z mobilu.
> **Proč:** Specifikace klade důraz na responsivitu a toto je pro cestovatele klíčový use-case.

### D. Rozšířené zálohy (High Priority)
Upravit formulář tak, aby umožňoval přidání více řádků záloh s různými měnami a způsoby vyplacení (stejně jako u plánovaných nákladů).
> **Proč:** Specifikace na toto klade důraz a je to častý požadavek u složitějších zahraničních cest.

## User Review Required

> [!IMPORTANT]
> Souhlasíte s těmito prioritami? Pokud ano, začnu s bodem **A (Výpočty stravného)**, což je technicky nejnáročnější část vyúčtování.
