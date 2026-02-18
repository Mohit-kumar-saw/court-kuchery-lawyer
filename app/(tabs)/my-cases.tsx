import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppColors } from '@/constants/theme';
import { getCasesByStatus } from '@/data/dummyCases';
import type { Case, CaseStatus } from '@/data/dummyCases';

const STATUS_FILTERS: { key: CaseStatus; label: string }[] = [
  { key: 'active', label: 'Active' },
  { key: 'pending', label: 'Pending' },
  { key: 'closed', label: 'Closed' },
];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusColor(status: CaseStatus) {
  switch (status) {
    case 'active':
      return AppColors.primary;
    case 'pending':
      return '#f59e0b';
    case 'closed':
      return AppColors.success;
    default:
      return AppColors.textSecondary;
  }
}

function searchCases(cases: Case[], query: string): Case[] {
  const q = query.trim().toLowerCase();
  if (!q) return cases;
  return cases.filter(
    (c) =>
      c.caseTitle.toLowerCase().includes(q) ||
      c.clientName.toLowerCase().includes(q) ||
      c.caseType.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
  );
}

export default function MyCasesScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<CaseStatus>('active');
  const [searchQuery, setSearchQuery] = useState('');

  const statusFiltered =
    activeFilter === 'active'
      ? getCasesByStatus('active')
      : activeFilter === 'pending'
        ? getCasesByStatus('pending')
        : getCasesByStatus('closed');

  const filteredCases = searchCases(statusFiltered, searchQuery);

  const renderCase = ({ item }: { item: Case }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/chat-history/${item.clientId}`)}
      activeOpacity={0.8}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.clientAvatar}</Text>
        </View>
        <View style={styles.cardMeta}>
          <Text style={styles.caseTitle}>{item.caseTitle}</Text>
          <Text style={styles.clientName}>{item.clientName}</Text>
          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
      </View>
      <Text style={styles.description} numberOfLines={2}>
        {item.description}
      </Text>
      <View style={styles.cardFooter}>
        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color={AppColors.textSecondary} />
          <Text style={styles.dateText}>Opened {formatDate(item.openedAt)}</Text>
        </View>
        {item.nextHearing && (
          <View style={styles.dateRow}>
            <Ionicons name="time-outline" size={14} color={AppColors.primary} />
            <Text style={styles.hearingText}>Next: {formatDate(item.nextHearing)}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Cases</Text>
        <Text style={styles.subtitle}>Track and manage your cases</Text>
      </View>

      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color={AppColors.textSecondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by case, client or type..."
          placeholderTextColor={AppColors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery('')}
            hitSlop={12}
          >
            <Ionicons name="close-circle" size={20} color={AppColors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filters}>
        {STATUS_FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[
              styles.filterBtn,
              activeFilter === f.key && styles.filterBtnActive,
            ]}
            onPress={() => setActiveFilter(f.key)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === f.key && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredCases}
        keyExtractor={(item) => item.id}
        renderItem={renderCase}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={64} color={AppColors.textSecondary} />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No results found' : `No ${activeFilter} cases`}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery
                ? 'Try a different search term'
                : `Your ${activeFilter} cases will appear here`}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.text,
  },
  subtitle: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: AppColors.text,
    padding: 0,
  },
  filters: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  filterBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: AppColors.white,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  filterBtnActive: {
    backgroundColor: AppColors.primary,
    borderColor: AppColors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.textSecondary,
  },
  filterTextActive: {
    color: AppColors.white,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AppColors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.primary,
  },
  cardMeta: {
    flex: 1,
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 2,
  },
  clientName: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  description: {
    fontSize: 14,
    color: AppColors.text,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: AppColors.textSecondary,
  },
  hearingText: {
    fontSize: 12,
    color: AppColors.primary,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: AppColors.text,
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginTop: 8,
  },
});
