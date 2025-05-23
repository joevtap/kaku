import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useReducer } from "react";
import {
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { colors } from "@/src/constants/colors";
import { FlashCardBack, FlashCardFront } from "@/src/types/Deck";
import { useCreateCard } from "@/src/hooks/useCreateCard";

type FormState = {
  front: FlashCardFront;
  back: FlashCardBack;
};

const INIT_FORM_STATE: FormState = {
  front: {
    type: "text",
    content: "",
    writingSystem: "latin",
  },
  back: {
    type: "text",
    content: "",
    writingSystem: "latin",
  },
};

type FormAction =
  | { type: "SET_FRONT"; payload: FlashCardFront }
  | { type: "SET_BACK"; payload: FlashCardBack }
  | { type: "RESET" };

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case "SET_FRONT":
      return { ...state, front: action.payload };
    case "SET_BACK":
      return { ...state, back: action.payload };
    case "RESET":
      return INIT_FORM_STATE;
    default:
      return state;
  }
};

export default function CreateCardPage() {
  const router = useRouter();
  const { deck } = useLocalSearchParams();

  const { createCard } = useCreateCard();

  const [formState, dispatch] = useReducer(formReducer, INIT_FORM_STATE);
  const { front, back } = formState;

  const handleSubmit = async () => {
    if (!front.content.trim() || !back.content.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    await createCard(deck as string, {
      front: [front],
      back: [back],
    });

    dispatch({ type: "RESET" });
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: "Criar Card" }} />

      <Text style={styles.label}>Sistema de escrita da pergunta</Text>
      <Picker
        selectedValue={front.writingSystem}
        onValueChange={(t) => {
          dispatch({
            type: "SET_FRONT",
            payload: {
              ...front,
              writingSystem: t,
            },
          });
        }}
        style={styles.input}
      >
        <Picker.Item label="Japonês" value="jp" />
        <Picker.Item label="Latim/Romano" value="latin" />
      </Picker>

      <Text style={styles.label}>Pergunta</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a pergunta"
        value={front.content}
        onChangeText={(t) => {
          dispatch({
            type: "SET_FRONT",
            payload: {
              ...front,
              content: t,
            },
          });
        }}
      />

      <Text style={styles.label}>Sistema de escrita da resposta</Text>
      <Picker
        selectedValue={back.writingSystem}
        onValueChange={(t) => {
          dispatch({
            type: "SET_BACK",
            payload: { ...back, writingSystem: t },
          });
        }}
        style={styles.input}
      >
        <Picker.Item label="Japonês" value="jp" />
        <Picker.Item label="Latim/Romano" value="latin" />
      </Picker>

      <Text style={styles.label}>Resposta</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite a resposta"
        value={back.content}
        onChangeText={(t) => {
          dispatch({
            type: "SET_BACK",
            payload: {
              ...back,
              content: t,
            },
          });
        }}
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Criar</Text>
      </Pressable>
    </ScrollView>
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
