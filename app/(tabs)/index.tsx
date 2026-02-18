import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import { AppColors, ROUTES } from '@/constants';
import { useAuth } from '@/contexts';
import { getActiveCasesCount } from '@/data/dummyCases';

const STAT_CARDS = [
  { id: 'cases', label: 'Active Cases', value: String(getActiveCasesCount()), icon: 'briefcase-outline', route: ROUTES.TABS.MY_CASES, color: AppColors.primary },
  { id: 'pending', label: 'Pending (₹)', value: '0', icon: 'time-outline', route: ROUTES.TABS.WALLET, color: '#f59e0b' },
  { id: 'paid', label: 'Paid (₹)', value: '0', icon: 'checkmark-circle-outline', route: ROUTES.TABS.WALLET, color: AppColors.success },
  { id: 'clients', label: 'Clients', value: '4', icon: 'people-outline', route: ROUTES.TABS.CLIENTS, color: '#8b5cf6' },
];

const QUICK_ACTIONS = [
  { id: 'cases', label: 'View My Cases', icon: 'document-text-outline', route: ROUTES.TABS.MY_CASES },
  { id: 'chats', label: 'Client Chats', icon: 'chatbubble-ellipses-outline', route: ROUTES.TABS.CHAT_HISTORY },
];

export default function LawyerDashboardScreen() {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome */}
        <View style={styles.welcomeSection}>
          <View style={styles.welcomeLeft}>
            <Text style={styles.welcomeText}>
              Hi, Adv. {user?.name ?? 'Lawyer'} 👋
            </Text>
            <Text style={styles.tagline}>Manage your practice</Text>
          </View>
          <View style={styles.logoWrap}>
            <Image source={require('@/assets/court/scale2.png')} style={styles.logo} />
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STAT_CARDS.map((stat) => (
            <TouchableOpacity
              key={stat.id}
              style={styles.statCard}
              onPress={() => router.push(stat.route as any)}
              activeOpacity={0.8}
            >
              <View style={[styles.statIconWrap, { backgroundColor: `${stat.color}20` }]}>
                <Ionicons name={stat.icon as any} size={24} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.8}
              >
                <Ionicons name={action.icon as any} size={28} color={AppColors.primary} />
                <Text style={styles.actionCardText}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color={AppColors.primary} />
          <View style={styles.infoText}>
            <Text style={styles.infoTitle}>Your Practice</Text>
            <Text style={styles.infoSub}>
              {user?.specialization || 'Legal'} • {user?.experienceYears || '0'} yrs exp • ₹{user?.ratePerMinute || '—'}/min
            </Text>
          </View>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#ebf2ff',
    borderRadius: 20,
  },
  welcomeLeft: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: AppColors.textSecondary,
  },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: AppColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: 44,
    height: 44,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    backgroundColor: AppColors.white,
    borderRadius: 16,
    padding: 16,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: AppColors.white,
    borderRadius: 12,
    paddingVertical: 20,
    alignItems: 'center',
    gap: 8,
  },
  actionCardText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.text,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ebf2ff',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoText: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: AppColors.text,
    marginBottom: 2,
  },
  infoSub: {
    fontSize: 13,
    color: AppColors.textSecondary,
  },
});
