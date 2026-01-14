/* ================= ELEMENTOS DO DOM ================= */
const titleInput = document.getElementById("title");
const subtitleInput = document.getElementById("subtitle");
const textInput = document.getElementById("text");
const ctaInput = document.getElementById("cta");
const ctaColorInput = document.getElementById("ctaColor");
const bgColorInput = document.getElementById("bgColor");
const imageInput = document.getElementById("image");
const seoTitleInput = document.getElementById("seoTitle");
const seoDescInput = document.getElementById("seoDesc");

const previewTitle = document.getElementById("previewTitle");
const previewSubtitle = document.getElementById("previewSubtitle");
const previewText = document.getElementById("previewText");
const previewBtn = document.getElementById("previewBtn");
const previewImage = document.getElementById("previewImage");

const imageStatus = document.getElementById("imageStatus");
const imagePlaceholder = document.getElementById("imagePlaceholder");

const landingPreview = document.getElementById("landingExportArea");
const landingList = document.getElementById("landingList");

let editIndex = null;

/* ================= ATUALIZAÇÃO DO PREVIEW ================= */
function updatePreview() {
    // Título, subtítulo e texto
    previewTitle.innerText = titleInput.value || "Aumente suas vendas com uma landing profissional";
    previewSubtitle.innerText = subtitleInput.value || "Design moderno, rápido e focado em conversão";
    previewText.innerText = textInput.value || "Criamos páginas otimizadas para transformar visitantes em clientes.";

    // Botão CTA
    previewBtn.innerText = ctaInput.value || "Quero saber mais";
    previewBtn.style.background = ctaColorInput.value || "#4f46e5";

    // Fundo do preview
    landingPreview.style.background = bgColorInput.value || "linear-gradient(135deg, #ffffff, #eef2ff)";

    // Imagem
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

/* ================= CARREGADOR INTELIGENTE DE IMAGEM ================= */
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
        // Tentativa via proxy CORS
        const proxiedUrl = `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
        previewImage.src = proxiedUrl;

        previewImage.onload = () => {
            previewImage.style.display = "block";
            imagePlaceholder.style.display = "none";
            imageStatus.innerText = "⚠️ Imagem carregada via proxy (CORS corrigido automaticamente)";
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

/* ================= LISTENERS ================= */
document.querySelectorAll("input, textarea").forEach(el => {
    el.addEventListener("input", updatePreview);
});

bgColorInput.addEventListener("input", updatePreview);

/* ================= SALVAR LANDING ================= */
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

/* ================= RENDER LISTA DE LANDINGS ================= */
function renderList() {
    landingList.innerHTML = "";
    const landings = JSON.parse(localStorage.getItem("landings")) || [];

    if (!landings.length) {
        landingList.innerHTML = "<p class='text-muted'>Nenhuma landing criada ainda.</p>";
        return;
    }

    landings.forEach((landing, i) => {
        const div = document.createElement("div");
        div.className = "landing-item";
        div.setAttribute("role", "listitem");
        div.setAttribute("tabindex", "0");
        div.style.cursor = "pointer";

        div.innerHTML = `
            <div>
                <strong>${landing.title || "(Sem título)"}</strong><br>
                <small>${landing.date || ""}</small>
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

        // Clique no card abre no preview
        div.addEventListener("click", () => openLandingInPreview(i));

        // Enter também abre
        div.addEventListener("keydown", e => { if (e.key === "Enter") openLandingInPreview(i); });

        landingList.appendChild(div);
    });
}

/* ================= EDITAR LANDING ================= */
function editLanding(index) {
    const landings = JSON.parse(localStorage.getItem("landings")) || [];
    const landing = landings[index];

    titleInput.value = landing.title;
    subtitleInput.value = landing.subtitle;
    textInput.value = landing.text;
    ctaInput.value = landing.cta;
    ctaColorInput.value = landing.color;
    bgColorInput.value = landing.bgColor || "#ffffff";
    imageInput.value = landing.image;
    seoTitleInput.value = landing.seoTitle;
    seoDescInput.value = landing.seoDesc;

    editIndex = index;
    updatePreview();
}

/* ================= DELETAR LANDING ================= */
function deleteLanding(index) {
    const landings = JSON.parse(localStorage.getItem("landings")) || [];
    landings.splice(index, 1);
    localStorage.setItem("landings", JSON.stringify(landings));
    renderList();
}

/* ================= LIMPAR FORMULÁRIO ================= */
function clearForm() {
    titleInput.value = "";
    subtitleInput.value = "";
    textInput.value = "";
    ctaInput.value = "";
    ctaColorInput.value = "#4f46e5";
    bgColorInput.value = "#ffffff";
    imageInput.value = "";
    seoTitleInput.value = "";
    seoDescInput.value = "";
    editIndex = null;
    updatePreview();
    highlightServiceBanner();
}

/* ================= ABRIR LANDING NO PREVIEW ================= */
function openLandingInPreview(index) {
    const landings = JSON.parse(localStorage.getItem("landings")) || [];
    const landing = landings[index];
    if (!landing) return;

    titleInput.value = landing.title || "";
    subtitleInput.value = landing.subtitle || "";
    textInput.value = landing.text || "";
    ctaInput.value = landing.cta || "";
    ctaColorInput.value = landing.color || "#4f46e5";
    bgColorInput.value = landing.bgColor || "#ffffff";
    imageInput.value = landing.image || "";
    seoTitleInput.value = landing.seoTitle || "";
    seoDescInput.value = landing.seoDesc || "";

    editIndex = index;
    updatePreview();

    landingPreview.style.background = landing.bgColor || "linear-gradient(135deg, #ffffff, #eef2ff)";

    // Destaque animado
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
}

/* ================= DESTACAR BANNER ================= */
function highlightServiceBanner() {
    const banner = document.querySelector(".service-banner");
    if (!banner) return;

    banner.scrollIntoView({ behavior: "smooth", block: "center" });

    banner.classList.add("highlight");
    setTimeout(() => banner.classList.remove("highlight"), 1200);
}

/* ================= EXPORTAR IMAGEM ================= */
function exportLandingImage() {
    imageStatus.innerText = "⏳ Gerando imagem...";
    imageStatus.className = "image-status info";

    html2canvas(landingPreview, {
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        scale: 2
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "landing-page.png";
        link.href = canvas.toDataURL("image/png");
        link.click();

        imageStatus.innerText = "✅ Imagem exportada com sucesso!";
        imageStatus.className = "image-status success";
        highlightServiceBanner();
    }).catch(err => {
        console.error(err);
        imageStatus.innerText = "❌ Erro ao exportar imagem.";
        imageStatus.className = "image-status error";
    });
}

/* ================= INICIALIZAÇÃO ================= */
renderList();
updatePreview();
