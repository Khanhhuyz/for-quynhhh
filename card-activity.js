(() => {
  const endpoint = 'https://for-quynhhh-activity.huynnkce200168.workers.dev';
  if (location.origin !== 'https://khanhhuyz.github.io') return;

  const visitId = crypto.randomUUID();
  function record(event) {
    fetch(endpoint + '/events', {
      method: 'POST',
      body: JSON.stringify({visitId, event}),
      keepalive: true,
      credentials: 'omit',
      referrerPolicy: 'no-referrer',
    }).catch(() => {});
  }

  record('visit');
  document.getElementById('answer-yes').addEventListener('click', () => record('yes'));
  document.getElementById('answer-later').addEventListener('click', () => record('later'));
})();
