(() => {
  const form = document.querySelector('#card-form');
  const fields = ['recipient', 'sender', 'headline', 'message', 'photo'];
  const state = { theme: 'rose', occasion: 'appreciation' };
  const $ = (selector) => document.querySelector(selector);
  const val = (id) => document.getElementById(id).value.trim();
  const occasionCopy = {
    appreciation: ['A LITTLE NOTE FOR YOU', '❀'],
    birthday: ['A LITTLE BIRTHDAY MAGIC', '✹'],
    love: ['A LITTLE LOVE NOTE', '♡'],
    congratulations: ['A LITTLE NOTE TO CELEBRATE', '✦']
  };
  const escapeHTML = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  function updatePreview() {
    const recipient = val('recipient') || 'Someone lovely';
    $('#preview-recipient').textContent = recipient.toLocaleUpperCase();
    $('#preview-sender').textContent = val('sender') || 'You';
    $('#preview-headline').textContent = val('headline') || 'A little something, just for you.';
    $('#preview-message').textContent = (val('message') || 'A few honest words, made just for them.').slice(0, 190);
    $('#preview').dataset.theme = state.theme;
    $('#preview-kicker').textContent = occasionCopy[state.occasion][0];
    $('#preview-flower').textContent = occasionCopy[state.occasion][1];
    $('#char-count').textContent = `${document.getElementById('message').value.length} / 900`;
    const photo = val('photo');
    const photoWrap = $('#preview-photo');
    if (photo) {
      photoWrap.hidden = false;
      $('#preview-photo-image').src = photo;
      $('#preview-photo-image').onerror = () => { photoWrap.hidden = true; };
    } else {
      photoWrap.hidden = true;
      $('#preview-photo-image').removeAttribute('src');
    }
  }
  fields.forEach((id) => document.getElementById(id).addEventListener('input', updatePreview));
  document.querySelectorAll('.theme-option').forEach((button) => button.addEventListener('click', () => {
    state.theme = button.dataset.theme;
    document.querySelectorAll('.theme-option').forEach((item) => item.classList.toggle('active', item === button));
    updatePreview();
  }));
  document.querySelectorAll('.occasion-option').forEach((button) => button.addEventListener('click', () => {
    state.occasion = button.dataset.occasion;
    document.getElementById('occasion').value = state.occasion;
    document.querySelectorAll('.occasion-option').forEach((item) => item.classList.toggle('active', item === button));
    updatePreview();
  }));

  function encodeData(data) {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = {
      version: 1,
      recipient: val('recipient'),
      sender: val('sender'),
      headline: val('headline'),
      message: val('message'),
      photo: val('photo'),
      occasion: state.occasion,
      theme: state.theme
    };
    const encoded = encodeData(data);
    const viewUrl = new URL('view.html', window.location.href);
    viewUrl.hash = `card=${encodeURIComponent(encoded)}`;
    $('#share-link').value = viewUrl.href;
    $('#open-link').href = viewUrl.href;
    $('#share-result').hidden = false;
    $('#copy-status').textContent = '';
    $('#share-result').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
  $('#copy-link').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('#share-link').value);
      $('#copy-status').textContent = 'Copied. Send it to them ✳';
    } catch {
      $('#share-link').select();
      const copied = document.execCommand('copy');
      $('#copy-status').textContent = copied ? 'Copied. Send it to them ✳' : 'Select the link above to copy it.';
    }
  });
  updatePreview();
})();
