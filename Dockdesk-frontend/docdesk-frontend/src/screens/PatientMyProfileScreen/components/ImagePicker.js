import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { launchImageLibraryAsync } from "expo-image-picker";
import api from "../../../Services/AuthService";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { baseUrl } from "../../../constants/constants";

const ImagePicker = ({ userId, picture }) => {
  const [image, setImage] = useState(picture);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [shouldRefetch, setShouldRefetch] = useState(false);

  const { user } = useAuthContext();

  useEffect(() => {
    // Fetch the profile image when the component mounts, only if user is available
    const fetchProfileImage = async () => {
      if (user && user._id) {
        try {
          const response = await api.get(`${baseUrl}/patients/${user._id}`);
          setImage(response.data.profileImage);
        } catch (error) {
          console.log("Error fetching profile image:", error);
        } finally {
          setUserLoading(false);
        }
      } else {
        setUserLoading(false);
      }
    };

    fetchProfileImage();
  }, [shouldRefetch]);

  useEffect(() => {
    if (shouldRefetch) {
      setShouldRefetch(false);
    }
  }, [shouldRefetch]);

  const takeImageHandler = async () => {
    const result = await launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.5,
    });

    if (!result.canceled) {
      const selectedImage = result.assets[0].uri;
      setImage(selectedImage);
      uploadImage(selectedImage);
    }
  };

  const uploadImage = async (uri) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("image", {
      uri,
      type: "image/jpeg",
      name: "profile.jpg",
    });
    formData.append("userId", userId);

    try {
      const response = await api.post(
        `${baseUrl}/patients/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Image upload response:", response.data);

      setImage(response.data.profileImage);

      setShouldRefetch(true);
    } catch (error) {
      console.log("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={takeImageHandler}>
        <View style={styles.profileImageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <Text>Select Image</Text>
          )}
        </View>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

export default ImagePicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  profileImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "#eee",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
