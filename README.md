<img width="3168" height="1344" alt="Gemini_Generated_Image_t5sf5st5sf5st5sf" src="https://github.com/user-attachments/assets/36af7871-41ee-4237-a0a4-934283c242ff" /># Tech-Sprint-2025

# ⚡ASthetiX

> Built by Team Noob Hackers for TechSprint 2025-2026




---

## 💡 Inspiration
As Noob Hackers, we know the struggle is real. Setting up a frontend project often feels harder than writing the actual code. We spend hours configuring folders, linking CSS, and fighting with boilerplates before we even start designing. 

We wanted to build the tool we wish we had: an "Instant Prototyping Engine" that allows anyone—from total noobs to pros—to go from a text idea to a live, industry-standard website in seconds.

## 🤖 What it does
  **ASTHETIX** is a browser-based autonomous frontend architect.
1.  **Understand:** It takes a natural language prompt (e.g., "A personal portfolio with a neon dark theme").
2.  **Architect:** It uses **Google Gemini 2.5 Flash** to generate semantic HTML, responsive CSS, and interactive JavaScript simultaneously.
3.  **Deploy:** It utilizes a **Virtual File System** to inject the code into a secure sandbox, providing an instant **Live Preview**.
4.  **Refine:** It acts as a Senior Engineer, ensuring the generated code follows industry standards (8px grids, semantic tags, and responsive layouts).

## ⚙️ How we built it
We stuck to the basics to build something fast, powerful, and accessible.

* **The Brain:** We integrated the **Google Gemini API** (`gemini-2.5-flash`). We used advanced "System Instructions" to force the AI to produce complete, 3-file deployments (HTML/CSS/JS) in a single shot.
* **The System:** We built a **Client-Side Virtual File System**. Instead of a backend server, we use **Blob URLs** (`URL.createObjectURL`) to dynamically link the generated CSS and JS strings to the HTML `<iframe>` in real-time.
* **The UI:** We designed a custom **Cyberpunk/Glassmorphism interface** from scratch to give it a futuristic "hacker" aesthetic.

## 🔧 Tech Stack
* ![Gemini](https://img.shields.io/badge/Google-Gemini_1.5_Flash-8E75B2) **(Generative AI)**
* ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow) **(Core Logic)**
* ![HTML/CSS](https://img.shields.io/badge/Frontend-HTML5_%26_CSS3-orange) **(Neon UI)**
* ![Git](https://img.shields.io/badge/Version_Control-Git-red)

## 🧠 Challenges we ran into
* **The "Missing CSS" Bug:** Initially, the AI would generate HTML but "forget" to write the CSS file. We fixed this by creating a strict `deployWebsite` tool definition that forces the AI to return all three files (HTML, CSS, JS) as mandatory arguments.
* **Browser Security:** Linking dynamic strings of code into an Iframe is tricky due to Cross-Origin (CORS) policies. Learning to use Blob Objects was a breakthrough moment for the team.

## 🏅 Accomplishments that we're proud of
* **Zero-Backend Architecture:** The entire app runs locally in the browser.
* **Self-Healing Code:** The AI generates cleaner, more semantic code than we usually write ourselves!
* **The Aesthetic:** We managed to make the tool look like a sci-fi command center from a movie.

## 🚀 What's next for Structura AI
* **Download Feature:** Allowing users to export the generated code as a `.zip` file.
* **Voice Commands:** Designing websites by talking to the AI ("Make the background blue").
* **Multi-Page Support:** Expanding beyond single-page landing sites to full web apps.

---

## 👥 Team Noob Hackers
* **[Priyam Patra]** - Frontend & GEN AI
* **[Ayusman Dey]** - [UI-UX Designer]


## 🏁 Getting Started (Judge's Guide)

### 🔑 Step 1: Get Your Free API Key
To use ASthetiX, you need a Google Gemini API Key. It's free and takes 1 minute to get:
1.  Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  Click **"Create API Key"**.
3.  Select "Create API key in new project".
4.  Copy the key (it starts with `AIza...`).

### 💻 Step 2: Run the Project Locally
1.  **Clone the repo:**
    ```bash
    git clone [https://github.com/your-username/asthetix.git](https://github.com/your-username/asthetix.git)
    cd asthetix
    ```

2.  **Run a local server:**
    * **Using VS Code (Recommended):** Install the "Live Server" extension, right-click `index.html`, and select **"Open with Live Server"**.
    * **Using Python:** Open terminal and run `python -m http.server`
    * **Using Node:** Open terminal and run `npx serve .`

3.  **Launch:**
    * Open your browser to `http://localhost:5500` (or the port shown).
    * Paste your **Gemini API Key** into the neon modal.
    * Type a prompt (e.g., *"A login page for a space travel agency"*) and hit **Execute**!

---

**Built with ❤️ by Team Noob Hackers.**
