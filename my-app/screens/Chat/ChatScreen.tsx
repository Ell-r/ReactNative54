
import {createHubConnection} from "@/service/SignalRService";
import {IMessage} from "@/models/Chat/IMessage";
import {useAccountQuery} from "@/service/AuthService";
import React, { useEffect, useState, useRef } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {HubConnection } from "@microsoft/signalr";

const ChatScreen = () =>{

    const [connection, setConnection] = useState<HubConnection | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [message, setMessage] = useState<IMessage[]>([])
    const [inputText, setInputText] = useState<string>("");
    const {data: account} = useAccountQuery();

    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        const newConnection = createHubConnection();

        setConnection(newConnection);

        newConnection.start()
            .then(() => {
                setIsConnected(true);
                setIsLoading(false);

                newConnection.on("Send", (messageText: string) => {
                    const newMessage: IMessage = {
                        id: Math.random().toString(),
                        text: messageText,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        username: account?.fullName ? account.fullName : "User",

                    };
                    setMessage((prevMessages) => [...prevMessages, newMessage]);
                });
            })
            .catch((error) => {
                console.error("SignalR Connection Error: ", error);
                setIsLoading(false);
            });

        return () => {
            if (newConnection) {
                newConnection.off("Send");
                newConnection.stop();
            }
        };

    }, [])


    const handleSendMessage = async () => {
        if (!inputText.trim() || !connection || !isConnected) return;

        try {
            await connection.invoke("Send", inputText);
            setInputText("");
        } catch (error) {
            console.error("Failed to send message: ", error);
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066cc" />
                <Text style={styles.loadingText}>Connecting to chat live stream...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                {/* Header Block */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Live Chat</Text>
                    <View style={styles.statusIndicator}>
                        <View style={[styles.statusDot, { backgroundColor: isConnected ? "#4cd964" : "#ff3b30" }]} />
                        <Text style={styles.statusText}>{isConnected ? "Connected" : "Disconnected"}</Text>
                    </View>
                </View>

                {/* Message Thread List */}
                <FlatList
                    ref={flatListRef}
                    data={message}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.messagesList}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    renderItem={({ item }) => (
                        <View style={styles.messageContainer}>
                            <Text style={styles.username}>{item.username}</Text>
                            <Text style={styles.messageText}>{item.text}</Text>
                            <Text style={styles.timestamp}>{item.timestamp}</Text>
                        </View>
                    )}
                />

                <SafeAreaView edges={['bottom']} style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Type your message..."
                        placeholderTextColor="#999"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, { opacity: inputText.trim() ? 1 : 0.6 }]}
                        onPress={handleSendMessage}
                        disabled={!inputText.trim()}
                    >
                        <Text style={styles.sendButtonText}>Send</Text>
                    </TouchableOpacity>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        paddingTop: 16,
        paddingHorizontal: 16,
        paddingBottom: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    statusIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 6,
    },
    statusText: {
        fontSize: 14,
        color: '#666',
    },
    messagesList: {
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    messageContainer: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 12,
        marginVertical: 4,
        maxWidth: '85%',
        alignSelf: 'flex-start',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    username:{
        fontSize: 16,
        lineHeight: 22,
        color: '#8960f3',
    },
    messageText: {
        fontSize: 16,
        color: '#333',
        lineHeight: 22,
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    inputContainer: {
        flexDirection: 'row',
        paddingHorizontal: 12,
        paddingVertical: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        alignItems: 'flex-end',
    },
    input: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderRadius: 24,
        paddingHorizontal: 16,
        paddingVertical: 10,
        marginRight: 8,
        fontSize: 16,
        color: '#333',
        maxHeight: 100,
    },
    sendButton: {
        backgroundColor: '#0066cc',
        borderRadius: 24,
        paddingHorizontal: 20,
        paddingVertical: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666',
    },
});
