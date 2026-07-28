/* IP SNIFFER by Kleine_Lars - CLEAN EDITION
   Features: Minimal UI, In-UI Key Setup, Auto-Copy IP, Network Classification, Key Validation Timeout
   API: User Provided (ipgeolocation.io)
*/

(function() {
    let MY_API_KEY = localStorage.getItem("sniffer_api_key") || "";

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .key-input {
            width: 100%; box-sizing: border-box; padding: 10px; margin: 12px 0 10px 0;
            background: #141414; border: 1px solid #333; color: #fff;
            border-radius: 6px; font-size: 13px; outline: none;
        }
        .key-input:focus { border-color: #555; }
        .key-btn {
            width: 100%; padding: 10px; background: #2a2a2a; color: #fff;
            border: 1px solid #3a3a3a; border-radius: 6px; font-weight: 700; cursor: pointer;
            transition: 0.2s; font-size: 13px;
        }
        .key-btn:hover { background: #333; }
    `;
    document.head.appendChild(style);

    const infoBox = document.createElement('div');
    infoBox.id = "ip-sniffer-ui";
    infoBox.style = `
        position: fixed; top: 20px; right: 20px; z-index: 2147483647;
        background: #121212; color: #e0e0e0; padding: 20px; 
        border-radius: 12px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; width: 300px;
        border: 1px solid #222; animation: slideIn 0.3s ease-out;
        box-shadow: 0 10px 25px rgba(0,0,0,0.6);
    `;
    
    infoBox.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom: 1px solid #222; padding-bottom: 12px;">
            <span style="font-weight:800; font-size:12px; color:#fff; letter-spacing:1px; text-transform:uppercase;">IP SNIFFER</span>
            <div id="status-dot" style="width:8px; height:8px; background:#555; border-radius:50%;"></div>
        </div>
        <div id="status-text" style="font-size:12px; color:#888;">
            Scanning for connection...
        </div>
    `;
    document.body.appendChild(infoBox);

    if (!MY_API_KEY) {
        showKeyInputUI();
    }

    function showKeyInputUI(errorMessage = "") {
        const statusContainer = document.getElementById('status-text');
        statusContainer.innerHTML = `
            <div style="text-align:left; color:#ccc;">
                <div style="font-weight:700; font-size:13px; color:#fff; margin-bottom:4px;">API Key Required</div>
                <div style="font-size:12px; color:#777;">
                    Get key at: <a href="https://ipgeolocation.io/" target="_blank" style="color:#aaa; text-decoration:underline;">ipgeolocation.io</a>
                </div>
                ${errorMessage ? `<div style="color:#ff5555; font-size:12px; margin-top:6px;">${errorMessage}</div>` : ''}
                <input type="password" id="api-key-field" class="key-input" placeholder="Paste API Key..." value="${MY_API_KEY}">
                <button id="save-key-btn" class="key-btn">Save Key</button>
            </div>
        `;

        document.getElementById('save-key-btn').onclick = async function() {
            const inputVal = document.getElementById('api-key-field').value.trim();
            if (!inputVal) {
                showKeyInputUI("Invalid API Key");
                return;
            }

            statusContainer.innerHTML = "Scanning for connection...";
            
            const isValid = await validateApiKey(inputVal);
            
            if (isValid) {
                MY_API_KEY = inputVal;
                localStorage.setItem("sniffer_api_key", MY_API_KEY);
            } else {
                setTimeout(() => {
                    localStorage.removeItem("sniffer_api_key");
                    MY_API_KEY = "";
                    showKeyInputUI("Invalid API Key");
                }, 5000);
            }
        };
    }

    async function validateApiKey(key) {
        try {
            const res = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${key}&ip=8.8.8.8`);
            return res.ok;
        } catch (e) {
            return false;
        }
    }

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
        if (!MY_API_KEY) return;

        try {
            const res = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${MY_API_KEY}&ip=${ip}`);
            
            if (res.status === 401 || res.status === 403) {
                localStorage.removeItem("sniffer_api_key");
                MY_API_KEY = "";
                showKeyInputUI("Invalid API Key");
                return;
            }

            const d = await res.json();
            if (!d.ip) return;

            const isProxy = /vpn|proxy|hosting|cloud|datacenter|server|ovh|akamai/i.test(d.isp || "");
            const isMobile = /mobile|t-mobile|vodafone|orange|lte|5g|4g/i.test(d.isp || "");
            
            let statusColor = "#4caf50";
            let susLabel = "Residential";
            
            if (isProxy) {
                statusColor = "#f44336";
                susLabel = "VPN / Proxy";
            } else if (isMobile) {
                statusColor = "#ff9800";
                susLabel = "Mobile Network";
            }

            document.getElementById('status-dot').style.background = statusColor;

            const statusContainer = document.getElementById('status-text');
            statusContainer.innerHTML = `
                <div style="animation: fadeIn 0.3s ease forwards;">
                    <div style="background:#181818; padding:12px; border-radius:6px; border:1px solid #282828; margin-bottom:12px; text-align:left; cursor:pointer;" id="copy-trigger">
                        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                            <span style="color:#666; font-size:9px; font-weight:700; text-transform:uppercase;">IP Address</span>
                            <span style="font-size:10px; color:${statusColor}; font-weight:700;">${susLabel}</span>
                        </div>
                        <div id="ip-val" style="font-size:16px; color:#fff; font-weight:700; word-break:break-all;">${d.ip}</div>
                    </div>
                    
                    <div style="text-align:left; font-size:12px; color:#ccc; margin-bottom:14px;">
                        <div style="display:flex; align-items:center; gap:6px;">
                            <span><b>${d.city || 'Unknown'}</b>, ${d.country_name}</span>
                            <img src="${d.country_flag}" width="14" height="10" style="object-fit:cover; border-radius:2px;">
                        </div>
                        <div style="font-size:11px; color:#666; margin-top:4px;">
                            ${d.isp}
                        </div>
                    </div>

                    <a href="https://www.google.com/maps?q=${d.latitude},${d.longitude}" target="_blank" 
                       style="display:block; background:#222; color:#ccc; border:1px solid #333; text-align:center; padding:9px; text-decoration:none; border-radius:6px; font-weight:700; font-size:12px; transition:0.2s;">
                        Open Location
                    </a>
                </div>
            `;

            document.getElementById('copy-trigger').onclick = function() {
                navigator.clipboard.writeText(d.ip);
                const val = document.getElementById('ip-val');
                const oldIp = val.innerHTML;
                val.innerHTML = "Copied to clipboard";
                val.style.color = statusColor;
                setTimeout(() => { val.innerHTML = oldIp; val.style.color = "#fff"; }, 1000);
            };

        } catch (e) { console.error(e); }
    }
})();
