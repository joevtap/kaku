import { Stack, useRouter } from "expo-router";
import { useReducer } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { colors } from "@/src/constants/colors";

type FormState = {
  question: string;
  answer: string;
  writingSystemQuestion: "jp" | "latin";
  writingSystemAnswer: "jp" | "latin";
};

const INIT_FORM_STATE: FormState = {
  question: "",
  answer: "",
  writingSystemQuestion: "latin",
  writingSystemAnswer: "latin",
};

type FormAction =
  | { type: "SET_QUESTION"; payload: string }
  | { type: "SET_ANSWER"; payload: string }
  | { type: "SET_WRITING_SYSTEM_QUESTION"; payload: "jp" | "latin" }
  | { type: "SET_WRITING_SYSTEM_ANSWER"; payload: "jp" | "latin" }
  | { type: "RESET" };

const formReducer = (state: FormState, action: FormAction) => {
  switch (action.type) {
    case "SET_QUESTION":
      return { ...state, question: action.payload };
    case "SET_ANSWER":
      return { ...state, answer: action.payload };
    case "SET_WRITING_SYSTEM_QUESTION":
      return { ...state, writingSystemQuestion: action.payload };
    case "SET_WRITING_SYSTEM_ANSWER":
      return { ...state, writingSystemAnswer: action.payload };
    case "RESET":
      return INIT_FORM_STATE;
    default:
      return state;
  }
};

export default function CreateCardPage() {
  const router = useRouter();

  const [formState, dispatch] = useReducer(formReducer, INIT_FORM_STATE);
  const { question, answer, writingSystemQuestion, writingSystemAnswer } =
    formState;

  const handleSubmit = async () => {
    if (!question.trim() || !answer.trim()) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    router.navigate("/");
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Criar Card" }} />

      <Text style={styles.label}>Sistema de escrita da pergunta</Text>
      <Picker
        selectedValue={writingSystemQuestion}
        onValueChange={(t) => {
          dispatch({ type: "SET_WRITING_SYSTEM_QUESTION", payload: t });
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
        value={question}
        onChangeText={(t) => {
          dispatch({ type: "SET_QUESTION", payload: t });
        }}
      />

      <Text style={styles.label}>Sistema de escrita da resposta</Text>
      <Picker
        selectedValue={writingSystemAnswer}
        onValueChange={(t) => {
          dispatch({ type: "SET_WRITING_SYSTEM_ANSWER", payload: t });
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
        value={answer}
        onChangeText={(t) => {
          dispatch({ type: "SET_ANSWER", payload: t });
        }}
      />

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
