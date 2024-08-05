import createField from './form-fields.js';
import { sampleRUM, loadScript } from '../../scripts/aem.js';

// TODO: add your reCAPTCHA site key here
const RECAPTCHA_SITE_KEY = 'AAA';

// constructPayload
function generatePayload(form) {
  const payload = {};

  [...form.elements].forEach((field) => {
    if (field.name && field.type !== 'submit' && !field.disabled) {
      if (field.type === 'radio') {
        if (field.checked) payload[field.name] = field.value;
      } else if (field.type === 'checkbox') {
        if (field.checked) payload[field.name] = payload[field.name] ? `${payload[field.name]},${field.value}` : field.value;
      } else {
        payload[field.name] = field.value;
      }
    }
  });
  return payload;
}

function handleSubmitError(form, error) {
  // eslint-disable-next-line no-console
  console.error(error);
  form.querySelector('button[type="submit"]').disabled = false;
  sampleRUM('form:error', { source: '.form', target: error.stack || error.message || 'unknown error' });
}

// submitForm
async function handleSubmit(form) {
  if (form.getAttribute('data-submitting') === 'true') return;

  const submit = form.querySelector('button[type="submit"]');
  try {
    form.setAttribute('data-submitting', 'true');
    submit.disabled = true;

    // create payload
    const payload = generatePayload(form);
    const response = await fetch(form.dataset.action, {
      method: 'POST',
      body: JSON.stringify({ data: payload }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      sampleRUM('form:submit', { source: '.form', target: form.dataset.action });
      if (form.dataset.confirmation) {
        window.location.href = form.dataset.confirmation;
      }
    } else {
      const error = await response.text();
      throw new Error(error);
    }
  } catch (e) {
    handleSubmitError(form, e);
  } finally {
    form.setAttribute('data-submitting', 'false');
  }
}

const errorMap = ['Invalid number', 'Invalid country code', 'Too short', 'Too long', 'Invalid number'];

function validateForm(form) {
  const valid = form.checkValidity();
  const tels = [...document.querySelectorAll('input[type="tel"]')];
  const telValid = tels.every((tel) => {
    if (tel.value) {
      const iti = window.intlTelInputGlobals.getInstance(tel);
      const validField = iti.isValidNumber();
      const errorMessage = validField ? '' : errorMap[iti.getValidationError()];
      tel.setCustomValidity(errorMessage);
      return validField;
    }
    return false;
  });
  return valid && telValid;
}

async function prepareFormSubmit() {
  const form = document.querySelector('form');
  const button = form.querySelector('button');
  if (validateForm(form)) {
    if (await handleSubmit(form)) {
      button.setAttribute('disabled', '');
      const redirectTo = button.dataset.redirect;
      if (redirectTo) {
        window.location.href = redirectTo;
      }
    } else {
      // eslint-disable-next-line no-alert
      alert('Form submission failed');
    }
  } else {
    [...form.elements].forEach((elem) => {
      if (elem.checkValidity()) {
        elem.classList.remove('invalid');
      } else {
        elem.classList.add('invalid');
      }
    });
  }
}

// apply rules to form
/* sample data:
  {
    "fieldId": "field-1",
    "rule": {
      "type": "visible",
      "condition": {
        "key": "fieldA",
        "operator": "eq",
        "value": "fieldA-value"
      }
    }
  }
*/

function applyRules(form, rules) {
  const payload = generatePayload(form);
  rules.forEach((field) => {
    const { type, condition: { key, operator, value } } = field.rule;
    if (type === 'visible') { // show/hide elements based on value in a field
      if (operator === 'eq') {
        if (payload[key] === value) {
          form.querySelector(`.${field.fieldId}`).classList.remove('hidden');
        } else {
          form.querySelector(`.${field.fieldId}`).classList.add('hidden');
        }
      }
    }
  });
}

async function createForm(formHref) {
  const { pathname } = new URL(formHref);
  const resp = await fetch(pathname);
  const json = await resp.json();

  const form = document.createElement('form');
  // eslint-disable-next-line prefer-destructuring
  form.dataset.action = pathname.split('.json')[0];

  const rules = [];
  const fields = await Promise.all(json.data.map((fd) => {
    const field = createField(fd, form);
    const fieldId = field.field.id;
    if (fd.Rules) {
      try {
        rules.push({ fieldId, rule: JSON.parse(fd.Rules) });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.warn(`Invalid Rule ${fd.Rules}: ${e}`);
      }
    }
    return createField(fd, form);
  }));

  fields.forEach((field) => {
    if (field) {
      const isSubmit = field.field.type === 'submit';
      const isRecaptcha = field.field.dataset.recaptcha === 'true' || field.field.dataset.Recaptcha === 'true';
      if (isSubmit && isRecaptcha) {
        const button = field.field;
        const key = button.dataset.sitekey ? button.dataset.sitekey : RECAPTCHA_SITE_KEY;
        button.dataset.callback = 'handleRecaptchaResponse';
        button.dataset.action = 'submit';
        button.dataset.sitekey = key;
        button.addEventListener('click', prepareFormSubmit);
        const obs = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              loadScript('https://www.google.com/recaptcha/api.js');
              obs.disconnect();
            }
          });
        });
        obs.observe(button);
      }

      form.append(field);
    }
  });

  // group fields into fieldsets
  const fieldsets = form.querySelectorAll('fieldset');
  fieldsets.forEach((fieldset) => {
    form.querySelectorAll(`[data-fieldset="${fieldset.name}"`).forEach((field) => {
      fieldset.append(field);
    });
  });

  form.addEventListener('change', () => applyRules(form, rules));
  applyRules(form, rules);

  return form;
}

window.handleRecaptchaResponse = async (token) => {
  if (token) {
    document.getElementById('g-recaptcha-response').textContent = token;
  }
};

export default async function decorate(block) {
  const formLink = block.querySelector('a[href$=".json"]');
  if (!formLink) return;

  const form = await createForm(formLink.href);
  block.replaceChildren(form);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = form.checkValidity();
    if (valid) {
      handleSubmit(form);
    } else {
      const firstInvalidEl = form.querySelector(':invalid:not(fieldset)');
      if (firstInvalidEl) {
        firstInvalidEl.focus();
        firstInvalidEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
}
