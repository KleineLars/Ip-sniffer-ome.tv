# IP Sniffer
A lightweight, real-time WebRTC IP Sniffer overlay for the browser. It intercepts IP addresses via WebRTC srflx ICE candidates, retrieves location and ISP data through the ipgeolocation.io API, and displays the results inside a custom UI overlay.

## Features

* **In-App Key Setup:** Input your API key directly within the overlay window without using browser prompt() popups.
* **Persistent Storage:** Saves the API key to localStorage so it persists across sessions.
* **Dynamic Network Detection:** Analyzes network types and adjusts UI highlights accordingly:
  * **Residential:** Standard home ISPs.
  * **Mobile Data:** Cellular networks (4G/5G/LTE).
  * **VPN / Proxy / Cloud:** Datacenters, hosting providers, or known proxy/VPN services.
* **Auto-Copy IP:** Click the displayed IP address to copy it to the clipboard.
* **Location Link:** Direct link to Google Maps using the coordinates provided by the API.

## Prerequisites & API Key

An API key from ipgeolocation.io is required to fetch IP metadata.

1. Create a free account at https://ipgeolocation.io
2. Copy your API key from the dashboard.
3. Paste the key into the input field inside the UI overlay when prompted on first run.

## Installation & Usage

### Method 1: Browser Console
1. Open any web page.
2. Open Developer Tools (F12 or Ctrl+Shift+I / Cmd+Option+I).
3. Navigate to the Console tab.
4. Paste the JavaScript code and press Enter.

### Method 2: Bookmarklet
1. Create a new browser bookmark.
2. Set the name to IP Sniffer.
3. Set the URL to:
   ```javascript
   javascript:(function(){/* Paste script code here */})();
