# Projektové odměny - Technická specifikace

Tento dokument definuje systém pro evidenci, schvalování a sledování výplaty projektových odměn.

## 1. Cíle projektu
- **Evidence:** Ruční záznam výše odměn bez automatických výpočtů.
- **Sledování stavu:** Přehled o tom, které odměny jsou navržené, schválené nebo již vyplacené.
- **Flexibilita:** Podpora dynamických fází projektu a změn v obsazení/částkách během trvání projektu.
- **Řízení přístupu:** Striktní viditelnost dat podle uživatelských rolí.

## 2. Uživatelské role
- **Ředitel implementace (ID):** Supervizor, vidí všechna data ze všech projektů. Schvaluje odměny a dává pokyn k výplatě. Může pověřit PRD revizí návrhu.
- **Projektový manažer (PM):** Vidí pouze své projekty. Navrhuje odměny, jejich změny a dává pokyny k výplatě.
- **Produktový ředitel (PRD):** Vidí své projekty. Provádí korekce návrhů, zadává schválené odměny do mezd/fakturace.
- **MLZ:** Vidí data pouze svých přímých podřízených (zaměstnanců). Zadává odměny "svých" lidí do mezd na pokyn PRD.

## 3. Datový model a dynamika
- **Fáze projektu (Sloupce):** Počet a názvy fází se liší projekt od projektu. 
- **Změny v čase:** V průběhu projektu lze přidávat nové fáze (sloupce), přidávat nové pracovníky nebo měnit částky u nevyplacených fází.
- **Stav výplaty:** Sleduje se status vyplacení pro každou dvojici (pracovník, fáze).

## 4. Klíčové scénáře

### Scénář 1: Návrh a správa odměn
- PM navrhuje/upravuje výši odměn, rozdělení do fází a obsazení lidmi.
- ID schvaluje tyto návrhy nebo změny.
- PRD provádí případné korekce.

### Scénář 2: Pokyn k výplatě
1. **Návrh:** PM navrhuje výplatu za konkrétní dokončenou fázi.
2. **Schválení:** ID schvaluje a dává pokyn k zahrnutí do mezd.
3. **Realizace:** PRD zadává do mezd/fakturace, případně dává pokyn MLZ k zadání pro jejich lidi.

## 5. Datová viditelnost (Zabezpečení)
- **ID:** Vidí vše (globální přístup).
- **PM:** Vidí projekty, kde je uveden jako `PM`.
- **PRD:** Vidí projekty, kde je uveden jako `PRD`.
- **MLZ:** Vidí pouze záznamy odměn pro uživatele, kteří jsou jeho přímými podřízenými.

## 6. Export a Integrace
- **Excel:** Možnost vygenerovat přehled odměn za projekt do Excelu ve struktuře odpovídající vzoru.
- **Technický Stack:** Next.js (App Router), TypeScript, Tailwind CSS, Shadcn UI, Prisma ORM (SQLite).
