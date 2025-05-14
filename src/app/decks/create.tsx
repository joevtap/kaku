import { Stack, useRouter } from "expo-router";
import { useReducer } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { colors } from "@/src/constants/colors";
import { useDecksStore } from "@/src/stores/DecksStore";
import { StaticDeck } from "@/src/types/Deck";

type FormState = {
  name: string;
  description: string;
};

const INIT_FORM_STATE: FormState = {
  name: "",
  description: "",
};

type FormAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "RESET" };

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "RESET":
      return INIT_FORM_STATE;
    default:
      return state;
  }
};

export default function CreateDeckPage() {
  const router = useRouter();
  const { createDeck } = useDecksStore();

  const [formState, dispatch] = useReducer(formReducer, INIT_FORM_STATE);
  const { name, description } = formState;

  const handleSubmit = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    const newDeck: StaticDeck = {
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      version: "1.0",
      name,
      description,
      cards: [],
    };

    await createDeck(newDeck);
    dispatch({ type: "RESET" });
    router.navigate("/");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Criar Deck" }} />
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Japonês básico"
        value={name}
        onChangeText={(t) =>
          dispatch({
            type: "SET_NAME",
            payload: t,
          })
        }
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Introdução ao japonês"
        value={description}
        onChangeText={(t) =>
          dispatch({
            type: "SET_DESCRIPTION",
            payload: t,
          })
        }
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Criar</Text>
      </TouchableOpacity>
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
