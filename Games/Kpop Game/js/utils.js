// Utility functions
// Utility Shortcuts
const $ = id => document.getElementById(id);

// Derpy fallback loader
function loadDerpyImage() {
    const img = $("derpy-img");
    const derpyFallbackSvg = `data:image/svg+xml;utf8,${encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><defs><radialGradient id="g" cx="52%" cy="35%" r="65%"><stop offset="0" stop-color="#ffd5bf"/><stop offset="1" stop-color="#f2a98c"/></radialGradient></defs><circle cx="48" cy="48" r="42" fill="url(#g)"/><ellipse cx="32" cy="40" rx="8" ry="10" fill="#ffffff"/><ellipse cx="64" cy="40" rx="8" ry="10" fill="#ffffff"/><circle cx="33" cy="42" r="3" fill="#1a1a1a"/><circle cx="63" cy="42" r="3" fill="#1a1a1a"/><ellipse cx="48" cy="57" rx="11" ry="8" fill="#e99373"/><circle cx="45" cy="56" r="1.4" fill="#1a1a1a"/><circle cx="51" cy="56" r="1.4" fill="#1a1a1a"/><path d="M37 63c4 4 18 4 22 0" stroke="#8c4b35" stroke-width="2.5" fill="none" stroke-linecap="round"/><path d="M20 29c5-8 14-12 22-12" stroke="#f2b6a0" stroke-width="5" stroke-linecap="round"/><path d="M76 29c-5-8-14-12-22-12" stroke="#f2b6a0" stroke-width="5" stroke-linecap="round"/></svg>'
    )}`;
    img.src = portraits.derpy;
    img.onerror = () => {
        console.warn("Derpy image failed, using fallback.");
        img.onerror = null;
        img.src = derpyFallbackSvg;
    };
}
