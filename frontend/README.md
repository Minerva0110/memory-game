# Minnisleikur – SCI-FI Edition

Þetta er [Next.js](https://nextjs.org) verkefni sem var sett upp með [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) og útvíkkað með Express.js, PostgreSQL og Prisma.

## Byrjaðu strax

**1. Klónaðu verkefnið:**

```bash
git https://github.com/Minerva0110/memory-game.git
cd minnisleikur
```

**2. Settu upp bæði framenda og bakenda:**

```bash
npm install
```

**3. Settu upp `.env` skrá í `backend/` með gagnagrunnstengingum:**

```env
DATABASE_URL="postgresql://notandi:lykilorð@host:port/gagnagrunnur"
```

**4. Keyrðu Prisma og gagnagrunn:**

```bash
npx prisma db push
```

**5. Keyrðu bæði framenda og bakenda samtímis:**

```bash
npm run dev
```

`frontend` keyrir á: [http://localhost:3000](http://localhost:3000)  
`backend` keyrir á: [http://localhost:8000](http://localhost:8000)

---

## Hvernig leikurinn virkar

Veldu leikham:

- **Keppni** – Tími og tilraunir eru mældar og vistaðar í stigatöflu
- **Æfing** – Tíminn er mældur en ekkert vistað
- **Frjáls spilun** – Engin tími eða mælingar, bara afslappað

---

## Tæknilegt yfirlit

| Tækni            | Lýsing                                  |
|------------------|------------------------------------------|
| Next.js          | Framendi (React + App Router)            |
| Express.js       | Bakendi REST API                         |
| PostgreSQL       | Gagnagrunnur (í Neon.tech)               |
| Prisma ORM       | Gagnagrunnstengingar og módel            |
| Sass (SCSS)      | Sérsniðin útlit og stílar                |
| Vercel           | Hýsing á framenda                        |

---

##  Sérkenni

- **Stjörnu-bakgrunnur** með fjölda fljótandi neon punkta
- Nafnaskráning og popup-stigatafla
- Móttekilegt útlit sem virkar á öllum skjástærðum
- Útfært með áherslu á „sci-fi“ stíl og gagnvirkni

---

## 🌍 Hýsing

### Hýsing á Vercel:

Verkefnið er hýst með Vercel:

[Deploy on Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)

### Backend + Gagnagrunnur:

Gagnagrunnurinn er vistaður á [Neon.tech](https://neon.tech) með PostgreSQL.

---


### Höfundur

Verkefni þróað sem hluti af **Vefforritun 2** – 2025  
Mínerva Hjörleifsdóttir

