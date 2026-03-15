import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl     = "https://kdyslerhrrjxidvkbutu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkeXNsZXJocnJqeGlkdmtidXR1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1MDgyNzMsImV4cCI6MjA4OTA4NDI3M30.CZzZVgYNwoyMCw9jpKJKQr-EJN0ay3EtwNhx1vJBqao";
const supabase        = createClient(supabaseUrl, supabaseAnonKey);

/* ─── ONE-TIME VIEW GATE ─── */
window.onload = async function () {
  try {
    const { data, error } = await supabase.from("message").select("*");
    if (error) throw error;

    const row  = data[0];
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
    setTimeout(() => { window.location.href = "/404.html"; }, 600000);

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
  try {
    await supabase.from("message").insert([{
      viewed: false,
      response: answer,          // "yes" or "no"
      responded_at: new Date().toISOString()
    }]);
  } catch (err) {
    console.error("Could not save response:", err);
  } finally {
    indicator.style.display = "none";
  }
}

/* ─── PROPOSAL BUTTONS ─── */
document.getElementById("btnYes").addEventListener("click", async () => {
  document.getElementById("proposalOverlay").classList.remove("active");

  // Burst hearts
  const burst = document.getElementById("heartBurst");
  const emojis = ["💙","✨","💫","🌟","💙","💙"];
  for (let i = 0; i < 30; i++) {
    const h = document.createElement("span");
    h.className = "heart-particle";
    h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    h.style.left = Math.random() * 100 + "vw";
    h.style.bottom = "0";
    h.style.animationDelay = Math.random() * 1.5 + "s";
    h.style.fontSize = (1 + Math.random() * 1.5) + "rem";
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
  const canvas  = document.getElementById("starfield");
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const context    = canvas.getContext("2d");
  const stars      = 500;
  const colorrange = [0, 60, 240];
  const starArray  = [];

  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  for (let i = 0; i < stars; i++) {
    starArray.push({
      x:       Math.random() * canvas.offsetWidth,
      y:       Math.random() * canvas.offsetHeight,
      radius:  Math.random() * 1.2,
      hue:     colorrange[getRandom(0, colorrange.length - 1)],
      sat:     getRandom(50, 100),
      opacity: Math.random()
    });
  }

  let frameNumber   = 0;
  let opacity       = 0;
  let secondOpacity = 0;
  let thirdOpacity  = 0;

  let baseFrame = context.getImageData(0, 0, window.innerWidth, window.innerHeight);

  const button = document.getElementById("valentinesButton");

  button.addEventListener("click", () => {
    if (button.textContent === "Click Me! ❤") {
      button.textContent = "loading...";
      fetch("send_mail.php")
        .then(r => {
          button.textContent = r.ok ? "Check Your Email 🙃" : "Error 😞";
        })
        .catch(() => { button.textContent = "Error 😞"; });
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

  function drawTextWithLineBreaks(lines, x, y, fontSize, lineHeight) {
    lines.forEach((line, idx) => {
      context.fillText(line, x, y + idx * (fontSize + lineHeight));
    });
  }

  function drawText() {
    const fontSize   = Math.min(30, window.innerWidth / 24);
    const lineHeight = 8;

    context.font      = fontSize + "px Comic Sans MS";
    context.textAlign = "center";

    context.shadowColor   = "rgba(45, 45, 255, 1)";
    context.shadowBlur    = 8;
    context.shadowOffsetX = 0;
    context.shadowOffsetY = 0;

    const w  = canvas.width;
    const cy = canvas.height / 2;
    const mobile = window.innerWidth < 600;

    // --- sentence 1 ---
    if (frameNumber < 250) {
      context.fillStyle = `rgba(45,45,255,${opacity})`;
      context.fillText("everyday day I cannot believe how lucky I am", w/2, cy);
      opacity += 0.01;
    }
    if (frameNumber >= 250 && frameNumber < 500) {
      context.fillStyle = `rgba(45,45,255,${opacity})`;
      context.fillText("everyday day I cannot believe how lucky I am", w/2, cy);
      opacity -= 0.01;
    }
    if (frameNumber === 500) opacity = 0;

    // --- sentence 2 ---
    if (frameNumber > 500 && frameNumber < 750) {
      context.fillStyle = `rgba(45,45,255,${opacity})`;
      mobile
        ? drawTextWithLineBreaks(["amongst trillions and trillions of stars,","over billions of years"], w/2, cy, fontSize, lineHeight)
        : context.fillText("amongst trillions and trillions of stars, over billions of years", w/2, cy);
      opacity += 0.01;
    }
    if (frameNumber >= 750 && frameNumber < 1000) {
      context.fillStyle = `rgba(45,45,255,${opacity})`;
      mobile
        ? drawTextWithLineBreaks(["amongst trillions and trillions of stars,","over billions of years"], w/2, cy, fontSize, lineHeight)
        : context.fillText("amongst trillions and trillions of stars, over billions of years", w/2, cy);
      opacity -= 0.01;
    }
    if (frameNumber === 1000) opacity = 0;

    // --- sentence 3 ---
    if (frameNumber > 1000 && frameNumber < 1250) {
      context.fillStyle = `rgba(45,45,255,${opacity})`;
      context.fillText("to be alive, and to get to spend this life with you", w/2, cy);
      opacity += 0.01;
    }
    if (frameNumber >= 1250 && frameNumber < 1500) {
      context.fillStyle = `rgba(45,45,255,${opacity})`;
      context.fillText("to be alive, and to get to spend this life with you", w/2, cy);
      opacity -= 0.01;
    }
    if (frameNumber === 1500) opacity = 0;

    // --- sentence 4 ---
    if (frameNumber > 1500 && frameNumber < 1750) {
      context.fillStyle = `rgba(45,45,255,${opacity})`;
      context.fillText("is so incredibly, unfathomably unlikely", w/2, cy);
      opacity += 0.01;
    }
    if (frameNumber >= 1750 && frameNumber < 2000) {
      context.fillStyle = `rgba(45,45,255,${opacity})`;
      context.fillText("is so incredibly, unfathomably unlikely", w/2, cy);
      opacity -= 0.01;
    }
    if (frameNumber === 2000) opacity = 0;

    // --- sentence 5 ---
    if (frameNumber > 2000 && frameNumber < 2250) {
      context.fillStyle = `rgba(45,45,255,${opacity})`;
      mobile
        ? drawTextWithLineBreaks(["and yet here I am to get the impossible","chance to get to know you"], w/2, cy, fontSize, lineHeight)
        : context.fillText("and yet here I am to get the impossible chance to get to know you", w/2, cy);
      opacity += 0.01;
    }
    if (frameNumber >= 2250 && frameNumber < 2500) {
      context.fillStyle = `rgba(45,45,255,${opacity})`;
      mobile
        ? drawTextWithLineBreaks(["and yet here I am to get the impossible","chance to get to know you"], w/2, cy, fontSize, lineHeight)
        : context.fillText("and yet here I am to get the impossible chance to get to know you", w/2, cy);
      opacity -= 0.01;
    }
    if (frameNumber === 2500) opacity = 0;

    // --- final lines ---
    if (frameNumber > 2500) {
      context.fillStyle = `rgba(45,45,255,${opacity})`;
      mobile
        ? drawTextWithLineBreaks(["I love you so much, more than","all the time and space in the universe can contain"], w/2, cy, fontSize, lineHeight)
        : context.fillText("I love you so much, more than all the time and space in the universe can contain", w/2, cy);
      if (opacity < 1) opacity += 0.01;
    }
    if (frameNumber >= 2750) {
      context.fillStyle = `rgba(45,45,255,${secondOpacity})`;
      mobile
        ? drawTextWithLineBreaks(["and I can't wait to spend all the time in","the world to share that love with you!"], w/2, cy+60, fontSize, lineHeight)
        : context.fillText("and I can't wait to spend all the time in the world to share that love with you!", w/2, cy+50);
      if (secondOpacity < 1) secondOpacity += 0.01;
    }
    if (frameNumber >= 3000) {
      context.fillStyle = `rgba(45,45,255,${thirdOpacity})`;
      context.fillText("I Love You <3", w/2, cy+120);
      if (thirdOpacity < 1) thirdOpacity += 0.01;

      button.style.display = "block";
    }

    // --- show proposal after last text is fully visible ---
    if (frameNumber >= 3250 && thirdOpacity >= 0.99) {
      button.style.display = "none";   // hide the old button
      document.getElementById("proposalOverlay").classList.add("active");
    }

    context.shadowColor   = "transparent";
    context.shadowBlur    = 0;
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
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    baseFrame = context.getImageData(0, 0, window.innerWidth, window.innerHeight);
  });

  window.requestAnimationFrame(draw);
}
