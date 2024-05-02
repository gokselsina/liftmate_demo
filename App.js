import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import * as SQLite from 'expo-sqlite';

export default function QRScannerScreen() {
  const dbName = 'forkdb';

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState('');

  useEffect(() => {
    const db = SQLite.openDatabase(dbName);

    // Veritabanı tablosunu oluştur
    db.transaction(tx => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS tbl_forklift (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          forklift_id TEXT NOT NULL,
          forklift_name TEXT NOT NULL
        );`
      );
    });

    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setQrData(data);
  };

  const handleScanPress = () => {
    setScanned(false);
    setQrData('');
  };

  const startScan = () => {
    console.log('oku');
    setScanned(true);
  };

  const handleCancel = () => {
    console.log('iptal');
    setScanned(false);
  };

  const handleFinal = () => {
    console.log('tamam');
    console.log(qrData);
    setScanned(false);
  };


  if (hasPermission === null) {
    return <Text>İzin bekleniyor...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Kamera erişim izni reddedildi.</Text>;
  }

  return (
    <View style={styles.container}>
      {!scanned && (
        <Button title="QR Tara" onPress={startScan} />
      )}
      {scanned && (
        <View style={styles.scannerContainer}>
          <BarCodeScanner
            onBarCodeScanned={handleBarCodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        </View>
      )}
      {scanned && (
        <View style={styles.qrDataContainer}>
          <Text style={styles.qrDataText}>Tarayıcıdan okunan QR Kodu:</Text>
          <Text style={styles.qrData}>{qrData}</Text>
          <Button title="Ok" onPress={handleFinal} />
          <Button title="İptal" onPress={handleCancel} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerContainer: {
    flex: 1,
    width: '100%',
  },
  qrDataContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    margin: 20,
    alignItems: 'center',
  },
  qrDataText: {
    fontSize: 18,
    marginBottom: 10,
  },
  qrData: {
    fontSize: 16,
    color: 'blue',
    marginBottom: 20,
  },
});
