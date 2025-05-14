import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { StaticDeck } from "@/src/types/Deck";

interface CreateDeckFormProps {
    onSubmit: (deck: StaticDeck) => void;
}

const CreateDeckForm: React.FC<CreateDeckFormProps> = ({ onSubmit }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const handleCreateDeck = () => {
        const newDeck: StaticDeck = {
            slug: name.toLowerCase().replace(/\s+/g, '-'),
            version: '1.0',
            name,
            description,
            cards: [],
        };
        onSubmit(newDeck);
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Nome do Deck"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />
            <TextInput
                placeholder="Descrição"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
            />
            <Button title="Criar Deck" onPress={handleCreateDeck} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    input: {
        borderBottomWidth: 1,
        marginBottom: 12,
        padding: 8,
    },
});

export default CreateDeckForm;