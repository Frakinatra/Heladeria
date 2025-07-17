import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert, Image,BackHandler } from 'react-native';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';

export default function AdminDashboardScreen() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const { logout } = useAuth();

  const fetchProducts = async () => {
    const querySnapshot = await getDocs(collection(db, 'products'));
    const items = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProducts(items);
  };

  const handleAdd = async () => {
    if (!name || !price || !descripcion || !imageBase64) {
      Alert.alert("Campos requeridos", "Completa nombre, precio, descripción y toma una foto");
      return;
    }
    await addDoc(collection(db, 'products'), { name, price, descripcion, image: imageBase64 });
    setName('');
    setPrice('');
    setDescripcion('');
    setImageUri(null);
    setImageBase64(null);
    fetchProducts();
  };

  const handleUpdate = async (id) => {
    if (!name || !price || !descripcion || !imageBase64) {
      Alert.alert("Campos requeridos", "Completa nombre, precio, descripción y toma una foto");
      return;
    }
    await updateDoc(doc(db, 'products', id), { name, price, descripcion, image: imageBase64 });
    setName('');
    setPrice('');
    setDescripcion('');
    setImageUri(null);
    setImageBase64(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'products', id));
    fetchProducts();
  };

  const handleLogout = async () => {
    await logout();
  };

  const Salir = () => {
      BackHandler.exitApp();
    };

  const tomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se necesita acceso a la cámara');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.5,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      const manipResult = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 800 } }],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );

      const base64 = await FileSystem.readAsStringAsync(manipResult.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      setImageUri(manipResult.uri);
      setImageBase64(`data:image/jpeg;base64,${base64}`); // importante agregar 'data:image/jpeg;base64,' aquí
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Productos</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={descripcion}
        onChangeText={setDescripcion}
      />

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}
      <View style={{ marginTop: 20}}>
              <Button title="Tomar Foto" color="grey" onPress={tomarFoto} />
      </View>
      <View style={{ marginTop: 20}}>
              <Button title="Agregar Producto" color="purple" onPress={handleAdd} />
      </View>


      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            {item.image && (
              <Image source={{ uri: item.image }} style={styles.productImage} />
            )}
            <Text style={styles.productTitle}>{item.name} - ${item.price}</Text>
            <Text style={styles.productDescription}>{item.descripcion}</Text>
            <View style={{ marginTop: 20 }}>
              <Button title="Actualizar" onPress={() => handleUpdate(item.id)} />
            </View>
            <View style={{ marginTop: 20}}>
              <Button title="Eliminar" onPress={() => handleDelete(item.id)} />
            </View>
            
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
  title: { fontSize: 22, marginBottom: 10, textAlign: 'center' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    alignSelf: 'center',
    borderRadius: 10,
  },
  item: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ddd',
  },
  productImage: {
    width: 100,
    height: 100,
    alignSelf: 'center',
    marginBottom: 5,
    borderRadius: 10,
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  productDescription: {
    textAlign: 'center',
    marginBottom: 5,
    color: 'gray',
  },
});
