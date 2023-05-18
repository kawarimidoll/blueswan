function setClass(name, value) {
  // console.log(`set ${name}-${value}`);
  visibilities.forEach((visibilitiy) => {
    document.body.classList.remove(`${name}-${visibilitiy}`);
  });
  document.body.classList.add(`${name}-${value}`);
}

chrome.storage.local.get(names, (data) => {
  // console.log(data);
  names.forEach((name) => {
    setClass(name, ensureValue(data[name]));
  });
});

chrome.runtime.onMessage.addListener((request, _options, sendResponse) => {
  // console.log({ request, options });
  if (request.cmd === "setClass") {
    const { name, value } = request;
    if (names.includes(name)) {
      setClass(name, ensureValue(value));
    }
    sendResponse();
  } else if (request.cmd === "getDark") {
    const modeText = document.querySelector(
      "div.css-175oi2r.r-11dz980.r-u8s1d.r-1ej1qmr.r-1ipicw7 > div:nth-child(4) > div > div.css-1rynq56",
    ).innerText;
    const targetText = location.href.includes("staging") ? 'Dark' : 'Light'
    sendResponse(modeText.includes(targetText));
  }
});
