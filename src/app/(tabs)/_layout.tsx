import { Tabs } from "expo-router";
import { Cards, Home } from "@icons";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/src/constants/colors";
import {
  TouchableOpacity,
  Modal,
  View,
  TextInput,
  Button,
  Text,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";

export default function TabLayout() {
  const [modalVisible, setModalVisible] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  const handleCreate = () => {
    // Handle form submission here
    setModalVisible(false);
    setNome("");
    setDescricao("");
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.fg,
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Decks",
            tabBarIcon: ({ color }) => <Cards size={28} color={color} />,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={{ marginRight: 16 }}
                accessibilityLabel="Create new deck"
              >
                <Feather name="plus" size={24} color={colors.fg} />
              </TouchableOpacity>
            ),
          }}
        />
      </Tabs>
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Nome do deck"
            />
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Descrição do deck"
            />
            <View style={styles.buttonRow}>
              <Button
                title="Cancelar"
                onPress={() => setModalVisible(false)}
                color="#888"
              />
              <Button title="Criar" onPress={handleCreate} />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    width: "85%",
    elevation: 4,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
});
