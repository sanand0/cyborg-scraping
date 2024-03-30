// ==UserScript==
// @name        scrape-linkedin-followers
// @description Scrapes LinkedIn followers from the page. No longer works (30 Mar 2024) since LinkedIn redirected https://www.linkedin.com/feed/followers/ to https://www.linkedin.com/mynetwork/network-manager/people-follow/followers/
// @homepageURL https://www.s-anand.net/blog/cyborg-scraping/
// @author      Anand S
// @version     1.0.0
// @date        2021-06-25
// @namespace   https://github.com/sanand0/cyborg-scraping
// @license     MIT
// @copyright   2021, Anand S
// @include     https://www.linkedin.com/feed/followers/
// @run-at      document-start
// @grant       none
// ==/UserScript==

function linkedinFollowers() {
  return Array.from(document.querySelectorAll(".follows-recommendation-card")).map((v) => {
    let name = v.querySelector(".follows-recommendation-card__name");
    let headline = v.querySelector(".follows-recommendation-card__headline");
    let subtext = v.querySelector(".follows-recommendation-card__subtext");
    let link = v.querySelector(".follows-recommendation-card__avatar-link");
    let followers = "",
      match;
    if (subtext) {
      if ((match = subtext.innerText.match(/([\d\.K]+) follower/))) {
        followers = match[1];
      } else if ((match = subtext.innerText.match(/([\d\.K]+) other/))) {
        followers = match[1];
      }
    }
    followers = followers.match(/K$/) ? parseFloat(followers) * 1000 : parseFloat(followers);
    return {
      name: name ? name.innerText : "",
      headline: headline ? headline.innerText : "",
      followers: followers,
      link: link ? link.href : "",
    };
  });
}

export default linkedinFollowers;
