/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

import { generateUUID } from '../../scripts/scripts.js';

export default function decorate(block) {
  const accordionUUID = `accordion-${generateUUID()}`;
  block.setAttribute('id', accordionUUID);
  [...block.children].forEach((row) => {
    const itemTitle = row.querySelector(':scope > div > h5');

    // is title for the accordion
    const isTitle = itemTitle && itemTitle.getAttribute('id') === 'title';
    if (isTitle) {
      row.remove();
      return;
    }

    // get title and content
    const title = itemTitle.innerHTML;

    const paragraphs = Array.from(row.querySelector(':scope > div:nth-child(2)').children).slice(1);

    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.innerHTML = `<p>${title}</p>`;

    // decorate accordion item body
    const body = document.createElement('div');
    body.className = 'accordion-item-body';
    // for each paragraph, append to body
    [...paragraphs].forEach((paragraph) => {
      body.appendChild(paragraph);
    });

    // decorate accordion item
    const details = document.createElement('details');
    details.className = 'accordion-item';
    details.append(summary, body);

    details.addEventListener('click', () => {
      block.querySelectorAll('.accordion-item').forEach((item) => {
        if (item !== details) {
          item.removeAttribute('open');
        }
      });
    });

    row.replaceWith(details);
  });
}
