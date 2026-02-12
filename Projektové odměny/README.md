# Projektové Odměny - Dokumentace

Tato aplikace slouží k evidenci a schvalování projektových odměn v rámci fází (milníků) projektu.

## Rychlý Start (Čistá Instalace)

1. **Inicializace databáze:**
   ```bash
   npx prisma db push --force-reset
   node prisma/seed.js
   ```

2. **Spuštění aplikace:**
   ```bash
   npm run dev
   ```

## Uživatelské Role a Workflow

Aplikace rozlišuje následující role:
- **ID (Ředitel):** Má plný přístup ke všem projektům. Schvaluje navržené odměny a týmové budgety. Má právo odeslat odměny k výplatě.
- **PM (Projektový Manažer):** Spravuje své projekty. Navrhuje odměny pro zaměstnance v rámci fází a navrhuje změny týmového budgetu.
- **PRD (Produktový Ředitel):** Vidí projekty, kde je přiřazen jako PRD. Má právo schvalovat odměny.
- **MLZ (Manažer):** Vidí odměny pouze pro členy svého týmu (přímé podřízené).

### Workflow Schvalování (Milníky)
Odměny se schvalují hromadně po celých sloupcích (fázích):
1. **PM** navrhne celou fázi (**NAVRHNOUT**).
2. **ID/PRD** schválí celou fázi (**SCHVÁLIT**).
3. **ID** odešle fázi do mezd (**K VÝPLATĚ**).

### Týmový Budget (Pool)
Každý projekt má svůj vyhrazený pool pro týmové odměny:
- **PM** navrhuje výši poolu (ikona tužky).
- **ID** schvaluje navrženou výši (ikona fajfky).
- Čerpání z poolu zadávají PM/ID s textovou poznámkou.

## Správa Uživatelů a Projektů
- Nové projekty zakládá role **ID** nebo **PM**.
- Pro přidání nových zaměstnanců do systému je nutné je přidat do tabulky `User` v databázi (nebo rozšířit rozhraní pro správu uživatelů).
