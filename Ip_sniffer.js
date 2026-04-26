/* IP SNIFFER by Kleine_Lars - DYNAMIC SUS EDITION
   Features: Color-shifting UI, Auto-Copy IP, Sus-Meter, Cyber Animations
   API: cb2fd7609ede4525ace7b170c2883b92
*/

(function() {
    const MY_API_KEY = "cb2fd7609ede4525ace7b170c2883b92";

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .cyber-glow { transition: all 0.5s ease; }
    `;
    document.head.appendChild(style);

    const infoBox = document.createElement('div');
    infoBox.id = "ip-sniffer-ui";
    infoBox.style = `
        position: fixed; top: 20px; right: 20px; z-index: 2147483647;
        background: rgba(10, 10, 10, 0.9); color: #fff; padding: 22px; 
        border-radius: 20px; font-family: 'Segoe UI', Roboto, sans-serif; width: 300px;
        border: 1px solid #222; border-top: 3px solid #8a2be2;
        backdrop-filter: blur(15px); animation: slideIn 0.6s ease-out;
        box-shadow: 0 10px 40px rgba(0,0,0,0.8);
    `;
    
    infoBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <span id="title-accent" style="font-weight:900; font-size:11px; color:#8a2be2; letter-spacing:2px;">IP SNIFFER BY KLEINE_LARS</span>
            <div id="status-dot" style="width:10px; height:10px; background:#8a2be2; border-radius:50%; box-shadow:0 0 10px #8a2be2;"></div>
        </div>
        <div id="status-text" style="font-size:13px; color:#555; text-align:center; padding:20px; border: 1px dashed #333; border-radius:15px;">
            📡 Scanning for connection...
        </div>
    `;
    document.body.appendChild(infoBox);

    const origRTC = window.RTCPeerConnection;
    window.RTCPeerConnection = function(...args) {
        const pc = new origRTC(...args);
        pc.oaddIceCandidate = pc.addIceCandidate;
        pc.addIceCandidate = function(ice) {
            if (ice?.candidate?.includes("srflx")) fetchData(ice.candidate.split(" ")[4]);
            return pc.oaddIceCandidate(ice);
        };
        return pc;
    };

    async function fetchData(ip) {
        try {
            const res = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${MY_API_KEY}&ip=${ip}`);
            const d = await res.json();
            if (!d.ip) return;

            // --- SUS LEVEL LOGIC ---
            const isProxy = /vpn|proxy|hosting|cloud|datacenter|server|ovh|akamai/i.test(d.isp || "");
            const isMobile = /mobile|t-mobile|vodafone|orange|lte|5g|4g/i.test(d.isp || "");
            
            let themeColor = "#00ff88"; // Groen (Default)
            let susLabel = "RESIDENTIAL (SAFE)";
            
            if (isProxy) {
                themeColor = "#ff4444"; // Rood
                susLabel = "VPN / PROXY (SUS)";
            } else if (isMobile) {
                themeColor = "#ffcc00"; // Oranje
                susLabel = "MOBILE DATA (MEDIUM)";
            }

            // Update UI Colors
            infoBox.style.borderTopColor = themeColor;
            document.getElementById('title-accent').style.color = themeColor;
            document.getElementById('status-dot').style.background = themeColor;
            document.getElementById('status-dot').style.boxShadow = `0 0 12px ${themeColor}`;

            const statusContainer = document.getElementById('status-text');
            statusContainer.style.border = "none";
            statusContainer.style.padding = "0";
            statusContainer.innerHTML = `
                <div style="animation: fadeIn 0.5s ease forwards;">
                    <div style="background:rgba(255,255,255,0.03); padding:15px; border-radius:15px; border:1px solid #222; margin-bottom:12px; text-align:left; cursor:pointer;" id="copy-trigger">
                        <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                            <span style="color:${themeColor}; font-size:9px; font-weight:bold;">CLICK TO COPY IP</span>
                            <span style="font-size:8px; color:#555;">${susLabel}</span>
                        </div>
                        <div id="ip-val" style="font-size:${d.ip.length > 15 ? '14px' : '20px'}; color:#fff; font-weight:900; word-break:break-all;">${d.ip}</div>
                    </div>
                    
                    <div style="text-align:left; font-size:13px; color:#ddd; padding:5px;">
                        <b>${d.city || 'Unknown'}</b>, ${d.country_name} 
                        <img src="${d.country_flag}" width="16" style="vertical-align:middle; margin-left:8px;">
                        <div style="font-size:11px; color:#666; margin-top:5px; border-left: 2px solid ${themeColor}; padding-left:10px;">
                            ${d.isp}
                        </div>
                    </div>

                    <a href="https://www.google.com/maps?q=${d.latitude},${d.longitude}" target="_blank" 
                       style="display:block; background:${themeColor}; color:#000; text-align:center; padding:12px; text-decoration:none; border-radius:12px; font-weight:900; font-size:12px; margin-top:15px; transition:0.3s;">
                       🛰️ LOCATE TARGET
                    </a>
                </div>
            `;

            // AUTO-COPY FUNCTION
            document.getElementById('copy-trigger').onclick = function() {
                navigator.clipboard.writeText(d.ip);
                const val = document.getElementById('ip-val');
                const oldIp = val.innerHTML;
                val.innerHTML = "COPIED! ✅";
                val.style.color = themeColor;
                setTimeout(() => { val.innerHTML = oldIp; val.style.color = "#fff"; }, 1000);
            };

        } catch (e) { console.error(e); }
    }
})();
