/*
 * sms-consent.js — 10DLC SMS opt-in checkbox for any form that collects a phone number.
 * Optional and unchecked by default (carriers require consent to be freely given and
 * not a condition of submitting the form). Configure on the <script> tag:
 *   data-brand="Brand Name" data-privacy="/privacy-policy/" data-terms="/terms/"
 * Consent text version: 2026-11-10. Keep in sync with each site's Privacy Policy and Terms.
 */
(function () {
  var s = document.currentScript || document.querySelector('script[data-sms-consent]');
  var cfg = {
    brand: (s && s.getAttribute('data-brand')) || document.title.split(/[|–—-]/).pop().trim(),
    privacy: (s && s.getAttribute('data-privacy')) || '/privacy-policy/',
    terms: (s && s.getAttribute('data-terms')) || '/terms-and-conditions/'
  };
  var VERSION = '2026-11-10';
  var PHONE_RX = /\b(phone|mobile|cell|tel)\b|phone|telefono|tel[eé]fono/i;

  function labelText(el) {
    var t = '';
    if (el.id) {
      var l = document.querySelector('label[for="' + el.id.replace(/"/g, '\\"') + '"]');
      if (l) t += ' ' + l.textContent;
    }
    var w = el.closest('label, .gfield, .et_pb_contact_field, .jb-field, .jb-zfield, .form-group, .field, p, div');
    if (w) { var lab = w.querySelector('label, .gfield_label, legend'); if (lab) t += ' ' + lab.textContent; }
    return t;
  }

  function isPhone(el) {
    if (el.type === 'tel') return true;
    if (!/^(text|number|)$/i.test(el.type || '')) return false;
    var hay = [el.name, el.id, el.placeholder, el.getAttribute('aria-label'), el.autocomplete].join(' ');
    return PHONE_RX.test(hay) || PHONE_RX.test(labelText(el));
  }

  function findSubmit(form) {
    return form.querySelector('button[type=submit], input[type=submit], button:not([type]), .gform_button, [data-submit]');
  }

  function build(form) {
    var id = 'sms-consent-' + Math.random().toString(36).slice(2, 8);
    var wrap = document.createElement('div');
    wrap.className = 'jb-field jb-sms-consent';
    wrap.innerHTML =
      '<span class="gfield_label jb-sms-consent__k">SMS consent</span>' +
      '<label for="' + id + '" class="jb-sms-consent__label">' +
      '<input type="checkbox" id="' + id + '" name="sms_consent" value="Yes - agreed to text messages (consent text v' + VERSION + ')"> ' +
      '<span>I agree to receive text messages from ' + esc(cfg.brand) +
      ' about my inquiry and appointments at the number above. Message frequency varies. ' +
      'Message &amp; data rates may apply. Reply STOP to opt out, HELP for help. ' +
      'Consent is not required to submit this form. See our <a href="' + esc(cfg.privacy) + '" target="_blank" rel="noopener">Privacy Policy</a> and ' +
      '<a href="' + esc(cfg.terms) + '" target="_blank" rel="noopener">Terms</a>.</span></label>';
    return wrap;
  }

  function esc(v) { return String(v).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function enhance(form) {
    if (!form || form.dataset.smsConsent) return;
    if (form.querySelector('[name="sms_consent"]')) { form.dataset.smsConsent = '1'; return; }
    // A form that already carries its own carrier-approved SMS consent keeps it.
    if (/\b(reply|send|text)\s+(STOP|HELP)\b|STOP to (unsubscribe|opt out|cancel)/i.test(form.textContent || '')) { form.dataset.smsConsent = '1'; return; }
    var inputs = form.querySelectorAll('input');
    var has = false;
    for (var i = 0; i < inputs.length; i++) { if (isPhone(inputs[i])) { has = true; break; } }
    if (!has) return;
    form.dataset.smsConsent = '1';
    var box = build(form);
    var sub = findSubmit(form);
    if (sub) {
      var anchor = sub;
      while (anchor.parentElement && anchor.parentElement !== form && anchor.parentElement.children.length === 1) anchor = anchor.parentElement;
      anchor.parentElement.insertBefore(box, anchor);
    } else {
      form.appendChild(box);
    }
  }

  function scan(root) {
    var forms = (root.querySelectorAll ? root.querySelectorAll('form') : []);
    for (var i = 0; i < forms.length; i++) enhance(forms[i]);
    if (root.tagName === 'FORM') enhance(root);
  }

  var css = document.createElement('style');
  css.textContent =
    '.jb-sms-consent{margin:12px 0;font-size:13px;line-height:1.45;text-align:left}' +
    '.jb-sms-consent__k{position:absolute!important;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}' +
    '.jb-sms-consent__label{display:flex;gap:8px;align-items:flex-start;cursor:pointer;font-weight:400;text-transform:none;letter-spacing:normal}' +
    '.jb-sms-consent__label input{margin:3px 0 0;flex:0 0 auto;width:16px;height:16px;min-height:0;appearance:auto;-webkit-appearance:checkbox}' +
    '.jb-sms-consent__label a{text-decoration:underline;color:inherit}';
  (document.head || document.documentElement).appendChild(css);

  function start() {
    scan(document);
    if (window.MutationObserver) {
      new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++)
          for (var j = 0; j < muts[i].addedNodes.length; j++) {
            var n = muts[i].addedNodes[j];
            if (n.nodeType === 1) scan(n);
          }
      }).observe(document.body, { childList: true, subtree: true });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
