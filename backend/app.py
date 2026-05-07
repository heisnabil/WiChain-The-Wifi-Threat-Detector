import os
import time
import random
import sqlite3
from datetime import datetime

import platform
import subprocess

import joblib
import pandas as pd

from flask import Flask, jsonify, request
from flask_cors import CORS
import logging

from blockchain import Blockchain

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MODEL_PATH = './models/wifi_classifier.pkl'
DATABASE_PATH = './wifi_networks.db'

try:
    model = joblib.load(MODEL_PATH)
    logger.info("Model loaded successfully with joblib")
except Exception as e:
    logger.error(f"Failed to load model: {e}")
    model = None

REQUIRED_COLS = [
    "SSID",
    "RSSI",
    "Encryption",
    "Band",
    "Duplicate_Count",
    "Vendors",
    "Internet_Access"
]

blockchain = Blockchain()

try:
    init_database_called = False
except NameError:
    init_database_called = False


def init_database():
    """Initialize the SQLite database with required tables."""
    global init_database_called
    if init_database_called:
        return

    try:
        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()

        cursor.execute('''
                       CREATE TABLE IF NOT EXISTS wifi_networks
                       (
                           id                INTEGER PRIMARY KEY AUTOINCREMENT,
                           scan_timestamp    REAL NOT NULL,
                           ssid              TEXT NOT NULL,
                           bssid             TEXT NOT NULL,
                           vendors           TEXT,
                           rssi              INTEGER,
                           encryption        TEXT,
                           band              TEXT,
                           internet_access   INTEGER,
                           duplicate_count   INTEGER,
                           prediction        TEXT,
                           score             REAL,
                           risk_level        TEXT,
                           threat_indicators TEXT,
                           blockchain_stored INTEGER   DEFAULT 0,
                           created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           UNIQUE (scan_timestamp, bssid)
                       )
                       ''')

        cursor.execute('''
                       CREATE TABLE IF NOT EXISTS scan_sessions
                       (
                           id               INTEGER PRIMARY KEY AUTOINCREMENT,
                           scan_timestamp   REAL NOT NULL UNIQUE,
                           total_networks   INTEGER,
                           threats_detected INTEGER,
                           scan_method      TEXT,
                           platform         TEXT,
                           created_at       TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                       )
                       ''')

        cursor.execute('CREATE INDEX IF NOT EXISTS idx_scan_timestamp ON wifi_networks(scan_timestamp)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_ssid ON wifi_networks(ssid)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_prediction ON wifi_networks(prediction)')
        cursor.execute('CREATE INDEX IF NOT EXISTS idx_created_at ON wifi_networks(created_at)')

        conn.commit()
        conn.close()
        init_database_called = True
        logger.info("Database initialized successfully")

    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise


def store_network_data(network_data, scan_timestamp):
    """Store individual network data in the database."""
    try:
        init_database()

        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()

        threat_indicators_json = ','.join(network_data.get('threat_indicators', []))

        cursor.execute('''
            INSERT OR REPLACE INTO wifi_networks 
            (scan_timestamp, ssid, bssid, vendors, rssi, encryption, band, 
             internet_access, duplicate_count, prediction, score, risk_level, 
             threat_indicators, blockchain_stored) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            scan_timestamp,
            network_data.get('SSID', ''),
            network_data.get('BSSID', ''),
            network_data.get('Vendors', ''),
            network_data.get('RSSI', 0),
            network_data.get('Encryption', ''),
            network_data.get('Band', ''),
            network_data.get('Internet_Access', 1),
            network_data.get('Duplicate_Count', 0),
            network_data.get('prediction', ''),
            network_data.get('score', 0.0),
            network_data.get('risk_level', ''),
            threat_indicators_json,
            network_data.get('blockchain_stored', 0)
        ))

        conn.commit()
        conn.close()

    except Exception as e:
        logger.error(f"Failed to store network data for {network_data.get('SSID', 'Unknown')}: {e}")


def store_scan_session(scan_timestamp, total_networks, threats_detected, scan_method):
    """Store scan session metadata in the database."""
    try:
        init_database()

        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()

        cursor.execute('''
            INSERT OR REPLACE INTO scan_sessions 
            (scan_timestamp, total_networks, threats_detected, scan_method, platform) 
            VALUES (?, ?, ?, ?, ?)
        ''', (
            scan_timestamp,
            total_networks,
            threats_detected,
            scan_method,
            platform.system()
        ))

        conn.commit()
        conn.close()

    except Exception as e:
        logger.error(f"Failed to store scan session: {e}")


def get_network_history(ssid=None, limit=100):
    """Retrieve network history from database."""
    try:
        init_database()

        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()

        if ssid:
            cursor.execute('''
                           SELECT *
                           FROM wifi_networks
                           WHERE ssid = ?
                           ORDER BY created_at DESC
                           LIMIT ?
                           ''', (ssid, limit))
        else:
            cursor.execute('''
                           SELECT *
                           FROM wifi_networks
                           ORDER BY created_at DESC
                           LIMIT ?
                           ''', (limit,))

        columns = [description[0] for description in cursor.description]
        results = []

        for row in cursor.fetchall():
            network_dict = dict(zip(columns, row))
            if network_dict['threat_indicators']:
                network_dict['threat_indicators'] = network_dict['threat_indicators'].split(',')
            else:
                network_dict['threat_indicators'] = []
            results.append(network_dict)

        conn.close()
        return results

    except Exception as e:
        logger.error(f"Failed to retrieve network history: {e}")
        return []


def get_database_stats():
    """Get database statistics."""
    try:
        init_database()

        conn = sqlite3.connect(DATABASE_PATH)
        cursor = conn.cursor()

        cursor.execute('SELECT COUNT(*) FROM wifi_networks')
        total_networks = cursor.fetchone()[0]

        cursor.execute('SELECT COUNT(*) FROM scan_sessions')
        total_sessions = cursor.fetchone()[0]

        cursor.execute('SELECT COUNT(*) FROM wifi_networks WHERE prediction IN ("spoof", "suspicious")')
        total_threats = cursor.fetchone()[0]

        cursor.execute('''
                       SELECT COUNT(*)
                       FROM wifi_networks
                       WHERE prediction IN ("spoof", "suspicious")
                         AND created_at > datetime('now', '-1 day')
                       ''')
        recent_threats = cursor.fetchone()[0]

        cursor.execute('SELECT COUNT(DISTINCT ssid) FROM wifi_networks')
        unique_ssids = cursor.fetchone()[0]

        cursor.execute('SELECT MAX(scan_timestamp) FROM scan_sessions')
        last_scan = cursor.fetchone()[0]

        conn.close()

        return {
            'total_networks_scanned': total_networks,
            'total_scan_sessions': total_sessions,
            'total_threats_detected': total_threats,
            'recent_threats_24h': recent_threats,
            'unique_ssids_discovered': unique_ssids,
            'last_scan_timestamp': last_scan
        }

    except Exception as e:
        logger.error(f"Failed to get database stats: {e}")
        return {}


def load_oui_file(file_path="oui.txt"):
    """
    Load OUI -> Vendor mapping from a simple text file.
    Each line: OUI<TAB>Vendor
    """
    oui_map = {}
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#"):
                    continue
                parts = line.split()
                if len(parts) >= 2:
                    oui = parts[0].upper()
                    vendor = " ".join(parts[1:])
                    oui_map[oui] = vendor
    except FileNotFoundError:
        logger.warning(f"OUI file {file_path} not found. Using empty OUI map.")
    return oui_map


oui_map = load_oui_file("oui.txt")


def get_vendor_from_mac(mac_address, oui_map=oui_map):
    """
    Get vendor information from MAC address OUI using local OUI file.
    """
    if not mac_address or len(mac_address) < 8:
        return "Unknown"
    oui = mac_address.replace(":", "").replace("-", "").upper()[:6]
    return oui_map.get(oui, "Unknown")


def scan_wifi_networks():
    """
    Cross-platform Wi-Fi network scanning with enhanced threat detection.
    Runs for 10 sec and removes duplicates.
    """
    try:
        system = platform.system().lower()
        networks = []
        seen_bssids = set()
        ssid_to_networks = {}

        start_time = time.time()
        logger.info(f"Scanning WiFi networks on {system} for 10 seconds...")

        while time.time() - start_time < 10:
            if system == "windows":
                new_networks = scan_wifi_windows()
            elif system == "linux":
                new_networks = scan_wifi_linux()
            elif system == "darwin":
                new_networks = scan_wifi_macos()
            else:
                logger.warning(f"Unsupported platform: {system}")
                break

            for net in new_networks:
                bssid = net.get("BSSID")
                ssid = net.get("SSID", "")
                if not bssid or bssid in seen_bssids:
                    continue

                seen_bssids.add(bssid)
                ssid_to_networks.setdefault(ssid, []).append(net)

            time.sleep(5)

        networks = []
        for ssid, nets in ssid_to_networks.items():
            nets.sort(key=lambda n: n.get("RSSI", -999), reverse=True)
            strongest = nets[0]
            strongest["Duplicate_Count"] = len(nets) - 1
            networks.append(strongest)

        if not networks:
            logger.warning("No networks found via system scan, using demo data...")
            networks = generate_demo_networks()

        enhanced_networks = []
        ssid_count = {}

        for i, network in enumerate(networks):
            ssid = network.get("SSID", f"Network_{i}")
            ssid_count[ssid] = ssid_count.get(ssid, 0) + 1

            enhanced_network = {
                "SSID": ssid,
                "BSSID": network.get("BSSID", f"00:11:22:33:44:{i:02d}"),
                "Vendors": network.get("Vendors", get_vendor_from_mac(network.get("BSSID", f"00:11:22:33:44:{i:02d}"))),
                "RSSI": network.get("RSSI", -50 - (i * 5)),
                "Encryption": network.get("Encryption", "WPA2"),
                "Band": network.get("Band", "2.4GHz" if i % 2 == 0 else "5GHz"),
                "Internet_Access": network.get("Internet_Access", 1),
                "Duplicate_Count": ssid_count[ssid] - 1,
            }

            threat_analysis = analyze_threat_indicators(enhanced_network)
            enhanced_network.update(threat_analysis)
            enhanced_networks.append(enhanced_network)

        logger.info(f"Enhanced {len(enhanced_networks)} unique networks with threat analysis")
        return enhanced_networks

    except Exception as e:
        logger.error(f"WiFi scanning failed: {e}")
        return generate_demo_networks()


def scan_wifi_windows():
    """Scan live Wi-Fi networks on Windows using netsh (mode=bssid)."""
    try:
        result = subprocess.run(
            ["netsh", "wlan", "show", "networks", "mode=bssid"],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=10
        )

        if result.returncode != 0:
            raise Exception(f"netsh failed: {result.stderr}")

        output = result.stdout.splitlines()

        networks = []
        current_ssid = None
        bssid_seen = set()
        idx = 0

        def sig_percent_to_rssi(pct_str):
            # e.g., "78%" -> approx RSSI in dBm
            try:
                pct = int(pct_str.strip().strip('%'))
                # simple mapping: RSSI ≈ (pct / 2) - 100  (80% ≈ -60 dBm)
                return int(pct / 2 - 100)
            except:
                return -60

        for line in output:
            line = line.strip()
            if line.startswith("SSID ") and ":" in line:
                current_ssid = line.split(":", 1)[1].strip() or f"Network_{idx}"
                idx += 1
            elif line.startswith("BSSID ") and ":" in line:
                bssid = line.split(":", 1)[1].strip().upper()
                if bssid in bssid_seen:
                    continue
                bssid_seen.add(bssid)
                networks.append({
                    "SSID": current_ssid or f"Network_{idx}",
                    "BSSID": bssid,
                    "RSSI": -60,
                    "Encryption": "WPA2",
                    "Band": "2.4GHz" if idx % 2 == 0 else "5GHz",
                    "Internet_Access": 1,
                    "Vendors": get_vendor_from_mac(bssid),
                    "Duplicate_Count": 0,
                })
            elif line.lower().startswith("signal") and ":" in line and networks:
                sig = line.split(":", 1)[1].strip()
                networks[-1]["RSSI"] = sig_percent_to_rssi(sig)
            elif (line.lower().startswith("authentication")) and ":" in line and networks:
                enc = line.split(":", 1)[1].strip()
                networks[-1]["Encryption"] = "Open" if "open" in enc.lower() else enc

        ssid_counts = {}
        for n in networks:
            ssid_counts[n["SSID"]] = ssid_counts.get(n["SSID"], 0) + 1
        for n in networks:
            n["Duplicate_Count"] = ssid_counts[n["SSID"]] - 1

        return networks

    except Exception as e:
        logger.error(f"Windows WiFi scan error: {e}")
        return []


def scan_wifi_linux():
    """Scan Wi-Fi networks on Linux using nmcli or iwlist."""
    try:
        networks = []

        try:
            cmd = ["nmcli", "-t", "-f", "SSID,SIGNAL,SECURITY", "dev", "wifi"]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)

            if result.returncode == 0:
                lines = result.stdout.strip().split('\n')
                for i, line in enumerate(lines):
                    if line.strip() and ':' in line:
                        parts = line.split(':')
                        if len(parts) >= 3:
                            ssid = parts[0].strip()
                            signal = parts[1].strip()
                            security = parts[2].strip() if parts[2] else "Open"

                            if ssid and ssid != '--':
                                networks.append({
                                    "SSID": ssid,
                                    "BSSID": f"00:22:33:44:55:{i:02d}",
                                    "RSSI": int(signal) if signal.isdigit() else -50,
                                    "Encryption": security or "Open",
                                    "Band": "2.4GHz" if i % 2 == 0 else "5GHz",
                                    "Internet_Access": 1,
                                    "Vendors": random.choice(["Cisco", "Netgear", "TP-Link", "Linksys"])
                                })

        except (subprocess.TimeoutExpired, FileNotFoundError):
            logger.warning("nmcli not available or timeout")

        return networks

    except Exception as e:
        logger.error(f"Linux WiFi scan error: {e}")
        return []


def scan_wifi_macos():
    """Scan Wi-Fi networks on macOS using airport utility."""
    try:
        airport_path = "/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport"

        if not os.path.exists(airport_path):
            airport_path = "/usr/sbin/airport"

        if os.path.exists(airport_path):
            cmd = [airport_path, "-s"]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=15)

            networks = []
            if result.returncode == 0:
                lines = result.stdout.split('\n')[1:]
                for i, line in enumerate(lines):
                    if line.strip():
                        parts = line.split()
                        if len(parts) >= 3:
                            ssid = parts[0]
                            bssid = parts[1] if len(parts) > 1 else f"00:33:44:55:66:{i:02d}"
                            rssi = parts[2] if len(parts) > 2 else "-50"

                            try:
                                signal_strength = int(rssi)
                            except:
                                signal_strength = -50

                            networks.append({
                                "SSID": ssid,
                                "BSSID": bssid,
                                "RSSI": signal_strength,
                                "Encryption": "WPA2",
                                "Band": "2.4GHz" if i % 2 == 0 else "5GHz",
                                "Internet_Access": 1,
                                "Vendors": random.choice(["Apple", "Cisco", "Netgear"])
                            })

            return networks

    except Exception as e:
        logger.error(f"macOS WiFi scan error: {e}")

    return []


def generate_demo_networks():
    """Generate demo network data for testing."""
    demo_networks = []
    return demo_networks


def analyze_threat_indicators(network):
    """Analyze network for threat indicators and calculate risk."""
    threat_score = 0
    threat_indicators = []

    if network["Encryption"] in ["Open", "WEP"]:
        threat_score += 0.3
        threat_indicators.append("weak_encryption")

    if network["Duplicate_Count"] > 0:
        threat_score += 0.4
        threat_indicators.append("duplicate_ssid")

    if network["SSID"] in ["Free WiFi", "Public WiFi", "Guest", "FreeWiFi", "Free_WiFi_Here"]:
        threat_score += 0.3
        threat_indicators.append("suspicious_name")

    if network["Vendors"] == "Unknown":
        threat_score += 0.2
        threat_indicators.append("unknown_vendor")

    if not network["Internet_Access"]:
        threat_score += 0.1
        threat_indicators.append("no_internet")

    if network["RSSI"] > -30 and network["Vendors"] == "Unknown":
        threat_score += 0.2
        threat_indicators.append("strong_unknown_signal")

    if threat_score >= 0.6:
        prediction = "spoof"
        risk_level = "high"
    elif threat_score >= 0.3:
        prediction = "suspicious"
        risk_level = "medium"
    else:
        prediction = "legitimate"
        risk_level = "low"

    final_score = min(0.99, max(0.1, threat_score + random.uniform(-0.1, 0.2)))

    return {
        "prediction": prediction,
        "score": final_score,
        "risk_level": risk_level,
        "threat_indicators": threat_indicators
    }


@app.route('/scan', methods=['POST'])
def scan_networks():
    """
    Main endpoint to scan Wi-Fi networks and return predictions.
    """
    try:
        if model is None:
            logger.warning("Model not loaded; using rule-based analysis only")

        logger.info("Starting Wi-Fi scan...")
        scan_timestamp = time.time()
        networks = scan_wifi_networks()

        if not networks:
            return jsonify({'error': 'No networks found'}), 500

        results = []
        threats_detected = 0

        for network in networks:
            try:
                network_data = {}
                for col in REQUIRED_COLS:
                    network_data[col] = [network.get(col, 0)]

                df = pd.DataFrame(network_data)

                try:
                    if model is not None:
                        prediction = model.predict(df)[0]
                        prediction_proba = model.predict_proba(df)[0]
                        confidence_score = max(prediction_proba)

                        model_prediction = 'spoof' if prediction == 1 else 'legitimate'

                        if network['prediction'] == 'spoof' or model_prediction == 'spoof':
                            final_prediction = 'spoof'
                            final_score = max(network['score'], confidence_score)
                        else:
                            final_prediction = network['prediction']
                            final_score = network['score']
                    else:
                        final_prediction = network['prediction']
                        final_score = network['score']

                except Exception as model_error:
                    logger.warning(f"Model prediction failed for {network['SSID']}: {model_error}")
                    final_prediction = network['prediction']
                    final_score = network['score']

                result = {
                    **network,  # Include all network fields
                    'prediction': final_prediction,
                    'score': float(final_score)
                }

                if final_prediction in ['spoof', 'suspicious'] and final_score >= 0.6:
                    threats_detected += 1
                    logger.info(f"Threat detected: {network['SSID']} - {final_prediction}")

                    transaction = blockchain.create_threat_transaction(result)
                    blockchain.add_transaction(transaction)

                    result["blockchain_stored"] = True
                else:
                    result["blockchain_stored"] = False

                store_network_data(result, scan_timestamp)

                results.append(result)

            except Exception as e:
                logger.error(f"Failed to process network {network.get('SSID', 'Unknown')}: {e}")
                continue

        # Store scan session metadata
        store_scan_session(scan_timestamp, len(results), threats_detected, 'enhanced_detection')

        if blockchain.pending_transactions:
            logger.info(f"Mining block with {len(blockchain.pending_transactions)} transactions...")
            try:
                mined_block = blockchain.mine_pending_transactions()
                logger.info(f"New block mined: {mined_block.hash}")
            except Exception as mining_error:
                logger.error(f"Block mining failed: {mining_error}")

        if not results:
            return jsonify({'error': 'Failed to process any networks'}), 500

        logger.info(f"Successfully processed {len(results)} networks, {threats_detected} threats detected")
        logger.info(f"Data stored in database with scan timestamp: {scan_timestamp}")

        return jsonify({
            'status': 'success',
            'total_scanned': len(results),
            'threats_detected': threats_detected,
            'networks': results,
            'blockchain_stats': blockchain.get_chain_stats(),
            'database_stats': get_database_stats(),
            'scan_timestamp': scan_timestamp,
            'scan_method': 'enhanced_detection'
        })

    except Exception as e:
        logger.error(f"Scan endpoint error: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/network-history', methods=['GET'])
def get_network_history_endpoint():
    """Get network scan history from database."""
    try:
        ssid = request.args.get('ssid')
        limit = int(request.args.get('limit', 100))

        history = get_network_history(ssid, limit)

        return jsonify({
            'status': 'success',
            'history': history,
            'total_records': len(history)
        })

    except Exception as e:
        logger.error(f"Error fetching network history: {e}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500


@app.route('/database-stats', methods=['GET'])
def get_database_stats_endpoint():
    """Get database statistics."""
    try:
        stats = get_database_stats()

        return jsonify({
            'status': 'success',
            'database_stats': stats
        })

    except Exception as e:
        logger.error(f"Error fetching database stats: {e}")
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500


@app.route('/blockchain-records', methods=['GET'])
def get_blockchain_records():
    """Get all blockchain threat records."""
    try:
        records = blockchain.get_threat_records()

        return jsonify({
            "status": "success",
            "records": records,
            "total_records": len(records)
        })

    except Exception as e:
        logger.error(f"Error fetching blockchain records: {e}")
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500


@app.route('/blockchain-stats', methods=['GET'])
def get_blockchain_stats():
    """Get blockchain network statistics."""
    try:
        stats = blockchain.get_chain_stats()

        blockchain_stats = {
            "connected": True,
            "network": "WICHAIN-NET",
            "latest_block": stats["total_blocks"] - 1,
            "total_detections": stats["threat_detections"],
            "recent_detections": stats["recent_detections"],
            "total_transactions": stats["total_transactions"],
            "pending_transactions": stats["pending_transactions"],
            "difficulty": stats["difficulty"],
            "chain_valid": stats["chain_valid"]
        }

        return jsonify({
            "status": "success",
            "blockchain_stats": blockchain_stats
        })

    except Exception as e:
        logger.error(f"Error fetching blockchain stats: {e}")
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500


@app.route('/blockchain-info', methods=['GET'])
def get_blockchain_info():
    """Get detailed blockchain information."""
    try:
        chain_data = []
        for block in blockchain.chain:
            chain_data.append(block.to_dict())

        return jsonify({
            "status": "success",
            "chain": chain_data,
            "chain_length": len(blockchain.chain),
            "is_valid": blockchain.validate_chain(),
            "stats": blockchain.get_chain_stats()
        })

    except Exception as e:
        logger.error(f"Error fetching blockchain info: {e}")
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500


@app.route('/mine-block', methods=['POST'])
def mine_new_block():
    """Mine a new block with pending transactions."""
    try:
        if not blockchain.pending_transactions:
            return jsonify({
                "status": "error",
                "error": "No pending transactions to mine"
            }), 400

        logger.info(f"Mining block with {len(blockchain.pending_transactions)} pending transactions...")
        mined_block = blockchain.mine_pending_transactions()

        return jsonify({
            "status": "success",
            "message": "Block mined successfully",
            "block": mined_block.to_dict(),
            "stats": blockchain.get_chain_stats()
        })

    except Exception as e:
        logger.error(f"Block mining error: {e}")
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500


@app.route('/health', methods=['GET'])
def health_check():
    """Enhanced health check endpoint with blockchain and database status."""
    try:
        blockchain_stats = blockchain.get_chain_stats()
        database_stats = get_database_stats()

        return jsonify({
            'status': 'healthy',
            'model_loaded': model is not None,
            'blockchain_initialized': blockchain is not None,
            'blockchain_valid': blockchain_stats['chain_valid'],
            'database_initialized': bool(database_stats),
            'total_blocks': blockchain_stats['total_blocks'],
            'pending_transactions': blockchain_stats['pending_transactions'],
            'total_networks_in_db': database_stats.get('total_networks_scanned', 0),
            'platform': platform.system(),
            'timestamp': time.time()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': str(e)
        }), 500


if __name__ == '__main__':
    print("Starting WICHAIN WiFi Scanner Backend...")

    try:
        init_database()
        print("[+] Database initialized successfully")
    except Exception as e:
        print(f"[x] Database initialization failed: {e}")
        exit(1)

    print(f"[+] Model loaded: {model is not None}")
    print(f"[+] Genesis Block Hash: {blockchain.chain[0].hash}")
    print(f"[+] Blockchain initialized with {len(blockchain.chain)} blocks")
    print(f"[+] Platform: {platform.system()}")
    print("[+] Database file: ./wifi_networks.db")
    print()
    print("Available Endpoints:")
    print("  POST /scan                - Scan WiFi networks and get predictions")
    print("  GET  /network-history     - Get network scan history from database")
    print("  GET  /database-stats      - Get database statistics")
    print("  GET  /blockchain-records  - Get threat records from blockchain")
    print("  GET  /blockchain-stats    - Get blockchain statistics")
    print("  GET  /blockchain-info     - Get detailed blockchain information")
    print("  POST /mine-block          - Mine a new block")
    print("  GET  /health              - Health check")
    print()
    print("Database Features:")
    print("  - Stores all scanned network features")
    print("  - Tracks scan sessions and timestamps")
    print("  - Maintains network history for analysis")
    print("  - Provides statistics and reporting")
    print()

    app.run(host='127.0.0.1', port=5000, debug=True)
