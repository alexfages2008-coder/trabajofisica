// ====================== CONFIGURACIÓN ======================
function initTailwind() {
    tailwind.config = { content: [], theme: { extend: {} } };
}

// ====================== PARTÍCULAS ======================
function createParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    let particles = [];

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.fillStyle = '#00f0ff';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        for (let i = 0; i < 120; i++) particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 120) {
                    ctx.strokeStyle = `rgba(0, 240, 255, ${1 - distance / 120})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();

    // Hero Canvas
    const heroCanvas = document.getElementById('heroCanvas');
    if (heroCanvas) {
        const hctx = heroCanvas.getContext('2d');
        heroCanvas.width = 600; 
        heroCanvas.height = 340;
        let smallParticles = [];
        for (let i = 0; i < 40; i++) {
            smallParticles.push({
                x: Math.random() * 600,
                y: Math.random() * 340,
                vx: (Math.random() - 0.5) * 2,
                vy: (Math.random() - 0.5) * 2,
                r: Math.random() * 4 + 2
            });
        }
        function animateHero() {
            hctx.clearRect(0, 0, 600, 340);
            smallParticles.forEach(p => {
                p.x += p.vx; p.y += p.vy;
                if (p.x < 0 || p.x > 600) p.vx *= -1;
                if (p.y < 0 || p.y > 340) p.vy *= -1;
                hctx.fillStyle = '#00f0ff';
                hctx.beginPath();
                hctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                hctx.fill();
            });
            requestAnimationFrame(animateHero);
        }
        animateHero();
    }
}

// ====================== DATOS DEL QUIZ ======================
const quizQuestions = [
    {
        q: "¿Cuál es la expresión correcta de la Ley de Gravitación Universal?",
        options: ["F = m·g", "F = G·m₁·m₂/r²", "F = k·Q₁·Q₂/r²", "F = B·I·L"],
        a: 1
    },
    {
        q: "El campo eléctrico debido a una carga puntual Q a distancia r es:",
        options: ["E = G·Q/r²", "E = k·Q/r²", "E = μ₀·I/(2πr)", "E = F/m"],
        a: 1
    },
    {
        q: "En un Movimiento Armónico Simple, la energía total es constante y vale:",
        options: ["½kA²", "½mv²", "mgh", "½LI²"],
        a: 0
    },
    {
        q: "La ley de Faraday establece que la fuerza electromotriz inducida es:",
        options: ["ε = -dΦ_B/dt", "ε = B·v·L", "ε = RI", "ε = k·Q/r"],
        a: 0
    },
    {
        q: "La velocidad de una onda se relaciona con su frecuencia y longitud de onda por:",
        options: ["v = f·λ", "v = λ/f", "v = f/λ", "v = 2πf"],
        a: 0
    },
    {
        q: "La refracción de la luz al pasar de aire a agua sigue la ley de:",
        options: ["Snell", "Ohm", "Newton", "Faraday"],
        a: 0
    },
    {
        q: "La energía potencial gravitatoria entre dos masas es:",
        options: ["G·m₁·m₂/r", "-G·m₁·m₂/r", "½G·m₁·m₂/r²", "G·m₁·m₂/r²"],
        a: 1
    },
    {
        q: "En un circuito RC, el tiempo de carga se define como τ =:",
        options: ["R·C", "L/R", "1/(√(LC))", "R/L"],
        a: 0
    },
    {
        q: "El periodo de un péndulo simple es:",
        options: ["T = 2π√(l/g)", "T = 2π√(g/l)", "T = 2πf", "T = √(k/m)"],
        a: 0
    },
    {
        q: "La ecuación de ondas electromagnéticas en el vacío es:",
        options: ["c = 1/√(ε₀μ₀)", "c = f·λ", "Ambas son correctas", "Ninguna"],
        a: 2
    }
];

let currentQuestion = 0;
let score = 0;
let selectedAnswer = null;

// ====================== FUNCIONES DEL QUIZ ======================
function startQuiz() {
    currentQuestion = 0;
    score = 0;
    document.getElementById('quiz-start').classList.add('hidden');
    document.getElementById('quiz-questions').classList.remove('hidden');
    document.getElementById('quiz-results').classList.add('hidden');
    loadQuestion();
}

function loadQuestion() {
    const q = quizQuestions[currentQuestion];
    document.getElementById('question-counter').innerHTML = `Pregunta ${currentQuestion + 1} de ${quizQuestions.length}`;
    document.getElementById('question-text').textContent = q.q;

    const container = document.getElementById('options-container');
    container.innerHTML = '';

    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = `w-full text-left px-8 py-6 text-xl rounded-2xl border border-white/20 hover:border-[#00f0ff] hover:bg-white/5 flex justify-between items-center`;
        btn.innerHTML = `
            <span>${option}</span>
            <span class="text-[#00f0ff] text-3xl opacity-0">✓</span>
        `;
        btn.onclick = () => selectAnswer(index, btn, q.a);
        container.appendChild(btn);
    });

    document.getElementById('feedback').innerHTML = '';
    document.getElementById('next-btn').classList.add('hidden');
    selectedAnswer = null;
}

function selectAnswer(index, btn, correctIndex) {
    if (selectedAnswer !== null) return;
    selectedAnswer = index;

    const allBtns = document.querySelectorAll('#options-container button');
    allBtns.forEach(b => b.disabled = true);

    if (index === correctIndex) {
        btn.classList.add('border-green-400', 'bg-green-900/30');
        score++;
        document.getElementById('feedback').innerHTML = `<span class="text-green-400">¡Correcto! 🎉</span>`;
    } else {
        btn.classList.add('border-red-400', 'bg-red-900/30');
        allBtns[correctIndex].classList.add('border-green-400', 'bg-green-900/30');
        document.getElementById('feedback').innerHTML = `<span class="text-red-400">Incorrecto</span>`;
    }

    document.getElementById('next-btn').classList.remove('hidden');
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    document.getElementById('quiz-questions').classList.add('hidden');
    const resultsDiv = document.getElementById('quiz-results');
    resultsDiv.classList.remove('hidden');

    const percentage = Math.round((score / quizQuestions.length) * 100);
    const circle = document.getElementById('score-circle');
    circle.style.borderColor = percentage >= 70 ? '#00f0ff' : '#f43f5e';
    circle.innerHTML = `${percentage}<span class="text-3xl">%</span>`;

    const text = document.getElementById('result-text');
    if (percentage >= 85) text.innerHTML = `¡Excelente! Estás preparado para la EvAU 🔥`;
    else if (percentage >= 70) text.innerHTML = `¡Muy bien! Solo unos retoques más`;
    else text.innerHTML = `¡Sigue practicando! Repasa los temas débiles`;
}

function restartQuiz() {
    document.getElementById('quiz-results').classList.add('hidden');
    document.getElementById('quiz-start').classList.remove('hidden');
}

function endQuiz() {
    if (confirm('¿Quieres salir del quiz?')) {
        restartQuiz();
    }
}

// ====================== CHATBOT ======================
function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    const chatContainer = document.getElementById('chat-messages');
    
    chatContainer.innerHTML += `
        <div class="flex justify-end">
            <div class="chat-bubble-user max-w-[75%] p-5">${message}</div>
        </div>`;

    input.value = '';

    setTimeout(() => {
        let responseText = "¡Buena pregunta! Dame más detalles para explicártelo mejor.";

        const lowerMsg = message.toLowerCase();
        if (lowerMsg.includes("gravedad") || lowerMsg.includes("newton")) responseText = "La ley de gravitación universal es F = G·m₁·m₂/r². G = 6.67×10⁻¹¹ N·m²/kg²";
        else if (lowerMsg.includes("campo electric") || lowerMsg.includes("e =")) responseText = "El campo eléctrico E = k·Q/r² donde k = 9×10⁹ N·m²/C²";
        else if (lowerMsg.includes("mas") || lowerMsg.includes("armónico")) responseText = "En el Movimiento Armónico Simple: x = A·cos(ωt + φ). ω = √(k/m)";
        else if (lowerMsg.includes("péndulo") || lowerMsg.includes("periodo")) responseText = "T = 2π√(l/g) donde l es la longitud y g ≈ 9.8 m/s²";
        else if (lowerMsg.includes("refrac") || lowerMsg.includes("snell")) responseText = "Ley de Snell: n₁·sinθ₁ = n₂·sinθ₂";
        else if (lowerMsg.includes("faraday") || lowerMsg.includes("inducc")) responseText = "ε = -dΦ_B/dt. La inducción electromagnética genera corriente";
        else if (lowerMsg.includes("hola") || lowerMsg.includes("buenos")) responseText = "¡Hola! ¿En qué duda de Física o Matemáticas te ayudo?";

        chatContainer.innerHTML += `
            <div class="flex gap-4">
                <div class="text-4xl">🤖</div>
                <div class="chat-bubble-bot max-w-[75%] p-5">${responseText}</div>
            </div>`;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }, 800);
}

// ====================== OTRAS FUNCIONES ======================
function navigateTo(section) {
    document.getElementById(section).scrollIntoView({ behavior: 'smooth' });
}

function toggleMobileMenu() {
    document.getElementById('mobileMenu').classList.toggle('hidden');
}

function toggleDark() {
    alert("¡Ya estás en el modo más oscuro y bonito de la física! 🌌");
}

// ====================== INICIO ======================
window.onload = function() {
    initTailwind();
    createParticles();
    console.log('%c✅ Física 2º Bachillerato - Página cargada correctamente', 'color:#00f0ff; font-size:14px');
};
