const usgs_url = 'https://earthquake.usgs.gov/earthquakes/map/';
setInterval(async ()=>{
    chrome.runtime.sendMessage({
        message: "Checkmaass",
    });
},1000);
const restart_value_incr = document.getElementById('restart_value_incr');
chrome.runtime.onMessage.addListener(async function (request) {
    if(request.message === 'checkme'){
        if(request.data[0] >= 400){
            document.getElementById('connection_check').innerHTML = `<span style='color:red; font-weight: 800;'>${request.data[0]}</span>`
        }else if(request.data[0] <= 399){
            document.getElementById('connection_check').innerHTML = `<span style='color:blue; font-weight: 800;'>${request.data[0]}</span>`
        }else{
            document.getElementById('connection_check').innerHTML = `<span style='color:#FF5F1F; font-weight: 800;'>${request.data[0]}:[<a href ='${usgs_url}' target="_blank">OPEN</a>]</span>`
        }
        if(request.data[1]){
            const time_diff = restart.value - (request.data[1]/1800);
            restart_value_incr.innerText = `${Math.floor(time_diff/24)} day(s) ${Math.round((time_diff%24)*1000)/1000} hour(s)`;
        }
    }
});
// Created on 2024.04.15 (USER INTERFACE)_by LEE JUNSUNG
const mag_value = document.getElementById('mag_size');
const hour_value = document.getElementById('hour_size');
const restart = document.getElementById('restart');
const restart_value = document.getElementById('restart_value');
let prev_mag = 0;
let prev_hour = 0;
let prev_restart_intv = 0;
document.addEventListener('DOMContentLoaded', async function () {
    chrome.storage.sync.get('magnum', async function(data) {
        if(data.magnum == undefined | data.magnum == null | data.magnum ==''){
            mag_value.value = 6;
        }else{
            mag_value.value = data.magnum;
        }
        chrome.runtime.sendMessage({
            message: "user_mag",
            data: mag_value.value,
        });
        prev_mag = mag_value.value;
    });
    mag_value.addEventListener('input', async function(){
        if(mag_value.value == undefined | mag_value.value == null | mag_value.value == ''){
        }else if(prev_mag == mag_value.value){
            prev_mag = mag_value.value
        }else if(mag_value.value >= 10){
            mag_value.value = 9;
            prev_mag = mag_value.value;
        }else if(mag_value.value<0){
            mag_value.value = 0;
        }else{
            prev_mag = mag_value.value;
            await chrome.storage.sync.set({magnum: mag_value.value}, async function() {
                console.log('mag_value is set to ' + mag_value.value);
            });
            chrome.runtime.sendMessage({
                message: "user_mag_clean",
                data: mag_value.value,
            });
            chrome.runtime.sendMessage({
                message: "user_mag",
                data: mag_value.value,
            });
        }
      });
///////////////////////////////////////////////////////////////////////////////////////////////////////
      chrome.storage.sync.get('hournum', async function(data) {
        if(data.hournum == undefined | data.hournum == null | data.hournum ==''){
            hour_value.value = 1;
        }else{
            hour_value.value = data.hournum;
        }
        chrome.runtime.sendMessage({
            message: "user_hour",
            data: hour_value.value,
        });
        prev_hour = hour_value.value;
    });
    hour_value.addEventListener('input', async function(){
        if(hour_value.value == undefined | hour_value.value == null | hour_value.value == ''){
        }else if(prev_hour == hour_value.value){
            prev_hour = hour_value.value
        }else if(hour_value.value > 24){
            hour_value.value = 24;
            prev_hour = hour_value.value;
        }else if(hour_value.value<0){
            hour_value.value = 0;
        }else{
            prev_hour = hour_value.value;
            await chrome.storage.sync.set({hournum: hour_value.value}, async function() {
                console.log('hour_value is set to ' + hour_value.value);
            });
            chrome.runtime.sendMessage({
                message: "user_hour_clean",
                data: hour_value.value,
            });
            chrome.runtime.sendMessage({
                message: "user_hour",
                data: hour_value.value,
            });
        }
      });
//////////////////////////////////////////////////////////////////////////////////////////////////////////
        chrome.storage.sync.get('restart_intv', async function(data) {
            if(data.restart_intv == undefined | data.restart_intv == null | data.restart_intv ==''){
                restart.value = 1;
                restart_value.innerText = '1 hour';
            }else{
                restart.value = data.restart_intv;
                if(restart.value >= 24){
                    restart_value.innerHTML = `${Math.floor(restart.value/24)} day(s) ${restart.value%24} hour(s)`
                }else{
                    restart_value.innerText = `${restart.value} hour(s)`;
                }
            }
            await chrome.runtime.sendMessage({
                message: "user_restart_intv",
                data: restart.value,
            });
            prev_restart_intv = restart.value;
        });
        restart.addEventListener('input', async function(){
            if(restart.value == undefined | restart.value == null | restart.value == ''){
                restart.value = 1;
                restart_value.innerText = '1 hour';
            }else{
                prev_restart_intv = restart.value;
                if(prev_restart_intv >= 24){
                    restart_value.innerHTML = `${Math.floor(restart.value/24)} day(s) ${restart.value%24} hour(s)`
                }else{
                    restart_value.innerText = `${restart.value} hour(s)`;
                }
            }
        });
            restart.addEventListener('change',async function(){
                try{
                    await chrome.storage.sync.set({restart_intv: prev_restart_intv}, async function() {
                        //console.log('restart_inv is set to ' + prev_restart_intv);
                    });
                    await chrome.runtime.sendMessage({
                        message: "user_restart_intv",
                        data: restart.value,
                    });
                }catch(err){
                    console.log(err);
                }
            });
            restart.addEventListener('keydown', async function(event) {
                await event.preventDefault();
                return false;
            }); 
        });