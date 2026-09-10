# Team AI Prompt & Audit Log

**Project Name:** Wasted
**Team Members:** Andres Garcia Gonazlez, Zantiago Vargas Beltran, Pedro Chucuan Gerardo
**SDG Goal Target:** Goal 12: Responsible Consumption and Production (partially Goal 11: Sustainable Cities and Communities)
**Scope:** Team project. Individual classwork is logged in `Classwork/PROMPT_LOG.md`.

---

## Rules of AI Engagement (quick reference)

1. **Boilerplate is fine; architecture is yours.** AI may generate layouts, CSS/Bootstrap grids, regex, SQL/Mongoose schemas, or boilerplate fetch functions. Routing, state trees, and integration logic must be understood by us.
2. **Every prompt gets a human audit.** No blind copy-paste: review, test, refine, and document what we changed.
3. **Oral defense readiness.** Any AI-generated block can be pointed at during evaluation. We must explain how it works and how it was integrated. This log is the study guide.

**Writing rows:** paste the prompt word for word. If it contains a `|`, escape it as `\|`; for line breaks inside a cell use `<br>`.

---

## Week 1

_Add one row per prompt. If no AI was used this week, write: "No Generative AI was used in Week 1."_


---
| Goal | Prompt | Audit | Learnings |
| :--- | :--- | :--- | :--- |
| Design the Wasted isotype: a W merged with a bin, to generate it with an image AI. | "[Image #1] Estamos trabajando en este proyecto de Wasted y tengo que hacer un logo. Específicamente estamos buscando hacer un isótipo para que reemplace la letra W por una integración entre un W y un icono de basura muy minimalista, con pocos trazos y tipo SVG vectorizado personalizado.<br><br>Lo generaré con un AI LLM de generación de imágenes. Analízalo, ve mi propuesta, imagínatelo y luego dame el prompt para que yo lo pueda copiar en mi AI generative image, de preferencia." | The AI only wrote the text prompt for the image generator; it did not draw the logo. The concept (the W *is* the bin, few strokes) was ours, and so was picking and cleaning the final SVG. The three files in `design-system/` are the result. | The isotype and the letter are the same stroke, which is why the logo cannot be redrawn in another typeface. The viewBox ratios (`0 0 339 116` for the lockup, `0 0 72 78` for the icon) are what every later layout sizes against. |
| Turn the logos and palette we chose into a design system doc, and rebrand the proposal HTML with them. | "Te agregué los dos logos para el proyecto, además de la paleta de colores. Quiero que la extraigas y que la pongas en un brief system design MD para que tengamos los colores y los dos logos SVG, para que podamos hacerlo y referenciarlo como nuestro system design mucho más adelante. Con esto en mente, rediseña el wasted HTML que tenemos, cambia los colores y reemplaza el logo que tienes por el verdadero logo SVG. [Image #2]" | The five greens and the logos were our decision; the AI extracted them into `design-system/DESIGN_SYSTEM.md` and applied them to `wasted.html`. Measuring the contrast was the useful part: it flagged that `--sage` on white is only 2.63:1, so we restricted it to rules and borders, never text, and that `--moss` on `--lime` fails AA at 4.46. | The doc is the single source and the HTML only consumes its tokens, so a color change happens in one place. WCAG exempts logotypes from contrast, which is why the lockup still needs `alt="Wasted"` and is never used as running text. |
| Add a closing hero section with the big logo and the slogan. | "Cierre abajo del todo. Quiero que pongas una sección de cierre tipo hero con el logo muy grande y un eslogan que diga "Throw it right"." | It took three corrections. First we asked for the shape: "ponlo en una card flotante, todo center aligned, rounded corners." It then sized the card to the text instead of the layout, so we said "debe ser del ancho de la columna central que tenemos (para que se vea diseno consistente.." and, when that still was not it, "Prefiero que esté alineado a todo el ancho de la columna central, no solamente el texto." Only then did it use `grid-column: 1 / -1`. | The card is the one block that spans both columns of the grid; everything else stays in the content column. Saying "full width" is ambiguous to the model: the fix was naming the grid behaviour we wanted, not the look. |
| Export the proposal to a single continuous PDF. | "Ahora prepara un script para exportarlo a PDF, display scale de 1. (todo en una sola page..)" | The first version came out as six A4 sheets, because `page.pdf()` applies the `@media print` CSS. It needed `page.emulateMedia({ media: "screen" })`. We also had it reuse the Playwright that another tool already had installed instead of adding dependencies to the project. | `export-pdf.mjs` measures `scrollHeight` and asks Chrome for a page exactly that tall, which is how the document stays in one piece. The script also counts the pages in the output and exits with an error if there is more than one. |
| Split the workspace into folders so the design system, the deliverables and the app each live in one place. | "Organiza todo el workspace en donde dividas un folder para el design system y otro folder para entregables. Deja el prompt log en el root." | It moved the files but left `wasted.html` pointing at the old logo locations, so the four `src`/`href` had to be rewritten. The folder names and the rule that `entregables/` only holds what we submit were ours. We re-ran the export to confirm the logos still resolved. | Relative paths belong to the file, not to the folder: moving an HTML breaks every asset link inside it. The layout is `design-system/` (brand source), `entregables/` (what we submit), `wasted/` (the app) and `PROMPT_LOG.md` at the root. |
| Keep the HTML and the export script out of git, since the PDF is what we hand in. | "Ponen una subcarpeta: el Wasted HTML y el Export to PDF. Esta es una subcarpeta que no incluiremos en git, se llmara "html design"" | The space in `html design` broke the script: it built the file URL with `new URL(...).pathname`, which leaves the space as `%20` and then re-encodes it to `%2520`, so Chrome answered `ERR_FILE_NOT_FOUND`. It was changed to `fileURLToPath()`. The script also kept writing the PDF inside the ignored folder, so its default output moved up to `entregables/`. | `.gitignore` decides what ships: we version the PDF, not its source. `new URL().pathname` is percent-encoded; `fileURLToPath()` gives the real filesystem path. |
| Initialize the repo and make the first commit with the folder structure. | "No, el container y el proyecto son dos cosas aparte pero sí haz el primer commit." | The commit went out as `abbrix` instead of `zantiagoup`, because our global gitconfig picks the identity from the remote URL (`includeIf hasconfig:remote.*.url`) and this repo has no remote yet. We set `user.name` and `user.email` locally and amended with `--reset-author`. | `Proyecto/` is its own repo, separate from `Container/`. Local repo config beats the global conditional include, so the identity holds even once we add the remote. `git commit --amend` rewrites the message, but the old commit stays reachable through the reflog until `git reflog expire` plus `git gc --prune`. |

## Week 2

| Goal | Prompt | Audit | Learnings |
| :--- | :--- | :--- | :--- |
|  |  |  |  |

---

## Reference: what a good entry looks like

**Exemplary (Prompt Alchemist standard)**

| Goal | Prompt | Audit | Learnings |
| :--- | :--- | :--- | :--- |
| Build an Express endpoint to authenticate a user using JWT. | "Show me how to write an Express POST route for `/api/login` that verifies a user's hashed password against a MongoDB document using mongoose, and returns a signed JWT if successful." | The AI used a generic `User.findOne`; we swapped it for our `UserModel` service. It hardcoded the signing secret (`jwt.sign(payload, 'secret')`), so we replaced it with `process.env.JWT_SECRET` to keep secrets out of GitHub. We also added an error handler for database timeouts so the server does not crash on a bad DB state. | The route returns a signed JWT the client must send in the `Authorization` header for protected routes. We learned `bcrypt.compare` runs asynchronously to avoid timing attacks. |

**Unacceptable (fails the ethical AI boundary)**

| Goal | Prompt | Audit | Learnings |
| :--- | :--- | :--- | :--- |
| Connect my server to MongoDB. | "Write my database connection code." | "We pasted it into our server and it connected." No analysis, no customization, no error handling, high risk of failing the oral defense. | — |
