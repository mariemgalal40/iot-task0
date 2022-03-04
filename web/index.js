var x=0, reading_value1, reading_value2, reading;
var layout1={title: 'Temperature'};
var layout2={title: 'Humitidy'};

function check(){
    if(x==1){
        // Plotly.deleteTraces('chart', [0]);
        plot_temp();
    }
    else{
        // Plotly.deleteTraces('chart', [0]);
        plot_hum();
    }}

function get_temp(){
    var data = firebase.database().ref().child("tempo")
    data.on("value", (snap)=>{
    reading_value1 = snap.val();
    console.log(reading_value1)
    })
return reading_value1;
}

function get_humi(){
    var data = firebase.database().ref().child("humii")
    data.on("value", (snap)=>{
    reading_value2 = snap.val();
    console.log(reading_value2)

    })
return reading_value2;
}

function plot_hum(){
x=1;
Plotly.purge('graph');
Plotly.plot('chart', [{ y:[0], type: 'line'}]);
setInterval(function() {
    Plotly.extendTraces('chart', { y:[[get_humi()]]}, [0])
})} 


function plot_temp(){
x=0;
Plotly.purge('chart');
Plotly.plot('graph', [{ y:[0], type: 'line'}]);
clearInterval([[get_humi()]]);
setInterval(function() {
    Plotly.extendTraces('graph', { y: [[get_temp()]] }, [0])
})}            

function send_alarm(){
    var data = firebase.database().ref().child("status")
    data.on("value", (snap)=>{
    reading = snap.val();})
    console.log(reading)
    if (Object.values(reading) == 1){
        firebase.database().ref().child("status").set({
            status : 0
        })}
    else{
    firebase.database().ref().child("status").set({
        status :1
}) }
}














