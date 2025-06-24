import { colors } from "@/src/constants/colors";
import React, { useEffect, useReducer } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type FormProps = {
  initialName?: string;
  initialDescription?: string;
  onSubmit: (form: { name: string; description: string }) => void;
  submitLabel?: string;
};

type FormState = {
  name: string;
  description: string;
};

type FormAction =
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "RESET" };

const INIT_FORM_STATE: FormState = {
  name: "",
  description: "",
};

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

export function DeckForm({
  initialName = "",
  initialDescription = "",
  onSubmit,
  submitLabel = "Salvar",
}: FormProps) {
  const [formState, dispatch] = useReducer(formReducer, INIT_FORM_STATE);
  const { name, description } = formState;

  useEffect(() => {
    dispatch({ type: "SET_NAME", payload: initialName });
    dispatch({ type: "SET_DESCRIPTION", payload: initialDescription });
  }, [initialName, initialDescription]);

  const handleSubmit = () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert("Erro", "Preencha todos os campos.");
      return;
    }

    onSubmit({ name, description });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Japonês básico"
        value={name}
        onChangeText={(t) => dispatch({ type: "SET_NAME", payload: t })}
      />

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Introdução ao japonês"
        value={description}
        onChangeText={(t) => dispatch({ type: "SET_DESCRIPTION", payload: t })}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{submitLabel}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 16,
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
