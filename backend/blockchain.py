import time
import json
import random
import logging

import uuid
import hashlib

logger = logging.getLogger(__name__)


class Block:
    """
    Simple Block Implementation
    """

    def __init__(self, index, timestamp, data, previous_hash, nonce=0):
        self.index = index
        self.timestamp = timestamp
        self.data = data
        self.previous_hash = previous_hash
        self.nonce = nonce
        self.hash = self.calculate_hash()

    def calculate_hash(self):
        block_string = json.dumps({
            "index": self.index,
            "timestamp": self.timestamp,
            "data": self.data,
            "previous_hash": self.previous_hash,
            "nonce": self.nonce
        }, sort_keys=True)
        return hashlib.sha256(block_string.encode()).hexdigest()

    def mine_block(self, difficulty):
        target = "0" * difficulty
        while self.hash[:difficulty] != target:
            self.nonce += 1
            self.hash = self.calculate_hash()
        logger.info(f"Block mined: {self.hash}")

    def to_dict(self):
        return {
            "index": self.index,
            "timestamp": self.timestamp,
            "data": self.data,
            "previous_hash": self.previous_hash,
            "hash": self.hash,
            "nonce": self.nonce
        }


class Blockchain:
    """
    Simple BlockChain Implementation
    """

    def __init__(self):
        self.chain = [self.create_genesis_block()]
        self.difficulty = 3
        self.pending_transactions = []
        self.mining_reward = 10

    def create_genesis_block(self):
        genesis_data = {
            "type": "genesis",
            "message": "WICHAIN Genesis Block - Network Security Initialized",
            "timestamp": time.time()
        }
        return Block(
            index=0,
            timestamp=time.time(),
            data=genesis_data,
            previous_hash="0"
        )

    def get_latest_block(self):
        return self.chain[-1]

    def add_transaction(self, transaction):
        self.pending_transactions.append(transaction)

    def mine_pending_transactions(self, mining_reward_address="system"):
        reward_transaction = {
            "type": "mining_reward",
            "to": mining_reward_address,
            "amount": self.mining_reward,
            "timestamp": time.time()
        }

        ssid_dict = {}
        for tx in self.pending_transactions:
            ssid = tx.get("ssid")
            if ssid not in ssid_dict:
                ssid_dict[ssid] = {
                    "ssid": ssid,
                    "features": {}
                }
            for k, v in tx.items():
                if k != "ssid":
                    ssid_dict[ssid]["features"][k] = v

        grouped_transactions = list(ssid_dict.values())
        grouped_transactions.append(reward_transaction)

        block_data = {
            "transactions": grouped_transactions,
            "transaction_count": len(self.pending_transactions)
        }

        block = Block(
            len(self.chain),
            time.time(),
            block_data,
            self.get_latest_block().hash
        )

        block.mine_block(self.difficulty)
        self.chain.append(block)
        self.pending_transactions = []
        return block

    def create_threat_transaction(self, network_data):
        transaction = {
            "id": str(uuid.uuid4()),
            "type": "threat_detection",
            "ssid": network_data.get("SSID", "Unknown"),
            "bssid": network_data.get("BSSID", "Unknown"),
            "vendor": network_data.get("Vendors", "Unknown"),
            "rssi": network_data.get("RSSI", 0),
            "encryption": network_data.get("Encryption", "Unknown"),
            "prediction": network_data.get("prediction", "legitimate"),
            "confidence": round(network_data.get("score", 0) * 100, 2),
            "risk_level": network_data.get("risk_level", "low"),
            "threat_indicators": network_data.get("threat_indicators", []),
            "timestamp": time.time(),
            "gas_used": random.randint(21000, 85000)
        }
        return transaction

    def validate_chain(self):
        for i in range(1, len(self.chain)):
            current_block = self.chain[i]
            previous_block = self.chain[i - 1]
            if current_block.hash != current_block.calculate_hash():
                return False
            if current_block.previous_hash != previous_block.hash:
                return False
        return True

    def get_chain_stats(self):
        total_blocks = len(self.chain)
        total_transactions = 0
        threat_detections = 0
        recent_detections = 0
        current_time = time.time()

        for block in self.chain:
            if isinstance(block.data, dict) and "transactions" in block.data:
                transactions = block.data["transactions"]
                total_transactions += len(transactions)

                for tx in transactions:
                    if tx.get("type") == "threat_detection":
                        threat_detections += 1
                        # Recent = last hour
                        if current_time - tx.get("timestamp", 0) <= 3600:
                            recent_detections += 1

        return {
            "total_blocks": total_blocks,
            "total_transactions": total_transactions,
            "threat_detections": threat_detections,
            "recent_detections": recent_detections,
            "chain_valid": self.validate_chain(),
            "difficulty": self.difficulty,
            "pending_transactions": len(self.pending_transactions)
        }

    def get_threat_records(self):
        records = []

        for block in self.chain:
            if isinstance(block.data, dict) and "transactions" in block.data:
                transactions = block.data["transactions"]

                for tx in transactions:
                    if tx.get("type") == "threat_detection":
                        record = {
                            "id": tx.get("id"),
                            "ssid": tx.get("ssid"),
                            "bssid": tx.get("bssid"),
                            "vendor": tx.get("vendor"),
                            "rssi": tx.get("rssi"),
                            "encryption": tx.get("encryption"),
                            "status": tx.get("prediction"),
                            "confidence": tx.get("confidence"),
                            "risk_level": tx.get("risk_level"),
                            "threat_indicators": tx.get("threat_indicators", []),
                            "timestamp": tx.get("timestamp"),
                            "block_index": block.index,
                            "block_hash": block.hash,
                            "transaction_hash": hashlib.sha256(json.dumps(tx, sort_keys=True).encode()).hexdigest(),
                            "gas_used": tx.get("gas_used"),
                            "network": "WICHAIN-NET"
                        }
                        records.append(record)

        records.sort(key=lambda x: x["timestamp"], reverse=True)
        return records
