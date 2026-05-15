/**
 * ============================================================
 * IoT Water Quality Monitor — ESP32
 * ============================================================
 * Sensor  : Turbidity Sensor (Analog)
 * Board   : ESP32 DevKit V1
 * Library : WiFi.h, HTTPClient.h (built-in ESP32)
 *
 * Wiring:
 *   Turbidity Sensor VCC  → 5V
 *   Turbidity Sensor GND  → GND
 *   Turbidity Sensor OUT  → GPIO 34 (ADC1_CH6)
 *
 * ============================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>   // Install via Library Manager: ArduinoJson by Benoit Blanchon

// ─── Configuration ────────────────────────────────────────────
const char* WIFI_SSID     = "YOUR_WIFI_SSID";       // Ganti dengan SSID WiFi Anda
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";   // Ganti dengan password WiFi Anda

const char* SERVER_URL    = "http://192.168.1.100:5000/api/water/add"; // Ganti dengan IP server Anda

const int   SENSOR_PIN    = 34;    // GPIO pin untuk sensor turbidity
const int   READ_INTERVAL = 5000;  // Interval pembacaan: 5 detik
const int   ADC_SAMPLES   = 10;    // Jumlah sampel untuk rata-rata ADC

// ─── Global Variables ─────────────────────────────────────────
unsigned long lastReadTime = 0;
bool wifiConnected = false;

// ─── Function Declarations ────────────────────────────────────
float readTurbidity();
float adcToNTU(int adcValue);
void  connectWiFi();
bool  sendData(float turbidity);
void  printStatus(float turbidity, bool sent);

// ─── Setup ────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n========================================");
  Serial.println("  IoT Water Quality Monitor — ESP32");
  Serial.println("========================================\n");

  // Configure ADC
  analogReadResolution(12);       // 12-bit ADC (0–4095)
  analogSetAttenuation(ADC_11db); // Full range: 0–3.3V

  // Connect to WiFi
  connectWiFi();
}

// ─── Main Loop ────────────────────────────────────────────────
void loop() {
  unsigned long currentTime = millis();

  // Reconnect WiFi if disconnected
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️  WiFi disconnected. Reconnecting...");
    connectWiFi();
  }

  // Read and send data at interval
  if (currentTime - lastReadTime >= READ_INTERVAL) {
    lastReadTime = currentTime;

    float turbidity = readTurbidity();
    bool sent = sendData(turbidity);
    printStatus(turbidity, sent);
  }
}

// ─── Read Turbidity Sensor ────────────────────────────────────
/**
 * Reads multiple ADC samples and returns average turbidity in NTU
 */
float readTurbidity() {
  long sum = 0;

  for (int i = 0; i < ADC_SAMPLES; i++) {
    sum += analogRead(SENSOR_PIN);
    delay(10);
  }

  int avgADC = sum / ADC_SAMPLES;
  float ntu  = adcToNTU(avgADC);

  Serial.printf("📊 ADC Raw: %d | Turbidity: %.2f NTU\n", avgADC, ntu);
  return ntu;
}

// ─── ADC to NTU Conversion ────────────────────────────────────
/**
 * Convert ADC value (0–4095) to NTU
 *
 * Calibration formula based on typical turbidity sensor:
 * - Clear water (low turbidity) → high voltage → high ADC
 * - Turbid water (high turbidity) → low voltage → low ADC
 *
 * Adjust the formula based on your specific sensor calibration.
 * Formula: NTU = -1120.4 * (voltage^2) + 5742.3 * voltage - 4352.9
 */
float adcToNTU(int adcValue) {
  // Convert ADC to voltage (3.3V reference, 12-bit)
  float voltage = adcValue * (3.3f / 4095.0f);

  float ntu;

  if (voltage < 2.5f) {
    // High turbidity range
    ntu = 3000.0f;
  } else if (voltage > 4.2f) {
    // Very clear water
    ntu = 0.0f;
  } else {
    // Polynomial calibration curve
    ntu = -1120.4f * (voltage * voltage) + 5742.3f * voltage - 4352.9f;
  }

  // Clamp to valid range
  if (ntu < 0.0f)    ntu = 0.0f;
  if (ntu > 3000.0f) ntu = 3000.0f;

  return ntu;
}

// ─── WiFi Connection ──────────────────────────────────────────
void connectWiFi() {
  Serial.printf("🔌 Connecting to WiFi: %s", WIFI_SSID);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    wifiConnected = true;
    Serial.println("\n✅ WiFi connected!");
    Serial.printf("   IP Address : %s\n", WiFi.localIP().toString().c_str());
    Serial.printf("   Signal     : %d dBm\n\n", WiFi.RSSI());
  } else {
    wifiConnected = false;
    Serial.println("\n❌ WiFi connection failed! Will retry...\n");
  }
}

// ─── Send Data to Server ──────────────────────────────────────
/**
 * Sends turbidity data to Node.js REST API via HTTP POST
 * Returns true if successful
 */
bool sendData(float turbidity) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ Cannot send: WiFi not connected");
    return false;
  }

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(5000); // 5 second timeout

  // Build JSON payload
  StaticJsonDocument<128> doc;
  doc["turbidity"] = turbidity;

  String payload;
  serializeJson(doc, payload);

  // Send POST request
  int httpCode = http.POST(payload);

  bool success = false;

  if (httpCode > 0) {
    String response = http.getString();

    if (httpCode == 201) {
      success = true;
      Serial.printf("✅ Data sent! HTTP %d\n", httpCode);
    } else {
      Serial.printf("⚠️  Server responded: HTTP %d — %s\n", httpCode, response.c_str());
    }
  } else {
    Serial.printf("❌ HTTP request failed: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
  return success;
}

// ─── Print Status to Serial Monitor ──────────────────────────
void printStatus(float turbidity, bool sent) {
  String status;
  if      (turbidity < 30) status = "Jernih";
  else if (turbidity < 70) status = "Keruh";
  else                     status = "Sangat Keruh";

  Serial.println("─────────────────────────────────────");
  Serial.printf("⏱  Time      : %lu ms\n", millis());
  Serial.printf("💧 Turbidity : %.2f NTU\n", turbidity);
  Serial.printf("📋 Status    : %s\n", status.c_str());
  Serial.printf("📡 Sent      : %s\n", sent ? "Yes ✅" : "No ❌");
  Serial.printf("📶 WiFi RSSI : %d dBm\n", WiFi.RSSI());
  Serial.println("─────────────────────────────────────\n");
}
