const newScriptTag = document.createElement("script");
newScriptTag.setAttribute(
  "src",
  "https://www.googletagmanager.com/gtag/js?id=AW-16657052920",
);

window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}

gtag("js", new Date());
gtag("config", "AW-16657052920");
