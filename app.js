const serverList = document.getElementById('serverList');
const connectBtn = document.getElementById('connectBtn');
const statusBox = document.getElementById('statusBox');

// Load real public VPN servers (VPNGate)
async function loadServers() {
  try {
    const response = await fetch('https://www.vpngate.net/api/iphone/');
    const text = await response.text();

    const lines = text.split('\n').filter(l => l.includes(','));
    const servers = lines.map(line => line.split(',')).slice(2, 30);

    serverList.innerHTML = "";
    servers.forEach(s => {
      const option = document.createElement('option');
      option.value = s[1];
      option.textContent = s[6] + " - " + s[0];
      serverList.appendChild(option);
    });

    statusBox.textContent = "Servers loaded successfully!";
  } catch (err) {
    serverList.innerHTML = "<option>Failed to load servers</option>";
    statusBox.textContent = "Error loading servers. Try again.";
  }
}

loadServers();

// Simulate VPN connect
connectBtn.addEventListener('click', () => {
  const selected = serverList.options[serverList.selectedIndex].text;
  statusBox.textContent = `Connecting to ${selected}...`;
  connectBtn.disabled = true;

  setTimeout(() => {
    statusBox.textContent = `✅ Connected to ${selected}`;
    connectBtn.textContent = "Disconnect";
    connectBtn.disabled = false;
  }, 2000);
});
