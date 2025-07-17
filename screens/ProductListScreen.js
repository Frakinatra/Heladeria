import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, Image, StyleSheet, Button, BackHandler } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

export default function ProductListScreen() {
  const [products, setProducts] = useState([]);
  const { logout } = useAuth();

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(items);
  };

  const handleLogout = async () => {
    await logout(); // Cierra sesión y vuelve al login
  };

  const Salir = () => {
    BackHandler.exitApp(); // Cierra la aplicación
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.productImage} />
            )}
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price}</Text>
            <Text style={styles.description}>{item.descripcion}</Text>
          </View>
        )}
      />
      <View style={{ marginTop: 20 }}>
        <Button title="Cerrar sesión" color="red" onPress={handleLogout} />
      </View>

      <View style={{ marginTop: 15 }}>
        <Button title="Salir" color="green" onPress={Salir} />
      </View>


    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  item: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  productImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    color: 'green',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
