(() => {
  const $ = (selector) => document.querySelector(selector);
  const validThemes = ['rose', 'sunset', 'midnight', 'pastel', 'matcha', 'blue'];
  const validOccasions = ['appreciation', 'birthday', 'love', 'congratulations'];
  const occasionCopy = {
    appreciation: { kicker: 'A LITTLE TRIBUTE, MADE JUST FOR YOU', welcome: 'A LITTLE SURPRISE, MADE WITH LOVE', end: 'You are appreciated more than words can say.' },
    birthday: { kicker: 'A LITTLE CELEBRATION, JUST FOR YOU', welcome: 'A LITTLE BIRTHDAY SURPRISE', end: 'May this next trip around the sun bring you beautiful things.' },
    love: { kicker: 'A LITTLE LOVE NOTE, JUST FOR YOU', welcome: 'A LITTLE SURPRISE FROM MY HEART', end: 'You have a way of making every day feel more like home.' },
    congratulations: { kicker: 'A LITTLE NOTE FOR A BIG MOMENT', welcome: 'A LITTLE SOMETHING TO CELEBRATE', end: 'This is your moment. I hope you let yourself enjoy every bit of it.' }
  };
  function decodeCard() {
    const hash = window.location.hash.slice(1);
    const raw = new URLSearchParams(hash).get('card');
    if (!raw) throw new Error('Missing card');
    const binary = atob(decodeURIComponent(raw));
    const data = JSON.parse(decodeURIComponent(escape(binary)));
    ['recipient', 'sender', 'headline', 'message'].forEach((key) => {
      if (typeof data[key] !== 'string' || !data[key].trim()) throw new Error(`Missing ${key}`);
    });
    if (!validThemes.includes(data.theme) || !validOccasions.includes(data.occasion)) throw new Error('Invalid design choice');
    if (data.photo && (typeof data.photo !== 'string' || !/^https?:\/\//i.test(data.photo))) data.photo = '';
    return { recipient: data.recipient.slice(0, 48), sender: data.sender.slice(0, 48), headline: data.headline.slice(0, 90), message: data.message.slice(0, 900), photo: data.photo || '', theme: data.theme, occasion: data.occasion };
  }
  const setText = (selector, value) => { $(selector).textContent = value; };
  function render(data) {
    document.body.dataset.theme = data.theme;
    const iconColors = { rose: '#c55763', sunset: '#d26037', midnight: '#d6ab71', pastel: '#8c6bb0', matcha: '#5e8064', blue: '#3c64a0' };
    const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="20" fill="${iconColors[data.theme]}"/><text x="17" y="46" font-family="Georgia" font-size="44" fill="#fff6eb">d</text></svg>`;
    $('#site-icon').href = `data:image/svg+xml,${encodeURIComponent(iconSvg)}`;
    const copy = occasionCopy[data.occasion];
    setText('#welcome-name', data.recipient.toLocaleUpperCase());
    setText('#welcome-sender', data.sender);
    setText('#welcome-kicker', copy.welcome);
    setText('#hero-kicker', copy.kicker);
    setText('#hero-name', data.recipient.toLocaleUpperCase());
    setText('#hero-headline', data.headline);
    setText('#hero-desc', data.message.split(/[.!?](?:\s|$)/)[0].trim() + '.');
    setText('#letter-title', data.occasion === 'birthday' ? 'A whole day to celebrate you.' : data.occasion === 'love' ? 'You deserve to hear this.' : data.occasion === 'congratulations' ? 'You did a beautiful thing.' : 'You deserve to hear this.');
    setText('#letter-dear', `Dear ${data.recipient},`);
    setText('#letter-copy', data.message);
    setText('#letter-sender', data.sender);
    setText('#final-title', `One last thing, ${data.recipient}.`);
    setText('#final-copy', copy.end);
    setText('#last-message', `${data.headline}\n\n${data.message}`);
    setText('#final-sender', `${data.sender} ♡`);
    if (data.photo) {
      $('#hero-photo-img').src = data.photo;
      $('#keepsake-img').src = data.photo;
      $('#hero-photo').hidden = false;
      $('#keepsake').hidden = false;
      setText('#keepsake-note', `${data.recipient}, some moments are worth keeping close. This one is yours, with love from ${data.sender}.`);
      $('#hero-photo-img').onerror = () => { $('#hero-photo').hidden = true; };
      $('#keepsake-img').onerror = () => { $('#keepsake').hidden = true; };
    }
    $('#open-surprise').addEventListener('click', () => {
      $('#open-screen').classList.add('opening');
      window.setTimeout(() => {
        $('#open-screen').hidden = true;
        $('#personal-site').hidden = false;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        observeSections();
      }, 350);
    });
    $('#last-message-button').addEventListener('click', (event) => {
      event.currentTarget.hidden = true;
      $('#last-message').hidden = false;
    });
  }
  function observeSections() {
    const sections = document.querySelectorAll('.reveal-section');
    if (!('IntersectionObserver' in window)) { sections.forEach((section) => section.classList.add('is-visible')); return; }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: 0.13 });
    sections.forEach((section) => observer.observe(section));
  }
  try {
    render(decodeCard());
  } catch {
    $('#open-screen').hidden = true;
    $('#invalid-card').hidden = false;
  }
})();
