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
    } else if (view === "preview") {
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
    landingPreview.style.background = bgColorInput.value || "linear-gradient(135deg, #ffffff, #eef2ff)";

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
        div.addEventListener("keydown", (e) => {
            if (e.key === "Enter") openLandingInPreview(i);
        });

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
    html2canvas(landingPreview, { useCORS: true, allowTaint: true, backgroundColor: null, scale: 2 })
        .then(canvas => {
            // Detecta mobile
            if (/Mobi|Android/i.test(navigator.userAgent)) {
                // Cria modal de visualização
                const modal = document.createElement("div");
                modal.style.position = "fixed";
                modal.style.inset = 0;
                modal.style.background = "rgba(0,0,0,0.85)";
                modal.style.display = "flex";
                modal.style.justifyContent = "center";
                modal.style.alignItems = "center";
                modal.style.zIndex = 9999;
                modal.style.padding = "20px";
                modal.style.cursor = "pointer";
                modal.addEventListener("click", () => document.body.removeChild(modal));

                const img = document.createElement("img");
                img.src = canvas.toDataURL("image/png");
                img.style.maxWidth = "100%";
                img.style.maxHeight = "100%";
                img.style.borderRadius = "16px";
                img.style.boxShadow = "0 10px 40px rgba(0,0,0,0.7)";
                modal.appendChild(img);

                document.body.appendChild(modal);

                imageStatus.innerText = "✅ Imagem gerada! Toque na imagem e segure para salvar.";
                imageStatus.className = "image-status success";
            } else {
                // Desktop: download direto
                const link = document.createElement("a");
                link.download = "landing-page.png";
                link.href = canvas.toDataURL("image/png");
                link.click();
                imageStatus.innerText = "✅ Imagem exportada com sucesso!";
                imageStatus.className = "image-status success";
            }
        })
        .catch(err => {
            console.error(err);
            imageStatus.innerText = "❌ Erro ao gerar imagem.";
            imageStatus.className = "image-status error";
        });
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
    landingPreview.style.background = l.bgColor || "linear-gradient(135deg, #ffffff, #eef2ff)";

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

// ================= INIT =================
renderList();
updatePreview();
