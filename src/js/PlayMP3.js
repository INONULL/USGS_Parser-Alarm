"use strict";
//2024.04.04 Lee JunSung
const favicon = '<link rel="icon" type="image/x-icon" href="../../favicon.ico">';
let popup = null;
let Text_tts = null;
let new_sig = false;
let j = 60;
let multi_close_sig = false;
let cascade_x = 0;
let cascade_y = 0;
const synth = window.speechSynthesis;
chrome.runtime.onMessage.addListener(async msg => { // Background to Audio 
    try {
        if ('play' in msg) {
            new_sig = true;
            multi_close_sig = false;
            if (Text_tts != null) {
                if(synth.speaking){
                    synth.cancel();
                }
                Text_tts = null;
            }
                await pm3(msg.play.source,msg.play.tw_tts,msg.play.mag);
        }
    } catch (err) {
        console.log("error on (offscreen_audio_onMessage_addListener): " + err);
    }
});
//mag[0] is likely a dummy :D 🚮
let counter;
let popupId;
let mag_up_num = 0;
let popup_mag_changed = [];
let multi_counter = [];
let counter_mag = null;
const hour_1 = 3600000;
async function alert_popup(mag, reviewed){
    if(((counter != null) && (counter != undefined)) && [true,false,undefined].includes(reviewed)){
      clearInterval(counter);
      counter = null;
    }
    let i = 60;
    let mag_triggered_reviewed_or_not;
    let mag_changed;
    let morethanone;
    let status_changed;
    if((mag[0] != null) & (mag[0] != undefined)){
    if(reviewed == true){
        mag_triggered_reviewed_or_not = `<!DOCTYPE html><html><title>USGS [MAG: ${mag[0]}] EarthQauke ANNOUNCED! [REVIEWED!]</title>
<h1 style="font-size: 30px; color:red;">USGS [MAG: ${mag[0]}]<br>EarthQauke ANNOUNCED!</h1>
<p style="font-size: 18px; color:black;">
<span style="color:blue; font-weight:900; font-size: 22px;">[REVIEWED!]</span>
<br><span style="font-weight:800">LOCATION:</span> ${mag[1].place_full}
<br><span style="font-weight:800">DETECTED TIME:</span> ${mag[1].detect_time}
<br><span style="font-weight:800">ANNOUNCED TIME:</span> ${mag[1].update_time}
<br><span style="font-weight:800">LAT/LNG:</span> ${Math.round(mag[1].lnglatdep[1]*100)/100}/${Math.round(mag[1].lnglatdep[0]*100)/100}
<br><span style="font-weight:800">DEPTH:</span> ${Math.round(mag[1].lnglatdep[2]*100)/100}km
</p>
<br><button id="stopButton" style="font-size: 35px; width: 450px; height: 100px;">CLOSE</button>
<h2 id ='countdown' style="font-size: 20px; color:blue;"></h2>
<script>
</script>
`;
    }else if(reviewed == false){
        mag_triggered_reviewed_or_not = `<!DOCTYPE html><html><title>USGS [MAG: ${mag[0]}] EarthQauke ANNOUNCED! [AUTOMATIC!]</title>
<h1 style="font-size: 30px; color:red;">USGS [MAG: ${mag[0]}]<br>EarthQauke ANNOUNCED!</h1>
<p style="font-size: 18px; color:black;">
<span style="color:red; font-weight:900; font-size: 22px;">[AUTOMATIC!]</span>
<br><span style="font-weight:800">LOCATION:</span> ${mag[1].place_full}
<br><span style="font-weight:800">DETECTED TIME:</span> ${mag[1].detect_time}
<br><span style="font-weight:800">ANNOUNCED TIME:</span> ${mag[1].update_time}
<br><span style="font-weight:800">LAT/LNG:</span> ${Math.round(mag[1].lnglatdep[1]*100)/100}/${Math.round(mag[1].lnglatdep[0]*100)/100}
<br><span style="font-weight:800">DEPTH:</span> ${Math.round(mag[1].lnglatdep[2]*100)/100}km
</p>
<br><button id="stopButton" style="font-size: 35px; width: 450px; height: 100px;">CLOSE</button>
<h2 id ='countdown' style="font-size: 20px; color:blue;"></h2>
<script>
</script>
    `;
    }else if(reviewed === undefined){
        mag_triggered_reviewed_or_not = `<!DOCTYPE html><html><title>USGS [MAG: ${mag[0]}] EarthQauke ANNOUNCED! [UNDEFINED!]</title>
<h1 style="font-size: 30px; color:red;">USGS [MAG: ${mag[0]}]<br>EarthQauke ANNOUNCED!</h1>
<p style="font-size: 18px; color:black;">
<span style="color:#FFC000; font-weight:900; font-size: 22px;">[UNDEFINED!]</span>
<br>LOCATION: ${mag[1].place_full}
<br><span style="font-weight:800">DETECTED TIME:<span> ${mag[1].detect_time}
<br><span style="font-weight:800">ANNOUNCED TIME:</span> ${mag[1].update_time}
<br><span style="font-weight:800">LAT/LNG:</span> ${Math.round(mag[1].lnglatdep[1]*100)/100}/${Math.round(mag[1].lnglatdep[0]*100)/100}
<br><span style="font-weight:800">DEPTH:</span> ${Math.round(mag[1].lnglatdep[2]*100)/100}km
</p>
<br><button id="stopButton" style="font-size: 35px; width: 450px; height: 100px;">CLOSE</button>
<h2 id ='countdown' style="font-size: 20px; color:blue;"></h2>
<script>
</script>
            `;
    }
}
if(reviewed === 'reviewed'){
    mag_changed = `<!DOCTYPE html><html><title>USGS EQ MAG CHANGED</title>
<h1 style="font-size: 30px; color:red;">USGS EQ MAG CHANGED!</h1>
<p style="font-size: 18px; color:black;">
<span style="color:blue; font-weight:900; font-size: 22px;">[REVIEWED!]</span>
<br> <span style="font-weight:800">TIME(CHANGED IN):</span> ${parseInt(Math.floor(parseInt(mag[1].updated_time_diff/hour_1)))}HOUR(s) ${parseInt(Math.round(((((mag[1].updated_time_diff/hour_1)%1)*100))*0.6))}MINUTE(s).
<br> <span style="font-weight:800">REGION:</span> ${mag[1].place_region}
<br> <span style="font-weight:800">DETAIL_REGION:</span> ${mag[1].place_city}
<br> <span style="font-weight:800">MAG CAHNGE:</span> Before[${mag[1].prev_mag}] -> After[${mag[1].current_mag}]. 
</p>
<h2 id ='countdown' style="font-size: 20px; color:blue;"></h2>
<script>
</script>`;

}
if(reviewed === 'automatic'){
    mag_changed = `<!DOCTYPE html><html><title>USGS EQ MAG CHANGED</title>
<h1 style="font-size: 30px; color:red;">USGS EQ MAG CHANGED!</h1>
<p style="font-size: 18px; color:black;">
<span style="color:red; font-weight:900; font-size: 22px;">[AUTOMATIC!]</span>
<br> <span style="font-weight:800">TIME(CHANGED IN):</span> ${parseInt(Math.floor(parseInt(mag[1].updated_time_diff/hour_1)))}HOUR(s) ${parseInt(Math.round(((((mag[1].updated_time_diff/hour_1)%1)*100))*0.6))}MINUTE(s).
<br> <span style="font-weight:800">REGION:</span> ${mag[1].place_region}
<br> <span style="font-weight:800">DETAIL_REGION:</span> ${mag[1].place_city}
<br> <span style="font-weight:800">MAG CAHNGE:</span> Before[${mag[1].prev_mag}] -> After[${mag[1].current_mag}]. 
</p>
<h2 id ='countdown' style="font-size: 20px; color:blue;"></h2>
<script>
</script>`;  
}

if(reviewed === 'undefined'){
    mag_changed = `<!DOCTYPE html><html><title>USGS EQ MAG CHANGED</title>
<h1 style="font-size: 30px; color:red;">USGS EQ MAG CHANGED!</h1>
<p style="font-size: 18px; color:black;">
<span style="color:#FFC000; font-weight:900; font-size: 22px;">[UNDEFINED!]</span>
<br> <span style="font-weight:800">TIME(CHANGED IN):</span> ${parseInt(Math.floor(parseInt(mag[1].updated_time_diff/hour_1)))}HOUR(s) ${parseInt(Math.round(((((mag[1].updated_time_diff/hour_1)%1)*100))*0.6))}MINUTE(s).
<br> <span style="font-weight:800">REGION:</span> ${mag[1].place_region}
<br> <span style="font-weight:800">DETAIL_REGION:</span> ${mag[1].place_city}
<br> <span style="font-weight:800">MAG CAHNGE:</span> Before[${mag[1].prev_mag}] -> After[${mag[1].current_mag}]. 
</p>
<h2 id ='countdown' style="font-size: 20px; color:blue;"></h2>
<script>
</script>`;  
}

if(reviewed === 'automatic_pcd'){
    morethanone = `<!DOCTYPE html><html><title>USGS [MAG: ${mag[0]}] EarthQauke ANNOUNCED! [AUTOMATIC!]</title>
<h1 style="font-size: 30px; color:red;">USGS [MAG: ${mag[0]}]<br>EarthQauke ANNOUNCED!</h1>
<p style="font-size: 18px; color:black;">
<span style="color:red; font-weight:900; font-size: 22px;">[AUTOMATIC!]</span>
<br><span style="font-weight:800">LOCATION:</span> ${mag[1].place_full}
<br><span style="font-weight:800">DETECTED TIME:</span> ${mag[1].detect_time}
<br><span style="font-weight:800">ANNOUNCED TIME:</span> ${mag[1].update_time}
<br><span style="font-weight:800">LAT/LNG:</span> ${Math.round(mag[1].lnglatdep[1]*100)/100}/${Math.round(mag[1].lnglatdep[0]*100)/100}
<br><span style="font-weight:800">DEPTH:</span> ${Math.round(mag[1].lnglatdep[2]*100)/100}km
</p>
<h2 id ='countdown' style="font-size: 20px; color:blue;"></h2>
<script>
</script>
    `;
}

if(reviewed === 'reviewed_pcd'){
    morethanone = `<!DOCTYPE html><html><title>USGS [MAG: ${mag[0]}] EarthQauke ANNOUNCED! [REVIEWED!]</title>
<h1 style="font-size: 30px; color:red;">USGS [MAG: ${mag[0]}]<br>EarthQauke ANNOUNCED!</h1>
<p style="font-size: 18px; color:black;">
<span style="color:blue; font-weight:900; font-size: 22px;">[REVIEWED!]</span>
<br><span style="font-weight:800">LOCATION:</span> ${mag[1].place_full}
<br><span style="font-weight:800">DETECTED TIME:</span> ${mag[1].detect_time}
<br><span style="font-weight:800">ANNOUNCED TIME:</span> ${mag[1].update_time}
<br><span style="font-weight:800">LAT/LNG:</span> ${Math.round(mag[1].lnglatdep[1]*100)/100}/${Math.round(mag[1].lnglatdep[0]*100)/100}
<br><span style="font-weight:800">DEPTH:</span> ${Math.round(mag[1].lnglatdep[2]*100)/100}km
</p>
<h2 id ='countdown' style="font-size: 20px; color:blue;"></h2>
<script>
</script>
`;
}

if(reviewed === 'undefined_pcd'){
    morethanone = `<!DOCTYPE html><html><title>USGS [MAG: ${mag[0]}] EarthQauke ANNOUNCED! [UNDEFINED!]]</title>
<h1 style="font-size: 30px; color:red;">USGS [MAG: ${mag[0]}]<br>EarthQauke ANNOUNCED!</h1>
<p style="font-size: 18px; color:black;">
<span style="color:#FFC000; font-weight:900; font-size: 22px;">[UNDEFINED!]</span>
<br><span style="font-weight:800">LOCATION:</span> ${mag[1].place_full}
<br><span style="font-weight:800">DETECTED TIME:</span> ${mag[1].detect_time}
<br><span style="font-weight:800">ANNOUNCED TIME:</span> ${mag[1].update_time}
<br><span style="font-weight:800">LAT/LNG:</span> ${Math.round(mag[1].lnglatdep[1]*100)/100}/${Math.round(mag[1].lnglatdep[0]*100)/100}
<br><span style="font-weight:800">DEPTH:</span> ${Math.round(mag[1].lnglatdep[2]*100)/100}km
</p>
<h2 id ='countdown' style="font-size: 20px; color:blue;"></h2>
<script>
</script>
`;
}

if(reviewed === 'status_changed'){
    status_changed = `<!DOCTYPE html><html><title>USGS STATUS CHANGED</title>
<h1 style="font-size: 30px; color:red;">USGS STATUS CHANGED</h1>
<p style="font-size: 18px; color:black;">
<span style="color:blue; font-weight:900; font-size: 22px;">[PREV: ${mag[1].prev_status} -> NOW: ${mag[1].current_status}]</span>
<br> <span style="font-weight:800">TIME(CHANGED IN):</span> ${parseInt(Math.floor(parseInt(mag[1].updated_time_diff/hour_1)))}HOUR(s) ${parseInt(Math.round(((((mag[1].updated_time_diff/hour_1)%1)*100))*0.6))}MINUTE(s).
<br> <span style="font-weight:800">REGION:</span> ${mag[1].place_region}
<br> <span style="font-weight:800">DETAIL_REGION:</span> ${mag[1].place_city}
<br> <span style="font-weight:800">STATUS:</span> [${mag[1].prev_status}] -> [${mag[1].current_status}].
<br> <span style="font-weight:800">MAG:</span> [${mag[0]}]
</p>
<h2 id ='countdown' style="font-size: 20px; color:blue;"></h2>
<script>
</script>`;  
}

    const error_con = `<!DOCTYPE html><html><title>USGS DISCONNECTION</title>
<h1 style="font-size: 18px; color:red;">DATA NOT RECEIVED<br>1. YOUR ETHERNET DISCONNECTED<br>2. USGS SERVER IS DOWN</h1>
<br><button id="stopButton" style="font-size: 35px; width: 450px; height: 100px;">CLOSE</button>
<h2 id ='countdown' style="font-size: 20px; color:blue;"></h2>
<script>
</script>
`;
    const error_dat = `<!DOCTYPE html><html><title>USGS DATA NOT RECEIVED</title>
<h1 style="font-size: 35px; color:red;">DATA NOT RECEIVED. (Err: 400 ~ 499)</h1>
<br><button id="stopButton" style="font-size: 35px; width: 450px; height: 100px;">CLOSE</button>
<h2 id ='countdown' style="font-size: 20px; color:blue;"></h2>
<script>
</script>
`;

if(reviewed === 'init'){
    chrome.runtime.sendMessage({
        message: "alert_finish",
    });
    return;
}
if(reviewed === 'automatic' || reviewed === 'reviewed' || reviewed === 'undefined' || reviewed === 'reviewed_pcd' || reviewed === 'automatic_pcd' || reviewed === 'undefined_pcd' || reviewed === 'status_changed' ){
    popup_mag_changed[mag_up_num] = window.open('',`popup_mag_changed${mag_up_num}`, `width=450,height=520, resizable=no, top=${cascade_y}, left=${cascade_x}`);
    cascade_x = cascade_x + 28;
    cascade_y = cascade_y + 28;
    popup_mag_changed[mag_up_num].resizeTo(480, 520);
    if(reviewed === 'automatic' || reviewed === 'reviewed' || reviewed === 'undefined'){
        popup_mag_changed[mag_up_num].document.body.innerHTML = mag_changed;
    }
    if(reviewed === 'reviewed_pcd' || reviewed === 'automatic_pcd' || reviewed === 'undefined_pcd'){
        popup_mag_changed[mag_up_num].document.body.innerHTML = morethanone;
    } 
    if(reviewed === 'status_changed'){
        popup_mag_changed[mag_up_num].document.body.innerHTML = status_changed;
    }
    popup_mag_changed[mag_up_num].document.body.style.backgroundColor = "#eeffff";
    popup_mag_changed[mag_up_num].addEventListener('beforeunload', async ()=>{
            try{
                setTimeout(async () => {
                    for(let l = 0; l<popup_mag_changed.length; l++){
                            if(popup_mag_changed[l] != null && popup_mag_changed != null){
                                if(popup_mag_changed[l] != null){
                                    popup_mag_changed[l].close();
                                    popup_mag_changed[l] = null;
                                }
                            }    
                        if((l >= popup_mag_changed.length -1) && multi_close_sig == false){
                            cascade_x = 0;
                            cascade_y = 0;
                            j = 60;
                            mag_up_num = 0;
                            popup_mag_changed = [];
                            multi_close_sig = true;
                            if(counter == null && popup == null && multi_close_sig){
                                await chrome.runtime.sendMessage({
                                    message: "alert_finish",
                                });
                            }
                        }
                    }
                }, 0);
            }catch(err){
                console.log(err);
            }
            clearInterval(counter_mag);
            counter_mag = null;
    });
    if(counter_mag != null){
        clearInterval(counter_mag);
    }
    counter_mag = setInterval(async ()=> {
        // if(counter === undefined){
        if(new_sig){
            j = 60;
            new_sig = false;
        }
        // }
        //j = j - ((1)/(popup_mag_changed.length))
        --j;
        for(let l = 0; l<popup_mag_changed.length; l++){
            try {
                popup_mag_changed[l].resizeTo(480, 520);
                popup_mag_changed[l].document.getElementById('countdown').innerText = 'CLOSED IN ' + j +' SECOND(s)';
            }catch(err){
                console.log(err);
                return;
            }
        }
        if(j<=0){
            for(let l = 0; l<popup_mag_changed.length; l++){
                await popup_mag_changed[l].close();
            }
        }
    },1000);
    mag_up_num ++;
}else{
    popup = window.open('', 'popup', 'width=480,height=520, resizable=no');
    popupId = popup.window.id;
    popup.resizeTo(480, 520);
    popup.addEventListener('resize', async function () { //force 350 350
        await popup.resizeTo(480, 520);
    });
    if(mag[0] === undefined){
        popup.document.body.innerHTML = error_dat;
    }
    if(mag[0] === null){
        popup.document.body.innerHTML = error_con;
    }
    if((mag[0] != null) && (mag[0] != undefined)){
        popup.document.body.innerHTML = mag_triggered_reviewed_or_not;
    }
    popup.document.body.style.backgroundColor = "#eeffff";
    popup.focus();
    popup.document.getElementById('stopButton').addEventListener('click', async () => {
        clearInterval(counter);
        await popup.close();
        popup = null;
        popupId = null;
        counter = undefined;
    });
    popup.addEventListener('beforeunload', ()=>{ // in case.. duplicate state
        clearInterval(counter);
        popup = null;
        popupId = null;
        if(mag_up_num <= 0){
            chrome.runtime.sendMessage({
                message: "alert_finish",
            });
        }
        counter = undefined;
    });
    counter = setInterval(async ()=> {
        if(new_sig){
            i = 60;
            new_sig = false;
        }
        --i;
        popup.document.getElementById('countdown').innerText = 'CLOSED IN ' + i +' SECOND(s)';
        if(i<=0){
            //toggle popup
            await popup.close();
            popup = null;
            clearInterval(counter);
            counter = undefined;
        }
    },1000);
}
}

window.addEventListener('beforeunload', async ()=>{
    if(popup != null){
        await popup.close();
        popup = null;
    }
});
async function pm3(source,tw_tts,mag) {
    try {
        if(source == 'backon'){
            if(popup != null){
                popup.close();
                popup = null;
                clearInterval(counter);
            }
        }
 switch (source) {
    case 'Alert.mp3_reviewed':
        Text_tts = tw_tts;
        await alert_popup(mag, true);
        break;
    case 'Alert.mp3_automatic':
        Text_tts = tw_tts;
        await alert_popup(mag, false);
        break;
    case 'Alert.mp3_undefined':
        Text_tts = tw_tts;
        await alert_popup(mag, undefined);
        break;
    case 'Alert.mp3_mag_changed_reviewed':
        Text_tts = tw_tts;
        await alert_popup(mag, 'reviewed');
        break;
    case 'Alert.mp3_mag_changed_automatic':
        Text_tts = tw_tts;
        await alert_popup(mag, 'automatic');
        break;
    case 'Alert.mp3_mag_changed_undefined':
        Text_tts = tw_tts;
        await alert_popup(mag, 'undefined');
        break;
    case 'Alert.mp3_reviewed_pcd':
        Text_tts = tw_tts;
        await alert_popup(mag, 'reviewed_pcd');
        break;
    case 'Alert.mp3_automatic_pcd':
        Text_tts = tw_tts;
        await alert_popup(mag, 'automatic_pcd');
        break;
    case 'Alert.mp3_undefined_pcd':
        Text_tts = tw_tts;
        await alert_popup(mag, 'undefined_pcd');
        break;
    case 'Alert.mp3_status_changed':
        Text_tts = tw_tts;
        await alert_popup(mag, 'status_changed');
        break;
    case 'Info.mp3':
        Text_tts = tw_tts;
        await alert_popup(mag, null);
        break;
    case 'Init.mp3':
        Text_tts = tw_tts;
        await alert_popup(mag, 'init');
        break;
    case 'shut.mp3':
        clearInterval(counter);
        if (popup != null) {
            await popup.close();
            popup = null;
        }
        if (counter != null) {
            clearInterval(counter);
            counter = undefined;
        }
        return;
    default:
        // Optional: Handle unexpected values
        console.log(`Unhandled source: ${source}`);
        break;
    }
            const utterThis = new SpeechSynthesisUtterance(Text_tts);
            //const voices = synth.getVoices();
            utterThis.lang = 'en';
            //utterThis.pitch = 1.7;
            utterThis.rate = 0.75;  // 속도 1.5배
            //utterThis.voice = voices[2]; //4 //15
            synth.speak(utterThis);
    } catch (err) {
        console.log("error on (PlayMP3): " + err);
        if(Text_tts != null){
            if(synth.speaking){
                synth.cancel();
            }
            Text_tts = null;
        }
        if(popup != null){
            popup = null;
        }
    }
}
