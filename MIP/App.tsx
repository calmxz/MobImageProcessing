import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

const App = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);

  const pickImage = () => {
    const options = {
      mediaType: 'photo' as 'photo',
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (!response.didCancel && response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setImage(selectedImage.uri || null);
        setPrediction(null);
      }
    });
  };

  const predictImage = async () => {
    if (image) {
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        name: 'photo.jpg',
        type: 'image/jpg',
      });

      try {
        const response = await fetch('http://192.168.1.117:5000/predict', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPrediction(data.prediction);
        } else {
          console.error('Prediction failed:', response.status);
        }
      } catch (error) {
        console.error('Error predicting image:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Image Upload & Prediction</Text>
      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Pick an image from camera roll</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {image && <TouchableOpacity style={styles.button} onPress={predictImage}>
        <Text style={styles.buttonText}>Predict Image</Text>
      </TouchableOpacity>}
      {prediction && <Text style={styles.prediction}>Prediction: {prediction}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Dark background color
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff', // White text color
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3f51b5', // Button background color
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#ffffff', // Button text color
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    marginTop: 20,
    marginBottom: 20,
    borderRadius: 10, // Rounded corners for the image
  },
  prediction: {
    marginTop: 20,
    fontSize: 16,
    color: '#ffffff', // White text color
  },
});

export default App;