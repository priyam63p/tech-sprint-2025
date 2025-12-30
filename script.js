import { GoogleGenerativeAI } from "@google/generative-ai";

const els = {
  modal: document.getElementById("apiKeyModal"),
  app: document.getElementById("mainApp"),
  keyInput: document.getElementById("apiKeyInput"),
  submitBtn: document.getElementById("submitKeyBtn"),
  promptInput: document.getElementById("userPrompt"),
  sendBtn: document.getElementById("sendBtn"),
  chatHistory: document.getElementById("chatHistory"),
  fileContainer: document.getElementById("fileContainer"),
  previewFrame: document.getElementById("previewFrame"),
  runCodeBtn: document.getElementById("runCodeBtn"),
  tabs: document.querySelectorAll(".tab-btn"),
  views: document.querySelectorAll(".view-content"),
};

let projectData = {
  html: "",
  css: "",
  js: "",
};

let genAI, model, chatSession;

if (els.tabs.length > 0) {
  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      els.tabs.forEach((t) => t.classList.remove("active"));
      els.views.forEach((v) => v.classList.remove("active"));
      tab.classList.add("active");
      document
        .getElementById(tab.dataset.tab === "files" ? "filesView" : "demoView")
        .classList.add("active");
    });
  });
}

els.submitBtn.addEventListener("click", async () => {
  const key = els.keyInput.value.trim();
  if (!key) return alert("API Key Required");

  try {
    genAI = new GoogleGenerativeAI(key);

    model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `You are a Senior Frontend Engineer and World-Class UI/UX Designer.
            YOUR GOAL:
            Build industry-standard, high-performance, and visually stunning website frontends. 
            Do not just write code; craft a user experience.
            
            DESIGN SYSTEM RULES (Strictly Follow):
            1.  **Visual Hierarchy:** Use spacing (8px grid system), clear typography scales (H1 vs Body), and contrast to guide the user's eye.
            2.  **Modern Aesthetics:** Adapt the design to the request. 
                - If "Corporate": Use clean lines, blues/grays, and sans-serif fonts (Inter/Roboto).
                - If "Creative": Use bold typography, brutalism, or vivid accent colors.
                - *Never* default to a specific style unless it fits the context.
            3.  **Responsive First:** The CSS must use Flexbox/Grid and Media Queries to work on Mobile and Desktop.
            4.  **Interaction Design:** Add subtle hover states, smooth transitions (0.3s ease), and active states for buttons.
            
            TECHNICAL STANDARDS:
            - **HTML:** Use semantic tags (<header>, <nav>, <section>, <article>, <footer>) for SEO and Accessibility.
            - **CSS:** Use CSS Variables (:root) for colors and spacing to ensure consistency.
            - **JS:** Ensure strict null checks. Add event listeners inside 'DOMContentLoaded'.
            // - **Images:** Use realistic placeholders (e.g., 'https://source.unsplash.com/random/800x600?tech').
            
            EXECUTION INSTRUCTIONS:
            You MUST use the 'deployWebsite' tool.
            - 'htmlCode': The complete, semantic HTML structure (with <link> and <script> tags pre-written).
            - 'cssCode': The complete, polished CSS.
            - 'jsCode': The complete, interactive JavaScript.
            
            If the user prompt is simple (e.g., "login page"), assume a high-end, production-ready version of it.
                    
                    // EXAMPLE for a calculator:
                    // 1. {command: "mkdir calculator"}
                    // 2. {content: "<!DOCTYPE html>...", filePath: "calculator/index.html"}
                    // 3. {content: "body { font-family: Arial...}", filePath: "calculator/style.css"}
                    // 4. {content: "document.addEventListener...", filePath: "calculator/script.js"}`,
    });

    els.modal.style.opacity = "0";
    setTimeout(() => {
      els.modal.classList.add("hidden");
      els.app.classList.remove("hidden");
    }, 500);

    chatSession = model.startChat({
      history: [],
      tools: [
        {
          functionDeclarations: [
            {
              name: "deployWebsite",
              description:
                "Deploys a fully functional website with HTML, CSS, and JS.",
              parameters: {
                type: "OBJECT",
                properties: {
                  htmlCode: {
                    type: "STRING",
                    description: "Complete HTML code",
                  },
                  cssCode: { type: "STRING", description: "Complete CSS code" },
                  jsCode: {
                    type: "STRING",
                    description: "Complete JavaScript code",
                  },
                },
                required: ["htmlCode", "cssCode", "jsCode"], // <--- THIS FORCES ALL 3
              },
            },
          ],
        },
      ],
    });
  } catch (e) {
    alert(e.message);
  }
});

els.sendBtn.addEventListener("click", () =>
  handleUserRequest(els.promptInput.value)
);
els.promptInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") handleUserRequest(els.promptInput.value);
});

async function handleUserRequest(text) {
  if (!text) return;

  addLog("USER", text);
  els.promptInput.value = "";
  els.sendBtn.innerText = "CODING...";
  els.sendBtn.disabled = true;

  projectData = { html: "", css: "", js: "" };
  els.fileContainer.innerHTML = "";

  try {
    const result = await chatSession.sendMessage(text);
    const response = await result.response;
    const functionCalls = response.functionCalls();

    if (functionCalls && functionCalls.length > 0) {
      const call = functionCalls[0];

      if (call.name === "deployWebsite") {
        const { htmlCode, cssCode, jsCode } = call.args;

        projectData.html = htmlCode;
        projectData.css = cssCode;
        projectData.js = jsCode;

        createVirtualFileUI("index.html", htmlCode);
        createVirtualFileUI("style.css", cssCode);
        createVirtualFileUI("script.js", jsCode);

        await chatSession.sendMessage([
          {
            functionResponse: {
              name: "deployWebsite",
              response: { result: "Website Deployed Successfully" },
            },
          },
        ]);

        addLog("SYSTEM", "All modules generated successfully.");

        renderPreview();

        if (document.querySelector('[data-tab="preview"]')) {
          document.querySelector('[data-tab="preview"]').click();
        }
      }
    } else {
      addLog("SYSTEM", response.text());
    }
  } catch (error) {
    addLog("ERROR", error.message);
  }

  els.sendBtn.innerText = "EXECUTE";
  els.sendBtn.disabled = false;
}

function renderPreview() {
  const iframe = els.previewFrame;
  if (!iframe) return;

  const cssBlob = new Blob([projectData.css], { type: "text/css" });
  const jsBlob = new Blob([projectData.js], { type: "application/javascript" });

  const cssUrl = URL.createObjectURL(cssBlob);
  const jsUrl = URL.createObjectURL(jsBlob);

  let finalHtml = projectData.html;

  // Inject Virtual Links
  finalHtml = finalHtml.replace(
    /href=["'](\.?\/)?style\.css["']/,
    `href="${cssUrl}"`
  );
  finalHtml = finalHtml.replace(
    /src=["'](\.?\/)?script\.js["']/,
    `src="${jsUrl}"`
  );

  if (!finalHtml.includes(cssUrl)) {
    finalHtml = finalHtml.replace(
      "</head>",
      `<link rel="stylesheet" href="${cssUrl}"></head>`
    );
  }
  if (!finalHtml.includes(jsUrl)) {
    finalHtml = finalHtml.replace(
      "</body>",
      `<script src="${jsUrl}"></script></body>`
    );
  }

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write(finalHtml);
  doc.close();
}

if (els.runCodeBtn) els.runCodeBtn.addEventListener("click", renderPreview);

// --- HELPERS ---
function addLog(sender, message) {
  const div = document.createElement("div");
  div.className = sender === "USER" ? "user-msg" : "ai-msg";
  div.innerHTML = `<span class="label">${sender}:</span> ${message}`;
  els.chatHistory.appendChild(div);
  els.chatHistory.scrollTop = els.chatHistory.scrollHeight;
}

function createVirtualFileUI(path, content) {
  const card = document.createElement("div");
  card.className = "file-card";

  let icon = "fa-file-code";
  if (path.includes("html")) icon = "fa-html5";
  if (path.includes("css")) icon = "fa-css3-alt";
  if (path.includes("js")) icon = "fa-js";

  card.onclick = () => alert(`SOURCE CODE (${path}):\n\n` + content);

  card.innerHTML = `
        <i class="fab ${icon} file-icon"></i>
        <span class="file-name">${path}</span>
    `;

  els.fileContainer.appendChild(card);
}
