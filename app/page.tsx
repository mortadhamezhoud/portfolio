// Static export has no server-side language detection: `/` redirects on the client,
// using the saved choice first, then the browser language, then English.
const redirectScript = `(function(){
  var saved = null;
  try { saved = localStorage.getItem("locale"); } catch (e) {}
  var langs = navigator.languages || [navigator.language || ""];
  var pick = saved === "fr" || saved === "en" ? saved : null;
  for (var i = 0; !pick && i < langs.length; i++) {
    if (/^fr/i.test(langs[i])) pick = "fr";
    else if (/^en/i.test(langs[i])) pick = "en";
  }
  location.replace("/" + (pick || "en") + location.hash);
})();`;

export default function RootRedirect() {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex" />
        <noscript>
          <meta httpEquiv="refresh" content="0;url=/en" />
        </noscript>
        <script dangerouslySetInnerHTML={{ __html: redirectScript }} />
      </head>
      <body style={{ background: "#05070D" }} />
    </html>
  );
}
