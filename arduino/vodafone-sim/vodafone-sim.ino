// APA

#include <SoftwareSerial.h>
#include "LowPower.h"
#include "HX711.h"
HX711 scale;

#define adc_sck 11
#define adc_dt 10

#define rx_of_sim 9
#define tx_of_sim 2

#define stepdown_en 5
#define battery_pin A0
#define stepdown_out_pin A2

#define BAUDRATE 57600
#define SLEEP_MINUTES 15

const String PINCODE = "2336";
const String APN = "internet.vodafone.net";
const String ENDPOINT = "http://165.232.65.144/api/m";
//#define lm35_gnd_pin A3
//#define lm35_dt_pin A0

SoftwareSerial simSerial(tx_of_sim, rx_of_sim);

void arduSleep(unsigned long minutes);
void gsm();
void updateSerial();
float getBattery();
float getStepdownOut();
float getAnalogPinVoltage(int pin);

float getWeight();

String getParams();

void setup() {
  pinMode(stepdown_en, OUTPUT);
  digitalWrite(stepdown_en, HIGH);
  
  //pinMode(lm35_gnd_pin, INPUT);
  //pinMode(lm35_dt_pin, INPUT);

  Serial.begin(BAUDRATE);
}

void loop() {
  delay(4000);

  gsm();

  arduSleep(SLEEP_MINUTES);
  delay(4000);
}

void arduSleep(unsigned long minutes)
{
  uint32_t milliseconds = minutes * 45 * 1000;
  LowPower.longPowerDown(milliseconds);
}

void gsm()
{
  digitalWrite(stepdown_en, HIGH);
  
  Serial.begin(BAUDRATE);
  Serial.println("start");
  String postParams = getParams();

  simSerial.begin(BAUDRATE);
  delay(4000);
  
  simSerial.println("AT");
  updateSerial();

  simSerial.println("AT+CPIN=" + PINCODE);
  updateSerial();
  updateSerial();
  updateSerial();

  simSerial.println("AT+SAPBR=3,1,\"APN\",\"" + APN + "\"");
  updateSerial();

  simSerial.println("AT+SAPBR=1,1");
  updateSerial();

  simSerial.println("AT+HTTPINIT");
  updateSerial();

  simSerial.println("AT+HTTPPARA=\"CID\",1");
  updateSerial();

  simSerial.println("AT+HTTPPARA=\"URL\",\"" + ENDPOINT + "\"");
  updateSerial();

  simSerial.println("AT+HTTPPARA=\"CONTENT\",\"application/x-www-form-urlencoded\"");
  updateSerial();

  simSerial.println("AT+HTTPDATA=" + String(postParams.length()) + ",12000");
  updateSerial();

  simSerial.print(postParams);
  updateSerial();
  updateSerial();
  updateSerial();

  simSerial.println("AT+HTTPACTION=1");
  updateSerial();
  updateSerial();
  
  simSerial.println("AT+HTTPREAD");
  updateSerial();
  updateSerial();
  updateSerial();

  digitalWrite(stepdown_en, LOW);
}

void updateSerial()
{
  delay(6000);
   while(simSerial.available()){
    Serial.write(simSerial.read());
 }
 while(Serial.available()){
  simSerial.write(Serial.read());
 }
}

float getBattery() {
  return 7 * getAnalogPinVoltage(battery_pin);
}

float getStepdownOut() {
  return 3 * getAnalogPinVoltage(stepdown_out_pin);
}

float getAnalogPinVoltage(int pin) {
  long milliVolt = map(analogRead(pin), 0, 1023, 0, 5000);
  float volt = milliVolt;
  volt /= 1000;

  return volt;
}


String getParams()
{
  String param;

  param += "&weight=";
  param += getWeight();
  
  param += "&battery=";
  param += getBattery();

  param += "&stepdownOut=";
  param += getStepdownOut();

  return param;
}

float getWeight()
{
  scale.begin(adc_dt, adc_sck);
  scale.set_scale(44.46);

  float weight = scale.get_units(20) + 833;
  return weight;
}