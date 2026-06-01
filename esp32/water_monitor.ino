/**
 * ============================================================
 * IoT Water Quality Monitor — ESP32
 * Sensor: Turbidity + pH
 * ============================================================
 *
 * Wiring:
 *   Turbidity Sensor OUT → GPIO 34 (ADC1_CH6)
 *   pH Sensor OUT        → GPIO 35 (ADC1_CH7)
 *   Semua VCC → 5V, GND → GND
 *
 * Library: ArduinoJson (install via Library Manager)
 * ============================================================
 */

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// ─── Konfigurasi ──────────────────────────────────────────────
const char* WIFI_SSID      = "YOUR_WIFI_SSID";
const char* WIFI_PASSWORD  = "YOUR_WIFI_PASSWORD";
const char* SERVER_URL     = "http://192.168.1.100:5000/api/water/add";

const int   TURBIDITY_PIN  = 34;   // GPIO ADC untuk turbidity
const int   PH_PIN         = 35;   // GPIO ADC untuk pH
const int   READ_INTERVAL  = 5000; // Interval 5 detik
const int   ADC_SAMPLES    = 10;   // Sampel rata-rata ADC

// ─── Global Variables ─────────────────────────────────────────
unsigned long lastReadTime = 0;

// ─── Setup ────────────────────────────────────────────────────
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("\n========================================");
  Serial.println("  IoT Water Quality Monitor — ESP32");
  Serial.println("  Sensor: Turbidity + pH");
  Serial.println("========================================\n");

  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  connectWiFi();
}

// ─── Main Loop ────────────────────────────────────────────────
void loop() {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("⚠️  WiFi disconnected. Reconnecting...");
    connectWiFi();
  }

  if (millis() - lastReadTime >= READ_INTERVAL) {
    lastReadTime = millis();

    float turbidity = readTurbidity();
    float ph        = readPH();
    bool  sent      = sendData(turbidity, ph);

    printStatus(turbidity, ph, sent);
  }
}

// ─── Read Turbidity ───────────────────────────────────────────
float readTurbidity() {
  long sum = 0;
  for (int i = 0; i < ADC_SAMPLES; i++) {
    sum += analogRead(TURBIDITY_PIN);
    delay(10);
  }
  int avgADC = sum / ADC_SAMPLES;
  return adcToNTU(avgADC);
}

float adcToNTU(int adcValue) {
  float voltage = adcValue * (3.3f / 4095.0f);
  float ntu;

  if (voltage < 2.5f)      ntu = 3000.0f;
  else if (voltage > 4.2f) ntu = 0.0f;
  else                     ntu = -1120.4f * (voltage * voltage) + 5742.3f * voltage - 4352.9f;

  return constrain(ntu, 0.0f, 3000.0f);
}

// ─── Read pH ──────────────────────────────────────────────────
/**
 * Membaca sensor pH analog
 *
 * Kalibrasi umum sensor pH analog (modul pH-4502C):
 *   Voltage 2.5V = pH 7.0 (netral)
 *   Setiap 0.18V perubahan ≈ 1 unit pH
 *
 * Formula: pH = 7.0 + ((2.5 - voltage) / 0.18)
 *
 * Catatan: Kalibrasi bisa berbeda per sensor.
 * Gunakan larutan buffer pH 4, 7, 10 untuk kalibrasi akurat.
 */
float readPH() {
  long sum = 0;
  for (int i = 0; i < ADC_SAMPLES; i++) {
    sum += analogRead(PH_PIN);
    delay(10);
  }
  int avgADC = sum / ADC_SAMPLES;
  return adcToPH(avgADC);
}

float adcToPH(int adcValue) {
  // Konversi ADC ke voltage (3.3V referensi, 12-bit)
  float voltage = adcValue * (3.3f / 4095.0f);

  // Kalibrasi: pH 7 = 2.5V, slope = 0.18V/pH
  float ph = 7.0f + ((2.5f - voltage) / 0.18f);

  // Clamp ke range valid 0–14
  return constrain(ph, 0.0f, 14.0f);
}

// ─── Send Data to Server ──────────────────────────────────────
bool sendData(float turbidity, float ph) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("❌ Cannot send: WiFi not connected");
    return false;
  }

  HTTPClient http;
  http.begin(SERVER_URL);
  http.addHeader("Content-Type", "application/json");
  http.setTimeout(5000);

  // Build JSON payload dengan turbidity + pH
  StaticJsonDocument<128> doc;
  doc["turbidity"] = turbidity;
  doc["ph"]        = ph;

  String payload;
  serializeJson(doc, payload);

  int httpCode = http.POST(payload);
  bool success = (httpCode == 201);

  if (httpCode > 0) {
    Serial.printf("%s HTTP %d\n", success ? "✅ Sent!" : "⚠️  Server:", httpCode);
  } else {
    Serial.printf("❌ HTTP error: %s\n", http.errorToString(httpCode).c_str());
  }

  http.end();
  return success;
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
    Serial.println("\n✅ WiFi connected!");
    Serial.printf("   IP: %s | RSSI: %d dBm\n\n", WiFi.localIP().toString().c_str(), WiFi.RSSI());
  } else {
    Serial.println("\n❌ WiFi failed! Retrying later...\n");
  }
}

// ─── Print Status ─────────────────────────────────────────────
void printStatus(float turbidity, float ph, bool sent) {
  String turbStatus = turbidity < 30 ? "Jernih" : turbidity < 70 ? "Keruh" : "Sangat Keruh";
  String phStatus   = ph < 6.5 ? "Asam" : ph <= 8.5 ? "Normal" : "Basa";

  Serial.println("─────────────────────────────────────");
  Serial.printf("⏱  Time      : %lu ms\n",   millis());
  Serial.printf("💧 Turbidity : %.2f NTU → %s\n", turbidity, turbStatus.c_str());
  Serial.printf("🧪 pH        : %.2f     → %s\n", ph, phStatus.c_str());
  Serial.printf("📡 Sent      : %s\n",        sent ? "Yes ✅" : "No ❌");
  Serial.printf("📶 WiFi RSSI : %d dBm\n",    WiFi.RSSI());
  Serial.println("─────────────────────────────────────\n");
}
