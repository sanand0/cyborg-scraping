// ==UserScript==
// @name        scrape-whatsapp-messages
// @description Scrapes WhatsApp messages from WhatsApp web
// @homepageURL https://github.com/sanand0/cyborg-scraping/blob/main/whatsapp-messages.js
// @author      Anand S
// @version     1.0.0
// @date        2024-03-30
// @namespace   https://github.com/sanand0/cyborg-scraping
// @license     MIT
// @copyright   2024, Anand S
// @include     https://web.whatsapp.com/
// @run-at      document-start
// @grant       none
// ==/UserScript==

function whatsappMessages() {
  let lastAuthor;
  return Array.from(document.querySelectorAll('#main [role="row"]')).map((v) => {
    let [isSystemMessage, userId, userDomain, messageId, authorPhone, authorDomain] = v.querySelector("[data-id]").dataset.id.split(/[_@]/);
    isSystemMessage = isSystemMessage === "true";
    let isRecalled = !!v.querySelector('[data-icon="recalled"]');
    const result = {
      messageId,
      authorPhone,
      isSystemMessage,
      isRecalled,
    };
    if (isSystemMessage && !isRecalled) result.text = v.outerText;
    if (!isSystemMessage && !isRecalled) {
      // TODO: Image links
      // TODO: Forwarded flag
      result.text = v.querySelector(".selectable-text")?.outerText;
      result.time = v.querySelector("[data-pre-plain-text]")?.dataset.prePlainText;
      result.author = v.querySelector('[testid="author"]')?.textContent ?? lastAuthor;
      if (!result.time) console.log("NO TIME", v, result);
    }
    lastAuthor = result.author;
    const quote = v.querySelector('[aria-label="Quoted Message"]');
    if (quote) {
      result.quoteAuthor = quote.querySelector('[testid="author"]')?.textContent;
      result.quoteText = quote.querySelector(".quoted-mention")?.outerText;
    }
    return result;
  });
}

export default whatsappMessages;
