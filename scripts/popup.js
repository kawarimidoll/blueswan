class VisibilitySelect extends HTMLElement {
  constructor() {
    super();

    const shadow = this.attachShadow({ mode: "open" });

    const name = this.getAttribute("name");

    const wrapper = document.createElement("div");
    wrapper.setAttribute("part", "wrapper");
    shadow.appendChild(wrapper);

    const title = document.createElement("div");
    const titleText = this.getAttribute("title") || name;
    title.textContent = titleText.replace(/^./, (c) => c.toUpperCase());
    wrapper.appendChild(title);

    const select = document.createElement("select");
    select.setAttribute("part", "select");
    const id = `select-${name}`;
    select.id = id;
    select.name = id;
    select.ariaLabel = id;
    wrapper.appendChild(select);

    const without = this.getAttribute("without") || "";
    visibilities.forEach((v) => {
      if (without !== v) {
        const option = document.createElement("option");
        option.value = v;
        option.textContent = v.toUpperCase();
        select.appendChild(option);
      }
    });
  }
}
customElements.define("visibility-select", VisibilitySelect);

chrome.storage.local.get(names, (data) => {
  names.forEach((name) => {
    const select = document.getElementById(`select-${name}`);
    [...select.options].forEach((option) =>
      option.selected = option.value === ensureValue(data[name])
    );
    select.addEventListener("change", (event) => {
      const { value } = event.target;
      chrome.storage.local.set({ [name]: value }, () => ({}));

      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        // console.log({ tabs });
        const tabId = tabs[0]?.id;
        if (tabId) {
          chrome.tabs.sendMessage(tabId, { name, value }, () => ({}));
        }
      });
    });
  });
});
