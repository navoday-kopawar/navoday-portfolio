document.querySelectorAll(".weather-window").forEach(win => {

  /* ======================================================
     LAYER SETUP
  ====================================================== */
  const back = document.createElement("div");
  const mid = document.createElement("div");
  const front = document.createElement("div");

  back.className = "layer back";
  mid.className = "layer mid";
  front.className = "layer front";

  win.append(back, mid, front);

  function clearAll() {
    back.innerHTML = "";
    mid.innerHTML = "";
    front.innerHTML = "";
  }

  /* ======================================================
     ELEMENT FACTORIES
  ====================================================== */
  const cloud = (layer) => {
    const c = document.createElement("div");
    c.className = `cloud ${layer}`;
    return c;
  };

  const rain = () => {
    const r = document.createElement("div");
    r.className = "rain";
    r.style.left = Math.random() * 100 + "%";
    r.style.animationDuration = .4 + Math.random() * .6 + "s";
    return r;
  };

  const snow = () => {
    const s = document.createElement("div");
    s.className = "snow";
    s.style.left = Math.random() * 100 + "%";
    s.style.animationDuration = 3 + Math.random() * 4 + "s";
    return s;
  };

  const sun = () => {
    const s = document.createElement("div");
    s.className = "sun";
    return s;
  };
  /* ======================================================
     WEATHER STATE HANDLER
  ====================================================== */
  function setWeather(type) {
    clearAll();

    if (type === "sunny") {
      win.style.background = "linear-gradient(#7dd3fc,#bae6fd)";
      back.append(cloud("back"));
      mid.append(cloud("mid"));
      front.append(sun());
    }

    if (type === "rain") {
      win.style.background = "linear-gradient(#475569,#020617)";
      back.append(cloud("back"));
      mid.append(cloud("mid"));
      for (let i = 0; i < 35; i++) front.append(rain());
    }

    if (type === "snow") {
      win.style.background = "linear-gradient(#cbd5f5,#f8fafc)";
      for (let i = 0; i < 28; i++) front.append(snow());
    }
  }

  /* ======================================================
     DEFAULT STATE
  ====================================================== */
  setWeather("sunny");

  /* ======================================================
     HOVER INTERACTION
  ====================================================== */
  win.addEventListener("mouseenter", () => setWeather("rain"));
  win.addEventListener("mouseleave", () => setWeather("sunny"));

});