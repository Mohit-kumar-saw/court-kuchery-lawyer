import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';

import { AppColors } from '@/constants/theme';
import { consultService } from '@/services/consultService';

type Consultation = {
  _id: string;
  userId: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  status: string;
  type: string;
  createdAt: string;
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 24 * 60 * 60 * 1000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (diff < 7 * 24 * 60 * 60 * 1000) return d.toLocaleDateString([], { weekday: 'short' });
  return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

export default function ChatHistoryScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [consultations, setConsultations] = useState<Consultation[]>([]);

  const fetchConsultations = async () => {
    try {
      const res = await consultService.getLawyerConsultations();
      setConsultations(res.consultations);
    } catch (error) {
      console.error("FETCH CONSULTATIONS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleChatPress = (consultation: Consultation) => {
    router.push(`/chat-history/${consultation._id}`);
  };

  const renderChat = ({ item }: { item: Consultation }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleChatPress(item)}
      activeOpacity={0.8}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item.userId?.name?.charAt(0) || '?'}
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={styles.name}>{item.userId?.name || 'Unknown User'}</Text>
          <Text style={styles.time}>{formatTime(item.createdAt)}</Text>
        </View>
        <Text style={styles.preview} numberOfLines={1}>
          Consultation Status: {item.status}
        </Text>
        <Text style={styles.caseType}>{item.type}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={AppColors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={AppColors.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Client Chats</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={AppColors.primary} />
        </View>
      ) : (
        <FlatList
          data={consultations}
          keyExtractor={(item) => item._id}
          renderItem={renderChat}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No consultations yet</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 20,
    fontWeight: '700',
    color: AppColors.text,
  },
  list: {
    padding: 16,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#cadcff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.primary,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.text,
  },
  time: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  preview: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 4,
  },
  caseType: {
    fontSize: 12,
    color: AppColors.primary,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  empty: {
    marginTop: 100,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: AppColors.textSecondary,
  },
});
