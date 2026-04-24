# IP SNIFFER

This script intercepts public IP addresses via WebRTC ICE candidates and displays real-time geolocation data.

## ✨ Features
- **Real-time Data:** Displays IP, Country (with flag), City, and ISP.
- **Quick Access:** Direct "View Location" button linking to Google Maps.
- **Engine:** Automated WebRTC interception logic.

## 🚀 How to Use

### Desktop (Chrome / Edge / Brave)
1. Open your video chat site (e.g., Ome.tv).
2. Press `F12` to open Developer Tools.
3. Go to the **Console** tab.
4. Paste the entire script above and hit **Enter**.
5. Information will appear in the purple box once a peer connection is established.

### Mobile (Android - Kiwi Browser)
1. Download **Kiwi Browser** (supports developer consoles).
2. Navigate to the site, tap the three dots -> **Developer Tools**.
3. Paste the script into the console.

## ⚠️ Disclaimer
- Use for **educational purposes** only.
- Accuracy depends on the ISP database; it usually points to a provider's hub, not a specific house.
- **VPN users** will show the location of the VPN server instead of their home.
