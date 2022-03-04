#include <ESP8266WiFi.h>  
#include <string.h>               
#include <FirebaseArduino.h>      
#include <DHT.h>              
#include <DallasTemperature.h>
#include <OneWire.h>

#define ONE_WIRE_BUS 2 // DS18B20 on NodeMCU pin D4 
#define FIREBASE_HOST "esp-database-1248a-default-rtdb.firebaseio.com"      
#define FIREBASE_AUTH "qEAzyzeHf8xxWuaidq8wuMXdNx8MTQjDjlY5WldU"                     
#define DHTPIN D3                                            // Digital pin connected to DHT11
#define DHTTYPE DHT11                                        // Initialize dht type as DHT 11
int n;  
DHT dht(DHTPIN, DHTTYPE);                                                    
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature DS18B20(&oneWire);
void scan();
void connecting(); 
void setup() 
{
  Serial.begin(115200);
  scan();
  connecting();
//  dht.begin();                                                  //reads dht sensor data 
//  DS18B20.begin();             
//  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);                                  
//  Serial.print("Connecting to ");
//  Serial.print(WIFI_SSID);
//  while (WiFi.status() != WL_CONNECTED) {
//    Serial.print(".");
//    delay(500);
  }
void scan(){
  int numberOfNetworks = WiFi.scanNetworks();
  Serial.print(numberOfNetworks);
  Serial.println(" Networks are found.");
  for(int i =0; i<numberOfNetworks; i++){
      Serial.print(i+1);
      Serial.print(") ");
      Serial.println(WiFi.SSID(i));
  }
  Serial.println("Scan Completed...");
}


void connecting (){
   char ssid[10];
   char password[10]; 
   Serial.println("Enter the name of the network you want:");  
   while (Serial.available() == 0) {}
  Serial.readBytesUntil(10, ssid, 50);
  Serial.print(ssid);
  Serial.println(" is Selected...");
  Serial.println("Enter the password...");
  while (Serial.available() == 0) {}
  Serial.readBytesUntil(10, password, 50);
   // connect to wifi.   
    WiFi.begin(ssid,password);
  
    Serial.print("connecting");
    int i=0;
    while( (WiFi.status() != WL_CONNECTED)&& i<10) {
      Serial.print(".");
      i++;
      delay(50);
        dht.begin();                                                  //reads dht sensor data 
        DS18B20.begin();
    }
    Serial.println();
    Serial.print("Successfully connected to: ");
    Serial.println(ssid);  
//  } 
//  Serial.println();
//  Serial.print("Connected");
//  Serial.print("IP Address: ");
//  Serial.println(WiFi.localIP());                               //prints local IP address
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);                 // connect to the firebase
  pinMode(D1,OUTPUT);  
  Firebase.set("status",0);  
 
}
 
void loop() 
{
  n=Firebase.getInt("status/status");  
  if (n==1) {  
      Serial.print("LED is ON");  
      digitalWrite(D1,1);  
 
  }  
   else{  
   Serial.print("LED is Off");  
   digitalWrite(D1,0);  
 }  
                                   // Read Humidity
  DS18B20.requestTemperatures();
  float t = DS18B20.getTempCByIndex(0);                              // Read temperature
  float h = dht.readHumidity();
  if (isnan(h) || isnan(t))                                     // Checking sensor working
  {                                   
    Serial.println(F("Failed to read from DHT sensor!"));
    return;
  } 
  Serial.print("Humidity: ");  
  Serial.print(h);
  String fireHumid = String(h) ;                   //Humidity integer to string conversion
  
  Serial.print("%  Temperature: ");  
  Serial.print(t);  
  Serial.println("°C ");
  String fireTemp = String(t);                  //Temperature integer to string conversion
  delay(1000);
 
 
  Firebase.pushString("/READINDS/humidity", fireHumid);            //setup path to send Humidity readings
  Firebase.pushString("/READINDS/temperature", fireTemp);         //setup path to send Temperature readings
  Firebase.setFloat("/tempo",t );
  Firebase.setFloat("/humii",h );
    if (Firebase.failed()) 
    {
 
      Serial.print("pushing /logs failed:");
      Serial.println(Firebase.error()); 
      return;
  }
}
