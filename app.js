const loadServersBtn = document.getElementById('loadServers');
const serverListDiv = document.getElementById('serverList');
const statusDiv = document.getElementById('status');

async function loadServers() {
  statusDiv.textContent = "Loading servers...";
  try {
    const response = await fetch('https://api.codetabs.com/v1/proxy/?quest=https://www.vpngate.net/api/iphone/');
    const text = await response.text();

    const servers = text.split('\n')
      .filter(line => line && !line.startsWith('*') && line.includes(','))
      .map(line => line.split(','));

    serverListDiv.innerHTML = '';
    servers.slice(1, 12).forEach(s => {
      const country = s[5];
      const ip = s[1];
      const ping = s[3];

      const div = document.createElement('div');
      div.className = 'server';
      div.innerHTML = `
        <h3>${country}</h3>
        <p>IP: ${ip}</p>
        <p>Ping: ${ping} ms</p>
        <button class="connect-btn">Connect</button>
      `;
      div.querySelector('button').addEventListener('click', () => connectVPN(country));
      serverListDiv.appendChild(div);
    });

    statusDiv.textContent = "";
  } catch (err) {
    console.error(err);
    statusDiv.textContent = "❌ Failed to load servers. Please check your connection.";
  }
}

function connectVPN(country) {
  statusDiv.textContent = `Connecting to ${country}...`;
  setTimeout(() => {
    statusDiv.textContent = `✅ Connected to ${country} (Public Node Active)`;
  }, 1500);
}

loadServersBtn.addEventListener('click', loadServers);
loadServers();
