import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const MOCK_HISTORY = [
    { id: '1', date: 'Hoy, 10:30 AM', origin: 'Parque Ricaurte', dest: 'Plaza de Mercado', price: '$5.000', status: 'Completado' },
    { id: '2', date: 'Ayer, 4:15 PM', origin: 'Hospital El Salvador', dest: 'Barrio La Granja', price: '$4.000', status: 'Completado' },
];

export default function Historial() {
    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <Text style={styles.title}>Mis Viajes</Text>

            <FlatList
                data={MOCK_HISTORY}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.date}>{item.date}</Text>
                            <Text style={styles.price}>{item.price}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.dot}>🟢</Text>
                            <Text style={styles.address}>{item.origin}</Text>
                        </View>
                        <View style={styles.line} />
                        <View style={styles.row}>
                            <Text style={styles.dot}>🔴</Text>
                            <Text style={styles.address}>{item.dest}</Text>
                        </View>
                        <Text style={styles.status}>{item.status}</Text>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.empty}>No tienes viajes recientes</Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#121212', padding: 24, paddingTop: 60 },
    title: { fontSize: 28, fontWeight: 'bold', color: 'white', marginBottom: 24 },
    list: { gap: 16 },
    card: {
        backgroundColor: '#1E1E1E', borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: '#333'
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
    date: { color: '#888', fontSize: 12, fontWeight: 'bold' },
    price: { color: '#00D084', fontSize: 16, fontWeight: 'bold' },
    row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    dot: { fontSize: 10, marginRight: 8 },
    address: { color: 'white', fontSize: 14 },
    line: { height: 16, borderLeftWidth: 1, borderLeftColor: '#444', marginLeft: 4, marginBottom: 8, marginTop: -8 },
    status: { alignSelf: 'flex-end', color: '#666', fontSize: 12, marginTop: 8 },
    empty: { color: '#666', textAlign: 'center', marginTop: 40 }
});
