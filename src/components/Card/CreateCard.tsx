import React, { useState } from "react";
import { View, Text, TextInput, Button, Image, ScrollView } from "react-native";
import Card from "./Card";

const fontes = [
  { value: "livro", label: "Livro" },
  { value: "video", label: "Vídeo" },
  { value: "artigo", label: "Artigo" },
];

export default function CreateCard() {
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [img, setImg] = useState("");
  const [fonte, setFonte] = useState(fontes[0].value);
  const [showBack, setShowBack] = useState(false);

  const handleSubmit = () => {
    // TODO: Save card logic here (API or local storage)
    alert("Card salvo!");
    setFront("");
    setBack("");
    setImg("");
    setFonte(fontes[0].value);
    setShowBack(false);
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 16 }}>
        Criar Novo Card
      </Text>
      <Text>Frente:</Text>
      <TextInput
        value={front}
        onChangeText={setFront}
        placeholder="Digite a frente do card"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 6,
          padding: 8,
          marginBottom: 12,
        }}
      />
      <Text>Verso:</Text>
      <TextInput
        value={back}
        onChangeText={setBack}
        placeholder="Digite o verso do card"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 6,
          padding: 8,
          marginBottom: 12,
        }}
      />
      <Text>Imagem (URL):</Text>
      <TextInput
        value={img}
        onChangeText={setImg}
        placeholder="Cole o link da imagem (opcional)"
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 6,
          padding: 8,
          marginBottom: 12,
        }}
      />
      <Text>Fonte:</Text>
      <View
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 6,
          marginBottom: 16,
          overflow: "hidden",
        }}
      >
        <select
          value={fonte}
          onChange={(e) => setFonte(e.target.value)}
          style={{
            width: "100%",
            padding: 8,
            border: "none",
            backgroundColor: "transparent",
          }}
        >
          {fontes.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </View>
      <Button
        title={showBack ? "Mostrar Frente" : "Mostrar Verso"}
        onPress={() => setShowBack(!showBack)}
      />
      <View style={{ marginVertical: 24 }}>
        <Text style={{ fontWeight: "bold", marginBottom: 8 }}>
          Pré-visualização:
        </Text>
        <Card
          showBack={showBack}
          front={
            <View>
              {img ? (
                <Image
                  source={{ uri: img }}
                  style={{
                    width: "100%",
                    height: 120,
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                  resizeMode="cover"
                />
              ) : null}
              <Text style={{ fontSize: 16 }}>{front}</Text>
              <Text style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                Fonte: {fonte}
              </Text>
            </View>
          }
          back={
            <View>
              <Text style={{ fontSize: 16 }}>{back}</Text>
            </View>
          }
        />
      </View>
      <Button title="Salvar Card" onPress={handleSubmit} />
    </ScrollView>
  );
}
