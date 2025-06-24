import { DeckForm } from "@/src/components/Deck/DeckForm";
import { useFetchManifest } from "@/src/hooks/useFetchManifest";
import { useUpdateDeck } from "@/src/hooks/useUpdateDeck";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function UpdateDeckPage() {
  const { deck: slugParam } = useLocalSearchParams();
  const slug = Array.isArray(slugParam) ? slugParam[0] : slugParam;
  const { updateDeck } = useUpdateDeck();
  const [manifest, error, loading] = useFetchManifest();
  const router = useRouter();

  const currentDeck = manifest?.decks.find((d) => d.slug === slug);

  const handleUpdate = async ({
    name,
    description,
  }: {
    name: string;
    description: string;
  }) => {
    if (!slug) return;

    try {
      await updateDeck({ slug, name, description });
      Toast.show({
        type: "success",
        text1: "Deck atualizado com sucesso!",
        position: "bottom",
      });
      router.replace("/");
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Erro ao atualizar o deck",
        text2: "Tente novamente mais tarde.",
        position: "bottom",
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Editar Deck" }} />
        <Text>Carregando dados do deck...</Text>
      </View>
    );
  }

  if (!currentDeck) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: "Editar Deck" }} />
        <Text>Deck não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Editar Deck" }} />
      <DeckForm
        initialName={currentDeck.name}
        initialDescription={currentDeck.description}
        onSubmit={handleUpdate}
        submitLabel="Salvar"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
});
