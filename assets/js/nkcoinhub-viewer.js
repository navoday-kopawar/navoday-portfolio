document.querySelectorAll(".nkcoinhub-tilt").forEach(wrapper => {
  const model = wrapper.querySelector("model-viewer");

  let isInteracting = false;
  let resetTimer = null;

  /* ======================================================
     MOUSE MOVE — 3D TILT
  ====================================================== */
  wrapper.addEventListener("mousemove", e => {
    if (!model) return;

    isInteracting = true;
    clearTimeout(resetTimer);

    // Pause auto-rotation while interacting
    model.autoRotate = false;

    const rect = wrapper.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    wrapper.style.transition = "transform 0.1s linear";
    wrapper.style.transform =
      `rotateX(${-y * 18}deg) rotateY(${x * 18}deg)`;
  });

  /* ======================================================
     MOUSE LEAVE — RESET
  ====================================================== */
  wrapper.addEventListener("mouseleave", () => {
    if (!model) return;

    isInteracting = false;

    // Smoothly reset tilt
    wrapper.style.transition = "transform 0.6s ease";
    wrapper.style.transform = "rotateX(0deg) rotateY(0deg)";

    // Resume auto-rotation after reset
    resetTimer = setTimeout(() => {
      if (!isInteracting) {
        model.autoRotate = true;
      }
    }, 650);
  });

  /* ======================================================
     TOUCH DEVICES — KEEP AUTO ROTATE
  ====================================================== */
  wrapper.addEventListener("touchstart", () => {
    if (!model) return;
    model.autoRotate = true;
  });
});
