// posthog see https://posthog.com/docs/libraries/js#installation
!(function (t, e) {
  var o, n, p, r;
  e.__SV ||
    ((window.posthog = e),
    (e._i = []),
    (e.init = function (i, s, a) {
      function g(t, e) {
        var o = e.split(".");
        2 == o.length && ((t = t[o[0]]), (e = o[1])),
          (t[e] = function () {
            t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
          });
      }

      ((p = t.createElement("script")).type = "text/javascript"),
        (p.crossOrigin = "anonymous"),
        (p.async = !0),
        (p.src =
          s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") +
          "/static/array.js"),
        (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r);
      var u = e;
      for (
        void 0 !== a ? (u = e[a] = []) : (a = "posthog"),
          u.people = u.people || [],
          u.toString = function (t) {
            var e = "posthog";
            return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e;
          },
          u.people.toString = function () {
            return u.toString(1) + ".people (stub)";
          },
          o =
            "init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(
              " ",
            ),
          n = 0;
        n < o.length;
        n++
      )
        g(u, o[n]);
      e._i.push([i, s, a]);
    }),
    (e.__SV = 1));
})(document, window.posthog || []);

const parseCookiesForConsentCookie = () => {
  const cookies = document.cookie.split(";");
  const octomindConsentCookie = cookies.find((c) =>
    c.trim().startsWith("octomind-consent="),
  );

  if (!octomindConsentCookie) {
    return undefined;
  }

  const value = octomindConsentCookie.split("=")[1];

  if (!value) {
    return undefined;
  }

  let parsedValue;
  try {
    parsedValue = JSON.parse(window.decodeURIComponent(value));
  } catch (e) {
    return undefined;
  }

  return parsedValue;
};

const OCTOMIND_USER_AGENT = "octomind";

const writeCookie = (cookieValue) => {
  const stringified = window.encodeURIComponent(JSON.stringify(cookieValue));

  // maximum allowed, see https://developer.chrome.com/blog/cookie-max-age-expires
  const daysUntilExpiry = 400;
  const msUntilExpiry = daysUntilExpiry * 24 * 3600 * 1000;
  const expires = new Date(Date.now() + msUntilExpiry);

  document.cookie = `octomind-consent=${stringified};sameSite=strict;Domain=.octomind.dev;path=/;expires=${expires.toUTCString()}`;
};

const posthogInit = (persistence) => {
  const currentUrl = new URL(window.location.href);
  const distinctId = currentUrl.searchParams.get("distinctId");

  posthog.init("phc_DZrVg5kgD45m4Au5nFt6m9rykBTg3mAkeHNY3atWNbW", {
    api_host: "https://octomind.dev/events",
    ui_host: "https://eu.posthog.com",
    disable_session_recording: true,
    person_profiles: "always",
    persistence,
    bootstrap: distinctId
      ? {
          distinctID: distinctId,
        }
      : undefined,
    loaded: (posthog) => {
      document.querySelectorAll("a").forEach((el) => {
        if (!el.hasAttribute("href")) {
          return;
        }

        if (!el.getAttribute("href").includes("octomind.dev")) {
          return;
        }

        const url = new URL(el.getAttribute("href"));

        url.searchParams.set("distinctId", posthog.get_distinct_id());
        el.href = url.toString();
      });
    },
  });

  if (window.navigator.userAgent.includes(OCTOMIND_USER_AGENT)) {
    posthog.opt_out_capturing();
  }
};

const hideBanner = () => {
  document.getElementById("cookie-banner-overlay").style.display = "none";
};

const showBanner = () => {
  document.getElementById("cookie-banner-overlay").style.display = "block";
};

const COOKIE_PERSISTENCE = "localStorage+cookie";

const setupCookieButton = (id, allowOptionalValueToPersist) => {
  const cookieButton = document.getElementById(id);
  const persistence = allowOptionalValueToPersist
    ? COOKIE_PERSISTENCE
    : "memory";

  cookieButton.onclick = () => {
    writeCookie({
      consentDate: new Date(),
      allowOptional: allowOptionalValueToPersist,
    });
    posthog.set_config({
      persistence,
    });
    hideBanner();
  };
};

const addCookieBanner = () => {
  const cookieBannerOverlay = document.createElement("div");
  cookieBannerOverlay.id = "cookie-banner-overlay";
  cookieBannerOverlay.className = "cookie-overlay";

  const cookieBannerImage = document.createElement("img");
  cookieBannerImage.src =
    "https://storage.googleapis.com/assets.octomind.dev/cookieBanner.webp";
  cookieBannerImage.className = "cookie-image";
  cookieBannerImage.loading = "lazy";
  cookieBannerImage.alt = "octopus tentacles holding a cookie";
  cookieBannerOverlay.appendChild(cookieBannerImage);

  const cookieModal = document.createElement("div");
  cookieModal.id = "cookie-modal";
  cookieModal.className = "modal-cookie";
  cookieBannerOverlay.appendChild(cookieModal);

  const cookieFrame = document.createElement("div");
  cookieFrame.className = "cookie-frame";
  cookieModal.appendChild(cookieFrame);

  const cookieTextBlock = document.createElement("div");
  cookieTextBlock.className = "cookie-text-block";
  cookieFrame.appendChild(cookieTextBlock);

  const cookieText = document.createElement("div");
  cookieText.className = "cookie-text";
  cookieText.innerHTML = `We are using cookies for secure log-in and to improve our app.  First party only, no data krakens 🦑&nbsp; Learn more in our <a href="https://octomind.dev/privacy-policy" target="_blank" class="link-white">privacy policy</a>.`;
  cookieTextBlock.appendChild(cookieText);

  const essentialButton = document.createElement("a");
  essentialButton.innerHTML = `
    <a id="allow-essential-btn" class="allow-essential-btn button">
      <span class="essential-button-inner">allow essential<br /> cookies</span>
    </a>
  `;
  cookieFrame.appendChild(essentialButton);

  const allCookiesButton = document.createElement("a");
  allCookiesButton.innerHTML = `<a id="allow-all-btn" class="button-allow-all button">allow all cookies</a>`;
  cookieFrame.appendChild(allCookiesButton);

  document.querySelector("main").appendChild(cookieBannerOverlay);
};

const sleep = async (numberOfMilliseconds) => {
  return new Promise((resolve) => {
    setTimeout(resolve, numberOfMilliseconds);
  });
};

const onLoad = async () => {
  console.log("onLoad");
  while (!window.next?.router?.isReady) {
    console.log("waiting for next hydration");
    await sleep(10);
  }

  addCookieBanner();

  const consentCookieValue = parseCookiesForConsentCookie();

  if (consentCookieValue) {
    if (consentCookieValue.allowOptional) {
      posthogInit(COOKIE_PERSISTENCE);
    } else {
      posthogInit("memory");
    }
    return;
  }

  posthogInit("memory");

  showBanner();

  setupCookieButton("allow-essential-btn", false);
  setupCookieButton("allow-all-btn", true);
};

console.log("executing");
window.addEventListener("load", () => {
  void onLoad();
});
