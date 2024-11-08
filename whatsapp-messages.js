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
      userId,
    };
    if (isSystemMessage && !isRecalled) result.text = v.outerText;
    if (!isSystemMessage && !isRecalled) {
      // TODO: Image links
      // TODO: Forwarded flag
      result.text = v.querySelector(".selectable-text")?.outerText;
      result.time = extractDate(v.querySelector("[data-pre-plain-text]")?.dataset.prePlainText);
      result.author = v.querySelector('[role=""] [dir][aria-label]')?.textContent ?? lastAuthor;
      if (!result.time) console.log("NO TIME", v, result);
    }
    lastAuthor = result.author;
    const quote = v.querySelector('[aria-label="Quoted message" i]');
    if (quote) {
      result.quoteAuthorPhone = quote.querySelector('[role=""] :not([aria-label])')?.textContent;
      result.quoteAuthorName = quote.querySelector('[role=""] [aria-label]')?.textContent;
      result.quoteText = quote.querySelector(".quoted-mention")?.outerText;
    }
    const reactions = v.querySelector('[aria-label^="Reactions "],[aria-label^="reaction "]');
    if (reactions)
      result.reactions = reactions
        .getAttribute("aria-label")
        .replace(/^reactions? */i, "")
        .replace(/ *in total$/i, "");
    return result;
  });
}

function extractDate(dateString) {
  const match = dateString?.match?.(/\[(\d{1,2}:\d{2}\s?[ap]m),\s?(\d{1,2})\/(\d{1,2})\/(\d{4})\]/);
  return match ? new Date(`${match[4]}-${match[3]}-${match[2]} ${match[1]}`) : null;
}

export default whatsappMessages;
