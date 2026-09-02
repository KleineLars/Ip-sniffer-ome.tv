/* IP SNIFFER by Kleine_Lars - LITE EDITION
   Features: Minimal UI, Direct WebRTC IP Capture, Custom In-UI Left Popup Notification
*/

(function() {
    const STORE_URL = "https://kleinelars.mysellauth.com/product/ip-sniffer-ometv";

    // 1. Styling toevoegen
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes slideInLeft { from { transform: translateX(-100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .promo-btn {
            display: block; width: 100%; box-sizing: border-box; padding: 8px 10px;
            background: #2a2a2a; color: #fff; text-align: center; text-decoration: none;
            border: 1px solid #3a3a3a; border-radius: 6px; font-weight: 700; font-size: 11px;
            transition: 0.2s; cursor: pointer; margin-top: 8px;
        }
        .promo-btn:hover { background: #333; border-color: #555; }
    `;
    document.head.appendChild(style);

    // 2. Hoofdmenu aan de rechterkant
    const infoBox = document.createElement('div');
    infoBox.id = "ip-sniffer-ui-lite";
    infoBox.style.cssText = `
        position: fixed; top: 20px; right: 20px; z-index: 2147483647;
        background: #121212; color: #e0e0e0; padding: 16px; 
        border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; width: 260px;
        border: 1px solid #222; animation: slideInRight 0.3s ease-out;
        box-shadow: 0 10px 25px rgba(0,0,0,0.6);
    `;
    
    infoBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; border-bottom: 1px solid #222; padding-bottom: 8px;">
            <span style="font-weight:800; font-size:11px; color:#fff; letter-spacing:1px; text-transform:uppercase;">IP SNIFFER (LITE)</span>
            <div id="status-dot" style="width:8px; height:8px; background:#ff9800; border-radius:50%;"></div>
        </div>
        <div id="status-text" style="font-size:12px; color:#888;">
            Scanning for connection...
        </div>
    `;
    document.body.appendChild(infoBox);

    // 3. Functie voor de melding aan de linkerkant
    function showPromoNotification() {
        const existingAlert = document.getElementById("ip-sniffer-promo");
        if (existingAlert) existingAlert.remove();

        const promoBox = document.createElement('div');
        promoBox.id = "ip-sniffer-promo";
        promoBox.style.cssText = `
            position: fixed; top: 20px; left: 20px; z-index: 2147483647;
            background: #121212; color: #e0e0e0; padding: 16px; 
            border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; width: 260px;
            border: 1px solid #222; animation: slideInLeft 0.3s ease-out;
            box-shadow: 0 10px 25px rgba(0,0,0,0.6);
        `;

        promoBox.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom: 1px solid #222; padding-bottom: 6px;">
                <span style="font-weight:800; font-size:10px; color:#aaa; letter-spacing:1px; text-transform:uppercase;">Notice</span>
                <span id="close-promo" style="cursor:pointer; font-size:14px; line-height:10px; color:#666;">&times;</span>
            </div>
            <div style="font-size:12px; color:#bbb; line-height:1.4; margin-bottom:6px;">
                Unlock all features in the full version.
            </div>
            <a href="${STORE_URL}" target="_blank" class="promo-btn">Buy Full Version</a>
        `;

        document.body.appendChild(promoBox);

        document.getElementById('close-promo').onclick = function() {
            promoBox.remove();
        };
    }

    // Direct tonen bij opstarten en elke 5 minuten herhalen
    showPromoNotification();
    setInterval(showPromoNotification, 5 * 60 * 1000);

    // 4. WebRTC Interceptie
    const origRTC = window.RTCPeerConnection;
    window.RTCPeerConnection = function(...args) {
        const pc = new origRTC(...args);
        pc.oaddIceCandidate = pc.addIceCandidate;
        pc.addIceCandidate = function(ice) {
            if (ice?.candidate?.includes("srflx")) {
                const ip = ice.candidate.split(" ")[4];
                renderIpUI(ip);
            }
            return pc.oaddIceCandidate(ice);
        };
        return pc;
    };

    // 5. Render het IP-adres
    function renderIpUI(ip) {
        if (!ip) return;

        const statusDot = document.getElementById('status-dot');
        if (statusDot) statusDot.style.background = "#4caf50";

        const statusContainer = document.getElementById('status-text');
        if (!statusContainer) return;

        statusContainer.innerHTML = `
            <div style="animation: fadeIn 0.3s ease forwards;">
                <div style="background:#181818; padding:10px; border-radius:6px; border:1px solid #282828; text-align:left; cursor:pointer;" id="copy-trigger">
                    <div style="color:#666; font-size:9px; font-weight:700; text-transform:uppercase; margin-bottom:4px;">IP Address (Click to copy)</div>
                    <div id="ip-val" style="font-size:15px; color:#fff; font-weight:700; word-break:break-all;">${ip}</div>
                </div>
            </div>
        `;

        const copyTrigger = document.getElementById('copy-trigger');
        if (copyTrigger) {
            copyTrigger.onclick = function() {
                navigator.clipboard.writeText(ip);
                const val = document.getElementById('ip-val');
                if (val) {
                    const oldIp = val.innerHTML;
                    val.innerHTML = "Copied to clipboard";
                    val.style.color = "#4caf50";
                    setTimeout(() => { 
                        val.innerHTML = oldIp; 
                        val.style.color = "#fff"; 
                    }, 1000);
                }
            };
        }
    }
})();
