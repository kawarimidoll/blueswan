const template = document.createElement("template");
template.innerHTML = `
  <div part="wrapper">
    <div id="title"></div>
    <select part="select" id="select"></select>
  </div>
`;

class VisibilitySelect extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));

    const name = this.getAttribute("name");

    const title = shadow.querySelector("#title");
    const titleText = this.getAttribute("title") || name;
    title.textContent = titleText.replace(/^./, (c) => c.toUpperCase());

    const select = shadow.querySelector("#select");
    const id = `select-${name}`;
    select.id = id;
    select.name = id;
    select.ariaLabel = id;
    select.addEventListener("change", (event) => {
      const { value } = event.target;
      chrome.storage.local.set({ [name]: value }, () => ({}));

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // console.log({ tabs });
        const tabId = tabs[0]?.id;
        if (tabId) {
          const cmd = "setClass";
          chrome.tabs.sendMessage(tabId, { cmd, name, value }, () => ({}));
        }
      });
    });

    chrome.storage.local.get(names, (data) => {
      const without = this.getAttribute("without") || "";
      visibilities.forEach((v) => {
        if (without !== v) {
          const option = document.createElement("option");
          option.value = v;
          option.selected = option.value === ensureValue(data[name]);
          option.textContent = v.toUpperCase();
          select.appendChild(option);
        }
      });
    });
  }
}
customElements.define("visibility-select", VisibilitySelect);

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tabId = tabs[0]?.id;
  if (tabId) {
    const cmd = "getDark";
    chrome.tabs.sendMessage(tabId, { cmd }, (v) => {
      if (v) {
        document.body.classList.add(`dark`);
      }
    });
  }
});
