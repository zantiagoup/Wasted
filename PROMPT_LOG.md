# Team AI Prompt & Audit Log

**Project Name:** [Insert Project Name]
**Team Members:** [Member 1, Member 2, Member 3]
**SDG Goal Target:** [Goal # and Title]
**Scope:** Team project. Individual classwork is logged in `Classwork/PROMPT_LOG.md`.

---

## Rules of AI Engagement (quick reference)

1. **Boilerplate is fine; architecture is yours.** AI may generate layouts, CSS/Bootstrap grids, regex, SQL/Mongoose schemas, or boilerplate fetch functions. Routing, state trees, and integration logic must be understood by us.
2. **Every prompt gets a human audit.** No blind copy-paste: review, test, refine, and document what we changed.
3. **Oral defense readiness.** Any AI-generated block can be pointed at during evaluation. We must explain how it works and how it was integrated. This log is the study guide.

---

## Week 1 Log Entry

_Duplicate this section for each week. If no AI was used this week, state: "No Generative AI was used in Week 1."_

### 1. High-Level Goal

_What feature, component, or bug were you trying to solve this week?_

- [Describe the goal. Example from this repo: implementing the callback math functions and the dispatch object in `Classwork/Class/js-calculator/js/calculator.js`.]

### 2. The Interaction Log

_Document the primary prompts you used to generate the base code._

| AI Tool Used | Exact Initial Prompt | What the AI Generated (Summary/Snippet) |
| :--- | :--- | :--- |
| [e.g., ChatGPT-4o / Copilot / Claude] | [Paste the exact prompt, word for word] | [Summary of the output, or a short snippet] |

### 3. The Human Audit & Modifications

_What did the AI get wrong or omit? What manual changes did you make to integrate this code into your existing application structure? (2-3 sentences.)_

- **What we changed/added:** [What was wrong or missing, what you rewrote, and why. Be specific: file, function, and the reason for the change.]

### 4. Integration & Learnings

_How does this code integrate with the rest of your system? What is the core mechanism you learned?_

- **Core Mechanics:** [How the piece connects to the rest of the app, and the mechanism you now understand, e.g. how a callback is passed as a value and invoked later.]

### 5. Oral Defense Self-Check

- [ ] We can explain every single line of this code.
- [ ] We understand how the asynchronous operations/CSS classes used here affect other components.
- [ ] We know exactly which file and line numbers this code is located in our repository.
- **File & lines:** [`path/to/file.js` lines 00-00]

---

## Week 2 Log Entry

_Duplicate this section for each week. If no AI was used this week, state: "No Generative AI was used in Week 2."_

### 1. High-Level Goal

-

### 2. The Interaction Log

| AI Tool Used | Exact Initial Prompt | What the AI Generated (Summary/Snippet) |
| :--- | :--- | :--- |
|  |  |  |

### 3. The Human Audit & Modifications

- **What we changed/added:**

### 4. Integration & Learnings

- **Core Mechanics:**

### 5. Oral Defense Self-Check

- [ ] We can explain every single line of this code.
- [ ] We understand how the asynchronous operations/CSS classes used here affect other components.
- [ ] We know exactly which file and line numbers this code is located in our repository.
- **File & lines:**

---

## Reference: what a good entry looks like

**Exemplary (Prompt Alchemist standard)**

- **Goal:** Build an Express endpoint to authenticate a user using JWT.
- **Prompt:** "Show me how to write an Express POST route for `/api/login` that verifies a user's hashed password against a MongoDB document using mongoose, and returns a signed JWT if successful."
- **Audit:** The AI used a generic `User.findOne`; we swapped it for our `UserModel` service. It hardcoded the signing secret (`jwt.sign(payload, 'secret')`), so we replaced it with `process.env.JWT_SECRET` to keep secrets out of GitHub. We also added an error handler for database timeouts so the server does not crash on a bad DB state.
- **Learnings:** The route returns a signed JWT the client must send in the `Authorization` header for protected routes. We learned `bcrypt.compare` runs asynchronously to avoid timing attacks.

**Unacceptable (fails the ethical AI boundary)**

- **Goal:** Connect my server to MongoDB.
- **Prompt:** "Write my database connection code."
- **Audit:** "We pasted it into our server and it connected." No analysis, no customization, no error handling, high risk of failing the oral defense.
