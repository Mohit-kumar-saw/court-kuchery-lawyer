import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AppColors } from '@/constants/theme';
import { getConversationByClientId } from '@/data/dummyClients';
import type { Message } from '@/data/dummyClients';

function formatMessageTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const conversation = id ? getConversationByClientId(id) : undefined;

  if (!conversation) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={24} color={AppColors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Chat</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Conversation not found</Text>
        </View>
      </View>
    );
  }

  const { client, messages } = conversation;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={AppColors.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerName}>{client.name}</Text>
          <Text style={styles.headerCase}>{client.caseType}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.chat}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((msg: Message) => (
          <View
            key={msg.id}
            style={[
              styles.bubbleWrap,
              msg.isFromClient ? styles.bubbleLeft : styles.bubbleRight,
            ]}
          >
            <View
              style={[
                styles.bubble,
                msg.isFromClient ? styles.bubbleClient : styles.bubbleLawyer,
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  msg.isFromClient ? styles.bubbleTextClient : styles.bubbleTextLawyer,
                ]}
              >
                {msg.text}
              </Text>
              <Text
                style={[
                  styles.bubbleTime,
                  msg.isFromClient ? styles.timeClient : styles.timeLawyer,
                ]}
              >
                {formatMessageTime(msg.timestamp)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    paddingHorizontal: 16,
    paddingTop: 15,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: AppColors.border,
    gap: 16,
  },
  backBtn: {
    padding: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.text,
  },
  headerCenter: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.text,
  },
  headerCase: {
    fontSize: 13,
    color: AppColors.primary,
    marginTop: 2,
  },
  chat: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 24,
  },
  bubbleWrap: {
    marginBottom: 12,
  },
  bubbleLeft: {
    alignItems: 'flex-start',
  },
  bubbleRight: {
    alignItems: 'flex-end',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  bubbleClient: {
    backgroundColor: AppColors.white,
    borderBottomLeftRadius: 4,
  },
  bubbleLawyer: {
    backgroundColor: AppColors.primary,
    borderBottomRightRadius: 4,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  bubbleTextClient: {
    color: AppColors.text,
  },
  bubbleTextLawyer: {
    color: AppColors.white,
  },
  bubbleTime: {
    fontSize: 11,
    marginTop: 6,
  },
  timeClient: {
    color: AppColors.textSecondary,
  },
  timeLawyer: {
    color: 'rgba(255,255,255,0.8)',
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: AppColors.textSecondary,
  },
});
