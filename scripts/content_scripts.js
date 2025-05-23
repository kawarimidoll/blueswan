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
    const wrapper = document.querySelector("#root > div > div");
    const DARK_CLASS = 'r-kemksi';
    sendResponse(wrapper?.classList?.contains(DARK_CLASS));
  }
});
