import { Stack, useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { colors } from "@/src/constants/colors";
import * as ImagePicker from "expo-image-picker";

export default function CreateCardPage() {
  const router = useRouter();

  const [linguagemPergunta, setLinguagemPergunta] = useState<"jp" | "latin">(
    "jp",
  );
  const [linguagemResposta, setLinguagemResposta] = useState<"jp" | "latin">(
    "latin",
  );
  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");
  const [imagem, setImagem] = useState<string>("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImagem(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!pergunta.trim()) return;
    if (!resposta.trim()) return;

    console.log("pergunta", pergunta);
    console.log("resposta", resposta);
    console.log("imagem", imagem);
    console.log("linguagemPergunta", linguagemPergunta);
    console.log("linguagemResposta", linguagemResposta);

    router.replace("/");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Criar Card" }} />

      <Text style={styles.label}>Linguagem da Pergunta</Text>
      <Picker
        selectedValue={linguagemPergunta}
        onValueChange={setLinguagemPergunta}
        style={styles.input}
      >
        <Picker.Item label="Japonês" value="jp" />
        <Picker.Item label="Latim" value="latin" />
      </Picker>

      <Text style={styles.label}>Pergunta</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a pergunta"
        value={pergunta}
        onChangeText={setPergunta}
      />

      <Text style={styles.label}>Linguagem da Resposta</Text>
      <Picker
        selectedValue={linguagemResposta}
        onValueChange={setLinguagemResposta}
        style={styles.input}
      >
        <Picker.Item label="Japonês" value="jp" />
        <Picker.Item label="Latim" value="latin" />
      </Picker>

      <Text style={styles.label}>Resposta</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a resposta"
        value={resposta}
        onChangeText={setResposta}
      />

      <Text style={styles.label}>Imagem (opcional)</Text>
      <Pressable
        style={[
          styles.input,
          { justifyContent: "center", alignItems: "center" },
        ]}
        onPress={pickImage}
      >
        <Text>{imagem ? "Alterar imagem" : "Selecionar imagem"}</Text>
      </Pressable>
      {imagem ? (
        <Image
          source={{ uri: imagem }}
          style={{
            width: 100,
            height: 100,
            marginVertical: 8,
            alignSelf: "center",
          }}
        />
      ) : null}

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Criar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontFamily: "Lato-Regular",
    color: colors.fg,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: "Lato-Regular",
    marginBottom: 8,
  },
  button: {
    backgroundColor: colors.fg,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "Lato-Bold",
  },
});
