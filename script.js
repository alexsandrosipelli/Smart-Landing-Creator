// ================= ELEMENTOS =================
const titleInput = document.getElementById("title");
const subtitleInput = document.getElementById("subtitle");
const textInput = document.getElementById("text");
const ctaInput = document.getElementById("cta");
const ctaColorInput = document.getElementById("ctaColor");
const imageInput = document.getElementById("image");
const seoTitleInput = document.getElementById("seoTitle");
const seoDescInput = document.getElementById("seoDesc");
const bgColorInput = document.getElementById("bgColor");

const previewTitle = document.getElementById("previewTitle");
const previewSubtitle = document.getElementById("previewSubtitle");
const previewText = document.getElementById("previewText");
const previewBtn = document.getElementById("previewBtn");
const previewImage = document.getElementById("previewImage");

const imageStatus = document.getElementById("imageStatus");
const imagePlaceholder = document.getElementById("imagePlaceholder");
const landingPreview = document.getElementById("landingExportArea");

let editIndex = null;

// ================= MOBILE TOGGLE =================
const formContainer = document.getElementById("formContainer");
const previewContainer = document.getElementById("previewContainer");
const showFormBtn = document.getElementById("showFormBtn");
const showPreviewBtn = document.getElementById("showPreviewBtn");

function toggleMobileView(view) {
    if (!formContainer || !previewContainer || !showFormBtn || !showPreviewBtn) return;
    if (view === "form") {
        formContainer.classList.add("active");
        previewContainer.classList.remove("active");
        showFormBtn.classList.add("active");
        showPreviewBtn.classList.remove("active");
    } else {
        formContainer.classList.remove("active");
        previewContainer.classList.add("active");
        showFormBtn.classList.remove("active");
        showPreviewBtn.classList.add("active");
    }
}

// Inicializa botões mobile
if (showFormBtn && showPreviewBtn) {
    showFormBtn.addEventListener("click", () => toggleMobileView("form"));
    showPreviewBtn.addEventListener("click", () => toggleMobileView("preview"));
    if (window.innerWidth <= 768) toggleMobileView("form");
}

// ================= ATUALIZA PREVIEW =================
function updatePreview() {
    previewTitle.innerText = titleInput.value || "Aumente suas vendas com uma landing profissional";
    previewSubtitle.innerText = subtitleInput.value || "Design moderno, rápido e focado em conversão";
    previewText.innerText = textInput.value || "Criamos páginas otimizadas para transformar visitantes em clientes.";
    previewBtn.innerText = ctaInput.value || "Quero saber mais";
    previewBtn.style.background = ctaColorInput.value || "#4f46e5";

    // Substitui gradiente por cor sólida para evitar erros no canvas
    const bg = bgColorInput.value || "#ffffff";
    landingPreview.style.background = bg;

    const imageUrl = imageInput.value.trim();
    if (!imageUrl) {
        previewImage.style.display = "none";
        imagePlaceholder.style.display = "flex";
        imageStatus.innerText = "🖼️ Insira uma URL de imagem.";
        imageStatus.className = "image-status info";
        return;
    }
    loadImageSmart(imageUrl);
}

// ================= SMART IMAGE LOADER =================
function loadImageSmart(url) {
    previewImage.crossOrigin = "anonymous";
    previewImage.src = url;

    previewImage.onload = () => {
        previewImage.style.display = "block";
        imagePlaceholder.style.display = "none";
        imageStatus.innerText = "✅ Imagem carregada com sucesso!";
        imageStatus.className = "image-status success";
    };

    previewImage.onerror = () => {
        // Tenta proxy para CORS
        const proxiedUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
        previewImage.src = proxiedUrl;

        previewImage.onload = () => {
            previewImage.style.display = "block";
            imagePlaceholder.style.display = "none";
            imageStatus.innerText = "⚠️ Imagem carregada via proxy (CORS corrigido)";
            imageStatus.className = "image-status warning";
        };

        previewImage.onerror = () => {
            previewImage.style.display = "none";
            imagePlaceholder.style.display = "flex";
            imageStatus.innerText = "❌ Não foi possível carregar a imagem. Verifique o link.";
            imageStatus.className = "image-status error";
        };
    };
}

// ================= INPUT LISTENERS =================
document.querySelectorAll("input, textarea").forEach(el => {
    el.addEventListener("input", updatePreview);
});

// ================= SAVE LANDING =================
function saveLanding() {
    const landings = JSON.parse(localStorage.getItem("landings")) || [];
    const landing = {
        title: titleInput.value,
        subtitle: subtitleInput.value,
        text: textInput.value,
        cta: ctaInput.value,
        color: ctaColorInput.value,
        bgColor: bgColorInput.value,
        image: imageInput.value,
        seoTitle: seoTitleInput.value,
        seoDesc: seoDescInput.value,
        date: new Date().toLocaleString()
    };

    if (editIndex !== null) {
        landings[editIndex] = landing;
        editIndex = null;
    } else {
        landings.push(landing);
    }

    localStorage.setItem("landings", JSON.stringify(landings));
    clearForm();
    renderList();
    alert("✅ Landing salva com sucesso!");
}

// ================= RENDER LIST =================
function renderList() {
    const list = document.getElementById("landingList");
    list.innerHTML = "";
    const landings = JSON.parse(localStorage.getItem("landings")) || [];

    if (landings.length === 0) {
        list.innerHTML = "<p class='text-muted'>Nenhuma landing criada ainda.</p>";
        return;
    }

    landings.forEach((l, i) => {
        const div = document.createElement("div");
        div.className = "landing-item";
        div.setAttribute("role", "listitem");
        div.setAttribute("tabindex", "0");
        div.style.cursor = "pointer";

        div.innerHTML = `
            <div>
                <strong>${l.title || "(Sem título)"}</strong><br>
                <small>${l.date || ""}</small>
            </div>
            <div>
                <button class="btn btn-sm btn-primary mr-2" onclick="event.stopPropagation(); editLanding(${i})">
                    Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="event.stopPropagation(); deleteLanding(${i})">
                    Excluir
                </button>
            </div>
        `;

        div.addEventListener("click", () => openLandingInPreview(i));
        div.addEventListener("keydown", e => { if (e.key === "Enter") openLandingInPreview(i); });
        list.appendChild(div);
    });
}

// ================= EDIT LANDING =================
function editLanding(index) {
    const landings = JSON.parse(localStorage.getItem("landings")) || [];
    const l = landings[index];

    titleInput.value = l.title;
    subtitleInput.value = l.subtitle;
    textInput.value = l.text;
    ctaInput.value = l.cta;
    ctaColorInput.value = l.color;
    bgColorInput.value = l.bgColor || "#ffffff";
    imageInput.value = l.image;
    seoTitleInput.value = l.seoTitle;
    seoDescInput.value = l.seoDesc;

    editIndex = index;
    updatePreview();
    if (window.innerWidth <= 768) toggleMobileView("form");
    clearForm();
}

// ================= DELETE LANDING =================
function deleteLanding(index) {
    const landings = JSON.parse(localStorage.getItem("landings")) || [];
    landings.splice(index, 1);
    localStorage.setItem("landings", JSON.stringify(landings));
    renderList();
}

// ================= CLEAR FORM =================
function clearForm() {
    titleInput.value = "";
    subtitleInput.value = "";
    textInput.value = "";
    ctaInput.value = "";
    ctaColorInput.value = "#4f46e5";
    imageInput.value = "";
    seoTitleInput.value = "";
    seoDescInput.value = "";
    editIndex = null;
    updatePreview();
    highlightServiceBanner();
}

// ================= EXPORT IMAGE =================
function exportLandingImage() {
    imageStatus.innerText = "⏳ Gerando imagem...";
    imageStatus.className = "image-status info";

    const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
        imageStatus.innerText = "⚠️ Para baixar a imagem use um computador ou ative o modo desktop no navegador.";
        imageStatus.className = "image-status error";
        return;
    }

    // Captura o estilo original
    const originalBg = landingPreview.style.background;
    const computedStyle = getComputedStyle(landingPreview);
    const backgroundImage = computedStyle.backgroundImage;
    const backgroundColor = computedStyle.backgroundColor;

    // Se tiver gradiente, aplica ele inline temporariamente
    landingPreview.style.background = backgroundImage && backgroundImage !== "none" ? backgroundImage : backgroundColor || "#ffffff";

    html2canvas(landingPreview, {
        useCORS: true,
        allowTaint: false,
        backgroundColor: null, // deixa transparente para capturar gradiente corretamente
        scale: 2
    })
    .then(canvas => {
        const link = document.createElement("a");
        link.download = "landing-page.png";
        link.href = canvas.toDataURL("image/png");
        link.click();

        imageStatus.innerText = "✅ Imagem exportada com sucesso!";
        imageStatus.className = "image-status success";

        // Restaura fundo original
        landingPreview.style.background = originalBg;
    })
    .catch(err => {
        console.error(err);
        imageStatus.innerText = "❌ Falha ao gerar imagem. Verifique imagens e cores.";
        imageStatus.className = "image-status error";

        landingPreview.style.background = originalBg;
    });
    clearForm();
}

// ================= ABRIR LANDING NO PREVIEW =================
function openLandingInPreview(index) {
    const landings = JSON.parse(localStorage.getItem("landings")) || [];
    const l = landings[index];
    if (!l) return;

    titleInput.value = l.title || "";
    subtitleInput.value = l.subtitle || "";
    textInput.value = l.text || "";
    ctaInput.value = l.cta || "";
    ctaColorInput.value = l.color || "#4f46e5";
    bgColorInput.value = l.bgColor || "#ffffff";
    imageInput.value = l.image || "";
    seoTitleInput.value = l.seoTitle || "";
    seoDescInput.value = l.seoDesc || "";

    editIndex = index;
    updatePreview();
    landingPreview.style.background = l.bgColor || "#ffffff";

    requestAnimationFrame(() => {
        setTimeout(() => {
            landingPreview.scrollIntoView({ behavior: "smooth", block: "start" });
            landingPreview.classList.remove("highlight");
            void landingPreview.offsetWidth;
            landingPreview.classList.add("highlight");

            const feedback = document.getElementById("formFeedback");
            if (feedback) {
                feedback.innerText = "👁️ Landing carregada no preview. Veja acima.";
                feedback.style.color = "#16a34a";
                setTimeout(() => feedback.innerText = "", 2500);
            }
        }, 180);
    });

    if (window.innerWidth <= 768) toggleMobileView("preview");
}

// ================= DESTAQUE BANNER =================
function highlightServiceBanner() {
    const banner = document.querySelector(".service-banner");
    if (!banner) return;
    banner.scrollIntoView({ behavior: "smooth", block: "center" });
    banner.classList.add("highlight");
    setTimeout(() => banner.classList.remove("highlight"), 1200);
}
// ================= GERAR HTML =================
const generateHTMLBtn = document.getElementById("generateHTMLBtn");

if (generateHTMLBtn) {
    generateHTMLBtn.addEventListener("click", generateLandingHTML);
}

function generateLandingHTML() {
  const title = titleInput.value || "Título da Landing";
    const subtitle = subtitleInput.value || "Subtítulo da Landing";
    const text = textInput.value || "Descrição detalhada da landing page.";
    const ctaText = ctaInput.value || "Chamada para ação";
    const ctaColor = ctaColorInput.value || "#4f46e5";
    const imageUrl = imageInput.value || "";
    const bgColor = bgColorInput.value || "#ffffff";

    const htmlContent = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<style>
    body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 0;
        background: ${bgColor};
        color: #1f2937;
    }
    .landing-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 40px 20px;
        text-align: center;
    }
    h1 {
        font-size: 2.5rem;
        margin-bottom: 0.5rem;
        color: #111827;
    }
    h2 {
        font-size: 1.5rem;
        margin-bottom: 1.5rem;
        color: #374151;
    }
    p {
        font-size: 1rem;
        margin-bottom: 1.5rem;
        line-height: 1.6;
        color: #4b5563;
    }
    .cta-btn {
        display: inline-block;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        color: #fff;
        background: ${ctaColor};
        border: none;
        border-radius: 8px;
        text-decoration: none;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    .cta-btn:hover {
        opacity: 0.9;
    }
    .landing-image {
        max-width: 100%;
        height: auto;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        margin-bottom: 30px;
    }
    footer {
        margin-top: 50px;
        font-size: 0.9rem;
        color: #6b7280;
    }
</style>
</head>
<body>
<div class="landing-container">
    ${imageUrl ? `<img src="${imageUrl}" alt="Imagem da Landing" class="landing-image">` : ''}
    <h1>${title}</h1>
    <h2>${subtitle}</h2>
    <p>${text}</p>
    <a href="Quer-personalizar-o-link-entre-em-contato-11948914961" class="cta-btn">${ctaText}</a>
    <footer>
    &copy; ${new Date().getFullYear()} Alexsandro Sipelli
</footer>
</div>

</body>
</html>
`;
    // Criar link para download
    const blob = new Blob([htmlContent], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "LandingPage.html";
    link.click();

    alert("✅ HTML da landing gerado com sucesso! Você pode abrir o arquivo no navegador.");
    clearForm();
}
// ================= MODELOS DE LANDINGS =================
const landingTemplates = [
    {
        title: "Consultoria Digital Profissional",
        subtitle: "Transforme seu negócio com estratégias digitais",
        text: "Aumente suas vendas e presença online com soluções de marketing digital, UX e performance.",
        cta: "Solicitar Consultoria",
        color: "#10b981",
        bgColor: "linear-gradient(135deg, #f0fdfa, #ccfbf1)",
        image: "https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=800&q=80",
        seoTitle: "Consultoria Digital Profissional",
        seoDesc: "Serviços de marketing, UX e performance digital para aumentar resultados."
    },
    {
        title: "Agência de Design Criativo",
        subtitle: "Design que encanta e converte",
        text: "Criamos identidades visuais, sites e landing pages com foco em usabilidade e estética.",
        cta: "Ver Portfólio",
        color: "#3b82f6",
        bgColor: "linear-gradient(135deg, #eff6ff, #dbeafe)",
        image: "https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=800&q=80",
        seoTitle: "Agência de Design Criativo",
        seoDesc: "Soluções de design, UI/UX e branding para negócios modernos."
    },
    {
        title: "Curso Online de Marketing Digital",
        subtitle: "Aprenda estratégias que vendem",
        text: "Treinamentos completos para dominar SEO, mídias sociais, anúncios pagos e conversão.",
        cta: "Inscreva-se Agora",
        color: "#f59e0b",
        bgColor: "linear-gradient(135deg, #fffbeb, #fef3c7)",
        image: "https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=800&q=80",
        seoTitle: "Curso Online de Marketing Digital",
        seoDesc: "Aprenda marketing digital do zero com foco em resultados reais."
    },
    {
        title: "App de Produtividade Pessoal",
        subtitle: "Organize sua rotina de forma inteligente",
        text: "Aumente sua produtividade com tarefas, lembretes e insights diários.",
        cta: "Baixar App",
        color: "#ef4444",
        bgColor: "linear-gradient(135deg, #fef2f2, #fee2e2)",
        image: "https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=800&q=80",
        seoTitle: "App de Produtividade Pessoal",
        seoDesc: "Aplicativo para organizar tarefas, metas e rotinas diárias."
    },
    {
        title: "Serviços de Consultoria em TI",
        subtitle: "Segurança, infraestrutura e performance",
        text: "Oferecemos auditoria, otimização de sistemas e suporte técnico especializado.",
        cta: "Solicitar Orçamento",
        color: "#8b5cf6",
        bgColor: "linear-gradient(135deg, #f5f3ff, #ede9fe)",
        image: "https://images.unsplash.com/photo-1506765515384-028b60a970df?auto=format&fit=crop&w=800&q=80",
        seoTitle: "Serviços de Consultoria em TI",
        seoDesc: "Auditoria, otimização e suporte técnico para empresas de todos os portes."
    }
];

// ================= FUNÇÃO PARA CARREGAR MODELOS =================
function loadLandingTemplates() {
    const landings = JSON.parse(localStorage.getItem("landings")) || [];

    // Adiciona apenas se ainda não existirem
    landingTemplates.forEach(template => {
        const exists = landings.some(l => l.title === template.title);
        if (!exists) landings.push(template);
    });

    localStorage.setItem("landings", JSON.stringify(landings));
    renderList(); // Atualiza lista na tela
    alert("✅ Modelos de landing carregados com sucesso!");
}

// ================= BOTÃO PARA CARREGAR MODELOS =================
const loadTemplatesBtn = document.createElement("button");
loadTemplatesBtn.className = "btn btn-success btn-block mt-3";
loadTemplatesBtn.innerText = "🎨 Carregar 5 Modelos de Landing";
loadTemplatesBtn.onclick = loadLandingTemplates;

// Adiciona botão ao container de ações
const actionsContainer = document.getElementById("formActions") || document.getElementById("buttonsContainer");
if (actionsContainer) actionsContainer.appendChild(loadTemplatesBtn);



// ================= INIT =================
renderList();
updatePreview();
