# Static landing page images

These two decorative photos are referenced by the landing page and are **not**
managed through the CMS. Drop the real files in here — until then those two
images render broken.

| File | Used by | Suggested size |
| --- | --- | --- |
| `hero-reception.jpg` | `src/components/sections/hero.tsx` — right-hand hero photo | ~1600×1000, landscape |
| `doctor-portrait.jpg` | `src/components/sections/why-us.tsx` — "Dlaczego my?" portrait | ~840×1040, portrait |

Everything else pictured on the site (news thumbnails, doctor photos) is
uploaded through the CMS admin at `/admin` and served from the Payload media
collection.
