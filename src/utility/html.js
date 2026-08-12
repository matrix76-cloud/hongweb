export function decodeHtml(str = "") {
    const el = document.createElement("textarea");
    el.innerHTML = str;
    return el.value;
  }