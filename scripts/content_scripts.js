const visibilities = ["show", "hover", "hide"];
const names = [
  "replys",
  "reposts",
  "likes",
  "followers",
  "following",
  "posts",
  "blueswan",
];

function ensureValue(value) {
  return visibilities.includes(value) ? value : "show";
}

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
  const { name, value } = request;
  if (names.includes(name)) {
    setClass(name, ensureValue(value));
  }
  sendResponse();
});
