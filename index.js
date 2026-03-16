import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = "https://kdyslerhrrjxidvkbutu.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkeXNsZXJocnJqeGlkdmtidXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDgyNzMsImV4cCI6MjA4OTA4NDI3M30.CZzZVgYNwoyMCw9jpKJKQr-EJN0ay3EtwNhx1vJBqao";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/* ─── ONE-TIME VIEW GATE ─── */
window.onload = async function () {
  try {
    const { data, error } = await supabase.from("message").select("*");
    if (error) throw error;

    const row = data[0];
    const view = row.viewed;

    if (view === true) {
      window.location.href = "/404.html";
      return;
    }

    // Mark as viewed
    await supabase.from("message").update({ viewed: true }).eq("id", 1);

    // Hide loading, start the animation
    document.getElementById("loadingOverlay").style.display = "none";
    startAnimation();

    // Auto redirect after 10 min just in case
    setTimeout(() => {
      window.location.href = "/404.html";
    }, 600000);
  } catch (err) {
    console.error(err);
    document.getElementById("loadingOverlay").innerHTML =
      "<p style='color:#ff4444'>Something went wrong 😞</p>";
  }
};

/* ─── SAVE RESPONSE TO SUPABASE ─── */
async function saveResponse(answer) {
  const indicator = document.getElementById("savingIndicator");
  indicator.style.display = "block";
  console.log("Saving response:", answer);
  try {
    await supabase.from("message").update({ ans: answer }).eq("id", 1);
  } catch (err) {
    console.error("Could not save response:", err);
  } finally {
    indicator.style.display = "none";
  }
}

/* ─── PROPOSAL BUTTONS ─── */
document.getElementById("btnYes").addEventListener("click", async () => {
  document.getElementById("proposalOverlay").classList.remove("active");

  const burst = document.getElementById("heartBurst");
  const emojis = ["💙", "✨", "💫", "🌟", "💙", "💙"];
  for (let i = 0; i < 30; i++) {
    const h = document.createElement("span");
    h.className = "heart-particle";
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left = Math.random() * 100 + "vw";
    h.style.bottom = "0";
    h.style.animationDelay = Math.random() * 1.5 + "s";
    h.style.fontSize = 1 + Math.random() * 1.5 + "rem";
    burst.appendChild(h);
  }

  document.getElementById("responseEmoji").textContent = "💙";
  document.getElementById("responseMsg").textContent =
    "I knew it. You just made me the luckiest person\nin the entire universe. 💙✨";
  document.getElementById("responseMsg").className = "response-msg yes-msg";
  document.getElementById("responseScreen").classList.add("active");

  await saveResponse("yes");
});

document.getElementById("btnNo").addEventListener("click", async () => {
  document.getElementById("proposalOverlay").classList.remove("active");
  document.getElementById("responseEmoji").textContent = "🌌";
  document.getElementById("responseMsg").textContent =
    "That's okay... the stars still think you're pretty cool. 💙";
  document.getElementById("responseMsg").className = "response-msg no-msg";
  document.getElementById("responseScreen").classList.add("active");

  await saveResponse("no");
});

/* ─── STARFIELD + TEXT ANIMATION ─── */
function startAnimation() {
  const canvas = document.getElementById("starfield");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const context = canvas.getContext("2d");
  const stars = 500;
  const colorrange = [0, 60, 240];
  const starArray = [];

  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  for (let i = 0; i < stars; i++) {
    starArray.push({
      x: Math.random() * canvas.offsetWidth,
      y: Math.random() * canvas.offsetHeight,
      radius: Math.random() * 1.2,
      hue: colorrange[getRandom(0, colorrange.length - 1)],
      sat: getRandom(50, 100),
      opacity: Math.random(),
    });
  }

  let frameNumber = 0;
  let opacity = 0;
  let secondOpacity = 0;
  let thirdOpacity = 0;

  let baseFrame = context.getImageData(
    0,
    0,
    window.innerWidth,
    window.innerHeight,
  );

  const button = document.getElementById("valentinesButton");

  button.addEventListener("click", () => {
    if (button.textContent === "Click Me! ❤") {
      button.textContent = "loading...";
      fetch("send_mail.php")
        .then((r) => {
          button.textContent = r.ok ? "Check Your Email 🙃" : "Error 😞";
        })
        .catch(() => {
          button.textContent = "Error 😞";
        });
    }
  });

  function drawStars() {
    for (let i = 0; i < stars; i++) {
      const s = starArray[i];
      context.beginPath();
      context.arc(s.x, s.y, s.radius, 0, 360);
      context.fillStyle = `hsla(${s.hue}, ${s.sat}%, 88%, ${s.opacity})`;
      context.fill();
    }
  }

  function updateStars() {
    for (let i = 0; i < stars; i++) {
      if (Math.random() > 0.99) starArray[i].opacity = Math.random();
    }
  }

  /**
   * Draws wrapped text centered on screen.
   * @param {string}   text       - Full sentence to render
   * @param {number}   centerY    - Vertical center point for the block
   * @param {number}   alpha      - Current opacity (0–1)
   * @param {number}   maxWidth   - Max px width before wrapping
   * @param {number}   fontSize   - Font size in px
   */
  function drawWrappedText(text, centerY, alpha, maxWidth, fontSize) {
    const lineHeight = fontSize * 1.55;

    // Split text into lines that fit within maxWidth
    const words = text.split(" ");
    const lines = [];
    let current = "";

    for (const word of words) {
      const test = current ? current + " " + word : word;
      if (context.measureText(test).width <= maxWidth) {
        current = test;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);

    // Draw each line, vertically centered as a block
    const totalHeight = lines.length * lineHeight;
    const startY = centerY - totalHeight / 2 + lineHeight / 2;

    context.fillStyle = `rgba(100, 140, 255, ${alpha})`;

    lines.forEach((line, i) => {
      context.fillText(line, canvas.width / 2, startY + i * lineHeight);
    });
  }

  function drawText() {
    const mobile = window.innerWidth < 600;
    const tablet = window.innerWidth < 900;

    // Responsive font size — bigger on mobile so it's clearly readable
    const fontSize = mobile
      ? Math.min(22, window.innerWidth / 16) // was /24, now /16
      : Math.min(32, window.innerWidth / 30);

    // Usable width with generous padding on mobile
    const padding = mobile ? 32 : 60;
    const maxWidth = canvas.width - padding * 2;

    const cy = canvas.height / 2;

    // Font setup
    context.font = `${fontSize}px "Comic Sans MS", cursive`;
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Glow effect — stronger on mobile for visibility against dark bg
    context.shadowColor = mobile
      ? "rgba(80, 120, 255, 0.9)"
      : "rgba(45, 45, 255, 1)";
    context.shadowBlur = mobile ? 18 : 10;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    const sentences = [
      {
        text: "everyday I cannot believe how lucky I am",
        start: 0,
        fadeIn: 250,
        fadeOut: 500,
      },
      {
        text: "amongst trillions and trillions of stars, over billions of years",
        start: 500,
        fadeIn: 750,
        fadeOut: 1000,
      },
      {
        text: "to be alive, and to get to spend this life with you",
        start: 1000,
        fadeIn: 1250,
        fadeOut: 1500,
      },
      {
        text: "is so incredibly, unfathomably unlikely",
        start: 1500,
        fadeIn: 1750,
        fadeOut: 2000,
      },
      {
        text: "and yet here I am to get the impossible chance to get to know you",
        start: 2000,
        fadeIn: 2250,
        fadeOut: 2500,
      },
    ];

    // Render fading sentences 1–5
    for (const s of sentences) {
      if (frameNumber > s.start && frameNumber < s.fadeOut) {
        let a;
        if (frameNumber < s.fadeIn) {
          a = Math.min(1, (frameNumber - s.start) / (s.fadeIn - s.start));
        } else {
          a = Math.max(
            0,
            1 - (frameNumber - s.fadeIn) / (s.fadeOut - s.fadeIn),
          );
        }
        drawWrappedText(s.text, cy, a, maxWidth, fontSize);
      }
    }

    // Reset opacity tracking for final lines
    if (frameNumber === 2500) {
      opacity = 0;
      secondOpacity = 0;
      thirdOpacity = 0;
    }

    // Final lingering lines — fade in and stay
    if (frameNumber > 2500) {
      if (opacity < 1) opacity = Math.min(1, opacity + 0.01);
      drawWrappedText(
        "I love you so much, more than all the time and space in the universe can contain",
        mobile ? cy - fontSize * 3.5 : cy - fontSize * 2,
        opacity,
        maxWidth,
        fontSize,
      );
    }
    if (frameNumber >= 2750) {
      if (secondOpacity < 1) secondOpacity = Math.min(1, secondOpacity + 0.01);
      drawWrappedText(
        "and I can't wait to spend all the time in the world to share that love with you!",
        mobile ? cy + fontSize * 1 : cy + fontSize * 1.5,
        secondOpacity,
        maxWidth,
        fontSize,
      );
    }
    if (frameNumber >= 3000) {
      if (thirdOpacity < 1) thirdOpacity = Math.min(1, thirdOpacity + 0.01);

      // "I Love You <3" — larger, more prominent
      const accentSize = mobile ? fontSize * 1.4 : fontSize * 1.3;
      context.font = `bold ${accentSize}px "Comic Sans MS", cursive`;
      context.shadowBlur = mobile ? 28 : 20;
      context.fillStyle = `rgba(140, 180, 255, ${thirdOpacity})`;
      context.fillText(
        "I Love You ♥",
        canvas.width / 2,
        mobile ? cy + fontSize * 5.5 : cy + fontSize * 5,
      );
      context.font = `${fontSize*1.2}px "Comic Sans MS", cursive`;
      context.shadowBlur = mobile ? 18 : 10;

      button.style.display = "block";
    }

    // Show proposal overlay
    if (frameNumber >= 3250 && thirdOpacity >= 0.99) {
      button.style.display = "none";
      document.getElementById("proposalOverlay").classList.add("active");
    }

    // Reset shadow
    context.shadowColor = "transparent";
    context.shadowBlur = 0;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;
  }

  function draw() {
    context.putImageData(baseFrame, 0, 0);
    drawStars();
    updateStars();
    drawText();
    if (frameNumber < 99999) frameNumber++;
    window.requestAnimationFrame(draw);
  }

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    baseFrame = context.getImageData(
      0,
      0,
      window.innerWidth,
      window.innerHeight,
    );
  });

  window.requestAnimationFrame(draw);
}
